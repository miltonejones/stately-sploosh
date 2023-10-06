import { createMachine, assign } from "xstate";

export const photoMachine = createMachine(
  {
    /** @xstate-layout N4IgpgJg5mDOIC5QAcAWB7ALug+gW3QgEMAbAOgEsISwBiAeQAUBRAOQG0AGAXURXVgVMFdADs+IAB6IAHACYAbGQAsCmTIDMcuTICc8-QBoQAT0QBaAOwbdZGcuVaNAVmecFnGQEYAvj+NoWLgExOToyGCikJSiQrSSsJhEmGBkRABmKQBOABRenACUtIHY+ISkZOGR0RSxmFy8SCDIAkIi4k3SCMqadrpyzl7OCiPOupzOxmbdXhpkY0MynBoTbhp+ARilIRVVURBkJOhEELVQtBBiqbUAbugA1qklweVhEfuHx6eiUAi36ABjZLtBoNCQtQTCMQSLpqZx2Gx6ZScSw6DQKKayORzdETLTKSzDLxDDbNLYvUKVd7RI4nM60MBZLLoLJkZAkZLpFl4NnksqUvY0r5nP6iO5AqGiUE8cGtSUwxDY5RkCbKZzeZw6exDZSYhAKSycMhyLzKXSouSWXSawmk5783bUg6077nRnM1nsznc3lBB1varO4U-UXi4FiUFeRr8SHtBUIDReWy6BQuTR6LyWw260wWE0qwkyBSZw2cTOZu18nYBj4u+lEZDvCBgpoQtrQzqIBRqsiGjRpyyE9yWGR6kYyXtDMvOBwzxaVv3VqmBsgAo6CH6rsTpChZPAAAjXAjoAO3u7wLZj7Y6oC6xJk8PyemtRdRZZz03M+UsxuJzkNWZav+C7bK8y4fEeG5QFuog7nuh7rieRCiACYAkJezRynGnYIMSxYqp4wxmlqZq6HqGjKF4KrmuanC6PRqgjCBFKOiukFnDBcEHpBdAYW28o4boPbFpq5pyMsSyUXqPavvYYzYveXi2v4ZKLmBgoHOxm48fupykOg5yXFEMR3I8vqgQKTqruuHE6XpRy-P8EogjwfFYR2t6yF4SgpuoRb0ei+RyHq5guLYg6aP+iaWAaMUKMx-rgdEWnQXZFD6YZVwmQ8TxVupVkpdZx66elDmhoC4ZSq5UayrGHlSIgppmsa4mcBM9gyNYIUaDFdjyEWCj-voT6WAlS4aZ8JyQLQADCAAy9AAMrMG5dU3g1uHLFR-aWI4ijWK4eh6l43h9BonWJkJei7TIY35SuLrTVkYCYFkJirde8b9LYRJtXoNizDOerYnIBaKCiRaJj0vgqfa41WY9EC0FA6AGTQH0CZ5CBfti8yKA++QzloZYYrmCDqEobjLHR+ScNio2w3llkru6LK0ECKFoRj2FY2oPlyOapEXQ+H4WINyoPtYPR08M9N3czHys1ktDPa970yq27nrV0rig9oHgms46I9KOZMKKDKLFgMZaKNoyzy6xitMmzKNo2A3P1Xe-TGqmNpyMoJpqv7IUnRO3jm+Mjjdm4zgOzWNJEAArihqD7q7UA0PusBgEQWQAqgFxZf8Zlw-dtZJynaeoxnYBZzneeoOVzkRq5GtXpjG1fgSZBKeiFGEv2ujfiHSk-oMxaWKa2gxe4fgqaIhBwOCTOkLVn04eYJo-fjgyqsT3kh4o8Ik0pZbuAS6yM2plJUDQa8d10ho+aagMGgN-Yj5Pxo9Eb4kzg4g045JQgPfHmnclJUU1HCQme0SYhVUMqc6OhBqKBcNiCiQCJq1CEKAz2iBBi2AJHhXa7U6ZeGBidMgKYrQDAJGaHomCEbBigLg7WiAbBzD+oFIYVpBqTDJlaH8clcR0U8GaW6V8LKO2SjZH4rD4zqHhFaNwQwh6Zn9mRMmm9PB2DnJRb6uhoqMLYrI1KZ54I8XkThYkQkVAjEcJmIedFRYJh8oPexg10QmjkMYiCpiirZxKhlKxWNDFzGUdONR2gzSH22nOJS-s3CKF8UKKaIDNZrS+goWwksHydUNgkvU9g3F-TWPYZBKSDhKxCRtRwQih5jE4I4KKRYXHaPhOMCi3hrTYlTJ4SphwK75yrm7Ouud841K6F+JpfQhJGzUWoEcpNPziR-EMfu-Qehqm8j4ueQA */
    id: "photo_modal",
    initial: "idle",
    states: {
      idle: {
        on: {
          OPEN: {
            target: "opened",
            actions: assign((_, event) => ({
              name: event.name,
              ID: event.ID,
              pending: [],
            })),
          },
        },

        description: `Modal is closed until it receives a search request.`,
      },
      opened: {
        initial: "init",

        states: {
          init: {
            after: {
              10: {
                target: "loading",
                actions: assign({
                  retries: 0,
                  open: true,
                }),
              },
            },

            description: `Launch state to initialize machine.`,
          },

          loading: {
            invoke: {
              src: "loadPhoto",
              onDone: [
                {
                  target: "loaded",
                  actions: assign({
                    open: true,
                    photo: (_, event) => event.data,
                  }),
                },
              ],
              onError: [
                {
                  target: "loading",
                  actions: assign({
                    retries: (context) => context.retries + 1,
                    open: true,
                  }),
                  cond: (context) => context.retries < 3,
                },
                {
                  target: "error",
                },
              ],
            },
            on: {
              append: {
                actions: "appendItem",
              },
            },
          },

          closing: {
            initial: "confirm close",
            states: {
              "confirm close": {
                on: {
                  confirm: {
                    target: "close dialog",
                  },

                  cancel: "#photo_modal.opened.loaded",
                },

                always: {
                  target: "close dialog",
                  cond: "value was selected",
                },
              },

              "close dialog": {
                invoke: {
                  src: "photoClicked",
                  onDone: [
                    {
                      target: "#photo_modal.idle",

                      actions: assign({
                        open: false,
                        pending: [],
                      }),

                      cond: "no items are waiting",
                    },
                    {
                      target: "#photo_modal.opened",
                      actions: "assignPendingItem",
                    },
                  ],
                },
              },
            },
          },

          loaded: {
            on: {
              CLOSE: {
                target: "closing",
                actions: assign({
                  value: (_, event) => event.value,
                }),
              },

              retry: {
                target: "init",
                actions: assign({
                  retries: 0,
                }),
              },

              google: "launch google search",
            },

            description: `Modal is displaying the found images.`,
          },

          error: {
            on: {
              cancel: "#photo_modal.idle",

              retry: {
                target: "init",
                actions: assign({
                  retries: 0,
                }),
              },

              google: "launch google search",
            },

            description: `Image search failed after 3 tries. Allow user retry.`,
          },

          "launch google search": {
            invoke: {
              src: "googlePhoto",
              onDone: [
                {
                  target: "#photo_modal.idle",
                  actions: assign({
                    open: false,
                    pending: [],
                  }),
                },
              ],
            },
          },
        },

        // on: {
        //   append: {
        //     actions: "appendItem",
        //   },
        // },
      },
    },
    context: {
      retries: 0,
      open: false,
      photo: [],
      pending: [],
    },
  },
  {
    actions: {
      appendItem: assign((context, event) => ({
        pending: context.pending.concat({
          name: event.name,
          ID: event.ID,
        }),
      })),
      assignPendingItem: assign((context) => {
        const { pending } = context;
        const item = pending.pop();
        return {
          pending,
          ...item,
        };
      }),
    },
    guards: {
      "value was selected": (context) => !!context.value,
      "no items are waiting": (context) => !context.pending.length,
    },
  }
);
