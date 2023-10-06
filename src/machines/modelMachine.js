import { createMachine, assign } from "xstate";

export const batchCastMachine = createMachine(
  {
    /** @xstate-layout N4IgpgJg5mDOIC5QGMCGsAuB9Atq5AFgJYB2YAdGpuURmAE6p0AEtYOsAxANoAMAuolAAHAPaxaRUSSEgAHogCsATgBM5VQBZlAZlW8AjIoBs+5QBoQAT0QB2dYtsAOY4qe3NTrYt46Avn6WVNh4hKQUwTR0jCxsHDwGgkggYhIYUjLJCggmOuSmxpqatsZ6OgaaljYIqnrkvMpOBg2NTnqOigFB6CH4xGSUPeSowsIANlbMOKIQYGOcENIUpABuogDWET24feGD1CPjk9OzYwiromjp0nz8t7KpktKy2W7K5Do+7sa8xrYVjiqiAAtAYnORdJoTLxVE4nGofpp-IEQMEdmEBkQIGMwJxgvdko9rplQNkDBDbL83D9jKUDMpeLxFECELwIU5FHpdL5yiofMjuph0f0IqIcOMwHQFksaCQ1pt9r0MaLxTi6Oc5ZcmBlbgSROIniT5CDVMpFOQfL5lEVbDo1LwnJVrIgDKpza5TAYjIVVK4vAEUSQZnBZGjQiKHgbiS8QTokRbGXabXb9I6WaDdBC44pFLCPWUnF1Udtw3tgpG0hkYzUoR9NMZlNblM1VAZSk5081jOQkVCTI57LY1AYi2HdgNImwYmBWHQOBXDdXTXk4w2my2207qq6NDn4Vp6bZ7NbCyix8rFcNRhMpsGxgvo1k7F4NKYzaoj-YwRZnQgvfUmThJpFAMcp200UcS3HZZsTAB8qyfBBgS0dQ7WaB1jCMexmV-WpyH+b8jDMTkdHsSChVLCcxQlOh4OeRDkPhfIXC8VsnB5XQWX0bs4yaD8dBhQpSmMAM-CAA */
    id: "cast_machine",
    initial: "idle",
    context: {
      index: 0,
      items: [],
    },
    states: {
      cast: {
        states: {
          "iterate items": {
            always: [
              {
                target: "apply model",
                cond: "more items",
              },
              "#cast_machine.complete",
            ],

            description: `Move to next item or exit when done.`,
          },

          "apply model": {
            invoke: {
              src: "castModel",
              onDone: [
                {
                  target: "iterate items",
                  actions: assign({
                    index: (context) => context.index + 1,
                    progress: (context) =>
                      100 * ((context.index + 1) / context.items.length),
                  }),
                },
              ],
            },
          },
        },

        initial: "iterate items",
      },

      idle: {
        on: {
          cast: {
            target: "cast",
            actions: assign((_, event) => ({
              items: event.items,
              ID: event.ID,
              index: 0,
            })),
          },
        },
      },

      complete: {
        invoke: {
          src: "sendCompeteSignal",
          onDone: "idle",
        },
      },
    },
  },
  {
    guards: {
      "more items": (context) => context.index < context.items.length,
    },
  }
);

