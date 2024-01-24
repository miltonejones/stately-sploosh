import { createMachine, assign } from "xstate";

export const splooshMachine = createMachine(
  {
    /** @xstate-layout N4IgpgJg5mDOIC5SwA4BsD2HYAsD6AtgIYDGOAlgHZgB0ERuAxAGoCSAIgKIDyA2gAwBdRKBTZyAF3IZKIkAA9EARgAsKmkoBs2zQHYAHPoCsupboBMAGhABPROf7ma5lQE5X+gMxHPn-St1NTwBfYOtUTGx8YjIqWnomAFluLgAZAWEkEDFYSWlZLMUEJVd1LR0DY1MLazsEc1cTGn1+V34lfl1+FW8zUPD0LFxCUgpqOgYcRgBlTgBBACUAYQAJDLkcvJk5IqUjMp09QxMzK1t7IyddN1dNV3NjbpcQsJAIoejRuImmADE55jcBasAAqnHWWU2Um2hWU1w0h0qJxq53qxk0zVavgC5nMmn4LwGkWGMTG8UmjAWnCWnAAciCIaJxNCCqBdv4ERVjtUznUGp0aJ5WqdTJ4Avp+m9BlERrFxgkpqs5rSAOLgoQbZn5HaIFQYoIPfhBO7ma63WqIIUqfQ0UqeFz6XTePxGSXvGWk76wIgANzAjAgMloVB9GAA1rR3SSvuNvX6ECGMCQiCyMozslqYWz7HojM4jZ0DA8OuYjBbip4lDbKy4GvalKWq27pdG5bQfeQIGBsHhMEQuxAaAAnMD9qhQANBmiJiM0KOfNs0Dtdnt9gfD0cQccJyih5OpoTpqHa2H1cx+Gi6QKqFQN3xtTTlrRO233JR+Pz8fR6JTN4kLskl07btYF7DB+0gGg13HSdxhnSMWwA75lxAsCIMHaDKCgHc9xTfI0w1SFM1ZBRlG-fhLwaUt-F0Ixvy0J89E8V9zHfLwWm-Uw-w+WVAJQ1dwPXNdIEYdg5mmNZCKZXIWR1CsDi5KozE8ct9CUGgbncI06NLRxCSlf9eOQ4CBPQqDBJE2ZFlWI9iLkrQjUvNR-HtOitHtJ9ulcGh8VcXwGnfCx7W4j0Y3bEzQOEjCLIgRh-kBYEwVsmST2zYpjSc60emo9zeWUdxmLuRo9h6L8DE0ELWz4iK0KEmLKWpOkGSkjMUqzUj0s8DFriy1y1INctcW8DQCp8FRWNorrKqQ8Z+MimLzPQmYAXVTJpK2EiijxYx83xK99GLRwy1RVR+DzfrNDxXx9muaajNmmqosWgdRO4RI5lYWlko2+z8W65zsrcgaTr2CjfKtW9NCUBsJVeed7vCld5rMqKWA4Hhvtk08HP+3qcuBuognUFQfE6XwnQcKa4cQhGgKR2rINR5I0kx1KOvc3GXPxjzUVNa1BV0Vw9mudpXFMV1qcMz0Hvpp7UdmZq1tan7TxcPYaH2EojA6b87l0RjHBodojDosXSgOvy7ulxHULl+qlVVVbNTazb7BUAUAmFwWzC8TQVCfIxHKNFxfO6Y19Ph626dthbUYABRWbgQT4Frj3araujzBw9qLNSjqfLpmNxAKTA8PE+klnio7mhnoqWlZ5gWRXnZVtK8UaXbCwOvPSwD6HBXKOj2gMa5dCtsLo9MuqlvYBZuDj1n0-sTPO-2w7e5OvbnD1782haTQDvHxca7tpaqV+KkJMX130scnquaBnm6mh-gKI6Pyq20Nwm0r0LFxHAAZiOJggY4K7nDAhKWE9AHAJwDhJMeEZAESVmnG+egKKsS6gSPmJQAhPjcLoEatwShnWMD4I+gEYFwCmKA4M4DZyR2gWAIB1D4H7nwoeJQKC7KngsBg98+J7TXFwfrE67h9QFRJiTLQagVAUO+FQkBU54JzhplHRRcDEzsKQYecw3CXZyS6PwrBQjbylFEc-IsRD9iaG1kLDi8jxgaNgnQ0MDC1FMJYbgNhiDKBpk8Po1uHVTDGMETg8xT5SjeRKH5Tw1w1I+Aqr-KqCjmGwJcdOehkCq6eNgT4g8gheAqECVjNKB9QnYOEREk6+x1BFUul0B42h3yONoM42hmS3HZL-pQtJrCtG+LTEYEpbMih3AqaYkRAd7hEKJu4R0RVWkbi8TQ5RWTVFQP-n07xAyCm8E0CMpe6UFLaCRDyQaRhSjNF8PvFolxDBLJQDgDAEgMB4AAK4oHoBIf0HSVGMMXE8l5bzPnfLAPkjhhTU48Lbn7LOBY1492OnyS60SS5ii0ELK8SzYBgAkHgABvoMBDkkL8tZXSNk5MXLi-FhLQwkp+RCnRULDk3zxLRVeucSzIpzFnG4blaJ0RNkkokVLAIQCHBgFAGT-keMXBKqVTK-GHmhQY1Wtj4U527tywa0M8xRLFHabQ7gln8TwGAIckqhwNSWNwZgnAFjX3slc8opzuSnHLJWIIGtvB6iho0Py5hTUmWejBP56yAXVRXKGrCSrkEt1KezBw+rw5+S8F7T1HJNKXRxp4Dwwbo2YQnBaq1NB0ApgAcSgglKenGULYJbcuzIVOuxsm20qaPwZtRAEQhJNKzvnbtcbQSyCAYC7GgGNE5w0Usjd8Ud47J1xpVay+ylYKLHB8NrV+ARWiDX0G0ZoJtBYmFNLiLwI6x1gAnUWxgJbiVlrQBWqtNaUnjHnVexdTbmUtrSu+DozQyG9G3V0Vwg0PDMQ4qUA+XVroS1FbW8YdLiWktgJOmVEa5WASQwyuAn7wHaOVSyhNozlD2icNlW8QovBkwLq0Si-I9SGBaHqJZ2GUNobvUOB9T6hzVtnYholOHUNFqXURoiarf1kY0vaSjX4hROifGpZiYsGimFkUYS6SyRwkDAJQCQaHp0QJfTNNpYAdN6bw7hPZqqgm7G8BRW4WCOhqa6nleovrbRuHGsPWiHQ4MGTFak8z+mb2ce4xIStvHjO0207pkLDbY1fsIz+9m9n21Oc6KoVzg01CELaKWUwTSoaw3g6+yMo4hxkAM+Soz-HytEEqzgSzCDrMrtbZdDSQRLlnQ6F10DqIrwYnuI5gwVYhQEhxRVqroXLX3vLRF59dW5xTaayJpL8bxO2eUHicjfWetGm8P1uou8AOmkMPcEWXFkkmboBgYgVBqtgJnZh74gZ7uUGawRjb61E27FLORwWppva3i8H3DEos94JO6D0JZb2iAPZm6W+bkW+MvflHd+HH21v4cGcu4jRyGyXA0oDq8QsQcqU3l+W0TozruDVtrX8kpKCXvgFkOr+Ob4AFp1JdVMH5IInRdLux5QgTn+r3AS8l5LiOaPyS4A53JPBqJKxuGaLcS4PhjD7vPdd2mcYwAK9Vo6ZTxvvAm2150J8eanANlsY4OnQoxQFpjuhQ3v7BGZQfv1J+ygQca0uj0XwB2jTO6npBEcY4sJu46g4AIPkPAHaFI0TBjELDOE-gn0ouJuih+RtPLcUfNu-eULY9S99Abe7c8+JwrFd4tCz7H3PtdnqQGj1td2hD2KBHPO+TWFPLGG1uI6T+jxcRyN1+o7ZOA2+6n5h0bzPb2j7qvBcrogp7zjRA3qINE+J5AteR8r5KYDdF5I2iLwtpTcm1Ni0CxFxDCXgbHqYhcTugy82YBGlBLBOkpn2iF8HgToZuN+luJ0BCPkeIY0egO6MOu+8qkqKAf+Dwfkl+QB1+Fud+9QnQeYPgeItiQQYoZCoe5qs2Q4f+MiZeAMfUuUimvgRC1ojggedEoef+9wzE7Q3QB0dw2g7Q-eloABqmO2Ys524+pWN2-Ek6rBpgRs8+XBtw+I745Yeo6k40Q+r8DklyIqAWCGtA76aA5BR0nI8SgcRoXQj4vMhgGCxgrkQsB2JW2hZWNAehkhp+BOZMRh1oJh6C5hfItwhCBgJs7Q7cDwxgrGP+PyrOP2Z+3KHhjwphRoBc-6agye-I3W1oYR9K7GRaBhL45Qxhr83hBcYsnmjQgcgc403gWmZmcWBhpYsRXhZhg0Yo6gcS+6gcWC9wZ0VRwWLhURbhuRpynhBRjRvMPQ6kjoQsBWWsXQ9hS2uKDWZArBti9RwxCRA22ggolyt440B8bQJqcBn+K2vRysxexQvBKx8RPhiA1hh6pQIOegLg7QsOGOVASxeYeRQxlxAcZ0GkbgUMbE+wfkrgzx72xxqC9k5xHxcRhRNSMyUSQQ2ufgasoQoQQAA */
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
            actions: assign({
              page: 1,
            }),
          },
          SEARCH: "#sploosh_machine.search",
          FAVORITE: "#sploosh_machine.favorites",
          RECENT: "#sploosh_machine.recent",
          CHANGE: {
            actions: assign({
              search_param: (context, event) =>
                event.value || context.search_param,
              debug: (context, event) => event.debug,
            }),
          },
        },
      },

      save: {
        invoke: {
          src: "saveSearch",
          onDone: [
            {
              target: "videos_loaded",
            },
          ],
        },
      },

      videos_loaded: {
        initial: "loading",
        states: {
          reading: {
            invoke: {
              src: "getParam",
              onDone: [
                {
                  target: "loaded",
                  actions: assign({
                    search_param: (context, event) => event.data,
                  }),
                },
              ],
            },
          },
          loading: {
            invoke: {
              src: "getSearches",
              onDone: [
                {
                  target: "reading",
                  actions: assign({
                    tabs: (context, event) => event.data,
                  }),
                },
              ],
            },
          },
          loaded: {
            on: {
              DASH: "#sploosh_machine.dash",
              SEARCH: "#sploosh_machine.search",
              FAVORITE: "#sploosh_machine.favorites",
              RECENT: "#sploosh_machine.recent",
              SAVE: {
                target: "#sploosh_machine.save",
                actions: assign({
                  value: (context, event) => event.value,
                }),
              },
              DOMAIN: {
                target: "#sploosh_machine.domain",
                actions: assign({
                  page: 1,
                  domain: (context, event) => event.param,
                }),
              },
              VIDEO: {
                target: "#sploosh_machine.video",
                actions: assign({
                  page: 1,
                  search_param: "",
                }),
              },
              MODEL: {
                target: "#sploosh_machine.model",
                actions: assign({
                  page: 1,
                }),
              },
              SET: {
                actions: assign((context, event) => ({
                  [event.key]: event.value,
                })),
              },
              CHANGE: {
                actions: assign({
                  search_param: (context, event) => event.value,
                  debug: (context, event) => event.debug,
                }),
              },
              PHOTO: {
                target: "#sploosh_machine.photo_update",
                actions: "assignPhotoData",
              },
              HEART: {
                target: "#sploosh_machine.set_favorite",
                actions: "assignPhotoData",
              },
              DROP: {
                target: "#sploosh_machine.drop",
                actions: "assignPhotoData",
              },
              REFRESH: "#sploosh_machine.refresh",
            },
          },
        },
      },

      refresh: {
        invoke: {
          src: "refreshList",
          onDone: [
            {
              target: "#sploosh_machine.video",
              cond: (context) => context.view === "video",
            },
            {
              target: "#sploosh_machine.model",
              cond: (context) => context.view === "model",
            },
            {
              target: "#sploosh_machine.favorites",
              cond: (context) => context.view === "favorites",
            },
            {
              target: "#sploosh_machine.recent",
              cond: (context) => context.view === "recent",
            },
            {
              target: "#sploosh_machine.search",
              cond: (context) => context.view === "search",
            },
            {
              target: "#sploosh_machine.domain",
              cond: (context) => context.view === "domain",
            },
            {
              target: "#sploosh_machine.dash",
            },
          ],
        },
      },

      photo_update: {
        invoke: {
          src: "updatePhoto",
          onDone: [
            {
              target: "#sploosh_machine.refresh",
            },
          ],
        },
      },

      set_favorite: {
        invoke: {
          src: "setFavorite",
          onDone: [
            {
              target: "#sploosh_machine.refresh",
            },
          ],
        },
      },

      drop: {
        invoke: {
          src: "dropVideo",
          onDone: [
            {
              target: "#sploosh_machine.refresh",
            },
          ],
        },
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
                  actions: assign({
                    videos: (context, event) => event.data,
                    view: "video",
                  }),
                },
              ],
              onError: [
                {
                  target: "#sploosh_machine.video_error",
                  actions: "assignProblem",
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
                  actions: assign({
                    models: (context, event) => event.data,
                    view: "model",
                  }),
                },
              ],
              onError: [
                {
                  target: "#sploosh_machine.video_error",
                  actions: "assignProblem",
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
                  actions: assign({
                    videos: (context, event) => event.data,
                    view: "favorites",
                  }),
                },
              ],
              onError: [
                {
                  target: "#sploosh_machine.video_error",
                  actions: "assignProblem",
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
                  actions: assign({
                    videos: (context, event) => event.data,
                    view: "recent",
                  }),
                },
              ],
              onError: [
                {
                  target: "#sploosh_machine.video_error",
                  actions: "assignProblem",
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
                  actions: assign({
                    videos: (context, event) => event.data,
                    view: "search",
                  }),
                },
              ],
              onError: [
                {
                  target: "#sploosh_machine.video_error",
                  actions: "assignProblem",
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
                  actions: assign({
                    videos: (context, event) => event.data,
                    view: "domain",
                  }),
                },
              ],
              onError: [
                {
                  target: "#sploosh_machine.video_error",
                  actions: "assignProblem",
                },
              ],
            },
          },
        },
      },
    },
    context: { page: 1, search_param: "" },
    predictableActionArguments: true,
    preserveActionOrder: true,
  },
  {
    actions: {
      assignProblem: assign((context, event) => {
        return {
          errorMsg: event.data.message,
          stack: event.data.stack,
        };
      }),
      assignPhotoData: assign((context, event) => {
        return {
          ID: event.ID,
          src: event.src,
        };
      }),
    },
  }
);
