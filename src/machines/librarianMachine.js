
import { createMachine, assign } from 'xstate';
import { useMachine } from "@xstate/react";
import { getJavKeys, getJavNames, searchJavdo } from '../connector/librarian'
import { getVideoInfo, addModelToVideo, getModelsByName, findVideos, saveVideo } from '../connector'
import { 
  getVideoByURL, 
} from "../connector/parser";

const SEARCH_SPEED = 5;


// add machine code
const librarianMachine = createMachine({
  id: "librarian",
  initial: "idle",
  states: {
    idle: {
      initial: "closed",
      states: {
        closed: {
          on: {
            OPEN: {
              target: "opening",
              actions: ["assignOpen", "clearProps"]
            },
            AUTO: {
              target: "auto",
              actions: "assignAuto"
            },
          },
        },
        opening: {
          invoke: {
            src: "onOpen",
            onDone: [
              {
                target: 'opened', 
                cond: "emptyData"
              },
              {
                target: "#librarian.get_keys",
                actions: "assignKeys"
              }
            ]
          }
        },
        opened: {
          entry: "clearProps",
          on: {
            CHANGE: {
              actions: "applyChange"
            },
            FIND: {
              target: "#librarian.get_keys",
              actions: assign( { responses: [], currentPage: 1 }),
            },
            CLOSE: {
              target: "closed",
              actions: ["assignClose", "clearProps"]
            },
          },
        },

        auto: {
          entry: "statusAuto",
          initial: "auto_load",
          states: {
            auto_load: {
              invoke: {
                src: "autoInvoke",
                onDone: [
                  {
                    target: "#librarian.get_keys",
                    actions: [
                      "assignOpen",
                      "clearProps",
                      "assignPath"
                    ]
                  }
                ],
                onError: [
                  {
                    target: "auto_error",
                    actions: "assignProblem"
                  }
                ]
              }
            },
            auto_error: {
              on: {
                RECOVER: {
                  target: "#librarian.idle",
                  actions: "assignClose"
                }
              }
            }
          }
        },

 
      },
    },

    find_model: {
      initial: "start",
      states: {
        start: {
          always: [
            {
              target: "locate",
              cond: "needsModel",
              actions: "assignModelName"
            },
            {
              target: "#librarian.check_keys"
            }
          ]
        },
        locate: {
          invoke: {
            src: "getModelFromPath",
            onDone: [
              {
                target: "#librarian.check_keys",
                actions: "assignImage"
              }
            ]
          }
        }
      }
    },

    get_keys: {
      entry: assign((context ) => ({ status: `Getting keys for ${context.path}` })),
      invoke: {
        src: "getKeysFromPath",
        onDone: [
          {
            target: "find_model",
            actions: "assignKeysOfPath",
          },
        ],
      },
    },

    recast: {
      entry: assign((context ) => ({ status: `Recasting ${context.uncastTracks.length} tracks` })),
      description: "add models to videos",
      initial: "next_track",
      states: {
        next_track: {
          always: [
            {
              target: "cast_track",
              cond: "moreTracks",
              actions: "assignTrack"
            },
            {
              target: "#librarian.check_keys.next_keys"
            }
          ]
        },
        cast_track: {
          invoke: {
            src: "castItem",
            onDone: [
              {
                target: "next_track",
                actions: "incrementTrackIndex"
              }
            ]
          }
        }
      },
    },

    check_keys: {
      on: {
        CHANGE: {
          actions: "applyChange"
        },
        CHOOSE: {
          actions: "assignSelect"
        },
        CANCEL: {
          target: "done"
        },
        PAUSE: {
          target: ".paused"
        }
      },
      initial: 'next_keys',
      states: {
        next_keys: {
          always: [
            {
              target: 'load_keys',
              cond: 'moreKeys',
            },
            {
              target: '#librarian.search', 
              actions: assign((context) => ({
                search_index: 0,
                response: {
                  ...context.response,
                  keys: context.keyset
                }
              }))
            },
          ],
        },
        load_keys: {
          entry: assign((context) => {
            const { response, search_index} = context;
            const batch = response.keys.slice(search_index, search_index + SEARCH_SPEED);
            return { 
              status: `Looking up keys '${batch.join(', ')}'` 
            }
          }),
          invoke: {
            src: 'checkKeys',
            onDone: [
              {
                target: "next_keys",
                cond: "fullCast",
                actions: "appendKeys"
              },
              {
                target: "#librarian.recast",
                actions: ["appendKeys", "assignMissing"]
              }
            ],
            onError: [
              {
                target: 'check_error',
                actions: 'assignProblem',
              },
            ],
          },
        },

        paused: {
          entry: assign(() => ({ status: `Lookup paused` })),
          description: "Pause to allow repaging",
          on: {
            RESUME: {
              target: "load_keys"
            },
            SEE: {
              target: "#librarian.viewing",
              actions: assign((_, event) => ({
                item: event.item,
                source: 'lookup'
              })) 
            },
            RESET: {
              target: "#librarian.get_keys",
              actions: assign((_, event) => ({
                path: event.path,
                currentPage: event.page
              }))
            }
          }
        },

        check_error: {
          on: {
            RECOVER: {
              target: '#librarian.idle',
            },
          },
        },
      },
    },
 
    search: {
      initial: "next",
      on: {
        CHANGE: {
          actions: "applyChange"
        },
        CHOOSE: {
          actions: "assignSelect"
        },
        CANCEL: {
          target: "done"
        },
        PAUSE: {
          target: ".paused"
        }
      },
      states: {
        next: {
          always: [
            {
              target: "lookup",
              cond: "moreKeys",
              actions: "assignNextKey",
            },
            {
              target: "#librarian.get_keys",
              cond: "morePages",
              actions: "assignNextPage",
            },
            {
              target: "#librarian.done",
            },
          ],
        }, 

        lookup: {
          entry: assign((context) => ({ status: `Sending search request for ${context.key}` })),
          invoke: {
            src: "sendSearchRequest",
            onDone: [
              {
                target: "next",
                actions: "assignNextResponse",
              },
            ],
            onError: [
              {
                target: "search_error",
                actions: "assignProblem",
              },
            ],
          },
        },
        search_error: {
          on: {
            RECOVER: {
              target: "#librarian.done",
            },
          },
        },
        paused: {
          entry: assign(() => ({ status: `Search is paused` })),
          description: "Pause to allow repaging",
          on: {
            RESET: {
              target: "#librarian.get_keys",
              actions: assign((_, event) => ({
                path: event.path,
                currentPage: event.page
              }))
            },
            SEE: {
              target: "#librarian.viewing",
              actions: assign((_, event) => ({
                item: event.item,
                source: 'search'
              }))  
            },
            RESUME: {
              target: "next"
            }
          }
        }

      },
    },

    done: {
      entry: assign(() => ({ status: `Operation complete` })),
      invoke: {
        src: "onComplete"
      },
      on: {
        CHANGE: {
          actions: "applyChange"
        },
        CHOOSE: {
          actions: "assignSelect"
        },
        EXIT:  {
          target: "#librarian.idle.opened",
        },

        SEE: {
          target: "viewing",
          actions: assign((_, event) => ({
            item: event.item,
            source: null
          }))
        },

        ADD: {
          target: "import_items",
          actions: assign(context => ({
            add_index: 0,
            candidates: context.responses.filter(f => !!f.selected)
          }))
        }
      }
    },

    viewing: {
      initial: 'load',
      states: {
        load: {
          entry: assign(() => ({ status: `Loading details..` })),
          invoke: {
            src: 'curateItem',
            onDone: [
              {
                target: 'match',
                actions: assign((_, event) => ({
                  models: event.data.stars
                })),
              },
            ],
            onError: [
              {
                target: 'view_error',
                actions: 'assignProblem',
              },
            ],
          },
        },

        match: {
          invoke: {
            src: 'matchModels',
            onDone: [
              {
                target: 'ready',
                actions: assign((_, event) => ({
                  stars: event.data?.filter(f => !!f)
                })),
              },
            ],
            onError: [
              {
                target: '#librarian.import_items.add_error',
                actions: 'assignProblem',
              },
            ],
          },
        },

        ready: {
          on: {
            CHOOSE: {
              actions: ["assignSelect", assign((context) => ({
                item: {
                  ...context.item,
                  selected: !context.item.selected
                }
              }))]
            },
            CLOSE: [
              {
                target: "#librarian.done",
                cond: "emptySource",
                actions: "clearStars"
              },
              {
                target: "#librarian.search.paused",
                cond: "searchSource",
                actions: "clearStars"
              },
              {
                target: "#librarian.check_keys.paused",
                cond: "keySource",
                actions: "clearStars"
              },
               ],
          },
        },
        view_error: {
          on: {
            RECOVER: {
              target: '#librarian.done',
            },
          },
        },
      },
    },

    import_items: {
      initial: 'next_item',
      states: {
        next_item: {
          always: [
            {
              target: 'add',
              cond: "moreCandidates",
              actions: "assignNextImport",
            },
            {
              target: "bye", 
            },
          ],
        },
        bye: {
          invoke: {
            src: 'onComplete',
            onDone: [
              {
                target: "#librarian.idle.closed",
                actions: ["assignClose", "clearProps"]
                // target: '#librarian.done',
              },
            ]
          }
        },
        add: {
          initial: 'curate',
          states: {
            curate: {
              entry: assign((context) => ({ status: `Curating item ${context.item.title}` })),
              invoke: {
                src: 'curateItem',
                onDone: [
                  {
                    target: 'match_item',
                    actions: assign((_, event) => ({
                      models: event.data.stars
                    })),
                  },
                ],
                onError: [
                  {
                    target: '#librarian.import_items.add_error',
                    actions: 'assignProblem',
                  },
                ],
              },
            },
            match_item: {
              invoke: {
                src: 'matchModels',
                onDone: [
                  {
                    target: 'add_item',
                    actions: assign((_, event) => ({
                      stars: event.data?.filter(f => !!f)
                    })),
                  },
                ],
                onError: [
                  {
                    target: '#librarian.import_items.add_error',
                    actions: 'assignProblem',
                  },
                ],
              },
            },
            add_item: {
              entry: assign((context) => ({ status: `Adding item ${context.item.title}` })),
              invoke: {
                src: 'addItem',
                onDone: [
                  {
                    target: '#librarian.import_items.next_item',
                    cond:  "invalidTrack",
                    actions: ["clearStars", "incrementAddIndex"]
                  },
                  {
                    target: 'cast',
                    actions: "assignCastID",
                  },
                ],
                onError: [
                  {
                    target: '#librarian.import_items.add_error',
                    actions: 'assignProblem',
                  },
                ],
              },
            },
            pause: {
              after: {
                1999: {
                  target: '#librarian.import_items.next_item',
                  actions: "clearStars"
                }
              }
            },
            cast: {
              entry: assign((context) => ({ status: `Casting models for ${context.ID}` })),
              invoke: {
                src: 'castItem',
                onDone: [
                  {
                    target: '#librarian.import_items.add.pause',
                    actions: "incrementAddIndex",
                  },
                ],
                onError: [
                  {
                    target: '#librarian.import_items.add_error',
                    actions: 'assignProblem',
                  },
                ],
              },
            },
          },
        },
        add_error: {
          on: {
            RECOVER: {
              target: '#librarian.done',
            },
            RETRY: {
              target: '#librarian.import_items.add.add_item',
            },
            SKIP: {
              target: '#librarian.import_items.next_item',
              actions: "incrementAddIndex",
            },
          },
        },
      },
    },

  },
  context: { path: "", history: [], currentPage: 1 },
  predictableActionArguments: true,
  preserveActionOrder: true,
},

{
  guards: {
    fullCast: (context, event) => {
      const files = event.data?.filter(f => !!f);
      const { modelfk } = context;
      console.log ({ files, modelfk });
      if (!context.modelfk || !files?.length) return true
      const uncastTracks = files
        .filter(file => !file.models?.find(star => star.ID === context.modelfk))

      return !uncastTracks.length
    },
    needsModel: (context) => {
      const { image, response } = context;
      return !image && /Videos starring (.*)/.exec(response.title)
    },
    emptyData:  (_, event) => !event.data,
    emptySource:  (context) => !context.source,
    searchSource:  (context) => context.source === 'search',
    keySource:  (context) => context.source === 'lookup',
    invalidTrack:  (_, event) => typeof event.data === 'object',
    morePages: context => context.response.pages && 
      context.response.pages.find(p => !isNaN(p.page) && Number(p.page) > Number(context.currentPage)),
    moreKeys: context => !!(context.response?.keys?.length > context.search_index),
    moreTracks: context => !!(context.uncastTracks?.length > context.cast_index),
    moreCandidates: context => context.add_index < context.candidates.length,
  },
  actions: {
    statusAuto: assign((context) => ({ status: context.studio 
        ? `Getting path for studio key '${context.key}'`
        : `Getting path for model '${context.name}'`  })),
    assignNextPage:  assign((context) => {
      const { href, page } = context.response.pages.find(f => !isNaN(f.page) && Number(f.page) > Number(context.currentPage));
      const parts = href.split('/');
      return {
        history: context.history.concat(context.path),
        path: parts.pop(),
        currentPage: page
      }
    }),
    assignImage: assign((_, event) => ({
       image: event.data
    })),
    assignModelName: assign((context, event) => {
      const { image, response } = context;
      const regex = /Videos starring (.*)/.exec(response.title)
      return {
        star: regex[1]
      }
    }),
    assignNextResponse:  assign((context, event) => ({
      responses: context.responses.concat(event.data),
      search_index: context.search_index + 1
    })),
    assignNextKey: assign((context) => ({
      key: context.response.keys[context.search_index], 
    })),
    assignKeysOfPath:  assign((_, event) => {
      const response = event.data;
      return {
          response: {
            ...response,
            keys: Array.from(new Set(response.keys))
          },
          history: [],
          keyset: event.data.keys, 
          search_index: 0
        }
    }),
    assignMissing: assign((context, event) => {
      const files = event.data?.filter(f => !!f);
      const uncastTracks = files
        .filter(file => !file.models?.find(star => star.ID === context.modelfk));
      return {
        uncastTracks,
        cast_index: 0
      }
    }),
    assignKeys:  assign((_, event) => ({
        path: event.data,
        response: {},
        responses: [], 
        currentPage: 1 
      })),
    incrementTrackIndex: assign((context) => ({
      cast_index: context.cast_index + 1
    })),
    incrementAddIndex: assign((context) => ({
      add_index: context.add_index + 1
    })),
    assignOpen: assign({ open: true }),
    assignPath: assign((_, event) => ({ path: event.data })),
    assignAuto: assign((_, event) => ({
      key: event.key,
      name: event.name,
      modelfk: event.modelfk,
      image: event.image,
      studio: event.studio,
      open: true
    })),
    assignCastID: assign((_, event) => ({ ID: event.data })),
    assignTrack: assign((context) => {
      const { ID } = context.uncastTracks[context.cast_index];
      return {
        stars: [{
          ID: context.modelfk
        }],
        ID
      }
    }),
    assignNextImport: assign(context => ({
      item: context.candidates[context.add_index],
      progress: 100 * (context.add_index/context.candidates.length)
    })),
    assignClose: assign({ image: null, studio: null, open: false, path: "" }),
    clearStars: assign({ models: [], stars: [], item: null }), 
    clearProps: assign({ 
      hide: false, 
      response: {},
      responses: [], 
      currentPage: 1 ,
      queryPage: 1, 
      modelfk: null,   
      history: [],   
    }),
    appendKeys: assign((context, event) => { 
      const files = event.data?.filter(f => !!f && !['javdoe.tv','javdoe.com','javfinder.la'].some(d => f.domain === d));
      const keyset = context.keyset.filter(key => !files.find(f => f.Key?.toUpperCase() === key.toUpperCase()))
      console.log ({ files , keyset})
      return {
        responses:  context.responses.concat(files), // (files||[]).concat(),
        keyset ,
        search_index: context.search_index + SEARCH_SPEED
      }
    }),
    applyChange: assign((_, event) => ({
      [event.key]: event.value
    })),
    assignSelect: assign((context, event) => ({
      responses: context.responses.map(e => e.URL === event.URL ? {
        ...e,
        selected: !e.selected
      } : e)
    })),
    assignProblem: assign((_, event) => ({
      error: event.data.message,
      stack: event.data.stack
    }))
  }
});

