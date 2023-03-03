
import { createMachine, assign } from 'xstate';
import { useMachine } from "@xstate/react";
import { getJavKeys, searchJavdo } from '../connector/librarian'
import { getVideoInfo, addModelToVideo, getModelsByName, findVideos, saveVideo } from '../connector'
import { 
  getVideoByURL, 
} from "../connector/parser";


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
              actions: assign({ open: true, title: "", hide: false})
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
      },
    },
    get_keys: {
      invoke: {
        src: "getKeysFromPath",
        onDone: [
          {
            target: "search",
            actions: assign((_, event) => ({
              response: event.data,
              history: [],
              // hide: false,
              // responses: [],
              search_index: 0
            })),
          },
        ],
      },
    },
    // check_keys: {
    //   invoke: {
    //     src: "checkKeys",
    //     onDone: [
    //       {
    //         target: "search",
    //         actions: (_, event) => console.log (event.data)
    //       }
    //     ]
    //   }
    // },
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
      },
      states: {
        next: {
          always: [
            {
              target: "check_key",
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
        check_key: {
          invoke: {
            src: "checkKey",
            onDone: [
              {
                target: "lookup",
                cond: (_, event) => !event.data.records?.length 
              },
              {
                target: "next",
                actions: assign((context, event) => ({
                  responses: context.responses.concat(event.data.records[0]),
                  search_index: context.search_index + 1
                })),
              },
            ],
          }
        },

        lookup: {
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
      },
    },
    done: {
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
        ADD: {
          target: "import_items",
          actions: assign(context => ({
            add_index: 0,
            candidates: context.responses.filter(f => !!f.selected)
          }))
        }
      }
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
              target: '#librarian.done',
            },
          ],
        },
        add: {
          initial: 'curate',
          states: {
            curate: {
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
              invoke: {
                src: 'addItem',
                onDone: [
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
