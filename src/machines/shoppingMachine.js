import { createMachine, assign } from "xstate";

export const shoppingMachine = createMachine(
  {
    /** @xstate-layout N4IgpgJg5mDOIC5SwBYHsAOB9AtgQwGMUBLAOzAGJYw8AnIiNcgbQAYBdRUDNWYgF2JMuIAB6IAtAGYATABYAdDKkB2FTIAcagIwaAnDJkAaEAE9EBxQDZ5UufoCsD5dqkBfNydSZchEuQoAYQAJAEEAOQBxAFE2TiQQHj5BYQTxBAltGQcrBQcpPQcVZy05K1YNE3MEWykFbTkVPTk5GVYZQvdPEG9sfCIyMAViCAAbSgB5AAVo8LiRJIEhUhF08tYFdo0HCv1VVlY9KsRsjW0Fe2yDq9Y5PS6vdD6-QYVaOABXUf5YCinQmLzBKLFIrNKSLL1FRWJwqOSsFQaDRWArGMyIVz6BRSbSsIp6DSGGS6KweR4+fr+IbvWBfH5BAAy0VCACUgdxeEtUqB0tJ7go9BUrNoRSKihVjghtM1rAUCfJGlInBoyT0nr4BuQ3p9vr8AMqhABqsQ4C05oNWkhxDmxyhh90KORRku0OxkCmRSt0u1Rqt6Gqp2tpuqCwQmEz1JviHOSy0tGWFKg9+mKrmaDg0dxdUixOLxTUJhhJfvVlNeNLpv1CUxm4QAIuzEua4+CE9ok0i9Dp9EX2y7WFYNLbtsT1AYczISxSXlqKyHI6yQo2QS2eYhZBsKo0R8VWNphS75BtiYKuwYijlJ91-WWtZgwOQIBQFyyl6bgc3uWIre61IUZDoMhWM0yiSvIrgCncUgonoMIHA8arTpqQz3o+CijGgeAQGQUAKNQ4wEPwkAUIwWpkAAbmgADWQw3jOKEYA+kDoZh2GkLh+FgIRkAIBRaAEHgoJxMun5gmuNTnPYeiupm8onioko4oi2L6NJrQGNCLRTs8yEKKhzEYVhOF4WABFEU+pFDHxNF4aW9F6YxaGGWxHGmVx5m8aQlECUJHDMNo0ZNrGX7pIUFwFDCGiyDKRRSGBUgIsmuhSDiSJ4tpAavPpEAsUZ7EKBgdDULQvyWcMXnUbRdm6dluUuQVRVgCVnneYJyzCe+MZcmJ34ZM4uSCkq0mulY8LOuiNSwXoChqHu9qqHKKgZbeDFMTlnGEThJFMFZFU2XRNWOcxG2COxLX8W1TAdYFK4hYguaHI0rjCgB-6KfaFxwq4DSFMBKrXtVga1c5xGRkygQACoicFPXpEBNpnBmFRyl2zgOIpDhyOchwOLi0oJXohPLfZwOscRgQMhGUZmjD8Y7EmzSDTYsgE6oYGwUOAEHBpxSjdoxO6dQpAQAABLAeDkWAYvEFApB4KM21kXtVVIYGQui+LkvS7L8vnT57V+Z1QXdfGEiaIoOQptccg5PBYG4rkF47N9SN6ALasPhrND0Cg2tywrZXWSrOke8LYve0Qfu63x+tXYbN2ifGQFJnimYTrIz1xRNxI5B6NtWMBKWE7I7uvOr4d0JHfA6wHO3lZR+2A2XnsVz7UejHrl2kMJAU0ybrZyAUmz2IOKWIrcKLoxNWTttidxSV2OKDvzqqkGgEBwCIB1Un3FqtpkhyOwUF6aHC5SVBNUVJlkg8tH9SJRaXZFjGAu+rr1uO5PIo35Oo0ILfFaSkF7B-12PoJ+1IdQ-DfndDIE48iRSKNKGweIByHhxPUYCo0VCsBSkUK85IQ5ZSOhAGBsMIS3CHPkQoxRT5lAlNnNQuQz6DgRAOaEK9CGZTvCQuqOEyGm1xAcPIx9aGlHPmBZEihv6DjuCiXEqgIEOTWnw-KJ1IACP3sSOo5RNAikJjbbYiJ2a4xmmUQcBhpQtCWgDVWxCVHOWMoVEqTV4Aflpvvf8IiaElDPgw6oHQrBJjkdCAczhlAqAQtvexaETr8Pcf3cSQilAAS9JmJE9ptCKRHFCBoQSJ6PSUaTLCGiEl7ySYPC4ZQ8nj1xLBRS0FprEmlDsJw-4kRKPLprKW1d-aaPEmbAkmxoSIjOHYewZwXRBKofoCokSbCIk6S3agldfa9Plv03qZs6io2XkqQJyIp7VG9IoOwo0gIDk0OkjwHggA */
    id: "shop_machine",

    initial: "idle",

    states: {
      idle: {
        on: {
          OPEN: {
            target: "opened",
            actions: assign({
              auto_search: (_, event) => event.value,
              page: 1,
              stars_to_add: [],
              open: true,
            }),
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

        description: `Drawer is displaying search results.`,
      },

      opened: {
        initial: "loading",

        states: {
          //
          loading: {
            initial: "parsers",
            states: {
              selected: {
                invoke: {
                  src: "loadSelectedParsers",
                  onDone: [
                    {
                      target: "#shop_machine.opened.loaded",
                      cond: (context) => !context.auto_search,
                      actions: assign({
                        selected: (context, event) => event.data,
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

                description: `Load the list of parsers that have been selected for searching.`,
              },
              parsers: {
                invoke: {
                  src: "loadParserList",
                  onDone: [
                    {
                      target: "selected",
                      actions: assign({
                        parsers: (context, event) => event.data,
                        open: true,
                      }),
                    },
                  ],
                },
              },
            },
          },

          selecting: {
            invoke: {
              src: "selectParser",
              onDone: [
                {
                  target: "#shop_machine.opened.loaded",
                  actions: assign({
                    selected: (context, event) => event.data,
                  }),
                },
              ],
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
            },

            description: `Shopping cart is ready for search params. Search can only be performed from here.`,
          },
        },

        on: {
          SEARCH: {
            target: "send search signal",
            actions: assign((_, event) => ({
              param_list: [],
              param_index: 0,
              open: false,
              source: "opened",
            })),
          },
        },
      },

      "send save signal": {
        invoke: {
          src: "sendSaveSignal",
          onDone: [
            {
              target: "opened",
              actions: assign({
                results: [],
                auto_search: false,
                open: true,
              }),
            },
          ],
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
    actions: {},
    guards: {
      "source is opened": (context) => context.source === "opened",
    },
  }
);