export const useLibrarian = (refresh) => {
  const [state, send] = useMachine(librarianMachine, {
    services: { 
      getModelFromPath: async(context) => { 
        const star = await getModelsByName(context.star, 1);
        // console.log ({ name })
        return star?.image
      },
      onComplete: async() => { 
        return refresh && refresh()
      },
      autoInvoke: async(context) => {
        const datum = await getJavNames(context.key, context.name, context.studio);
        console.log (context.name, context.key, datum)
        if (datum?.indexOf('javlibrary') > 0) {
          return datum.split('/').pop()
        } 
        return false
      },
      onOpen: async() => {
       const datum = await navigator.clipboard.readText();
        if (datum?.indexOf('javlibrary') > 0) {
          return datum.split('/').pop()
        } 
        return false
       },
      getKeysFromPath: async(context) => { 
        return await getJavKeys(context.path)
      },
      sendSearchRequest: async(context) => {
        return await searchJavdo(context.key)
      },
      checkKeys: async(context) => {
        const { response, search_index} = context;
        const batch = response.keys.slice(search_index, search_index + SEARCH_SPEED);
        return await Promise.all(batch.map(s => findVideos(s,1,1))); 
      },
      checkKey: async(context) => {
        return await findVideos(context.key)
      },
      castItem: async(context) => {
        console.log ('castItem', context.ID, context.stars) 
        return await Promise.all(context.stars.map((s) => addModelToVideo(context.ID, s.ID))); 
      },
      matchModels:async (context) => { 
        if (!context.models) return [];
        return await Promise.all(
          context.models.map((s) => getModelsByName(s, !0))
        );
      },
      addItem: async(context) => {
        const track = await getVideoByURL(context.item.URL);
        const ID = await saveVideo(track);
        console.log ('addItem', track, context.item, context.stars)
        return ID;
      },
      curateItem: async(context) => {
        return await getVideoInfo(context.item.Key);
      }
    },
  }); 

  return {
    state,
    send, 
    ...state.context
  };
}
