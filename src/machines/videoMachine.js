import { createMachine, assign } from "xstate";

export const videoMachine = createMachine(
  {
    /** @xstate-layout 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-CSwoNgbwsdaqcbkB6AAEEfg-HywK+uM66m7W8TrSUZgEzGGTDGJN3CvLeAdWhgTO4JBXYgPQH4AAlZIj3A4OMsqYeEt880Zuvbfea5wYTMzq94C74OKCQ+h3wRgiQABqCxVvWejOA7x23T73vFFeuoTRiuMs8k0UFfhgcceS5donlAVH0BJwAYQp3waH8P-xaDcrTco+wqgXObhydoDj7lx2RXz0HAvICpXTuQKAvHhszLBxD-XEBDcWZWwSgrApzIbXMGO6MbRbj8lqgYCCJgriCQQiDseuvW2bgN9FmtIs1EaK0abwPFurdLfKdL0yA8B6uSnMDYqA9xxKcQFGFi9q5yA0TrzxcnGY-B4wJD0XrBEgAGUqe24FbLoCdNFdgUQLidk1loanxnCYQk-uApl8wOnPXJAtyEL+bGvZM0oy+EsjGWyNkdCeX5NxViQQ5zjlhMzbm2uA+E71+X0fxBx8MGA+Ju3s-e5DkX60K46heJSkxOcRM3FoZt2L9oofI-W2jDIJuHJa7AA88RPGfIeVxeyNXLyWOd3EoOVcyWwJMcyC4ZlPfQfA-IPYfCvVKQAyHP-YA0AwoaMNkYqPQLwSBYqJEXiRHJMKxNyZEawXQP3B4DLDAeALIChBvEBbhdwFuaCduWrLuUceuGwNpU+PQXEG9TuNBAfTSBILgmXfQDbeEcoE7HQRMfkRuawVicQuERMKUA5R1d4KkMABQ0ybhJEAwU+KUQIROYwVofkLYbQQdLYbwJMJaLER1fqKIMwmaWFKFZMOMacISLwayDmGQtA-GY6AWFRXwjYUwCcHYFQziKCLQKwA2VNViJMYIbwbwGwLXEvZLbw9GL0EsOI9vTob7cqbyIwBEZPJMXfQo0HYogWKicohAS4d3a4EMRGdPKCKCAo7RFo99DCJ8JUdo6EDhE4ZfYIZiG4NabNdyIFISHgv3SIt2ZqaiPddo0UFieFVQgkaUdHBAXkVyayYoQqNwSMLwtGVorDS6do6wZwtiCoQRK4dTDIhoc9GCBI4GJgm4mWPTCYq4XieoAwIcFEISG4PwRrIo24wKCY8ybuROTwcyO-RjHwQY03JKLBdozySCGEegoeTnYeKOMUScWFRVeEPWfwHTXEqzO3RuIdPg64AQzuFnT7ZwrTWMRObydxFVWQqRUzF+WQdooVbhVyaEznJEQRSopmPECcJMAcRfGyPEAU9Y5tPRBZMU7ySdCBY+DiGBWoOMKjdxZiC4Hg6GOkrU2hKgWIhkp7UOEVbyVjIIY7a4ZxWMKw3wTXdWLQa0gJW0zqRRUUh07goeZufUqBQ0r7JmGMZw7xPvIILEW4djJosef9AZIM4ZFZctQpYpdgi-J7eoFibhVpeoLaROWM40yQkMU+YSB5OwRMAMjJDFOQLFbUT5b5OAHU+FZ0tuC4N0-IuU402oik3Uy4WFSUGMFs5+e0oskBaMVxNuaEIebyeoOMOMc+LwZwuET7CUWMQRVA9Mh+YUsuHUjkcqayLYdNQIGqFnKqZMXweA6qO1dUk8jBM84NdsrlTsnlC8yUAwGU288yVMbcuwdfclUMeFRTWcjVV1dtCNEkMUnES+BffwEUVC8ClyRMbaNwYIedQUzUkjdCHUoSSCTMW5LbPwbPMcSMCkiGTPGMOMLE1FTMkYvSUMhchueEbYVNYSFQ6CBMLQHCug3wBaHpIijDEi7cec2uNbGzZmDWFTT7PEUI2irEBoSQura1MUNYj8oUt9IEsMthZEFyKCJc2FaioIBMDmDwWEZEGETaFY48kbKbNLPE9pKEWyKxE2IdB8uwGFPciOPwXEJMXzdylrYLULbLYgKLGATymmaEYUew0KnWc+NyfQAeTWS4XwGxVy03UbSgNrDrUbWbebGgdozmVxNnLEISRMIvY45BLKuEeVPKwUAnCHKqoeDwKBG1fYpVSrK1eoTWGCjiNMr-DAoXYWcYkypPMlFMK4eqnEcwGMBMG4O9a4fwNoCMJg8KqSqgb-S3aLbqjvPq2EAairUcOdE9dNQk6wm4TqwXI-CAdopa6-GMLYQRLNB-UcHwTEKUTnPQNuYqJ6w-LA4-U-N69oVxeFT66FH6x-ZMB3S4YScyVcsGzAn-SgfAkmS8V6uamfOEFiEUbhB5A4EcxANyFyC6mopVBI1i0vKal6nA-Gt6rYHC3PPwdWYqFnUwcqCUB3JocyFa7mMIIAA */
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
        const values = getFullNames(context.model.value); // context.model.value.split(",").map((f) => f.trim());
        return {
          IDs: [],
          create_counter: 0,
          values,
        };

        function getFullNames(str) {
          const output = str.replace(/\([^)]*\)\s*/g, "");

          // Split into words
          const words = output.trim().split(/\s+/);

          // Array to store full names
          const fullNames = [];

          // Process pairs of words
          for (let i = 0; i < words.length; i += 2) {
            // Check if we have both first and last name
            if (i + 1 < words.length) {
              fullNames.push(`${words[i]} ${words[i + 1]}`);
            }
          }
          return fullNames;
        }
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
