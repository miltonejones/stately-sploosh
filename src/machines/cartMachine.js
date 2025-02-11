import { createMachine, assign } from "xstate";

export const cartMachine = createMachine(
  {
    /** @xstate-layout N4IgpgJg5mDOIC5QGMCGAnALgfQLauQAsBLAOzAGJUAHasUiAbQAYBdRUage1mM2K6kOIAB6IAtAEYArAE4ALADoAbAGYAHOoDszdZNnN5k9QBoQATwmrmWxQCZVy+aulatdyXdluAvj7NoWHgEJOSK5CKYFCKwmKiYYIqoAGYJ6AAUkszMAJQUgTj4RGSJEZgs7Egg3Lz8gsJiCOLqdsqK6rIy2aoezNLyphaIDlpKuo7G8kaadlp+ARiFISXhYJHRsfGJKWmZ2XkFwcVhZYySlZw8fAJCVY1Sqp6K8rLq8nL63szKZpYIDlNFNYPNIbG9lHJ5iBDkVQolkFxcLg+BQIIJEmQAG5cADW8MWRzhigRSL4CCxXDQdVIFQqwhq13qd0Qki0qhU0jshlkjlmelmvxZs1soI+Og0qm80ihMOWYRJyKiaLCFLxxIJsJWCrJFKpN1p53pV2pDUQo3sWnUE3UNlaqlU8kFCC66meymUkiMhk0BjsMo1cvhiMVqPRilV+KCmvlwZ1pGxesEtLsF2qxpupoQzCdzH9UcDxNjUTA6HQXHQimoABt4sly7h1fnjkHSZhyfHKfF9Ww6VUGSbmQhHLYdJ5dOK+rpHUMEJa2so7NprMxWQY1Hmls31bFFFWuKgIKGVR21bKt2gd3uD+2E12kz22EbahnB56dIosk43JIPcotLInUkHp2lmWZpEkYwbRcZQN0JLVUEvfdDxLMsK2rWt60bTciQvTBdyQm9O2pWlHz7dMmVARo-1kRRDGMNx5B0Vw9EAoCVDsaQ3mkUFlFkXjnFg6N8R3ahUAAV1gSgYjiBIklSEtMlkJSDgDc8ELw0SJLAXtLmfCjRBZdRlGYD8enBUZGI6QDtEkRR-wcDw2RsXRBILXCkloKtzCPDET0jbD4J3Ghq3MQjExpB9U37F9KJZZQ3kUbjF1BZhVFGLRWSdZxbA8TxnHGFcHVctSgs87zlV87FT1UnD1I8kKwrvCLWDOKLyNuWLnVcWylN9DoVy4wY-lXJRrD0V57PM4ratKkKKBQ8tKxrTA63QBszxmvDgq8xriMip9GQ6gyEA6V15DsIxnHtH8ekArQ2i5RxmAMVldHUaV-GhGqVgW9AKHQMAEUxEsdLTPSjvuTjpES87pAXKZ3RaaRAMeIFQLZTRWX-WQ-U+jaftLct-sBrhgfQVqDoHTqHneRLXmYBwenkD1APkEzXG+K6siU-Rpq1MT0C2Hzwz8rC4PlAWtl27sWtI3TDszC6cveuROSmTi-2nP4FBozxWQhPi2ReD6FibHDJYSebCbQ5bVvW76JcFhJpfvWW2vBxXGMUWRXGke1Rj-D02Sy99OndSVjLSrI5jxh3EivQ8KpFqr-PF+OCN1JqSPdhXB3ERx2S0ORmanXKvCdJwaLkf81Bsl4cb5sIE6t1ClowtaxaE-Dr0zva3cpmLjog9ldDUFLzr6LwtCdFxoc5T0Bh6YfWUbxIAYPbzNiwUHov0+5NDaP3eKSxjRgcGe-3sAZvgg757TeGPTYCsJkjIYhYEIYWI07gtX9Id-CAu2ajvdqmYpD6BMp8IucgOiciUk6Dodgr4vDeMzd4NhVCr0UJiVAVZiAQC2AAAkxPgsAXBsG4PwV2UgUAv6i3xmEHBeCCEJGIaQ8hTCqH8BoUA7OA897DD4t7CCIwnCfE8MjGcq4kF-laM4Ti2RmZYM4SwsAbCIBkIocw6htCk7fwYYkFRRCSEaI4ZQlhZAoC8J7IaMiHtBytBMhdQw9oI4cQ8IBPiZ03BwMXNkLkuMn5py0VwtRJjNEfy4AAd0IbgLgGiqywA2DJbY8kMgcX2PkOOITVHqIiYQaJsT4lgESSA+xnVLSJQXH7NmDNPytCdFyVKFo1CvGZi4FesczYrAAFaoExGiMJ5itjEkIIDHEhC0T4DIBQMpudqb8Q-M9F4jgpitHLlI560NWSLz9v+VwrQsF9IGVwIZ2jZJEHGZMxEqAZkUzsfM464gxEfjsG8uGnQWhs1UBXCC7QcYDAyj0d0Awjn9MGcQ4ZskjGsPCVwOhKcf5bmORCmFhioVhPYdY-uDyqZPO4m0CCp9UppSUvFJ0loTLoJXLxfQ6V1BgpOWc0JOTjHsIRbiVOXcUWnMhec9F-K8lcGxfc+WeL7jMxHMslcxhwJsmnlIzkbQ9BOEcIgzokgsEAEExKYC4IQhCvAoCkCKQkjl1VulhB1Xqg1sAjUmriQkkVcswaPKomlC0Aw-asi8A6H4UjmZzz4mNTwTMMp+E+qQYp8AqgGP4RDCQQEeR0xtIzC6LMZziB9h+JVCgFwQQYo-L6lrShrEwPGzMC8VCfL6i8N6dhGlpVdLMHGftJRTFGFg7U5bcWD0aD+ZVNlNBTGcBBACmzKmIKMDoK04FtBdvUhW18z0aJWgdBdZmxhOhawkLYCErQ1AgkXC4PiC7EIHiXZ1Iltg13nQRluz0FLV2MTVRAj0DMGVdOfsJDS4lJKXqHvdZtP5XhrhkFMIaiBxp2VGK4AY4IfyfqCV3dy20-hir7Sye67IO09A3TjSUCrhoDFoj4tmzMWhjhNsW79ihfoAf7eadw8V7pOBqRHQCchnguBfRoBmuUu0WzAAx4Y9oYNuG0KdLduhfm2RnedJSnIbQKCwQnETTRfZ2Q8IuNm2hDAZRnqCLT7xXEDReFg9eEB0OuvFYmgdObFzKdgV4cdfwNA0W8O8bQXx7qzHkFgv+AD1NSHcSofxRk3DWHOqxGwKhzoaHdGoB0hhlEYqFep1wzwS4OiLugiCkhAIQmhh0AwbMMpFy5DBL9wS0VCtZdwqA6n4pIOgf7HingeR3VeO0XzCgHTaHiv56rXdatwsUJEmJjqSkxowwI50fQsuR0Yv0UE+WusmUlJ8+6OsGZVeQwWHlzLVHBfurZX1jF4oQThtFmc2hiuaBW-+aw-5NXDYO+C3laLRlXKmbco6u8E1NCBfYHkF29AyCcA2mcwagTDoGHWhir39vIo+0dkZo32HBdaYlN5HoVWLlZD8qRrRXQyGLkZDibShvI6JNa-VhriDGtNSUprDp2hOBXC8e6hhGKATkbRYyIx8q7Y+n4IAA */
    id: "cart_machine",

    initial: "ready",

    context: {
      save_index: 0,
      chosen: [],
      track_info: null,
      track_to_save: null,
      counter: 0,
      stars_to_add: [],
    },

    states: {
      next: {
        entry: assign({ pausing: false }),
        after: {
          100: [
            {
              target: "javdoe validate",
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
          message: `Saving video details...'`,
        }),

        invoke: {
          src: "saveVideoObject",

          onDone: [
            {
              target: "Auto assign model",
              cond: "can auto assign",
              actions: [
                "incrementSave",
                assign((context, event) => ({
                  ID: event.data,
                  curateId: context.curateId,
                })),
              ],
            },
            {
              target: "validate video",
              cond: "no model present",
              actions: [
                "incrementSave",
                assign((_, event) => ({
                  ID: event.data,
                  curateId: null,
                })),
              ],
            },
            {
              target: "cast",
              actions: assign((context, event) => ({
                track_to_save: {
                  ...context.track_to_save,
                  ID: event.data,
                  curateId: null,
                },
              })),
            },
          ],

          onError: [
            {
              target: "error",
              actions: ["assignProblem", assign({ source: "commit" })],
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
                actions: ["assignProblem", assign({ source: "load" })],
              },
            },
          },
          pause: {
            entry: assign({ pausing: true }),
            after: {
              1999: {
                target: "#cart_machine.next",
                // actions: assign({
                //   stars_to_add: [],
                // }),
              },
            },

            description: `Pause a few seconds to allow the UI to update.`,
          },
          apply: {
            invoke: {
              src: "castModels",
              onDone: [
                {
                  target: "pause",
                  actions: "incrementSave",
                  cond: "found models",
                },
                {
                  target: "#cart_machine.next",
                  actions: "incrementSave",
                },
              ],
              onError: {
                target: "#cart_machine.error",
                actions: ["assignProblem", assign({ source: "apply" })],
              },
            },
          },
        },
      },

      error: {
        description: `An error has occured somewhere in the process.`,
        on: {
          recover: [
            {
              target: "load",
              actions: "incrementSave",
              cond: "more pages",
            },
            "finish",
          ],
        },
      },

      curate: {
        entry: assign({
          message: `Looking up video details...'`,
          stars_to_add: [],
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
              actions: ["assignProblem", assign({ source: "curate" })],
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
            actions: ["assignProblem", assign({ source: "load" })],
          },
        },

        description: `Load details of the current video as an object`,
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
                track_to_save: null,
                skipped: 0,
              }),
            },
          ],
        },
      },

      "validate video": {
        states: {
          validating: {
            invoke: {
              src: "verifyVideo",
              onDone: [
                {
                  target: "show models",
                  cond: "video has models",
                  actions: "assignStars",
                },
                {
                  target: "#cart_machine.next",
                },
              ],
            },
          },

          "show models": {
            entry: assign({ pausing: true }),
            after: {
              2500: {
                target: "#cart_machine.next",
                // actions: assign({ stars_to_add: [] }),
              },
            },
          },
        },

        initial: "validating",
        entry: assign((context) => ({
          message: `Validating javdoe video ${context.track_to_save.title}...`,
        })),
      },

      "javdoe validate": {
        states: {
          "check domain": {
            always: [
              {
                target: "validate video",
                cond: "domain is javdoe.sh",
              },
              "#cart_machine.load",
            ],
          },

          "validate video": {
            invoke: {
              src: "checkVideoContent",
              onDone: [
                {
                  target: "#cart_machine.load",
                  cond: "javdoe video found",
                },
                {
                  target: "#cart_machine.next",
                  actions: [
                    "incrementSave",
                    assign((context) => ({
                      skipped: context.skipped + 1,
                    })),
                  ],
                },
              ],
            },

            description: `Check to see if the video endpoint has content.`,
          },
        },

        initial: "check domain",
      },

      "Auto assign model": {
        invoke: {
          src: "castModel",
          onDone: "validate video",
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
      assignStars: assign((_, event) => {
        if (!event.data.records) return;
        const { records } = event.data;
        const { models } = records[0];
        return {
          stars_to_add: models,
        };
      }),
      appendChosen: assign((context, event) => {
        return {
          chosen: context.chosen.concat(event.chosen),
        };
      }),
      assignChosen: assign((_, event) => {
        return {
          chosen: event.chosen,
          curateId: event.curateId,
          save_index: 0,
          skipped: 0,
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
      "can auto assign": (context) => {
        // alert("can auto assign!!" + context.curateId + "/" + context.ID);
        return !!context.curateId && !context.track_info?.stars;
      },
      "javdoe video found": (context, event) => {
        const address = context.chosen[context.save_index];
        const res = event.data;
        if (res.result) {
          console.log('Video "%s" is missing!', address);
        }
        return !res.result;
      },
      "domain is javdoe.sh": (context) => {
        const address = context.chosen[context.save_index];
        return address.indexOf("javdoe.sh") > 0;
      },
      "more pages": (context) => context.save_index < context.chosen.length,
      "no model present": (context) => !context.track_info?.stars,
      "found models": (context) => !!context.stars_to_add?.length,
      "video has models": (_, event) =>
        !!event.data.records && !!event.data.records[0].models?.length,
    },
  }
);
