import { createMachine, assign } from 'xstate';

export const searchMachine = createMachine({
  id: "search_machine",
  initial: "idle",
  states: {
    idle: {
      on: {
        OPEN: "opened",
      },
    },
    pin: {
      invoke: {
        src: 'pinSearch',
        onDone: [
          {
            target: 'opened'
          }
        ]
      }
    },
    drop: {
      invoke: {
        src: 'dropSearch',
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
        loading: {
          invoke: {
            src: 'loadSearches',
            onDone: [
              {
                target: 'loaded',
                actions:  assign({
                  searches: (context, event) => event.data,  
                  open: true
                }),
              }
            ]
          }
        },
        closing: {
          invoke: {
            src: 'modalClose',
            onDone: [
              {
                target:  "#search_machine.idle",
                actions:  assign({  
                  open: false
                }),
              }
            ]
          }
        },
        loaded: {
          on: {
            DROP: {
              target:  "#search_machine.drop",
              actions:  assign({ 
                value: (context, event) => event.value,   
              }),
            },
            PIN: {
              target:  "#search_machine.pin",
              actions:  assign({ 
                value: (context, event) => event.value,   
              }),
            },
            CLOSE: {
              target:  "closing",
              actions:  assign({ 
                value: (context, event) => event.value,   
              }),
            },
          },
        }
      }
    }
  }
})