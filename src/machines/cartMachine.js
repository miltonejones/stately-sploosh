import { createMachine, assign } from "xstate";

export const cartMachine = createMachine(
  {
    /** @xstate-layout N4IgpgJg5mDOIC5QGMCGAnALgfQLauQAsBLAOzAGJUAHasUiAbQAYBdRUage1mM2K6kOIAB6IAtAEYArAA5mAOgDszACzTmATklLZSzdIBMAGhABPCQGZJshbNX3ml+dIBsrvQF9PptFjwEJOQK5CKYFCKwmKiYYAqoAGax6AAUkszMAJQUfjj4RGRxoZgs7Egg3Lz8gsJiCOJukgqGlg7WNq7OSqYWCDZK0gqqkpZyDh7S0kqu3r4YeYGFIWBhEVExcYnJaRnZuQEFwcWMkmWcPHwCQuV1UpZqyqpKkp1KziOukj2INqquCppVH9LNNnJpZIZVLMQPt8kE4sguLhcHwKBBBHEyAA3LgAawR8wO8IUiORfAQ2K4aGqpFKpWElUuNRuiEhlmUhje0kshkMHmmf2+fWGg3Shk0vNcww8hmhsMWwVJKPC6OClPxJMJcKWSvJlOpVzppwZFxptR+WiUzUhDmYsjc4OYriFkhFCjFBjekkMGk0ljlWoVCKRyooYHQ6C46AU1AANjEElHcJr-NrFSG9aQcQbBHS2CaqldzQgQU0XvI-jZDN63kL5Fbq8wptNQVppAHU0HNVEFLGuKgIGiMQp1QTO4cCT2+wOKVmqTFDWx6eVGWaWcKVO6nU9np9XPoXTy7JzOdJJDZ5KMZj4YYGJ93ML3+4Pw5Ho3GE0mUwt72gp8-Z2zBdcyXfMV1NIt13cTQhmGF4+Sldxz0PQxjyUU9z1kS83A7H9iT-R9qFQABXWBKEiaJYniJJwzSTR6L2O98NQHsiNIsBl3OQtmVAOodDPBRmEMJsHEkAw+W5F09EGYZRnsWQJima85nHZiexoOMzCHNU5w1eVfxYx8NNjMxAPnGk8zOCoIJ40QfiUYYFFacFXXkTQHNkSwhVUUZBKlcYlAGXQRnbG99LUozaBMsMIyjGN40wRN0GTcKdUM+IotM-VgNpUCrNXSDeMQLD-k0JxDHtNx1GsaQXW0BQqoGTknUmORcKJJZXyjCh0DAREsXDTjrO464ivqKYZPuAxwVccVVGYbpzB+awnJPWR0ksKUT3atMEWI9ANm0zFdLHPCdX2jYzJzXLWCGgrbL4uQnNmvl7T+E9aqWhAFMGe4m3WtwmwGTQdq7ZALtiGK33iz9ku-DrFQhsArpyyyCyZUa7IQRsFFcO0sJ9cF6IML4vqeRQfSwp5uR9Sx3NB+9p0HVVjpxPSmKWJmUYsvL0bXMaIUeaQ-TK5hXQqvQhVaK1dABloPHUbklAZ4leoHLT1iwO6bMx24SoazaDCMHdVBaKX92aW1PnSTpnCeFWlgSMhiFgQgjpHE74d2hQndIF3CG5xdbrAriMeLKQWhgrRIXWtRKaeOs9EeU39BrN7QpUs7giZqG4o-RKv1S7OAOynng-ynXw58mXNClSYJSmMrNCFGPmjE4Tq08zaoWhUguAgOBhCLsA+cKrG7iMR5dxBd5NtJ3pxAMd0jE6VxAQyb1rAdo4VkwUeHp+SFce0WQyoq1QyoJqSKuafRabpoEHO34MyT38CRuLF5-iw54qaBdpm5fXSLoOwEphgqE8meLwYUOaKkMvvXWFp6J2EsK0G0nxT6uiFOIK0rgV6tBBOTdIWhn4PifAOBBn9XRWi7qbIEGDtCqCFPoOwTxNrrTKp8ISshSEERjCRMilD1w6A8G3Nep8nQyCBLIOsYllAOSmA4ewe4eEwNUmldSmUhFjREeyR+PIbQSjpotXorlBKBWkPNP4EJvRNlIV1dA2isaQhgsLFoOg6azXct6F0wshijDYc4IS1ZJC8KRk4vim0AR2idNoaYYttBeS+p8dk7lXjuF5JY2apCmYRIkGeUq3p6KjCrFI82-wnjqECvoCEm1lZqKznENWEBeih35uPb0MhBKK1rjyXQEwpanwBAohWkwZB2lIb7f2eT6jeknnjbh+43hxxdMA3GptnDuFtlY7w3ggA */
    id: "cart_machine",

    initial: "ready",

    context: {
      save_index: 0,
      chosen: [],
      track_info: null,
      track_to_save: null,
      counter: 0,
    },

    states: {
      next: {
        after: {
          100: [
            {
              target: "load",
              cond: "more pages",
            },
            {
              target: "finish",
              actions: assign({
                results: [],
                message: "",
                progress: 0,
                auto_search: false,
              }),
            },
          ],
        },

        description: `Iterate counter and move to next item in the import collection.`,
      },

      commit: {
        entry: assign({
          message: (context) => `Saving video details...'`,
        }),

        invoke: {
          src: "saveVideoObject",

          onDone: [
            {
              target: "next",
              cond: "no model present",
              actions: "incrementSave",
            },
            {
              target: "cast",
              actions: assign((context, event) => ({
                track_to_save: {
                  ...context.track_to_save,
                  ID: event.data,
                },
              })),
            },
          ],

          onError: [
            {
              target: "error",
              actions: "assignProblem",
            },
          ],
        },

        description: `Save video record to database and return the ID`,
      },

      cast: {
        initial: "load",
        states: {
          load: {
            entry: assign({
              message: () => `Getting models...'`,
            }),
            invoke: {
              src: "loadModels",
              onDone: {
                target: "apply",
                actions: assign({
                  stars_to_add: (_, event) => event.data,
                }),
              },
              onError: {
                target: "#cart_machine.error",
                actions: "assignProblem",
              },
            },
          },
          pause: {
            after: {
              1999: {
                target: "#cart_machine.next",
              },
            },
          },
          apply: {
            invoke: {
              src: "castModels",
              onDone: {
                target: "pause",
                actions: "incrementSave",
              },
              onError: {
                target: "#cart_machine.error",
                actions: "assignProblem",
              },
            },
          },
        },
      },

      error: {
        description: `An error has occured somewhere in the process.`,
        on: {
          recover: { target: "load", actions: "incrementSave" },
        },
      },

      curate: {
        entry: assign({
          message: (context) => `Looking up video details...'`,
        }),
        invoke: {
          src: "curateVideo",
          onDone: [
            {
              target: "commit",
              actions: assign((context, event) => ({
                track_info: event.data,
                track_to_save: {
                  ...context.track_to_save,
                  title: event.data?.title || context.track_to_save.title,
                },
              })),
            },
          ],
          onError: [
            {
              target: "error",
              actions: "assignProblem",
            },
          ],
        },
      },

      load: {
        invoke: {
          src: "loadByURL",

          onDone: [
            {
              target: "curate",
              actions: assign({
                track_to_save: (_, event) => event.data,
              }),
            },
          ],

          onError: {
            target: "error",
            actions: "assignProblem",
          },
        },
      },

      ready: {
        on: {
          start: {
            target: "load",
            actions: "assignChosen",
          },
        },
      },

      finish: {
        invoke: {
          src: "refreshList",
          onDone: [
            {
              target: "ready",
              actions: assign({
                chosen: [],
                progress: 0,
                save_index: 0,
              }),
            },
          ],
        },
      },
    },

    on: {
      append: {
        actions: "appendChosen",
        description: `Add items to the import list`,
      },
    },
  },
  {
    actions: {
      assignProblem: assign((_, event) => ({
        error: event.data.message,
        stack: event.data.stack,
      })),
      appendChosen: assign((context, event) => {
        return {
          chosen: context.chosen.concat(event.chosen),
        };
      }),
      assignChosen: assign((_, event) => {
        return {
          chosen: event.chosen,
          save_index: 0,
        };
      }),
      incrementSave: assign((context, event) => {
        return {
          saved: event.data,
          message: `Saved ${context.save_index} of ${context.chosen.length}`,
          progress: 100 * ((context.save_index + 1) / context.chosen.length),
          save_index: context.save_index + 1,
          track_info: null,
        };
      }),
    },
    guards: {
      "more pages": (context) => context.save_index < context.chosen.length,
      "no model present": (context) => !context.track_info?.stars,
    },
  }
);
