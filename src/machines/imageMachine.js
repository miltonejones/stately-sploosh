import { createMachine, assign } from 'xstate';

export const imageMachine = createMachine({
  id: "image_machine",
  initial: "loading",
  states: { 
    loading: {
      invoke: {
        src: "loadPhoto",
        onDone: [
          {
            target: "loaded"
          }
        ],
        onError: [
          {
            target: "retry"
          }
        ]
      }
    },
    retry: {
      after: {
        100: [
          {
            target: "loading",
            actions: assign({
              retries: context => context.retries + 1
            }), 
            cond: context => context.retries < 3
          },
          {
            target: "backup"
          }
        ]
      }
    }, 
    backup: {},
    loaded: {
      on: {
        ERROR: 'backup'
      }
    },
  } ,
  context: { retries: 0 }, 
})