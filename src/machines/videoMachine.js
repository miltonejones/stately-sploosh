import { createMachine, assign } from "xstate";

export const videoMachine = createMachine(
  {
    /** @xstate-layout N4IgpgJg5mDOIC5QDcCWEwHsD6BbAhgMYAWqAdmAHToA2YAxALICqAMgCoCSACqwKIBtAAwBdRKAAOmWKgAuqTGXEgAHogCMADgAsATkq6AbJsO6AzAFYATGcPGANCACeiQ9rOULmr1atD1FkKmFgC+IY5oGDgEJORUtAwA8tx8AHLCYkggUjLyispqCFqmBsamljZ2mo4uCGZ+BlZGQVaaZkJtAOxhEehYeESkFJS4AK408hJ0TGxcvIKiyjlyCkpZhVoW+kYm5ta2Ds6IWx4dhkK62lad2pvd4SCR-TFDVGMTqFMMfAAinOwZJbSFb5daIXyWSjqKzaTSdPyXXQWdSGGquFGUMyWTSadTY-zXHqPPrRQZxEbjSbTZJpQFZZZ5NagQpNLSUbTIzrePE4jpohB6DyGeq6ITIwzqIQdSxEp6k2LDCAAJ0wEmwcsoGFkYEIsnoKlgsnw2so+AAZtqlQAKdQASnocoGCqoytV6pJmrA2t1dMkwMZBXBF0oUv81isFm02k6nXU2n5Zk6Fk8RkC4rxN3uvSiTtempVao1Wp1eoNRpN5stNvtjpe5NdhY9xZ96kyftyq0DCARIalAV8kejsfjR27mislDc7W8xja1izxJzdcVBfdUUoNEwqsomGQYCV9AginiZGQmAA1lRa2SV26NZvt7v9whyGfCMbVhlfdl-Z2wUUdG2Mo9kqQ5am8fQhHhWMLkuYV1FlElc3rVd7y3CRKAoFRS0NY0qErfcbSlGskOXF1UI9B8MKw2RvwZP9mVcbRDEoGwo2hCwY3MZj+WHFMJRMCwtjceFEKXG9yLvSj0MwsBsP1XCKwtQjJSEEjxOdfMpPXKjZOwgRWyBDtQUYoohFaENmN0XQrAlTijF0fkcXUShOmsvwrGhdQ3NuMTngkrTGx0mT9xVA8yzw01lOtPRrPU-zNIbNcsA3EKlTCujfxM1QmJYtjbgjLizB40drM0Tw9BsSMmglaM-PlPMkrQ7coEwQ9j2oU8LyvUiAqa6SWswF8uvfRkv0WeksqZHK6mRScIylGyYznCwnIsFjOOuSVrOY9pdHq5DbyClLdNa+hQswJVKCmY0zUu3BKGvRKKOCwbhrfD9FHGtsf2M6bCksFzDAWi5ri5SxVtK3RysjGzLCuIw4wXJ7GpelKG3a4ZX26x7eue7T0YLd7MFGz9REyv6uy0PRSl2CoDmqUd1CRzxCo5IR2kq0IHhRlCCcwQLzvSy7rpoW77txjTUf5wLidJr7yYm9sQX+jRrBczoOa0JFAk0dz+VU5NYd8MUdY6ZG8eltVcEwDAaExk8z0vSWEqtvBbbAGg5c+shvqMlWuxhCUoUlK4LnhbaEyjDw4yRAJIzMPEZR5y3yXwCAIHdu3PW9HDy3w6LqwdVPhnTzObez5taKV36A--SVOgNrENvMmEbmK7btAOsjTQzrPPZzksFPzqKqztYupbTvuK4HquDJ++jso2bz+QW7Re3ccyJU8pELcn0vp49mhB91YfIoI61x95g-y6Pk-aKsBepqpqDV90WMDFU3QtF2LRu4Csu-dj6ECVGASK5BYD7j1EeLGXVnbX3wofbOICwEmggVA72Y1FZP0pv+ZELkzDfyELcUUzE4SOSZjZfQ7gUQcVsmVKw-9NKAJnsA0B4CyCQKVHqC6V0bqyDukqB6CDe632QewtBnCMHY3lr7bB-sAx4OZpiIhJDiHGDcgbNwyZowzlsJxDmYomF5hYXfFBkUSA6nPAAAlQGaaxrDrFyVQIaWADtOpOx6vvRBYiB7mJNJYwgNi7EOKPk4lQLjZCwEwWTEQFM66mWZprTw9R-AonshYLEBtvCdEnLibRbRYRaD3q7Kevi2GoKoIE4J9jHHONce47G8CS4+KAZQfxVTiBWNsbUsJ9SokxIVnEwyk1cGJJhMmVo6hRSGC2J0ROwpsmSihLieyO9vKdEMMYspbSOnUEtHhaxZB8C4DgPQeJijEneSECkvwzNZluUyWYA2iNJw+EIRybQWtGEp28aI3ZEj4gHO1Eck5Zz54KIYjNbySJWLjk4nGYq79oyr0lBOHEUYuRSmYoKbZN82ll32fuQ5rC3EXKhYUNy5U9YcTFOUeZI5ai2UhO4MwcItjeSRni1prDRFEqVCSo+ZKRnK0uTNIOLlmbEIRBHC4q8YwsTsMQ7wUEOh+C7r80p+LeWErLqEu21jZCYGsXKRpcCvFap5XfXVGd9We0NcauUgy5FxJrovVWCBNAcxDJcCM0M8RXE0aOCMVx2RevHJraMMKNXZktf8nVGdRF2poA6k1JIhZhVFuLIRLsGo7ITRAJNjijVpqiM6v2oyEnQt8PoNeOggg+UMI3YNXhJU2H9XiGE44tmarzdqu+ukaJnyUmPYiE842mOzoOuS1ccFVsKHrG50JoximlFUKwCZ-A3LZXYFE9RpnmW5fGgdMkh0RRHSpMdIjJ0D2nfpEVtcxUsmYpK0OMrPJytHInGMng9bwQxcQ-avbDpWqnWlMKw6C5VliroeKfbQO3vA5dclS9ECLqhG3VdbR10JiaOvLERhZnTOKDZI9N7j6nTajAx2ONr1IMQ29GRPsK2iopccEwBhwxfIjKpFFX7+yYngl8pMs4hJkfoxRmSZ1eFZoERLOj5TUqMZGsx+Rlan3sZYkiXw3HkTYubbUEU+HCF2GRN-XYPzY3wcoKAs0oDYDEEwpgeQZonDWJIPgMgMBIOjxUoENS47rO2fs45sgzm7FuY815sAKGPVNA6D6vTKIzZclXl6yV5x26pg5CUoLYA7NwEc5AsgEBrHBcK9YmQUBjn22ox42jLSbP5ZC5QYrpXysOcq6gar+AvZMawa6udGm6jXAnMJ4w7brglSZeODwOJ4SWFBsDYhR7VRgAoBAegABBH4PxYtdmBgmJt+h7Kh1jBCYqq2JDrcgPQH4AAlZI+3-y2WTOo9+EY2jv0uAmLwQpbLmVuHiHY3MrMgZ3Ndjb9B7t8EYIkAAagsIbbGEDWATDGI2+7vCJ0A20K7N3C28Oh3wAAwgjvg93nuJPIbTco+wqgGx-RydoszoaEORJZxcca1sbdSuncgUAzWeNzeDnnkA+cQAF+WtTrHUN1CbTch5Tb2hsuqs80cWwJzbRNm5YqmsgNg57mLwtm5+deYzSLfhgjhGNeNxLqX-XYlU5mrYZJSv5kc28FcdXhnrAGCCHiaZx3zJmHx7z03GBNsk9YIkAAykjyFcvilATpvTsCaGXIwexzOEwhJgNG8h+LiP4uSBbkgect1z9-yEPMK5aGrREy4j0bxJtIZCHxY5sidwuXReF5N5gdOJfiBl4YBC9TKOa8eCpQ3rkmxFka6xFCGybRLDnD8HCMPReB+R8oKMMgm4gm3YP+eZ3hRN4ThFLn5FXhGXHHMpOeopgLjnEjAETf-fB-98P5tvfx-T+IARhuQuCEljnaC5EhlqC2BhhMDjE8gEglFDyJDCwwHgCyAQUTw9QAFoKFahMCe1DcAoEgMCuwrgDZllEUP1Nll1zMj13gqQwBiD65rJkwkR2hV0FlxxGZIDLhf0oDOJNd5lECCD8ZjpMBGDTJCEXlkxEVVJ2hbJTMY0udrN+p1xeFxDoVTAJwdh4QHkoItAN0mZzJclrh1okRvBvAbBOcREVD0YvQSx1CF0DNEBbByoYVltzAugxN88+o0YBYqIHDEAftRxgZcln87lvITMEJvCRDko-CZInwlQAiihWgTsPCrhghmIbg1pjD3JmIhIzNfJoi3ZmpqIZ0kiZlLJyh2hoRpRb9PUvU69zNgZOJtFFDrDfClMMI1Dx85drB142IKhkVfBmYDZzIbkTCYJNDgZv4j0bC4jBokjYDeJ6gDAhx0lOIw4e8e45jApFjzIyDE5PBW4dAmgzDfBZjVxWEkjDsv0ctWIlo4wA9sMtiAEJMkjpsNAYRIJW5ltYRvchClDwdyN75FizCMM7IvlLBL8m5NkDAuRNYYxNkLh3BxNFMOlyi6i4wdA4STB9d1p1oXjmEJN2lAVKBujZcPU2hyobIg44QbgxinCig7BjCxQdNhjNoASFMAVKlOouFZBFjSCmZNlthE5YZ4R343J8DASe5gS9lqkelk1wlIlUCKSqYhIhRbhjAX0CoDDagtAEsWdrAE5RQYQrDGtZTSS5BiUQVjlTkVTH0UcqTGhaSYxuNX5KFOJKAMVYxsdIwJtUS2lySHSk8vlIIuQvVmJjAOYcDwQvAl121ZlbIV82jzTiSy53iGgdBbh9hRQkRTBV5Fsw0oJBI0kzS-lgTCUrSBUQVSV3jjAvT2IczgD8yW1g4ctExcyoyDdpTXjFMbVSti1HUSRyjv4QxgY4QiM8REzV4hJFUYRzJZyvAI0AzeV-CeiPVUlXJZlExCEpRMlrg0saZ5tkSdNcUij80T1twaJFjY4DAdytAURzCxQExvINo9Z0t91A1OTUzFNdIgz3UuxNlXCYRXd5w7BEwEwFkxzhRCp1ogcVzLyMJWokiXCtzMl5lRQxR6hGS5Dyp5kvVMkqhv4UQj0OtiAkjrh-BwSXCTY9YhJV5mTMRdgV02VrgsRSLmtCsnMXNItiBPMYAKKbh9BoRhQJt18dZ5VrImL9crgYQzzhC8wyLWt1t2tOLOsqsasULiFxi2cIZ7yoxJL9A2UZLTzzB38UKEYjiAhYQdgIx6Lg1Zl2QA88jxw4C4x38yThZEj1yuw2Uvl2RIwkt9g6jEx14YLMsbALgUR5kPKI8BcLKf1AhrK-14V7LIDYSOgthmc3BzZuyRE7di8IAULZs682hHyUiggICACAgoRsKxQNjvBMlYrt8h8R9iqP4qUOCKrZl+R0KvSsq+xNZArmrP9d998SZLwiqfL-woxYQQw3IkwjCYJdTXAYRMQRKsQKqJkRqd9j9IB3i91EsNlQrUsF9M9A1OVO1PJNAwgwggA */
    id: "video_machine",
    initial: "idle",
    states: {
      idle: {
        on: {
          MULTIPLE: {
            target: "multiple",
            actions: assign({
              videos: [],
            }),
          },
          OPEN: {
            target: "opened",
            actions: assign((_, event) => {
              // alert(JSON.stringify(event.video));
              return {
                video: event.video,
              };
            }),
          },
        },

        description: `Drawer is closed and waiting for input.`,
      },
      multiple: {
        on: {
          MULTIPLE: "idle",
          EDIT: "opened",
          OPEN: {
            actions: assign({
              videos: (context, event) =>
                context.videos.find((e) => e.ID === event.video.ID)
                  ? context.videos.filter((f) => f.ID !== event.video.ID)
                  : context.videos.concat(event.video),
            }),
          },
        },

        description: `Handle multiple items somehow`,
      },
      drop_video: {
        initial: "detect",
        states: {
          error: {},
          detect: {
            after: {
              1: [
                {
                  target: "drop",
                  cond: "request has no videos",
                },

                {
                  target: "loop",
                  actions: assign({
                    loop_index: 0,
                    video: (context) => context.videos[0],
                  }),
                },
              ],
            },
          },

          loop: {
            initial: "go",
            states: {
              over: {
                invoke: {
                  src: "refreshList",
                  onDone: {
                    target: "#video_machine.opened",
                    actions: assign({
                      videos: [],
                      // open: false
                    }),
                  },
                },
              },
              next: {
                after: {
                  100: [
                    {
                      target: "go",
                      cond: "more videos",
                      actions: assign({
                        video: (context) => context.videos[context.loop_index],
                      }),
                    },
                    {
                      target: "over",
                    },
                  ],
                },
              },
              error: {
                after: {
                  4999: {
                    target: "next",
                    actions: assign({
                      loop_index: (context) => context.loop_index + 1,
                    }),
                  },
                },
              },
              go: {
                invoke: {
                  src: "dropVideo",
                  onDone: [
                    {
                      target: "next",
                      actions: assign({
                        loop_index: (context) => context.loop_index + 1,
                      }),
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

          drop: {
            invoke: {
              src: "dropVideo",
              onDone: [
                {
                  target: "#video_machine.refresh",
                  actions: assign({
                    message: "Deleted video.",
                  }),
                },
              ],

              onError: [
                {
                  target: "error",
                  actions: assign({
                    msg: (_, event) => event.data.message,
                  }),
                },
              ],
            },
          },
        },
      },
      drop_model: {
        invoke: {
          src: "dropModel",
          onDone: [
            {
              target: "refresh",
              actions: assign({
                message: "Removed model from video.",
              }),
            },
          ],
        },
      },
      add_model: {
        initial: "detect",

        states: {
          detect: {
            after: {
              1: [
                {
                  target: "create",
                  cond: "context model has value",
                  description: `Look for a "value" prop on the model object to detect a name.`,
                  actions: "resetCreateCounter",
                },

                {
                  target: "add",
                  cond: "video array is empty",
                  actions: "resetAddCounter",
                },

                {
                  target: "loop",
                  actions: assign({
                    loop_index: 0,
                    video: (context) => context.videos[0],
                  }),
                },
              ],
            },

            description: `Detect param type for this iteration and route to the correct state.`,
          },

          create: {
            initial: "iterate names",
            entry: [
              assign({
                stateName: "creating new models",
              }),
              "debug",
            ],
            states: {
              error: {},

              insert: {
                invoke: {
                  src: "createModel",
                  onDone: {
                    target: "iterate names",
                    actions: ["assignModelID", "iterateModelCounter"],
                    description: `Mutate "model" to remove the "value" prop.`,
                  },

                  onError: [
                    {
                      target: "error",
                      actions: assign({
                        msg: (_, event) => event.data.message,
                      }),
                    },
                  ],
                },

                description: `Create a new model and return the server response.`,
              },

              "check if model exists": {
                invoke: {
                  src: "checkModel",
                  onDone: [
                    {
                      target: "iterate names",
                      cond: "model name was found",
                      actions: ["assignFoundModel"],
                    },
                    { target: "#video_machine.add_model.create.insert" },
                  ],
                },
              },

              "iterate names": {
                always: [
                  {
                    target:
                      "#video_machine.add_model.create.check if model exists",
                    actions: "setCurrentModelName",
                    cond: "more model names",
                  },
                  {
                    target: "#video_machine.add_model.detect",
                    actions: assign({
                      model: {},
                    }),
                  },
                ],

                description: `Iterate over the name list and create each one`,
              },
            },
          },

          error: {},

          add: {
            // Natasha Nice,Spencer Scott,Kyler Quinn,Juan Small

            description: `Apply model ID to track ID`,
            entry: [
              assign({
                stateName: "applying models to videos",
              }),
              "debug",
            ],
            states: {
              "iterate models": {
                always: [
                  {
                    target: "add model to video",
                    cond: "more model ids",
                    actions: "setCurrentModelID",
                  },
                  {
                    target: "#video_machine.refresh",
                    actions: assign((context) => ({
                      message: `Added ${context.IDs.length} models`,
                    })),
                  },
                ],
                description: `Iterate over the model list and add each one`,
              },

              "add model to video": {
                invoke: {
                  src: "applyModel",

                  onDone: {
                    target: "iterate models",
                    actions: "iterateAddCounter",
                  },

                  onError: "#video_machine.add_model.error",
                },
              },
            },

            initial: "iterate models",
          },

          loop: {
            initial: "go",

            states: {
              next: {
                after: {
                  100: [
                    {
                      target: "go",
                      cond: "more videos",
                      actions: assign({
                        video: (context) => context.videos[context.loop_index],
                      }),
                    },
                    {
                      target: "#video_machine.refresh",
                    },
                  ],
                },
              },
              error: {
                after: {
                  4999: {
                    target: "next",
                    actions: assign({
                      loop_index: (context) => context.loop_index + 1,
                    }),
                  },
                },
              },
              go: {
                invoke: {
                  src: "applyModel",
                  onDone: [
                    {
                      target: "next",
                      actions: assign({
                        loop_index: (context) => context.loop_index + 1,
                      }),
                    },
                  ],

                  onError: [
                    {
                      target: "error",
                      actions: assign((_, event) => ({
                        error: event.data.message,
                        stack: event.data.stack,
                      })),
                    },
                  ],
                },
              },
            },

            entry: [
              assign({
                stateName: "loop over videos",
              }),
              "debug",
            ],
          },
        },
      },
      refresh: {
        description: `Refresh video list after changes`,

        states: {
          "notify change": {
            entry: assign({ notify: true }),
            after: {
              1500: {
                target: "send refresh signal",
                actions: assign({ notify: false }),
              },
            },
          },

          "send refresh signal": {
            invoke: {
              src: "refreshList",
              onDone: [{ target: "#video_machine.opened" }],
            },
          },
        },

        initial: "notify change",
      },
      opened: {
        initial: "loading",

        states: {
          error: {
            on: {
              RECOVER: {
                target: "#video_machine.idle",
                actions: assign({
                  open: false,
                }),
              },
            },
          },
          loading: {
            invoke: {
              src: "loadVideo",
              onDone: [
                {
                  target: "loaded",
                  actions: assign({
                    video: (context, event) => event.data,
                    open: true,
                  }),
                },
              ],
              onError: [
                {
                  target: "error",
                  actions: assign({
                    error: (context, event) => event.data.message,
                    open: true,
                  }),
                },
              ],
            },
          },
          loaded: {
            on: {
              CLOSE: {
                target: "#video_machine.idle",
                actions: assign({
                  open: false,
                  videos: [],
                  video: null,
                }),
              },
            },

            states: {
              choose: {
                always: [
                  {
                    target: "unlocked",
                    cond: "is unlocked",
                  },
                  "locked",
                ],
              },

              unlocked: {
                on: {
                  lock: {
                    target: "locked",
                    actions: "assignLock",
                  },
                },
              },

              locked: {
                on: {
                  unlock: {
                    target: "unlocked",
                    actions: "assignUnlock",
                  },
                },
              },
            },

            initial: "choose",
          },
        },

        on: {
          ADD: {
            target: "add_model",
            actions: "assignInitialModels",
          },

          DROP: {
            target: "drop_model",
            actions: "assignEventID",
          },

          REMOVE: {
            target: "drop_video",
            actions: "assignEventID",
          },
        },
      },
    },
    context: {
      open: false,
      locked: false,
      IDs: [],
    },
    predictableActionArguments: true,
    preserveActionOrder: true,
  },
  {
    actions: {
      assignUnlock: assign({
        locked: false,
      }),
      assignLock: assign({
        locked: true,
      }),
      assignModelID: assign((context, event) => {
        console.log({
          created: event.data,
        });
        return {
          IDs: context.IDs.concat(event.data.insertId),
        };
      }),
      assignInitialModels: assign((_, event) => {
        // alert(JSON.stringify(event.model, 0, 2));
        return {
          model: event.model,
          IDs: !!event.model.ID ? [event.model.ID] : [],
        };
      }),
      // assignModelList: assign((context) => ({
      //   IDs: [context.model.ID],
      // })),
      resetCreateCounter: assign((context) => {
        const values = context.model.value.split(",").map((f) => f.trim());
        return {
          IDs: [],
          create_counter: 0,
          values,
        };
      }),
      resetAddCounter: assign((context) => {
        return {
          add_counter: 0,
        };
      }),
      iterateAddCounter: assign((context) => {
        const { add_counter, IDs } = context;
        console.log({ add_counter, IDs });
        return {
          add_counter: context.add_counter + 1,
        };
      }),
      setCurrentModelName: assign((context) => ({
        value: context.values[context.create_counter],
      })),
      setCurrentModelID: assign((context) => ({
        ID: context.IDs[context.add_counter],
      })),
      iterateModelCounter: assign((context) => ({
        create_counter: context.create_counter + 1,
      })),
      assignEventID: assign((context, event) => ({
        IDs: context.IDs.concat(event.ID),
        ID: event.ID,
      })),
      assignFoundModel: assign((context, event) => {
        const models = event.data;
        const model = models?.find((f) => f.name === context.value);
        const IDs = context.IDs.concat(model.ID);
        const create_counter = context.create_counter + 1;
        console.log({ models, create_counter, IDs });
        return {
          IDs,
          ID: model.ID,
          create_counter,
        };
      }),
      debug: assign((context) => {
        //Angela White, Mia Khalifa, Lana Rhoades, Lena Paul, Gabbie Carter, Skylar Vox
        console.log('Entered "%s" state', context.stateName);
      }),
    },
    guards: {
      "is unlocked": (context) => !context.locked,
      "request has no videos": (context) => !context.videos,
      "video array is empty": (context) => !context.videos?.length,
      "more model names": (context) =>
        !!context.values?.length &&
        context.create_counter < context.values.length,
      "more videos": (context) =>
        !!context.videos?.length && context.loop_index < context.videos.length,
      "context model has value": (context) => !!context.model.value,
      "more model ids": (context) => context.add_counter < context.IDs.length,
      "model name was found": (context, event) => {
        const models = event.data;
        const model = models?.find((f) => f.name === context.value);

        console.log({ model });
        if (model) {
          return model.ID;
        }

        return false;
      },
    },
  }
);
