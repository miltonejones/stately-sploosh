import { createMachine, assign } from 'xstate';


export const shoppingMachine = createMachine({
  id: "shop_machine",
  initial: "idle",
  states: {
    idle: {
      on: {
        OPEN: {
          target: 'opened',
          actions: assign({
            auto_search: (context, event) =>  event.value,
            page: 1
          })
        },
      },
    },

    search: {
      initial: 'init',
      states: {
        init: {
          after: {
            1: {
              target: 'find',
              actions:  assign({  
                search_index: 0,
                page_index: 0,
                progress: 0,
                page: 1,
                busy: true,
                results: [],
                // auto_search: false
              }),
            }
          }
        },
        next: {
          after: {
            1: [
              {
                target: 'page',
                cond: context => !!context.addresses && context.page_index  < context.addresses.length
              },
              {
                target: '#shop_machine.search.find',
                cond: context => context.search_index  < context.selected.length
              },
              {
                target: '#shop_machine.results',
                actions: assign({
                  message: '',
                  busy: false,
                  chosen: []
                })
              }
            ]
          }
        },
        page: {
          on: {
            MODE: {
              actions: 'assignProps'
            }
          },
          invoke: {
            src: 'searchByPage',
            onDone: [
              {
                target: 'next',
                actions: 'assignPage'
              }
            ]
          }
        },
        find: {
          on: {
            MODE: {
              actions: 'assignProps'
            }
          },
          invoke: {
            src: 'searchByText',
            onDone: [
              {
                target: 'next',
                actions: 'assignResults'
              }
            ]
          }
        }
      }
    },
    save: {
      initial: 'load',
      states: {
        next: {
          after: {
            100: [
              {
                target: 'load',
                cond: context => context.save_index < context.chosen.length
              },
              {
                target: '#shop_machine.refresh',
                actions:   assign({  
                  results: [],
                  message: '',
                  progress: 0,
                  auto_search: false
                }),
              }
            ]
          }
        },
        load: {
          on: {
            MODE: {
              actions: 'assignProps'
            }
          },
          invoke: {
            src: 'saveByURL',
            onDone: [
              {
                target: 'next',
                actions: assign({
                  saved: (context, event) => event.data,
                  message: context => `Saved ${context.save_index} of ${context.chosen.length}`,
                  progress: context => 100 * ((context.save_index + 1) / context.chosen.length),
                  save_index: context => context.save_index + 1
                })
              }
            ]
          }
        }
      }
    },
    results: {
      on: {
        PAGE: { 
          actions:  assign({  
            page: (context, event) => event.page
          }),
        },
        CLEAR: {
          target: 'opened',
          actions:   assign({  
            results: [],
            auto_search: false
          }),
        },
        SAVE: {
          target: 'save',
          actions:   assign({  
            save_index: 0
          }),
        },
        CHOOSE: { 
          actions: assign({  
            chosen: (context, event) => context.chosen.indexOf(event.ID) > -1 
              ? context.chosen.filter(f => f !== event.ID)
              : context.chosen.concat(event.ID)
          }),
        },
        APPEND: { 
          actions: assign({  
            chosen: (context, event) => context.chosen.concat(event.ID)
          }),
        }
      }
    },
    refresh: {
      invoke: {
        src: 'refreshList',
        onDone: [
          {
            target: 'opened'
          }
        ]
      }
    },
    opened: {
      initial: 'loading',
      states: {

//
        loading: {
          initial:  'parsers',
          states: {
            selected: {

              invoke: {
                src: 'loadSelectedParsers',
                onDone: [
                  {
                    target: '#shop_machine.opened.loaded',
                    cond: context => !context.auto_search,
                    actions:  assign({
                      selected: (context, event) => event.data,  
                      open: true
                    }),
                  },
                  {
                    target: '#shop_machine.search',
                    actions: assign({
                      param: context => context.auto_search,
                      selected: (context, event) => event.data,  
                      open: true
                    })
                  }
                ]
              }
              
            },
            parsers: {
          
              invoke: {
                src: 'loadParserList',
                onDone: [
                  {
                    target: 'selected',
                    actions:  assign({
                      parsers: (context, event) => event.data,  
                      open: true
                    }),
                  }
                ]
              }
              
              
            }
          },
        },

        selecting: {
          invoke: {
            src: 'selectParser',
            onDone: [
              {
                target: '#shop_machine.opened.loaded',
                actions:  assign({
                  selected: (context, event) => event.data,   
                }),
              }
            ]
          }
        },
      
        loaded: {
          on: {
            CHANGE: { 
              actions:  assign({  
                param: (context, event) => event.value
              }),
            }, 
            SEARCH:  "#shop_machine.search",
            SELECT:  {
              target: "#shop_machine.opened.selecting",
              actions: assign({
                parser: (context, event)  => event.value
              })
            },
            CLOSE: {
              target:   "#shop_machine.idle", 
              actions:  assign({  
                open: false
              }),
            },
          },
        }
      }
    }
  }
},
{
  actions: {

    assignResults: assign((context, event) => { 
      const currentDomain = context.selected[context.search_index] 
      const { videos, pages } = event.data;
      const addresses = !pages ? null : pages.map(dressAddress(currentDomain));
      return {
        results: context.results.concat(videos)  ,
        message: `Searching ${currentDomain}. ${context.results.length} matches for "${context.param}"...`,
        addresses,
        page_index: 0,
        currentDomain,
        progress: 100 * ((context.search_index + 1) / context.selected.length),
        search_index: context.search_index + 1
      };
    }),

    assignProps: assign((context,event) => {
      return event;
    }),

    assignPage: assign((context, event) => {   
      return {
        results: context.results.concat(event.data)  , 
        message: `Searching ${context.currentDomain}. ${context.results.length} matches for "${context.param}"...`,
        page_index: context.page_index + 1, 
      };
    }),

  }
});


const dressAddress = (domain) => p => {
  const address = p[0].indexOf('://') > 0 
    ? p[0]
    : `https://${domain}${p[0]}`
  return [
    address,
    p[1],
    domain
  ]
}


