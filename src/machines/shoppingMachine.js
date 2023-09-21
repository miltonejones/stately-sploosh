import { createMachine, assign } from "xstate";

export const shoppingMachine = createMachine(
  {
    /** @xstate-layout N4IgpgJg5mDOIC5SwBYHsAOB9AtgQwGMUBLAOzADpiIAbMAYgHkAFAUQDkBtABgF1FQGNLGIAXYmlICQAD0QB2AEwBmCgEYAnAA4NANm4AWXQFYDyzQBoQAT0TLlZiorMHti+RuPH5ugL6+rVExcQhJyClgwPAAnIno8DAwwUggefiQQIRFxSWk5BEVuZXkKYxU1Ay1uDTNqgytbBE1vCnk2tTKNZW5jHQN-QPRsfCIySkiYogoMGMisGei8HFh6GVhRPFFKPAAzLeiACgMASnog4dCxiKjYlGnZsHmYpdg06SyxCSkM-OVvVQ0Gm4PgMRX0al0ugaiEUihqTi0HmUug08iKyg0AxA5xCo3CE1uFHIMlET0WOFW6022z2YEOBhOZyGuLC4xuU2JpIWSzeGQ+OW+oF+sK06jUaORHjUii0WmhBTMot07mlRQ6ui0aixOJGrOukzunLJS0pGy2FF2+yOjJ1l3x7MNYBJxpwnDU6UEwk+uR+dm4hVKDhFsu4GvlamBBgoWn+xWMah0igq2uZuquBKmZDEpupFtphzUp1teLZBqopDEvM92S+eRhWmR0e4WmcLfFEOM8sUvVUoc8bUKaP9KeCaftZc5OfNlrpB0LTNHdtLhM5VcyXoFdYQyMR0b03b0dV08k7NjsagcFH3vWl8mlxkxAWxqaX+pXTtEU5pVvnxb1GcdEk3Q9dcax9IU7F0exSg6Ax5AMRRdAMBM5TPAoPF0GC-lMONgT+EcLhLN8OQ-L88x-IsXyIgCiQ-ThFBA-la19bdjGVCgTDY5R3FhSFUMaRDQwobjAWUBtXHBAiWXTB17hgegIEkSgyAANzQABrcYqP-WSZhgBBVLQAhNi+NI1yY8DZDsZFMN6JNjGRHoGXkeUHBaYxuAqGU1BQ0w-CfP8ZLLPSGAAWUYAARVhzI3ZiIO3GNe0qCNTAQqo9Fc5VuGEjUlHjDp7GKKSx2XKY6WiNBojImd6UBDRKMXajZPKyqYrAwUrKaRFsocsExOPIwTy7GMSg8E9EQZWUTHkYrXxonYyAgBSlPLNTNIibSgsJBaUgM0g1OMgUzL4d5Yss-IZS8UpCi6TyNEKRDlFcnzFCcRyensBsvH6ALNvHbbFvoFrommGhNh2SqcA2xqdLLHaID2g6TMkY7GLOjqLoQ7LDAhRFinuxDhvFBFPKQwSui0H7Bhhrapnh+hwqitrvQx88KiveNKagspdHFLs9DUJxUuqLwilcWaiOiOAAFcaFEFZmAAQQAcWik6+XRrcAFpjDFBt9ZRbr4yetDpSqCgGQfLKengpCJb1KXYFl+X6AAYQAGVYRWACVmc3FitdBXXDCqLQ+LvEVwzRTDpXcKoTFDTzlHtq5HedlYAGVFYANTVtH2u1uFsrhUwahPDpqihU3ilerL5BjHoGxRfzqcIh2ZbllZXYACUYRgM7z06C4DyENAoaolA0CEjF5jFwxlbLLf3bgbcGlPwjTzv6EV5g2HYCK-bizqtchEp4yntp8d6Kf5TD3sLx6ZsdH0Mp18oTBkkgegB59nvD-OxA4p65OHFL0REF4lAykylBK8lQDAPkph4Hmb8KAf3IBACgNA0B4AgGQKA1w6AEC2EtRS4RDLrUCuENBkBMHYNwaQfBkRCHEMRkZZGpBUZDxZluXWCYkIJk0JqbQyo-jPWAXCaacIfDikUCg6hGCsE4LwQQsARCv6kOUvtDSWkaZUKSOg2hSiGEqLUQjQyh1TJ8GAlw-28UdAlFRM2aoXQ2gojEaKCR3gpG8yUHI-RNDFH0PwQsSI0QVgaNWto6GbcrjyMMUE+4YS6SwFYRYlGVj1bVm4QHbiUYTxdGQu4bQoZ6hoSkYLKePjuKN2VFTZ8uj37+IwUw1R4gGHLTIVoihf1Gmf2aWAZheDUnsM4RrYe8UrrwP+PIDE2gJr8UgldMozho7wW8DNX6DTUFNPiV-Huit2Cq3-qzBAJ8SifSKE5ERpTGh-E8uof0sy8pKGBH4vpuyloD09q7AAKscrc9k3o6ATEYMwF5Ty3IcphOO3YyhoiMG8gxgS9nu37oPMZ2T4oXnYrKcSegTBfRuXYUEmEzBxiUA4REvjNkxPtCkAABLAPAKkwCMuIFAUgeAaAdM0WtHRtK2QMqZSytlHKuXDKOhk-OmLj6IUwvBBssLtAYjYl2F66gez+lhGXBk-gnykDQBAOA0hKFgBsUffIWs7wlAnnCaekILwaHlG0XWxsIQnngpXWRNLpJkNoGajFtjOoQi6BxQSsJ3D2BqK5YoqgxouKTN0XmKCALmoAQUaeV5AQ+E8lq+BXZmyutlI4oM3FqWt19aVO4ITHjcmWGmk5fxiitAJhJZE4oHBqpmePYtlQcKaGlCm2SRo60Nq3H8MOQtn6ygQrzUMXZJoW0BCXQt+hdU+pKsRO4WZRBjpYtxcwgZtARgrmHFyZS11OAFmHcFzg7YbrmsOj8e74oOHuVPLVXR7DwMUM9aCRhEIqFRNoVEQ7gp4BgC+zqyI2LRgjMUmZSEdAQuJchaMsJgQpRlD4sDhJgZQYukmV6dUc0RlhPmsplM8meC6BqMobZk4PqanDRaBH6wOQtuYMOdVCjAnPQJKoxcg4rwfg+YwKDN7yzY6cjEgsfJFEHECUEnbTbNlULCUwIokwMkQoiyA0mT5-CvOqYEkJSaVC7Eg9QqJvDAqBFPcTTG9RxMCXggzvQHEmZ8OCJDw0WwcRswNTDgI9MKLocolppiDPNqBBCeyao3D8ZhI46zJ4vDIe6OW+pArtnvNc8YmtYT3MYmM2xUzPmLNlJS5oNL19epZdNblgxkW2lQGk7BxE-xNCGE8nCBZCUyjqDvINQw+gaihY+dJiM2Mag8y+t2SEVdbnFFFJTNiip46RiHUK5lrKRBipoNFww0ZTAnnbXBeFS3AFeJgh5leaofr+CAA */
    id: "shop_machine",
    initial: "idle",
    states: {
      idle: {
        on: {
          OPEN: {
            target: "opened",
            actions: assign({
              auto_search: (context, event) => event.value,
              page: 1,
              stars_to_add: [],
            }),
          },
        },

        description: `Modal is closed and idle.`,
      },

      search: {
        initial: "parse_params",

        states: {
          parse_params: {
            after: {
              4: {
                target: "next_param",
                actions: assign({
                  param_list: (context) => context.param.split("|"),
                  param_index: 0,
                  results: [],
                }),
              },
            },
          },
          next_param: {
            after: {
              44: [
                {
                  target: "init",
                  cond: (context) =>
                    context.param_index < context.param_list.length,
                  actions: assign({
                    busy: true,
                    param: (context) => context.param_list[context.param_index],
                  }),
                },
                {
                  target: "#shop_machine.results",
                  actions: assign({
                    message: "",
                    busy: false,
                    open: true,
                    chosen: [],
                    param: (context) => context.param_list.join(" OR "),
                  }),
                },
              ],
            },
          },
          init: {
            after: {
              1: {
                target: "find",
                actions: assign({
                  search_index: 0,
                  page_index: 0,
                  progress: 0,
                  page: 1,
                  // auto_search: false
                }),
              },
            },
          },
          next: {
            after: {
              1: [
                {
                  target: "page",
                  cond: (context) =>
                    !!context.addresses &&
                    context.page_index < context.addresses.length,
                },
                {
                  target: "#shop_machine.search.find",
                  cond: (context) =>
                    context.search_index < context.selected.length,
                },
                {
                  target: "#shop_machine.search.next_param",
                  actions: assign({
                    param_index: (context) => context.param_index + 1,
                  }),
                },
              ],
            },
          },
          page: {
            on: {
              MODE: {
                actions: "assignProps",
              },
            },
            invoke: {
              src: "searchByPage",
              onDone: [
                {
                  target: "next",
                  actions: "assignPage",
                },
              ],
            },
          },
          error: {
            after: {
              4999: "#shop_machine.opened",
            },
          },
          find: {
            on: {
              MODE: {
                actions: "assignProps",
              },
            },
            invoke: {
              src: "searchByText",
              onDone: [
                {
                  target: "next",
                  actions: "assignResults",
                },
              ],
              onError: [
                {
                  target: "error",
                  actions: assign((context, event) => ({
                    error: event.data.message,
                    stack: event.data.stack,
                  })),
                },
              ],
            },
          },
        },

        on: {
          append: {
            actions: assign({
              param_list: (context, event) =>
                context.param_list.concat(event.param),
            }),
          },
        },
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
                      target: "#shop_machine.search",
                      actions: assign((context, event) => ({
                        param: context.auto_search,
                        selected: event.data,
                        open: false,
                        param_list: [],
                        param_index: 0,
                      })),
                    },
                  ],
                },
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
              CHANGE: {
                actions: assign({
                  param: (_, event) => event.value,
                }),
              },

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

            description: `Shopping cart is ready for search params`,
          },
        },

        on: {
          SEARCH: {
            target: "search",
            actions: assign({
              param_list: [],
              param_index: 0,
              open: false,
            }),
          },
        },
      },

      "send save signal": {
        invoke: {
          src: "signalSave",
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
    },
  },
  {
    actions: {
      // incrementSave: assign((context, event) => {
      //   return {
      //     saved: event.data,
      //     message: `Saved ${context.save_index} of ${context.chosen.length}`,
      //     progress: 100 * ((context.save_index + 1) / context.chosen.length),
      //     save_index: context.save_index + 1,
      //     // track_to_save: null,
      //     track_info: null,
      //     // stars_to_add: null
      //   };
      // }),
      assignResults: assign((context, event) => {
        const currentDomain = context.selected[context.search_index];
        const { videos = [], pages } = event.data;
        const addresses = !pages
          ? null
          : pages.map(dressAddress(currentDomain));
        // const trimmed = videos?.filter(f => !context.results?.find(v => !!v && !!f && v.URL === f.URL))
        // const results = context.results.filter(f => !videos?.find(v => !!v && !!f && v.URL === f.URL))
        // console.log ({
        //   videos,
        //   trimmed
        // })
        const results = combine(videos, context.results);
        return {
          latest: results[0] || context.latest,
          results,

          message: `Searching ${currentDomain}. ${
            context.results.length
          } matches for "${context.param_list.join(" or ")}"...`,
          addresses,
          page_index: 0,
          currentDomain,
          progress:
            100 * ((context.search_index + 1) / context.selected.length),
          search_index: context.search_index + 1,
        };
      }),

      assignProps: assign((context, event) => {
        return event;
      }),

      assignPage: assign((context, event) => {
        const results = combine(event.data, context.results);
        return {
          latest: results[0] || context.latest,
          results,
          message: `Searching ${context.currentDomain}. ${
            context.results.length
          } matches for "${context.param_list.join(" or ")}"...`,
          page_index: context.page_index + 1,
        };
      }),
    },
  }
);

const combine = (source, destination) => {
  const trimmed = source?.filter(
    (src) =>
      !destination?.find((dest) => !!dest && !!src && dest.URL === src.URL)
  );
  const combined = destination.concat(trimmed);
  const timed = combined.filter(
    (file) => !file.CalculatedTime || file.CalculatedTime > 899
  );
  console.log({
    combined,
    timed,
  });
  return timed;
};

const dressAddress = (domain) => (p) => {
  const address = p[0].indexOf("://") > 0 ? p[0] : `https://${domain}${p[0]}`;
  return [address, p[1], domain];
};
