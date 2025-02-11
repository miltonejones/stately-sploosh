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
    /** @xstate-layout N4IgpgJg5mDOIC5QFsD2EwBsD6aIENMBiAeQAUBRAOQG0AGAXUVAAdVYBLAFw9QDtmIAB6IAjAGYALADYAdKICc4hZPEB2OgCYArKOlqANCACeiALRrNa2dukK727ZvH7pmgL7ujeLLnSEiADEAQQA1EgAlAEkAFQp6JiQQNk4efkERBFE1R1kADjy1BVtxPNFtcW08o1MECz1ZSU08lzUCulE8js9vdF88QllCDnxYIgh+MFkOPgA3VABrKZ8cAcwhzBHYBBn5gGN8NL4EhMEU7l4BJMzJbUlZBUVdMp01Ju1DE0QpOWltDo+zTo0lUPRAKz8BHWqBYYD4kCIAGEADIkADK8UYZ3YF3S10QkgU8kkeVUmjckkkamk0hqiDo+TopU0omyH2KzjuYIha1kMLhCIxMVOSXORwyiE0mgUeVkGgUMo+eSUMtpXzqEgZ2gUdGVCjU6kcfzy3L6q380Nh8IgRAiFECdrRAAkRawceL8QgpfZZOpJFopRJVDk6Vk-bI3NIulL5bpTRhzVC+VbILJMKh8BAZlBxpNpnNFsszZDBvzrWmM1m+FAdgWDkcTljRe7LhKw9JRPk3HQKjJOpJRJpQ6ymhG6AaitJKmoJB4vODi7yy6n05ns0QwAAnTeoTeyFiYQ4AM13yFkPItyYFEAra+rtf2h0ujcSbtSrc9j2s2vEfsUejybVQyUORdDsAptUcEl436S9lxvPZ2C4fBNzGCZ4XzeYlnPRc4JTBCkJQ7ZdlQetn0YV1khbPFQEyPQlHyQdx0cRR9FEYc6DoIkB1sTjRB7XtxBgxNS3w2RENgZDUI3bdd33Q8uBPTczwvJN4PEwjUIfUin34F9sXfGjhDEAFfRcKQZB7TQOk+Wp+MpX0Y3JNQinETjJGEktLWvc8OFgThq1zDCSOw1TRJ85A-ICmsSLIvSKKbN9cSuWixBpTsaXUUpLEBUMp24wl-n+PJpUsTylzEyL-PXLcdz3A9j1PHCEy8q9yyq6LtLi44EtfKjDJS4yw3ETsmVESkdCnPRxFDMpOysf1nClY1SnKvCfNXDAbTIYIAHFMT6sUP1SrJLCJX9xGlaUnBGllQzMZpfmKVlSX1XQ516FqKo2ysER2-aaFEQ7qMGuj9XuDoCmUNzSppe7HojZ7+zewc1rUsTNoRAAhYIYkRF1Ev65K2x0Tp5E4-5CWsqlHFDJprBpDouLcHVlDR8Ly0xm0MWRChEWFQmjqMujCWsFRyWe0pVEHUNdC1aRgWswpgQndnvM536bTtMgInISihdBsRCTkR4FHJHsCh1GVQxGzsWh+VRxwVXU1baldNdtahggAWQOgzic9bUtU6Loqkqca1VqAciSmmlnseRQ6A8+cwvV93MwRCZUGQfWQbbPQmURs2JDeW4XOHD4I1KVko2KGkBxNFPcPRnzat3T3ERIUIKAiXOBpJmQ5X4s2XNr-RANDNptAeElGZKpopFEV31JgLgAAIs+QSA144CA0LzEKiy+9by1XjfUGz7fd+IutdJ6hg+4Dk6mM0fIyk4pQZ2BWx7v9axspcD2FyLldRCSbsfFu5Y9gAAswB7AWGvBScB16bEkkQR+Hpn4slfvYTo7JbD2AqKGFksgtAciUFxROM5G6fVgpA1MMC4EIKQZJRBfkuDoKBv7TBQ1xoqFIS5GQfxspvGqOqMwGV9RaFKJdakLJZzLzEohPgR4ODKTXgAI0ODAjeWAwBcDAEQPgqAMHHSGtSe4ugNBlEqAONk909DTyTroHUVIDSklRuAuhHMGH8FUeorRXAdEJn0YY4wcBTHC0QIUSxbkqhUhKm8EM4jALyGpAqEkttlRlS8SJNON54QAHc16SUOGANeoggpTEPs1bx+TZBFJKchAxFSup330s2funo8gdl9D0zo1DpQ6m0PDVJv5qYdEUF0QortYBwggJo7R0CSkcCgHwAIiFkAHlCZEw2XpxmkPnuPIBv5ZZaBsBUJijxbAyFsJ4ecxiMDwCSKnbhZjMhmEjuYMoTi7AgnGs0ChChXa70wGAN5USEBNEnmbB444mSaEdgM5OtC8kbC2BCvZ2ROzqGjCoJo11CQ20JGObs5R9A5DUIo68mK2wzlfsoG61l9TpVsuYQk9wCgGgHOBD4M4wGotaupTa2ZaWfkHj+QoOguh8LEXZVkRJlSvRYsoN4H0FwQJ8QRUpqExXPxGnIAlwJWg5UusBR4voZSlEeEySoLhqXtSiqKzpT9eEaAZBoYMI0P5ThmuqScb8elSjKMqbI6rU5uxvFzPVvCFZyBGgqQoIInBTjlQSay5MSqFBcEtGQDrUxt03DGzIKhp70yjIvay41J4aAjB8IBihKgqHzTeM+m8r572LWICor8k6Ul1B2KQLQRniMWg8fQYduVuFWrkoVSjYHwMQWU1hqCuBdqyMtLsdwtA3MukOcRTxGhMhcsqf4-EekCo1XUyNGkVFqOQIsoJyyQkGPXdSBkjKlpcWpB2NlWRZQuWKA3N4g4cmCu+uWRppSWmiHXT0w1ShnAFCnNZLi8NWQz0cCVWwJVm2zt5HMvgCzAk6M4Gswg67mgGgjFKZ4xQ5aIrpqUGwyoFZNp6d0e5QA */
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

              doom: {
                target: "get doomed ids",
                actions: "initDoomedPage",
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

          "get doomed ids": {
            invoke: {
              src: "loadDoomedIdList",
              onDone: {
                target: "check latest list",
                actions: "assignDoomedIds",
              },
            },
          },

          "check latest list": {
            always: [
              {
                target: "confirm batch delete",
                cond: "list is complete",
              },
              {
                target: "get doomed ids",
                actions: "assignDoomedPage",
              },
            ],
          },

          "confirm batch delete": {
            on: {
              no: "#model_modal.opened",
              yes: {
                target: "new state 1",
                actions: "resetPage",
              },
            },
          },

          "new state 1": {
            invoke: {
              src: "invokeBatchDelete",
              onDone: "#model_modal.opened",
            },
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
    guards: {
      "list is complete": (context) => !context.readIDS?.length,
    },
    actions: {
      setProp: assign((_, event) => ({
        [event.name]: event.value,
      })),

      initDoomedPage: assign((context, event) => {
        // Extract necessary data from context and event
        //model.videos.records
        const { page } = context;
        return {
          doomedPage: page,
          afterPage: page - 1,
          IDS: [],
        };
      }),
      assignDoomedPage: assign((context, event) => {
        const { doomedPage } = context;
        return {
          doomedPage: doomedPage + 1,
        };
      }),
      resetPage: assign((context, event) => {
        const { afterPage } = context;
        return {
          page: afterPage,
        };
      }),
      assignDoomedIds: assign((context, event) => {
        // Extract necessary data from context and event
        const { afterPage, IDS } = context;
        const model = event.data;
        const { videos } = model;
        if (videos && videos.records?.length) {
          const readIDS = videos.records.map((f) => f.ID);
          // alert(JSON.stringify(readIDS));

          return {
            IDS: IDS.concat(readIDS),
            readIDS,
          };
        }

        return {
          readIDS: [],
          // page: afterPage,
        };
      }),
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
