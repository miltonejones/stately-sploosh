import { createMachine, assign } from "xstate";

export const shoppingMachine = createMachine(
  {
    /** @xstate-layout N4IgpgJg5mDOIC5SwBYHsAOB9AtgQwGMUBLAOzAGJYw8AnIiNcgbQAYBdRUDNWYgF2JMuIAB6IAnAEYArADoATFNYSA7AoDMANhkSNrGQBoQAT0QAOBQBY5Mlau2qZVmeZcBfd8dSZchEuQUAMIAEgCCAHIA4gCibJxIIDx8gsKJ4ggAtBIyCnIqrKoSmlYaUlpWWsZmCAq5qvlqEuYaejmFnt7o2PhEZGByxBAANpQA8gAKMRHxIskCQqQiGeZSGnKqVgqslQ6sLXrViBqqWlJyGnYKqjsSKrlWnSA+Pf79crRwAK7D-LAUEzCsVmiXmqSW6UQrnOzQkVlYBTKqnMVVMiGULnyqyKW2aVhuEieLz8fXIH2+v3+QQAMjEwgAlEHcXgLNKgDLFdabczmVyaM6XcxHBBSNQ2aF6BFWeE7IndEkBAafWA-P7BWkM5hSBLMlKLZbonbrGRaTSqVTKBQ81gKYVW1haRQOGQaK3bZTmOW+XqK8kqykUADKYQAanEOHMWeCDSL9jYFNsJHclDtVra0SKZFJzHItHsLTIXVZZI8vM95T73srVVSQmMxoHwzqklH9ZCRQnHdnWtsUXctLzhWtcnJylbdHmEZcZF7XqSlRS1WEJlMIgARJktvVssTohMNU7bLRaHYDqyDjMY+T7KQ4hR4m5aWcKquL-6NhmhTdgtvs9FqRQdFxTRzHNJQNCHUV1nKeFNhtJxZAUZ9KzJTAwHICA5GGNA8AgAACahRgIfhIDwjA6GoWh-kYMkyAANzQABrAZiRQgY0IwrCcPwwiwGI0jyKosAqIQei0AIPBwXib9Wx3DJMh0Vg5BRc9NmUIpzTtPsLjcXJWlWXJNGQt5UIwdDIC43CCLAIiSPwwTKOopgBjE5i5FYkz2LMzjsKs3j+PsijhNgUTSAYiSpI4LVmx-OTEAU28dI0DQWiUKRYPTGps0Su5pBcaRtmcDRjPnOQOIs-zBFIKAKBolywqYliK08srvIqmy+KqqBQvCyTFmkiNQVkiE-yyOo5CTKR7TheEppaYUNBlLEDJuBE8xK31ysw3yIEgIMYlpIIABUZO3EbdwQOwlOaM8JC0ZLrmaBa5tHG1NDumRNlNJ8yw80qtss3aIHVBsm0jM6Y2PJTnFYRb7sKV1rAWip5GsE0B30Yoig294AZ2vaP3pL9Bt1VlzoyaUc1FNRs2RDFkVRGo6gdRRWiKVpCnMaQZ1+5rSuoUgeLwOiwAI4goFIPBhlq5zBgaty-t9AWhZFsWJalnrxL6pgBpi4aYykW8JEUUVLBvRbSkyxB70S+78vSrNrmcHGyWV6y6CINXJeluq5YYhW+aV9CeJoegUC9jWxIi-qopJrcyZjOwbCA9TZBPaUHTtbQbARGnLhtLQchdljg-dsOI592XXKa70Wrd6gPfDvh1eGTXo51qLtXBhP210c4HvhCps3HRn0WPHNktW3IeX0Yredr0qdrIoLaDw4ZiFgfgZdo+Wa7nX0l4c4S143-g2+10hde76N2zzc5z3KO6SkN2RhXhLmJrsPNKhhhxi7kAgTAABmxBaA4DwgQbC1AQaNlOj3UaoE8h5jcOoDS0p7p2hNMbS4yVWBzSLFIf+gDSAgLARAqBlAgiRCCAdOBN8EGuAmveSoj1tiVCHNKGw2hChwgRLDV0P0yykDQLteAiRFb9Gvr+C6mQvrKQqKBYsPDNIZgcA0XOFo3AIhaLIf+QxRhSLipdF0o51IMxuhUUeCAeznFNCaKwd18Tnh5l0BevpqyUkMeTRA6glLoNKBUbQzQXSQT0LmQeg9HHaH-ltLxMYFLNHkapJRGlVB2mREpfQ6VTgogUMeH6rj964zattbi1lbICRXmI0m9CZHOHjAzQoJRkrJQWilGwFoWGVDuJaFx5Y3HFPMphSqZAoBxPbMWHM54BwmiNClWGbSnC2B0EoZED8bh9IkaZIZgNIDjNGs4uQpQHRbBUK0NYQoMxWjzMpPBMNFqwwtP-euwtRbN29vsi66kuz4jsOUZKNMrYihuLYgwvIWhnCms0Z5pcG7l3eVLT5GRNDnGsCjXsWZ0pSCHKsc4axrlTVcDcT088ilkkPivE+m8kWIB0A0NQKUuZFB2A7N+i1zhZn2C6VYpQHGbMDu8YhpDwGQN4GAGlCBkRU0eTyeEzQUSXKZsPWwdQLS8OuIbTwnggA */
    id: "shop_machine",

    initial: "load parser list",
    context: {
      memory: {},
    },
    states: {
      idle: {
        on: {
          OPEN: {
            target: "opened",
            actions: "assignOpen",
          },
        },

        description: `Modal is closed and idle. Only the OPEN event is accepted.`,
      },

      results: {
        on: {
          PAGE: {
            actions: assign({
              page: (_, event) => event.page,
            }),
          },

          CLEAR: [
            {
              target: "confirm close",
              cond: "has chosen items",
            },
            {
              target: "opened",
              actions: "assignClose",
            },
          ],

          SAVE: {
            target: "send save signal",
            actions: assign({
              save_index: 0,
            }),
          },

          CHOOSE: {
            actions: assign({
              chosen: (context, event) =>
                context.chosen.indexOf(event.ID) > -1
                  ? context.chosen.filter((f) => f !== event.ID)
                  : context.chosen.concat(event.ID),
            }),
          },

          APPEND: {
            actions: assign({
              chosen: (context, event) => context.chosen.concat(event.ID),
            }),
          },

          SEARCH: {
            target: "send search signal",
            actions: assign((_, event) => ({
              param_list: [],
              param_index: 0,
              source: null,
              param: event.param,
            })),
          },
        },

        description: `Drawer is displaying search results. Can be called from sny state in the machine.`,
      },

      opened: {
        initial: "load selected parsers",

        states: {
          //
          "load selected parsers": {
            invoke: {
              src: "loadSelectedParsers",
              onDone: [
                {
                  target: "#shop_machine.opened.loaded",
                  cond: (context) => !context.auto_search,
                  actions: assign({
                    selected: (_, event) => event.data,
                    open: true,
                  }),
                },
                {
                  target: "#shop_machine.send search signal",
                  actions: assign((context, event) => ({
                    param: context.auto_search,
                    selected: event.data,
                    open: false,
                    source: "opened",
                    param_list: [],
                    param_index: 0,
                  })),
                },
              ],
            },
          },

          selecting: {
            invoke: {
              src: "selectParser",
              onDone: {
                target: "load selected parsers",
                actions: assign({
                  selected: (context, event) => event.data,
                }),
              },
            },

            description: `A parser is being selected or removed.`,
          },

          loaded: {
            on: {
              SELECT: {
                target: "#shop_machine.opened.selecting",
                actions: assign({
                  parser: (context, event) => event.value,
                }),
              },

              CLOSE: {
                target: "#shop_machine.idle",
                actions: assign({
                  open: false,
                  param: "",
                }),
              },

              SEARCH: {
                target: "#shop_machine.send search signal",
                actions: assign((context, event) => ({
                  param_list: [],
                  param_index: 0,
                  open: false,
                  source: "opened",
                  param: context.param || event.param,
                })),
              },
            },

            description: `Shopping cart is ready for search params. Search can only be performed from here.`,
          },
        },
      },

      "send save signal": {
        invoke: {
          src: "sendSaveSignal",
          onDone: {
            target: "opened.loaded",
            actions: assign({
              results: [],
              auto_search: false,
              open: true,
            }),
          },
        },
      },

      "send search signal": {
        invoke: {
          src: "sendSearchSignal",
          onDone: [
            {
              target: "opened.loaded",
              cond: "source is opened",
              description: `Return to appropriate state based on the source of the request.`,
            },
            {
              target: "results",
            },
          ],
        },

        description: `Send params to search machine and return immediately to opened state. Search will be picked up by finder machine.`,
      },

      "load parser list": {
        invoke: {
          src: "loadParserList",
          onDone: [
            {
              target: "idle",
              actions: assign({
                parsers: (_, event) => event.data,
              }),
            },
          ],
        },
      },

      "confirm close": {
        on: {
          CLOSE: {
            target: "opened.loaded",
            actions: "assignClose",
          },

          CANCEL: {
            target: "results",
          },
        },

        description: `Confirm before clearing if any items are selected.`,
      },
    },

    on: {
      searchdone: {
        target: ".results",
        actions: assign({
          message: "",
          busy: false,
          open: true,
          chosen: [],
          page: 1,
        }),
      },

      CHANGE: {
        actions: assign({
          param: (_, event) => event.value,
        }),
      },
    },
  },
  {
    actions: {
      assignClose: assign((context) => {
        return {
          memory: {
            ...context.memory,
            [context.param]: context.results,
          },
          open: false,
          param: "",
          results: [],
          auto_search: false,
        };
      }),
      assignOpen: assign({
        auto_search: (_, event) => event.value,
        page: 1,
        stars_to_add: [],
        open: true,
      }),
    },
    guards: {
      "source is opened": (context) => context.source === "opened",
      "has chosen items": (context) => context.chosen.length > 0,
      // "remembers param": (context) => !!context.memory[context.param],
      // "parsers not loaded": (context) => !context.selected?.length,
    },
  }
);
