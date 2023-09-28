import { createMachine, assign } from "xstate";

export const cartMachine = createMachine(
  {
    /** @xstate-layout N4IgpgJg5mDOIC5QGMCGAnALgfQLauQAsBLAOzAGJUAHasUiAbQAYBdRUage1mM2K6kOIAB6IAtAEYArAE4ALADoAbAGYAHOoDszdZNnN5k9QBoQATwmrmWxQCZVy+aulatdyXdluAvj7NoWHgEJOSK5CKYFCKwmKiYYIqoAGYJ6AAUkszMAJQUgTj4RGSJEZgs7Egg3Lz8gsJiCOLSmor6slnyWs7MqnZmlgjGysqKstp28rIaHszKfgEYhSEl4WCR0bHxiSlpmdl5BcHFYWWMkpWcPHwCQlWNUtZK3VqSaloako6SA4jG8qMFADVFo1OpxpMFiAjkVQolkFxcLg+BQIIJEmQAG5cADW8KWxzhigRSL4CCxXDQdVIFQqwhqN3q90Qk1UincH2kfTsym0TmUvyGRmkbWYXjsPKMvLsUJhKzCJORUTRYQpeOJBNhq0VZIpVNutIu9Ou1Iaf2Y3nsk3k6l00mU4zmgskwtFXlcqk80gtqllmvl8MRSooYHQ6C46EU1AANvFkhHcBqglqFUHdaRsfrBLS2MbarczQhHHZ7Fl1M5ecoPNJ+hZEFp1KMq9prMxJFoDGo-cmAxrYopo1xUBBUejFGr8T2Tvj+4Ph+SM5T4ga2HSqgzTcyhTpRU43G83h3nX1FOo7BzpJJjLaXPN-ND-dO+5gB0OR6Hw5GY3GE0nlk+0FnN8F0zZds1XXN1xNAst2UDtFEMYw3C6ZhXD0Z0vhUOwWnkaRvQdB1nG7f8iUAl9qFQABXWBKBiOIEiSVJQ0yWRWMOR9SNQfsKOosA1yufMmVARpr2YFReW0Dl5DmLpnW0JRWI+RsDDmeTiMJbUuJfGgY3MUdVUXdU5QArSkloaNzBApdqRzS5qmgoTRD+XklDwux1G9XoXnbQVnFsDxPB6dRrC+eR1JTGdtPMvSVQxQzJxIzT+x0iyrKzGlVyNKDBLuYS-lcSQxlYsVwTbcsWmdDslGsPRxg7dyAS0cLezIszdJDMMIyjWNMHjdBE2MzjkuitKwIy1h+PsnLC3BdRFHkSYXVUZa3j6SrRjsXplAtNsdE0aRmqfD8IwodAwARTFQ0mjcYLypoWhFaQFvta0RjPaRj0KvoOQ0PQ3FYmV70G1ZjvQU7zq4S70HOOybsch5Qsex0HD6AEfjrIUxNcGSVotDpZEO0jKPQbZ9Li7EjI47Vie2UabIg2GHNypyEAlObHG6K8HC6ZxBVkc82m26w5GybJeUJ6mSYSDrP26n9+r-DSFRphI6ZXCbIIExlmcaCVZAQ1R+cbbnumsVRfI+cTjAlLnPHKiWwjnEdYvHeLFYi195z1MbbLzbXC3EZw5oBYLNq0LlJWCwU1FGG1DbUKYdGcAmgapx23xlrrv1639gfTr3F3S33sv9rcrzZXQ1E8hbUK8LRBRcR6PHkOOAs9JrU6nIkzuHPStiwa6mYDzRRi5B03K6boHAbuD7BtOYrzmZbyw7xYu9WZIyGIWBCDJ12KYSpXEk30ht8INXwI1xnpq3KR9DE9pw7kcEa1YwVwRLa1xhbpxvQ+Px7ykC4BAOAwg85gD9puO6jxpiKGfmKZakxlDo0GOIWQIoZA8i8MFfmNYQQO1KOsTAkDbos0CioDopUGoGE0LWQY1s5rnlwctIE3QCHEjTMQkuUCyEjFPNoa8LdnBXlkM6Gwc0P5GD2i4JC7CyIkPhuaVip5loLR-sYDo8hBTiFsMoGsYIXQ0MvAtORpknYKJ1n8F0thgqqDUWjcELpBTwRXo4WqC8SqmO4lRGiFjCztl5KWB0pVkFPRtO-fQ7JuiuBtOWZB4tO6JQVKZFKgwtY8JEqCNkLcPgShbvzQ29cMYujmjYcO0kQ4eE2gdRJR9FCgz8WXbo7IeR8l-nY+Ozo5DzRcF0ZeYoApyJVhA7hpDdYulPHIOQuF+ZwTgtHXQYw1CTG6C3Q2bx2HmNGYo+6bwxieFYjIs8MgtEY0cLHaJbgOxng5uwnuEA0lTVLtAq8fDMGaAtC-LwoizngjGNE7Q3gbBVjYbUj2J8z6NJedhEs20SpwQ+IYOhVibAqAWhoEYag7GGAAT4IAA */
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
            after: {
              1999: {
                target: "#cart_machine.next",
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
      "found models": (context) => !!context.stars_to_add?.length,
    },
  }
);
