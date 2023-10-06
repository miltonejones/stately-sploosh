import { createMachine, assign } from "xstate";

export const cartMachine = createMachine(
  {
    /** @xstate-layout N4IgpgJg5mDOIC5QGMCGAnALgfQLauQAsBLAOzAGJUAHasUiAbQAYBdRUage1mM2K6kOIAB6IAtAEYArAE4ALADoAbAGYAHOoDszdZNnN5k9QBoQATwmrmWxQCZVy+aulatdyXdluAvj7NoWHgEJOSK5CKYFCKwmKiYYIqoAGYJ6AAUkszMAJQUgTj4RGSJEZgs7Egg3Lz8gsJiCOLqzMqK6rIy2aoezNLyphaI+oaKuo7G8kaadlp+ARiFISXhYJHRsfGJKWmZ2XkFwcVhZYySlZw8fAJCVY1SPXaK8rLq8nL63q1mlgjGWkprB5pDY3sppJp5iBDkVQolkFxcLg+BQIIJEmQAG5cADW8MWRzhigRSL4CCxXDQdVIFQqwhq13qd2G+kUcnkdn67hksmk0jsP2Gs1kbIMChevI5kP80IJsJWJORUTRYQpeOJcuWYUVZIpVJutPO9Ku1IaLN0ilUqlk3kkam0IOkgr+QLG9tU+kk8i0ym8UJhWvhiKVFDA6HQXHQimoABt4slI7gNUF5drg7rSNj9YJaWxjbUbmaEI5bDpPLodNYQW9nVp1G1lHZtNZmJItAY1P7Ncd8bFFDGuKgIKj0Yo1fiU4GNX2B0PyZnKfEDWw6VUGabmX9vcxFFknG47Xb287JD12rNZtJJMYWi5lF3Jz3p5h+4Ph2GI1HY-HE8mlk+0BnN95yzJccxXPM1xNQtN2UdsxmmNxt1cPQT1PFROTePlWlkX1nAff8iUAl9qFQABXWBKBiOIEiSVIw0yG1ZAObsiNQPtSIosBV0uAsmVARpjGUHdTybeQ4KmOtZBPbRJEUdsHA8LRrB0dQCMJBV2JfGhY3MEdVQXdUAwArSkloGNzBAxdqVzC5qmg-jRGGZQ3jZfl1BBZhVABLQ22dZxbA8TxnHGVtVHkdTU17bTzL0lUMUMidCM0vsdIsqzsxpFcjSgvjbgE4ZXDkpjmCbAxJghE920BXR9G0WQxLgyKp2IszdNDcNI2jONMATdAk2MtjUtijKwKy1gePsvKiw6dRnjsIxnCtO0eiqto7C84TytUjzmqfD9IwodAwARTEw0m9cYIKpoIWkNkOWkRspmUFzORPD1LQvZTNDbdsGr2okDvQI6Tq4M70DOOzLsc+5T3eUUWgcHpxMkE95B3VxWiWrIbX0AGFTI9Atn0hLsSM1iCaJhJRpsiCoYc-KnIQBbAo8uR+SmCEJOdBQRU8NtwVw5SXmkfHtUJ4mge6n9+r-DTxapsAaeXCbIN4xlGcaFnFF5LRpCtAE4OUNtVH8nQdbtNRcK83ybDFxJZ2HeKx0SuWotfOc9TG2z8w1otxEcVR5PZYS3iCrxnScEU5Hbe1fIlOx7Y999Oq-Hq+oGimwkd5XwNV+nps3a8g90NRPI5PovC0Z0XDu-kvQGHpi7bJPjqHPTNiwC6Gf9zQ2n130+RZgEHBruD7AGVpr1aK03jmGVBpWZIyGIWBCBJl2yaS+XEmX0hV8IXPxu7wvrqkEZdxtPW5A6fkbWdDongWl43nE94bFUJPMVQGNiAgLYAAEmI-5gC4Iob+v9-78FIFADe443ZTggX-QBwCICgPAT-ZB0CoBHx9rlP2m4ehzTDteXy+tvLG3kCefoO5DDWA0F5dGj8v6YKgWAIBICwFIKgWQWBzt4GLzCNwlBnCMGQKXDA3B2UC4EOuk2Hc5U5A2FmF6dQo8hh-GUrYKYaiFoQmyNkROC8s6JGEQkDhaCwFry4AAdwAbgLgaCYywA2DRbY9EMicn2PkExYisHsNQeg6xdiHFONgCfWRTNrxtE8Gow2Nta4Cg0W2a89hSo+nchCF4EVjGPiJAAK1QJiNEATWFbGJIQE6OIAFonwGQCgESNxnzwruZgvNHBTDsI2aSyS2l3TbI3fW7ZXBdKToU4pXBSniNokQKpNTESoHqZDX2TSmbiCcHJTwdhOS+mMAtLykdUmPwGL5HoL0BhjKKSUoBZTaJmICZwuBrtBGJHGdc+5fi2EWNAVI-OKyrprL5DEr0bgvLeRtC5WsLRnieTtJ0bw3o1K5OSmEN5kybnTNMbch5linlbwQU+NFUz-GfJEZY35yz8GrPuOJUsbT0bXg8ibauyT+RtD0E4Rwj9OiSD8DKUgji4DCBef8mGEhTyyCDjfUqVoFrG2dOIXku42XGF5goYWScyiis1kKJQuyOilTeAYGYMkmz2AUuQ8UAIk46kwNqoslt2iyU0FMZw14em-CyHWdoDUjCqRcP8G1Wl7VFzaSKdQVoOTPVVV6BVthwSYTcMJQ8XTeXIp3s+ZOIbrrXm9O0SNz9jYdFjRo+Cc8uUjGNoaoNHFyKUWzVEn0c0PC+gNcbfoAwH6siQq4AYYI7RIoWHklKMVdINsEj6IOklHhTAataFlnqBhjDcDQ8Sajyyi3Te7IG47hgAnkl07Q5z9bOFwtQkUzguSz1KkFG1EsEi7uZlaeSbg6xST0AawYvxjZyVUhyG07l6VJ0do+8Qrg7rcjEhWQwvka4ggPe8K01hJiyFbmAduoHokxPci0V4vIvAesQBoEUCKITth0D6WYOSh0ot3ivNemHORPGEoauCylDBJM9V6lQHINAvTUOFQwLDMXfK4I+jolofSdA5OCPuaMvL2EHnoBQSHZjCf8aJ0l2DH3xxUPWJSrY9Zek44VcSE8XqaERnoO06mvmBKsYQWx9jBXOMfaeWwFDpNdIhPWah3l5JKY8AMBQEJLkTOJWw0DPo5JeHCk268j0OQPz1k6o1hhGXbLC+87FFS5m1MWYzaGOqminPsJK70LkEtOBMwgXCQcNCvzS0hNNNGM1EoxSS+5onQNWzZNsotdomwmxPIe5V7J9M3ymHynwQA */
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
              target: "validate video",
              cond: "no model present",
              actions: [
                "incrementSave",
                assign((_, event) => ({
                  ID: event.data,
                })),
              ],
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
