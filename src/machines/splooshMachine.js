import { createMachine, assign } from 'xstate';

export const splooshMachine = createMachine({
  id: "sploosh_machine",
  initial: "dash",
  states: {
    dash: {
      on: {
        VIDEO: {
          target: "video",
        },
        MODEL: {
          target: "#sploosh_machine.model",
          actions:  assign({
            page: 1, 
          }),
        },
        SEARCH:  "#sploosh_machine.search",
        FAVORITE:  "#sploosh_machine.favorites",
        RECENT:  "#sploosh_machine.recent",
        CHANGE: { 
          actions:  assign({
            search_param: (context, event) => event.value || context.search_param, 
            debug: (context, event) => event.debug, 
          }),
        },
      },
    },

    save: {
      invoke: {
        src: 'saveSearch',
        onDone: [
          {
            target: 'videos_loaded'
          }
        ]
      }
    },

    videos_loaded: {
      initial: 'loading',
      states: {
        reading:  {
          invoke: {
            src: 'getParam',
            onDone: [
              {
                target: 'loaded',
                actions:  assign({
                  search_param: (context, event) => event.data, 
                }),
              }
            ]
          }
        },
        loading: {
          invoke: {
            src: 'getSearches',
            onDone: [
              {
                target: 'reading',
                actions:  assign({
                  tabs: (context, event) => event.data, 
                }),
              }
            ]
          }
        },
        loaded: {
          on: {
            DASH:  "#sploosh_machine.dash",
            SEARCH:  "#sploosh_machine.search",
            FAVORITE:  "#sploosh_machine.favorites",
            RECENT:  "#sploosh_machine.recent",
            SAVE:{
              target: "#sploosh_machine.save",
              actions:  assign({ 
                value: (context, event) => event.value
              }),
            },
            DOMAIN: {
              target: "#sploosh_machine.domain",
              actions:  assign({
                page: 1,
                domain: (context, event) => event.param
              }),
            },
            VIDEO: {
              target: "#sploosh_machine.video",
              actions:  assign({
                page: 1,
                search_param: ''
              }),
            },
            MODEL: {
              target: "#sploosh_machine.model",
              actions:  assign({
                page: 1, 
              }),
            },
            SET: { 
              actions:  assign((context, event) => ({
                [event.key]:  event.value,  
              })),
            },
            CHANGE: { 
              actions:  assign({
                search_param: (context, event) => event.value, 
                debug: (context, event) => event.debug, 
              }),
            },
            PHOTO: { 
              target: "#sploosh_machine.photo_update",
              actions: 'assignPhotoData',
            },
            HEART: { 
              target: "#sploosh_machine.set_favorite",
              actions: 'assignPhotoData',
            },
            DROP: { 
              target: "#sploosh_machine.drop",
              actions: 'assignPhotoData',
            },
            REFRESH: "#sploosh_machine.refresh", 
          }
        }
      },

    },

    refresh: {
      invoke: {
        src: 'refreshList',
        onDone: [
          {
            target: "#sploosh_machine.video",
            cond: context => context.view  === 'video',
          },
          {
            target: "#sploosh_machine.model",
            cond: context => context.view  === 'model',
          },
          {
            target: "#sploosh_machine.favorites",
            cond: context => context.view  === 'favorites',
          },
          {
            target: "#sploosh_machine.recent",
            cond: context => context.view  === 'recent',
          },
          {
            target: "#sploosh_machine.search",
            cond: context => context.view  === 'search',
          },
          {
            target: "#sploosh_machine.domain",
            cond: context => context.view  === 'domain',
          },
          {
            target: "#sploosh_machine.dash", 
          },
        ]
      } 
    },

    photo_update: {
      invoke: {
        src: 'updatePhoto',
        onDone: [
          {
            target: "#sploosh_machine.refresh", 
          },
        ]
      }
    },

    set_favorite: {
      invoke: {
        src: 'setFavorite',
        onDone: [
          {
            target: "#sploosh_machine.refresh", 
          },
        ]
      }
    },

    drop: {
      invoke: {
        src: 'dropVideo',
        onDone: [
          {
            target: "#sploosh_machine.refresh", 
          },
        ]
      }
    },

    video_error: {
      on: {
        RECOVER: {
          target: "#sploosh_machine.dash",
        },
      },
    },

    video: {
      initial: "loading",
      states: {
        loading: {
          invoke: {
            src: "loadVideos",
            onDone: [
              {
                target: "#sploosh_machine.videos_loaded",
                actions:  assign({
                  videos: (context, event) => event.data, 
                  view: 'video'
                }),
              },
            ],
            onError: [
              {
                target: "#sploosh_machine.video_error",
                actions:  'assignProblem',
              },
            ],
          },
        },  
      },
    },

    model: {
      initial: "loading",
      states: {
        loading: {
          invoke: {
            src: "loadModels",
            onDone: [
              {
                target: "#sploosh_machine.videos_loaded",
                actions:  assign({
                  models: (context, event) => event.data, 
                  view: 'model'
                }),
              },
            ],
            onError: [
              {
                target: "#sploosh_machine.video_error",
                actions:  'assignProblem',
              },
            ],
          },
        },  
      },
    },

    favorites: {
      initial: "loading",
      states: {
        loading: {
          invoke: {
            src: "loadFavorites",
            onDone: [
              {
                target: "#sploosh_machine.videos_loaded",
                actions:  assign({
                  videos: (context, event) => event.data,  
                  view: 'favorites'
                }),
              },
            ],
            onError: [
              {
                target: "#sploosh_machine.video_error",
                actions:  'assignProblem',
              },
            ],
          },
        },  
      },
    },

    recent: {
      initial: "loading",
      states: {
        loading: {
          invoke: {
            src: "loadRecentVideos",
            onDone: [
              {
                target: "#sploosh_machine.videos_loaded",
                actions:  assign({
                  videos: (context, event) => event.data, 
                  view: 'recent'
                }),
              },
            ],
            onError: [
              {
                target: "#sploosh_machine.video_error",
                actions:  'assignProblem',
              },
            ],
          },
        },  
      },
    },

    search: {
      initial: "loading",
      states: {
        loading: {
          invoke: {
            src: "searchVideos",
            onDone: [
              {
                target: "#sploosh_machine.videos_loaded",
                actions:  assign({
                  videos: (context, event) => event.data, 
                  view: 'search'
                }),
              },
            ],
            onError: [
              {
                target: "#sploosh_machine.video_error",
                actions:  'assignProblem',
              },
            ],
          },
        },
        
      },
    },

    domain: {
      initial: "loading",
      states: {
        loading: {
          invoke: {
            src: "loadDomain",
            onDone: [
              {
                target: "#sploosh_machine.videos_loaded",
                actions:  assign({
                  videos: (context, event) => event.data, 
                  view: 'domain'
                }),
              },
            ],
            onError: [
              {
                target: "#sploosh_machine.video_error",
                actions:  'assignProblem',
              },
            ],
          },
        },
        
      },
    },


  },
  context: { page: 1, search_param: '' },
  predictableActionArguments: true,
  preserveActionOrder: true,
},
{
  actions: {
    assignProblem: assign((context, event) => {
      return {
        errorMsg: event.data.message,
        stack: event.data.stack
      }
    }),
    assignPhotoData: assign((context, event) => { 
      return {
        ID: event.ID  ,
        src:  event.src
      };
    }),
  }
}

);