export const modelMachine = createMachine(
  {
    /** @xstate-layout N4IgpgJg5mDOIC5QFsD2EwBsD6aIENMBiAeQAUBRAOQG0AGAXUVAAdVYBLAFw9QDtmIAB6IAjAGYALADYAdKICc4hZPEB2OgCYArKOlqANCACeiALRrNa2dukK727ZvH7pmgL7ujeLLnSFZVBYwPkgiACUKADFIgGUACXomJBA2Th5+QREETU17WXVJLVyJVTVtI1MECTVJWTdpAA5ijQVdT290XzxCIiiAQQA1EnCASQAVCiTBNO5eARTs0VrGm1zpbUlayxrK811tevFRbToZOlrtBQ6QHxwezFlCDnxYIgh+MFkOPgA3VAA1l87n4CI9nq8ED9-gBjfAZPhJaYpWYIrKIfQKWSaOhnRqNIpSRqWPYIcROeSbNTScTiLQaNTkm4gh6BYKhCBEADCABkSLEpowZuw5plFohJFjRJICeJNG5JFtpNJSXRZM1xI1NKJlto1G1nJtmV17v5HkEQmEBeNkawRWjxTk8qtWgpGnrGko3SqTOYJGqrnRPQpGeVbNpGsaMKawWzLRBZJhUPgID8oO9Pt8-oDgSbQQELRzE8nU3woFDs3CEUihSj7fN0dUXKJ1W46NopNJRATRJpSTrJJp6hd1PZyWoJB4vLc86zC5Biym00QwAAnVeoVeyFiYeEAM03yFkLLNcaLSaXZYrsPh8xryTt6QbjoUyxsSkKij07oUpKUcl0Ox8SuRwZSjbpT3nBMYXYLh8FXN4PlCLN-iBY9Z0g9kFxg2A4IQ69UCrO9GFtVJ6zFUAljscR1V7C5HEUfRRH7XEsUkE5pFxUR2w7VRwJjAssOg2D4LeNcNy3Hd90PdDo3zc0hNkHC8NgAiiP4e9hSfCjhDEOgTgKFwpHOJx9MMX1qjOOo5SseU1H1Okzn4+SzwXZAOFgTgywzZDoRzWSINjKDjw8rzyz89TERI2tH1FBZKLEZUW2VdRNUsPU+wsmk2MlU5Ti1EMp06OS50U9zPOXcTN23XcuAPVcjxPIKytCtM1NvDToofMjtPi3Sm2OWQ6GORUdBpPRxFJRodWxWotBsjZGk1ZzSvjRcME5Mh+gAcUFbrUWfBLqg2LF21UBQgzoJorh9KpuNWHEO31WzlisaQVswtaLw2ogtt2mhRH28i+qWBQwfkbtFR2HFlXMu6g2xdtRxeyxGQ+5qvpLMIACF+nGLlEhinq4sbHRu3kXFTklHEtkcUlB2sZV9Loew8mG65pyawTMZTK0KB5CguRtImDp0pZJWsFR5TaCRZV7UldADTi22JK7Q3R7nzyxzlIjIcJyFI0WQbESU5FfBR5XbfELrdUljhbJbO1UC4waDDWFJ5n7IiofoAFk9q0knHU46wyeJezLmUCoLPYgNX2WfTOJDd3XITKrVwiQWSEGChwkN4HSZkWQJxZqxqU9fR3VJNR3VkFRGiZrVBykUQU9gEIIAAAgAI3hGEAAtO84KA+F6GDkB3MAuDAfPetJ2khyDTQZBr9tGUmizTiHRxjhxV9bBkWxPGnPgungFIucwQOHSOsxbvMabDiu+x7HKTVJUjTmMNjDgIEwMBr6HX6oOauFs64XGGsvOk3ZagpwhOfWKN9+p5BoiGNo5tBx5DphZckUoCSKgbpqZ+2gU5QUAWLRADcsRXFpLUL811fwWRxMXJGq92JgxtqQxS300zkONggFQAElDEh0M0aUtsLI6kUOqN0uVdDKFqEVGcJVPpFmUqJPhjYJB6FkJgq6Lh7I6DlH+V8BQ3SalfMNckLguFrXKmFTRjoE5qg0GUY4rEaQbyqPqOQ+IG65Gmp6V6tita8wgI4o6egroFEUG6akkgnA0kaPTZh91NDEhcM4Ze70v4qIxkWdOET+oqEOAzJoLccTSmrhoeoeo16KFwZINuHce590HsPUeV86xz0dOkxk9Rci6E9AxLQkh6aahsBXYaVwG76WPu4IAA */
    id: "model_modal",

    initial: "idle",

    states: {
      idle: {},

      // batch: {
      //   initial: "next",
      //   states: {
      //     go: {
      //       invoke: {
      //         src: "castModel",
      //         onDone: [
      //           {
      //             target: "next",
      //             actions: assign({
      //               add_index: (context) => context.add_index + 1,
      //               progress: (context) =>
      //                 100 * ((context.add_index + 1) / context.selected.length),
      //             }),
      //           },
      //         ],
      //       },
      //     },
      //     next: {
      //       after: {
      //         10: [
      //           {
      //             target: "go",
      //             cond: (context) =>
      //               context.add_index < context.selected.length,
      //           },
      //           {
      //             target: "#model_modal.opened",
      //             actions: assign({ progress: 0 }),
      //           },
      //         ],
      //       },
      //     },
      //   },
      // },

      alias: {
        invoke: {
          src: "assignAlias",
          onDone: [
            {
              target: "opened",
            },
          ],
        },

        description: `Assign an alias artist to this one/`,
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
                  actions: "assignModels",
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
              src: "loadCostars",
              onDone: [
                {
                  target: "missing",
                  actions: assign({
                    costars: (context, event) => event.data,
                  }),
                },
              ],
              onError: [
                {
                  target: "error",
                },
              ],
            },
          },
          missing: {
            invoke: {
              src: "loadMissing",
              onDone: [
                {
                  target: "loaded",
                  actions: assign({
                    missing: (context, event) => event.data,
                    open: true,
                    tab: 0,
                    selected: [],
                  }),
                },
              ],
              onError: [
                {
                  target: "error",
                },
              ],
            },
          },
          loaded: {
            on: {
              PAGE: [
                {
                  target: "#model_modal.opened",
                  cond: (context) => context.tab === 0,
                  actions: assign({
                    page: (_, event) => event.page,
                  }),
                },
                {
                  actions: assign({
                    page: (_, event) => event.page,
                  }),
                },
              ],

              BATCH: {
                target: "#model_modal.send batch signal",
                actions: assign({
                  add_index: 0,
                }),
              },

              SELECT: {
                actions: assign({
                  selected: (context, event) =>
                    context.selected.indexOf(event.ID) > -1
                      ? context.selected.filter((f) => f !== event.ID)
                      : context.selected.concat(event.ID),
                }),
              },

              // TAB: {
              //   actions: assign({
              //     tab: (_, event) => event.tab,
              //     page: 1,
              //   }),
              // },

              // CHANGE: {
              //   actions: assign({
              //     filterText: (_, event) => event.value,
              //   }),
              // },

              REPROP: {
                // target: "#model_modal.opened",
                actions: assign((_, event) => ({
                  [event.name]: event.value,
                  page: 1,
                })),
              },

              RENAME: {
                target: "#model_modal.alias",
                actions: assign({
                  alias: (_, event) => event.alias,
                  aliasMode: false,
                }),
              },
            },

            description: `Modal is open and ready for interaction.`,
          },
          error: {
            on: {
              RECOVER: {
                target: "#model_modal.idle",
              },
            },

            description: `Error occured in some part of the load.`,
          },
        },

        on: {
          CLOSE: {
            target: "idle",
            actions: assign({
              open: false,
              page: 1,
              ID: null,
              // memory: [],
            }),
          },

          SET: {
            actions: "setProp",
          },

          REFRESH: {
            target: "opened",
            internal: true,
          },
        },
      },

      "send batch signal": {
        invoke: {
          src: "sendBatch",
        },

        on: {
          complete: "opened",
        },
      },
    },

    context: {
      page: 1,
      tab: 0,
      favorite: false,
      memory: [],
    },

    on: {
      OPEN: {
        target: ".opened",
        actions: assign({
          ID: (_, event) => event.ID,
          page: 1,
        }),
      },

      FAVORITE: {
        target: ".opened",
        actions: assign({
          favorite: (context) => !context.favorite,
          page: 1,
          tab: 0,
        }),
      },
    },
  },
  {
    actions: {
      setProp: assign((_, event) => ({
        [event.name]: event.value,
      })),
      assignModels: assign((context, event) => {
        // Extract necessary data from context and event
        const { memory } = context;
        if (!event.data.model?.length) {
          return console.log("What happened??");
        }

        console.log({ data: event.data.model });
        // const [model] = event.data;
        const { ID, image, name } = event.data.model[0];

        // Check if the model is already in memory
        const existingModel = memory.find((star) => star.ID === ID);

        // Update the memory array with the new model or the updated image for an existing model
        const updatedMemory = existingModel
          ? memory.map((star) => (star.ID === ID ? { ...star, image } : star))
          : [...memory, { ID, image, Name: name }];

        // Return the updated context with the model and memory
        return {
          model: event.data,
          open: true,
          memory: updatedMemory,
        };
      }),
    },
  }
);
