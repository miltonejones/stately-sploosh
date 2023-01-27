import { createMachine, assign } from 'xstate';


export const photoMachine = createMachine({
  id: "photo_modal",
  initial: "idle",
  states: {
    idle: {
      on: {
        OPEN: {
          target: "opened",
          actions:  assign({
            name: (context, event) => event.name, 
            ID: (context, event) => event.ID, 
          }),
        },
      },
    },
    opened: {
      initial: "init",
      states: {
        init: {
          after: {
            10: {
              target: 'loading',
              actions:  assign({
                retries: 0,
                open: true
              }),
            }
          }
        },
        loading: {
          invoke: {
            src: "loadPhoto",
            onDone: [
              {
                target: "loaded",
                actions:  assign({
                  open: true,
                  photo: (context,event) => event.data
                }),
              },
            ],
            onError: [
              {
                target: "loading",
                actions:  assign({
                  retries: context => context.retries + 1,
                  open: true
                }),
                cond: context => context.retries < 3
              },
              {
                target: "error", 
              },
            ],
          },
        },
        closing: {
          invoke: {
            src: 'photoClicked',
            onDone: [
              {
                target: "#photo_modal.idle",
                actions: assign({ 
                  open: false
                }),
              },
            ],
          },
        },
        loaded: {
          "on": {
            "CLOSE": {
              "target": "closing",
              actions: assign({ 
                value: (context, event) => event.value,
              }),
            }
          }
        },
        error: {}, 
      },
    },
  },
  context: {
    retries: 0,
    open: false,
    photo: []
  }, 
});