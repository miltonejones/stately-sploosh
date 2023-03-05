
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
              actions: assign({ open: true, title: "", hide: false, queryPage: 1})
            },
            AUTO: {
              target: "auto",
              actions: assign((_, event) => ({
                key: event.key,
                name: event.name,
                open: true
              }))
            },
          },
        },
        opening: {
          invoke: {
            src: "onOpen",
            onDone: [
              {
                target: 'opened', 
                cond: (_, event) => !event.data
              },
              {
                target: "#librarian.get_keys",
                actions: assign((_, event) => ({
                  path: event.data,
                  response: {},
                  responses: [], currentPage: 1 
                }))
              }
            ]
          }
        },
        opened: {
          entry: assign({ responses: [], currentPage: 1   }),
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
              actions: assign({ open: false, path: "", history: [], responses: []})
            },
          },
        },


        auto: {
          entry: assign((context ) => ({ status: `Getting path for model '${context.name}'` })),
          invoke: {
            src: "autoInvoke",
            onError: [
              {
                target: 'closed',
                actions: "assignClose"
              }
            ],
            onDone: [
              {
                target: "#librarian.get_keys",
                actions: ["assignOpen", "clearProps", "assignPath"], 
              }
            ]
          }
        }, 
        
      },
    },

    get_keys: {
      entry: assign((context ) => ({ status: `Getting keys for ${context.path}` })),
      invoke: {
        src: "getKeysFromPath",
        onDone: [
          {
            target: "check_keys",
            actions: assign((_, event) => ({
              response: event.data,
              history: [],
              keyset: event.data.keys,
              // hide: false,
              // responses: [],
              // key_index: 0,
              search_index: 0
            })),
          },
        ],
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
                target: 'next_keys',
                actions: 'appendKeys',
              },
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
              actions: assign((context) => ({
                key: context.response.keys[context.search_index], 
              })),
            },
            {
              target: "#librarian.get_keys",
              cond: "morePages",
              actions: assign((context) => {
                const { href, page } = context.response.pages.find(f => !isNaN(f.page) && Number(f.page) > Number(context.currentPage));
                const parts = href.split('/');
                return {
                  history: context.history.concat(context.path),
                  path: parts.pop(),
                  currentPage: page
                }
              }),
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
                actions: assign((context, event) => ({
                  responses: context.responses.concat(event.data),
                  search_index: context.search_index + 1
                })),
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
            item: event.item
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
            CLOSE: {
              target: '#librarian.done',
              actions: assign({
                models: [],
                stars: [],
                item: null
              })
            },
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
              cond: context => context.add_index < context.candidates.length,
              actions: assign(context => ({
                item: context.candidates[context.add_index]
              })),
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
                actions: assign({ open: false, path: "", history: [], responses: []})
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
                    cond:  (_, event) => typeof event.data === 'object',
                    actions: assign({ stars: [], item: null })
                  },
                  {
                    target: 'cast',
                    actions: assign((_, event) => ({
                      ID: event.data 
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
            pause: {
              after: {
                1999: {
                  target: '#librarian.import_items.next_item',
                  actions: assign({ stars: [], item: null })
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
                    actions: assign((context) => ({
                      add_index: context.add_index + 1
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
              actions: assign((context) => ({
                add_index: context.add_index + 1
              })),
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
    morePages: context => context.response.pages && 
      context.response.pages.find(p => !isNaN(p.page) && Number(p.page) > Number(context.currentPage)),
    moreKeys: context => !!(context.response?.keys?.length > context.search_index),
  },
  actions: {
    assignOpen: assign({ open: true}),
    assignPath: assign((_, event) => ({ path: event.data })),
    assignClose: assign({ open: false }),
    clearProps: assign({ 
      hide: false,
      response: {},
      responses: [], 
      currentPage: 1 
    }),
    appendKeys: assign((context, event) => { 
      const files = event.data?.filter(f => !!f && !['javdoe.tv','javdoe.com','javfinder.la'].some(d => f.domain === d));
      const keyset = context.keyset.filter(key => !files.find(f => f.Key?.toUpperCase() === key.toUpperCase()))
      console.log ({ files , keyset})
      return {
        responses: (files||[]).concat(context.responses),
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
      onComplete: async() => { 
        return refresh && refresh()
      },
      autoInvoke: async(context) => {
        const datum = await getJavNames(context.key, context.name)
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
