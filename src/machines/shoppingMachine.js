import { createMachine, assign } from "xstate";

export const shoppingMachine = createMachine(
  {
    /** @xstate-layout N4IgpgJg5mDOIC5SwBYHsAOB9AtgQwGMUBLAOzAGJYw8AnIiNcgbQAYBdRUDNWYgF2JMuIAB6IAHAE4ALADoArAGYATEpkBGKQHYNWjSoA0IAJ6INrGQrmsJG7bJVSJM7awBsAX0-HUmXIQk5BQAwgASAIIAcgDiAKJsnEggPHyCwsniCAC0UgoqNlKsDmoyShruMu7GZggq+dqFDhJKUq0Kxd6+6Nj4RGRgcsQQADaUAPIACnFRiSKpAkKkIlkSKgVt9TJSBhIdGko1iGVKEjYKMk4KspenXSB+vYEDcrRwAK4j-LAUkxHxc2SC3Sy0yiAUdjkzlkrFYRXK2gk1VM5ks1ls9kczlccPujwC-XIrw+Xx+IQAMnEIgAlQHcXiLDKgLI7AraCFSdzldTwjRHOoKLRyMraJwVNwqGQSbR4noEoKDN6wT7fCgAZQiADUEhx5gyQStUds5Oz3O4PCotJKpPyNIKzu5tEpinblJoLrL-H0FcTlaTQmFxuM1TqkvS0ktDQgDKxrB18i0LNpNKwjCjo0p2XIDjs7WbNPDPU9CYqSaqIpNplEACJ0lL6yNg6MqYo2FplBTufIWG3pixWNuYy7YtxeHwPOXel5KlU-EM08J14GN5nmHRyFRd4dqaWig62rRKbOVYoyVPsu0qIvyl6YMDkCByEZoPAQAAE1DGBH4kDfGDo1C0D8jBEmQABuaAANaDPiU5EneD5Pi+76fmA36-v+QFgEBCDgWgBB4CCiRLg2TJiIg2SVGcnailKHR7O4dr8komZHoxsjOtKViSjI15wYMCGQEhr4fmAX4-u+mGAcBTCDHh0FyLBzzwRg95Cc+ImoehkkAdhsC4aQEEEURHDMBoYb1hGZFZNkCiInIqiZlKqYHDIMi2nYjRFDsVisrGZR8cpAmqYhWmCKQUAUCBcmGVBMGTkFciCY+YVkFABlGYRSzEbqQKkaCq45CoZzFdIHgXOoxXlMxEjStmLiIme2iOvkgUlklIXqchkDqnElIhAAKiRVkFeRCDbA60jrGeLFImUzGMdYWi1WaTpKBcVhtT6yXCRAPUUsGoZ6iNUaVFI5zrBoiapm5va1Jc9gORtlydqxvHjkp7U7Rpe0QL1C5hMNjKjVkw5yHY0oHMmqixho7npvUrAaHIlRWJcbhFOaMofQl7XUKQKF4GBYAfsQUCkHgIxRbJQyxQpn0+vjhPE6T5OUxl+FZUwOUWcu1moqm2awkoZrOM6FQSMxmbI7C2yOBc7hIltLxM6JdBEKzFNU9FtMQfTuOM-eKE0PQKCa+zeHGdlpm5eGwNRts1hVCLljsi0az7gj62NHoisi24blSu93ReolqvUOrZt8Gz2s0-J8Wh3jRtq6b5sjBzVvc6Z5nHfbTYQu4igOM41wtGa0q2l250eA49gXIKUhXjjic+j9f66bQb4jMQsD8NToF0wnxat8h7dYZ33e9xnXOkDzucGk2VdQm0nZrJmrDqHy6ZVNIKPOnkjFI4KSjeOOpBoHt8DJAzAzzyuY3ZMm8g0ZKey2J2THpnkjQQnX5pI0UJuIdh4vGGGMO+-MEAKGUNmJM7pG7OjsvyNyXJwZdjFD2ZQUhlZEhnKSCBINECilYMKKoZRKgixLocPsh4UZnhPO4Tk5CcHBTUhAAhUZKKckUI6V+9EP4KGYioLM6gITaD3MmOGCgWEdTYbtUS4kMIdyvnbBehVbJVCLu4NQVUnK1RqrocGeh6j2DNFdAKzcQEqTkalCKHCmyaELldBBlgyhML2DVbRKNGIuG2JKeokoZHfW6uwvKJ0HHGmLn7CovtthSy8S4a46hYwnksDI8ORMSbRy1vYwqnIvItGEcVHcy1K6yAcs4E8axEQbxPpYm8RJw4mw1tkymuSxpqGRpKSo+R356E0B5PQ2ZVBIgMGI2wMi25SWwl3Hu-B2lZEqIXOi7Iih2VsOyZBbR5BODWBCZ2FVT6eCAA */
    id: "shop_machine",

    initial: "load parser list",

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

          CLEAR: {
            target: "opened",
            actions: assign({
              results: [],
              auto_search: false,
            }),
          },

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
                actions: assign((_, event) => ({
                  param_list: [],
                  param_index: 0,
                  open: false,
                  source: "opened",
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
          // param: (context) => context.param_list.join(" OR "),
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
      assignOpen: assign({
        auto_search: (_, event) => event.value,
        page: 1,
        stars_to_add: [],
        open: true,
      }),
    },
    guards: {
      "source is opened": (context) => context.source === "opened",
      // "parsers not loaded": (context) => !context.selected?.length,
    },
  }
);
