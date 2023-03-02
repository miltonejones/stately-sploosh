import { createMachine, assign } from 'xstate';

export const videoMachine = createMachine({
  id: "video_machine",
  initial: "idle",
  states: {
    idle: {
      on: {
        MULTIPLE: {
          target: "multiple",
          actions:  assign({
            videos: []
          }),
        },
        OPEN: {
          target: "opened",
          actions:  assign({
            video: (context, event) => event.video  ,
            error: null,
            stack: null
          }),
        },
      },
    },
    multiple: {
      on: {
        MULTIPLE: 'idle',
        EDIT: 'opened',
        OPEN: {
          actions:  assign({
            videos: (context, event) => context.videos.find(e => e.ID === event.video.ID)
              ? context.videos.filter(f => f.ID !== event.video.ID)
              : context.videos.concat(event.video),  
          }),
        },
      }
    },
    drop_video:{
      initial: 'detect',
      states: {
        error: {},
        detect: {

          after:  {
            1: [
              {
                target: 'drop',
                cond: context => !context.videos
              },

              {
                target: 'loop',
                actions: assign({
                  loop_index: 0,
                  video: context => context.videos[0]
                })
              }
            ]
          }
        },


        loop: {
          initial: 'go',
          states: {
            over: {
              invoke: {
                src: 'refreshList',
                onDone: [
                  {
                    target: '#video_machine.idle',
                    actions: assign({ 
                      videos: [],
                      // open: false
                    })
                  }
                ]
              }
            },
            next: {
              after: {
                100: [
                  {
  
                    target: 'go',
                    cond: context => context.loop_index < context.videos.length,
                    actions: assign({ 
                      video: context => context.videos[context.loop_index]
                    })
                  },
                  {
                    target: 'over', 
                  }
                ]
              }
            },
            error: {
              after: {
                4999: {
                  target: 'next',
                  actions: assign({
                    loop_index: context => context.loop_index + 1,
                  }),
                }
              }
            },
            go: {
              invoke: {
                src: 'dropVideo',
                onDone: [
                    {
                    target: 'next',
                    actions: assign({
                      loop_index: context => context.loop_index + 1,
                    }),
                  } 
                ],

                  onError: [
                    {
                    target: 'error',
                    actions: assign((context, event) => ({
                      error: event.data.message,
                      stack: event.data.stack
                    })),
                  } 
                ]
              }
            }
          }
        },


        drop: {
          invoke: {
            src: 'dropVideo',
            onDone: [{
              target: '#video_machine.refresh'
            }],

            onError: [
              {
                target: "error",
                actions: assign({
                  msg: (context, event) => event.data.message
                })
              }
            ]

          },
        },


      }
    },
    drop_model: {
      invoke: {
        src: 'dropModel',
        onDone: [{
          target: 'refresh'
        }]
      },
    },
    add_model: {
     initial: 'detect',
     states: {
      detect: {
        after: {
          1: [
            {
              target: 'create',
              cond: context => !!context.model.value
            },

            {
              target: 'add',
              cond: context => !context.videos?.length
            },

            {
              target: 'loop',
              actions: assign({
                loop_index: 0,
                video: context => context.videos[0]
              })
            }
          ]
        }
      },
      create: {
        initial: 'insert',
        states: {
          error: {},
          insert: {
            invoke: {
              src: 'createModel',
              onDone: [
                {
                  target: "#video_machine.add_model",
                  actions: assign({
                    model:  (context, event) =>  { 
                      return ({
                        ID: event.data.insertId
                      })
                    }
                     
                  })
                }
              ],
  
              onError: [
                {
                  target: "error",
                  actions: assign({
                     msg: (context, event) => event.data.message
                  })
                }
              ]
            }
          }
        }
      },
      error: {},
      add: {
        invoke: {
          src: 'applyModel',
          onDone: [{
            target: '#video_machine.refresh'
          }],

          onError: [
            {
              target: "error",
              actions: assign({
                 msg: (context, event) => event.data.message
              })
            }
          ]

        },
      },
      loop: {
        initial: 'go',
        states: {
          next: {
            after: {
              100: [
                {
                  target: 'go',
                  cond: context => context.videos?.length && context.loop_index < context.videos.length,
                  actions: assign({ 
                    video: context => context.videos[context.loop_index]
                  })
                },
                {
                  target: '#video_machine.refresh', 
                }
              ]
            }
          },
          error: {
            after: {
              4999: {
                target: 'next',
                actions: assign({
                  loop_index: context => context.loop_index + 1,
                }),
              }
            }
          },
          go: {
            invoke: {
              src: 'applyModel',
              onDone: [
                  {
                  target: 'next',
                  actions: assign({
                    loop_index: context => context.loop_index + 1,
                  }),
                } 
              ],

              onError: [
                {
                target: 'error',
                actions: assign( (context, event) => ({
                  error: event.data.message,
                  stack: event.data.stack
                })),
              } 
            ]
            }
          }
        }
      }
     }
    },
    refresh: {
      invoke: {
        src: 'refreshList',
        onDone: [
          {
            target: '#video_machine.opened',
            // actions: assign({ 
            //   videos: [],
            //   open: false
            // })
          }
        ]
      }
    },
    opened: {
      initial: 'loading',
      states: {
        error: {
          on: {
            RECOVER:  {
              target: '#video_machine.idle',
              actions:  assign({ 
                open: false
              }),
            }
          }
        },
        loading: {
          invoke: {
            src: 'loadVideo',
            onDone: [{
              target: 'loaded',
              actions:  assign({
                video: (context, event) => event.data, 
                open: true
              }),
            }],
            onError: [
              {
                target: 'error',
                actions:  assign({ 
                  error: (context, event) => event.data.message,
                  open: true
                }),
              }
            ]
          }
        },
        loaded: {

          on: {
            ADD: {
              target: '#video_machine.add_model',
              actions: assign({
                model: (context, event) => event.model,  
              }),
            },
            DROP: {
              target: '#video_machine.drop_model',
              actions: assign({
                ID: (context, event) => event.ID,  
              }),
            },
            REMOVE: {
              target: '#video_machine.drop_video',
              actions: assign({
                ID: (context, event) => event.ID,  
              }),
            },
            CLOSE:  {
              target: "#video_machine.idle",
              actions:  assign({ 
                open: false,
                videos: [],
                video: null
              }),
            }
          }
        }
      }
    },
  },
  context: {
    open: false
  },
  predictableActionArguments: true,
  preserveActionOrder: true,
});