import { createMachine, assign } from 'xstate';

export const modelMachine = createMachine({
  id: "model_modal",
  initial: "idle",
  states: {
    idle: {
      on: {
        OPEN: {
          target: "opened",
          actions:  assign({
            ID: (context, event) => event.ID,
            page: 1
          }),
        },
      },
    }, 
    batch:{
      initial: 'next',
      states: {
        go: {
          invoke: {
            src: 'castModel',
            onDone: [
              {
                target: 'next',
                actions: assign({
                  add_index: context => context.add_index + 1,
                  progress: context => 100 *  ((context.add_index + 1) / context.selected.length),
                })
              }
            ]
          }
        },
        next: {
          after:  {
            10: [
              {
                target:  'go',
                cond: context => context.add_index < context.selected.length
              },
              {
                target: "#model_modal.opened",
                actions: assign({ progress: 0})
              }
            ]
          }
        }
      }
    },
    alias: {
      invoke: {
        src: 'assignAlias',
        onDone: [
          {
            target: 'opened'
          }
        ]
      }
    },
    opened: {
      initial: "loading",
      states: {
        loading: {
          invoke: {
            src: "loadModel",
            onDone: [
              {
                target: "costars",
                actions: 'assignModels',
              },
            ],
            onError: [
              {
                target: "error",
              },
            ],
          },
        },
        costars: {
          invoke: {
            src: 'loadCostars',
            onDone: [
              {
                target: "missing",
                actions:  assign({
                  costars: (context, event) => event.data, 
                }),
              },
            ],
            onError: [
              {
                target: "error",
              },
            ],
          }
        },
        missing: {
          invoke: {
            src: 'loadMissing',
            onDone: [
              {
                target: "loaded",
                actions:  assign({
                  missing: (context, event) => event.data,
                  open: true,
                  tab: 0,
                  selected: [] 
                }),
              },
            ],
            onError: [
              {
                target: "error",
              },
            ],
          }
          
        },
        loaded: {
          on: {
            PAGE: [
              {
                target: '#model_modal.opened',
                cond: context => context.tab  === 0,
                actions:  assign({
                  page: (context, event) => event.page,
                }),
              },
              {
                actions:  assign({ 
                  page: (context, event) => event.page,
                }),
              }
            ],
            CLOSE: {
              target: '#model_modal.idle',
              actions:  assign({ 
                open: false,
                page: 1,
                memory: []
              }),
            },
            BATCH: {
              target: '#model_modal.batch',
              actions: assign({
                add_index: 0
              })
            },
            SELECT: {
              actions: assign({
                selected: (context, event) => context.selected.indexOf(event.ID) > -1
                  ? context.selected.filter(f => f !== event.ID)
                  : context.selected.concat(event.ID)
              })
            },
            REFRESH: '#model_modal.opened',
            OPEN: {
              target: '#model_modal.opened',
              actions:  assign({
                ID: (context, event) => event.ID,
                page: 1
              }),
            },
            TAB: {
              actions:  assign({
                tab: (context, event) => event.tab,
                page: 1
              }),
            },
            CHANGE: {
              actions:  assign({
                filterText: (context, event) => event.value, 
              }),
            }, 
            RENAME: {
              target: "#model_modal.alias",
              actions: assign({
                alias: (context, event) => event.alias,
                aliasMode: false
              })
            },
            ALIAS: {
              actions:  assign({
                aliasMode: (context) => !context.aliasMode, 
              }),
            },
            FAVORITE: {
              target: '#model_modal.opened',
              actions:  assign({
                favorite: (context, event) => !context.favorite,
                page: 1,
                tab: 0
              }),
            },

          }
        },
        error: {
          on: {
            RECOVER: {
              target: "#model_modal.idle",
            },
          },
        },
      },
    },
  },
  context: {
    page: 1,
    tab: 0,
    favorite: false,
    memory: []
  }, 
},
{
  actions: {
    
    assignModels: assign((context, event) => {
      const { memory } = context;
      const model = event.data; 
      const {ID, image, name} = model.model[0];
      // alert (JSON.stringify(model.model[0],0,2))
      return {
        model ,
        open: true,
        memory: memory.find(d => d.ID === ID) 
          ? memory 
          : memory.concat([{
            ID, image, Name: name
          }])
      };
    }),
  }
}

);