import { createMachine, assign } from 'xstate';

export const appMachine = createMachine({
  id: "sploosh_application",
  initial: "dash",
  states: {
    dash: {
      initial: "load_dash",
      states: {

        load_dash: {
          invoke: {
            src: 'loadDashboard',
            onDone: [
              {
                target: 'load_latest',
                actions:  assign({
                  dashboard: (context, event) => event.data,
                }),
              }
            ],
            onError: [
              {
                target: 'error',
                actions:  assign({
                  message: (context, event) => event.data.message,
                }),
              }
            ]
          }
        },

        load_latest: {
          invoke: {
            src: 'loadLatestVideos',
            onDone: [
              {
                target: 'load_favorites',
                actions:  assign({
                  latest: (context, event) => event.data,
                }),
              }
            ],
            onError: [
              {
                target: 'error',
                actions:  assign({
                  message: (context, event) => event.data.message,
                }),
              }
            ]
          }
        },

        load_favorites: {
          invoke: {
            src: 'loadFavorites',
            onDone: [
              {
                target: 'load_recent',
                actions:  assign({
                  favorites: (context, event) => event.data,
                }),
              }
            ],
            onError: [
              {
                target: 'error',
                actions:  assign({
                  message: (context, event) => event.data.message,
                }),
              }
            ]
          }
        },
        load_recent: {
          invoke: {
            src: 'loadRecentVideos',
            onDone: [
              {
                target: 'loaded',
                actions:  assign({
                  recent: (context, event) => event.data,
                }),
              }
            ],
            onError: [
              {
                target: 'error',
                actions:  assign({
                  message: (context, event) => event.data.message,
                }),
              }
            ]
          }
        },
        
        loaded: {},
        error: {
          on: {
            RECOVER: 'load_dash'
          }
        }
      }, 
    }, 
  },
  context: {}, 
});
