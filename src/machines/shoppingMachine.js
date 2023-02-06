import { createMachine, assign } from "xstate";

export const shoppingMachine = createMachine(
  {
    id: "shop_machine",
    initial: "idle",
    states: {
      idle: {
        on: {
          OPEN: {
            target: "opened",
            actions: assign({
              auto_search: (context, event) => event.value,
              page: 1,
              stars_to_add: []
            }),
          },
        },
      },

      search: {
        initial: "parse_params",
        states: {
          parse_params: {
            after: {
              44: {
                target: "next_param",
                actions: assign(({
                  param_list: context => context.param.split('|'),
                  param_index: 0,
                  results: [],
                }))
              }
            }
          },
          next_param: {
            after: {
              44: [
                {
                  target: "init",
                  cond: context => context.param_index < context.param_list.length ,
                  actions: assign(({
                    busy: true,
                    param: context => context.param_list [context.param_index] 
                  }))
                },
                {
                  target: "#shop_machine.results",
                  actions: assign({
                    message: "",
                    busy: false,
                    chosen: [],
                    param: context => context.param_list.join(' OR ')
                  }),
                },
              ]
            }
          },
          init: {
            after: {
              1: {
                target: "find",
                actions: assign({
                  search_index: 0,
                  page_index: 0,
                  progress: 0,
                  page: 1,
                  // auto_search: false
                }),
              },
            },
          },
          next: {
            after: {
              1: [
                {
                  target: "page",
                  cond: (context) =>
                    !!context.addresses &&
                    context.page_index < context.addresses.length,
                },
                {
                  target: "#shop_machine.search.find",
                  cond: (context) =>
                    context.search_index < context.selected.length,
                },
                {
                  target: "#shop_machine.search.next_param",
                  actions: assign({ 
                    param_index: context => context.param_index + 1
                  }),
                },
              ],
            },
          },
          page: { 
            on: {
              MODE: {
                actions: "assignProps",
              },
            },
            invoke: {
              src: "searchByPage",
              onDone: [
                {
                  target: "next",
                  actions: "assignPage",
                },
              ],
            },
          },
          error: {
            after: {
              4999: {
                target: "#shop_machine.idle", 
              }
            }
          },
          find: {
            on: {
              MODE: {
                actions: "assignProps",
              },
            },
            invoke: {
              src: "searchByText",
              onDone: [
                {
                  target: "next",
                  actions: "assignResults",
                },
              ],
              onError: [
                {
                  target: "error",
                  actions: assign((context, event) => ({
                    error: event.data.message,
                    stack: event.data.stack,  
                  })),
                },
              ],
            },
          },
        },
      },
      save: {
        initial: "load",
        states: {
          next: {
            after: {
              100: [
                {
                  target: "load",
                  cond: (context) => context.save_index < context.chosen.length,
                },
                {
                  target: "#shop_machine.refresh",
                  actions: assign({
                    results: [],
                    message: "",
                    progress: 0,
                    auto_search: false,
                  }),
                },
              ],
            },
          },
          commit: {
            entry: assign(({
              message: context => `Saving video details...'`
            })),
            invoke: {
              src: "saveVideoObject",
              onDone: [
                {
                  target: "next",
                  cond: (context, event) => !context.track_info?.stars,
                  actions: "incrementSave"
                },
                {
                  target: "cast",
                  actions: assign((context, event) => ({
                    track_to_save: {
                      ...context.track_to_save,
                      ID: event.data,
                    },
                  })),
                },
              ],
            },
          },
          cast: {
            initial: "load",
            states: {
              load: {
                entry: assign(({
                  message: context => `Getting models...'`
                })),
                invoke: {
                  src: "loadModels",
                  onDone: {
                    target: "apply",
                    actions: assign({
                      stars_to_add: (context, event) => event.data,
                    }),
                  },
                  onError: {
                    target: "error",
                    actions: assign({
                      message: (context, event) => event.data.message,
                    }),
                  },
                },
              },
              error: {

                initial: 'start',
                states: {
                  start: {
                    after: {
                      1: {
                        target: 'count',
                        actions: assign({
                          counter: 0
                        })
                      }
                    }
                  },
                  count: {
                    after: {
                      100: [
                        {
                          target: 'count',
                          cond: context => context.counter < 7999,
                          actions: assign({
                            counter: context => context.counter + 100
                          })
                        },
                        {
                          target: 'done'
                        }
                      ]
                    }
                  },
                  done: {
                    target: "#shop_machine.save.next",
                    actions: "incrementSave"
                  }
                },
 
                on: {
                  RECOVER: {
                    target: "#shop_machine.save.next",
                    actions: "incrementSave"
                  },
                  RETRY: {
                    target: "#shop_machine.save.next", 
                  }
                }
              },


              pause: {
                after: { 
                  1999: {
                    target: "#shop_machine.save.next",
                  }
                }
              },
              apply: {
                invoke: {
                  src: "castModels",
                  onDone: {
                    target: "pause",
                    actions: "incrementSave"
                  },
                  onError: {
                    target: "error",
                    actions: assign({
                      message: (context, event) => event.data.message,
                    }),
                  },
                },
              },
            },
          },
          error: {

          },
          curate: {
            entry: assign(({
              message: context => `Looking up video details...'`
            })),
            invoke: {
              src: "curateVideo",
              onDone: [
                {
                  target: "commit",
                  actions: assign((context, event) => ({
                    track_info: event.data,
                    track_to_save: {
                      ...context.track_to_save,
                      title: event.data?.title || context.track_to_save.title,
                    },
                  })),
                },
              ],
              onError: [
                {
                  target: "error",
                  actions: assign((context, event) => ({
                    error: event.data.message, 
                    stack: event.data.stack, 
                  })),
                },
              ],
            },
          },
          load: {
            on: {
              MODE: {
                actions: "assignProps",
              },
            },
            invoke: {
              src: "loadByURL",
              onDone: [
                {
                  target: "curate",
                  actions: assign({
                    track_to_save: (context, event) => event.data,
                  }),
                  // actions: assign({
                  //   saved: (context, event) => event.data,
                  //   message: context => `Saved ${context.save_index} of ${context.chosen.length}`,
                  //   progress: context => 100 * ((context.save_index + 1) / context.chosen.length),
                  //   save_index: context => context.save_index + 1
                  // })
                },
              ],
            },
          },
        },
      },
      results: {
        on: {
          PAGE: {
            actions: assign({
              page: (context, event) => event.page,
            }),
          },
          CLEAR: {
            target: "opened",
            actions: assign({
              results: [],
              auto_search: false,
            }),
          },
          SAVE: {
            target: "save",
            actions: assign({
              save_index: 0,
            }),
          },
          CHOOSE: {
            actions: assign({
              chosen: (context, event) =>
                context.chosen.indexOf(event.ID) > -1
                  ? context.chosen.filter((f) => f !== event.ID)
                  : context.chosen.concat(event.ID),
            }),
          },
          APPEND: {
            actions: assign({
              chosen: (context, event) => context.chosen.concat(event.ID),
            }),
          },
        },
      },
      refresh: {
        invoke: {
          src: "refreshList",
          onDone: [
            {
              target: "opened",
            },
          ],
        },
      },
      opened: {
        initial: "loading",
        states: {
          //
          loading: {
            initial: "parsers",
            states: {
              selected: {
                invoke: {
                  src: "loadSelectedParsers",
                  onDone: [
                    {
                      target: "#shop_machine.opened.loaded",
                      cond: (context) => !context.auto_search,
                      actions: assign({
                        selected: (context, event) => event.data,
                        open: true,
                      }),
                    },
                    {
                      target: "#shop_machine.search",
                      actions: assign((context, event) => ({
                        param: context.auto_search,
                        selected: event.data,
                        open: true,
                        param_list: [],
                        param_index: 0,
                      })),
                    },
                  ],
                },
              },
              parsers: {
                invoke: {
                  src: "loadParserList",
                  onDone: [
                    {
                      target: "selected",
                      actions: assign({
                        parsers: (context, event) => event.data,
                        open: true,
                      }),
                    },
                  ],
                },
              },
            },
          },

          selecting: {
            invoke: {
              src: "selectParser",
              onDone: [
                {
                  target: "#shop_machine.opened.loaded",
                  actions: assign({
                    selected: (context, event) => event.data,
                  }),
                },
              ],
            },
          },

          loaded: {
            on: {
              CHANGE: {
                actions: assign({
                  param: (context, event) => event.value,
                }),
              },
              SEARCH: {
                target: "#shop_machine.search",
                actions: assign(({ 
                  param_list: [],
                  param_index: 0,
                }))
              },
              SELECT: {
                target: "#shop_machine.opened.selecting",
                actions: assign({
                  parser: (context, event) => event.value,
                }),
              },
              CLOSE: {
                target: "#shop_machine.idle",
                actions: assign({
                  open: false,
                  param: ''
                }),
              },
            },
          },
        },
      },
    },
  },
  {
    actions: {
      incrementSave: assign((context, event) => {
                  
        return {

          saved:   event.data,
          message: `Saved ${context.save_index} of ${context.chosen.length}`,
          progress:  100 * ((context.save_index + 1) / context.chosen.length),
          save_index:  context.save_index + 1,
          // track_to_save: null,
          track_info: null,
          // stars_to_add: null
        }
      }),
      assignResults: assign((context, event) => {
        const currentDomain = context.selected[context.search_index];
        const { videos = [], pages } = event.data;
        const addresses = !pages
          ? null
          : pages.map(dressAddress(currentDomain));
        // const trimmed = videos?.filter(f => !context.results?.find(v => !!v && !!f && v.URL === f.URL))
        // const results = context.results.filter(f => !videos?.find(v => !!v && !!f && v.URL === f.URL))
        // console.log ({
        //   videos,
        //   trimmed
        // })
        const results = combine(videos, context.results);
        return {
          latest: results[0] || context.latest,
          results,
          
          message: `Searching ${currentDomain}. ${context.results.length} matches for "${context.param}"...`,
          addresses,
          page_index: 0,
          currentDomain,
          progress:
            100 * ((context.search_index + 1) / context.selected.length),
          search_index: context.search_index + 1,
        };
      }),

      assignProps: assign((context, event) => {
        return event;
      }),

      assignPage: assign((context, event) => {  
        const results = combine(event.data, context.results);
        return {
          latest: results[0] || context.latest,
          results,
          message: `Searching ${context.currentDomain}. ${context.results.length} matches for "${context.param}"...`,
          page_index: context.page_index + 1,
        };
      }),
    },
  }
);

const combine = (source, destination) => {
  const trimmed = source?.filter(src => !destination?.find(dest => !!dest && !!src && dest.URL === src.URL));
  const combined = destination.concat(trimmed);
  const timed = combined.filter(file => !file.CalculatedTime || file.CalculatedTime > 899);
  console.log ({
    combined,
    timed
  })
  return timed;
}


const dressAddress = (domain) => (p) => {
  const address = p[0].indexOf("://") > 0 ? p[0] : `https://${domain}${p[0]}`;
  return [address, p[1], domain];
};
