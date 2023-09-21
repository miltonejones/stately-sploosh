import { createMachine, assign } from "xstate";

export const shoppingMachine = createMachine(
  {
    /** @xstate-layout N4IgpgJg5mDOIC5SwBYHsAOB9AtgQwGMUBLAOzADpiIAbMAYgHkAFAUQDkBtABgF1FQGNLGIAXYmlICQAD0QB2AEwBmCgEYAnAA4NANm4AWXQFYDyzQBoQAT0TLlZiorMHti+RuPH5ugL6+rVExcQhJyClgwPAAnIgoMGMisBOi8HFh6GVhRPFFKPAAzPOiACgMDAEp6IOx8IjJKSJi4lKSUtNgefiQQIRFxSWk5BGVjLV0KZQ0fY10DbiVFcatbBBU1CZNZ7jUtY2UlXUV-QPRa0IaIqNiUCnIZUWSYtMzs3PyisFLyqpqQ+vCTRudzADyeqRwXWkfTEEikPWGykUS3Uank3GUug8aiWWhWiGcyi0FCO8hxGLUsy0ahOID+dTCjWucXuj3aOFeOTyFEKxTKlWqZ3+jKuzVurPBaU4am6gmEsMGCLs3EU3Ao+wMyK02u4ujxNkQagWBgoe3k9nkxl2GkUagMtPpF0BzNuZDEnPePM+pTUvyFDMuQLibtEUJ6MIG8NAw0UGgcFEMOM8docBnxa2MngoNu4ngW+w03AxDv9TqZYpBDw93N5XxKvsFwQDzorrLDcv6cKGdj18lNekUmf0GiMlvT5njA7GOLJg40JabZdFwNZ1Y+fIbjoB5ZXoNDMuh8sj3ZGuns6spBnkmrmu31q3cegvo1MB2MC1GC-O2+XLL3a69Dc-UXH8g3FPdOEUWVeiPLslRGWZFBJLwz3cZFdD1dNFH0CYkQ0OMtAcPQdi-YVAxdeI8BgegIEkSgyAANzQABrRpS1AiiEhgBBGLQAhcjhLp2xgztFWjOxMQmMZbX2fRTCvccDG8dUdk1ak71MPwAjpdiRTAyjqIAWUYAARVhhIjODxJGPZVEMaluHkpZc10ccjjVTEtCUK1KXsA5SObHc4i+aI0GiADa2+fCNGA789IokKwos2CxNkQ0vLVfYMTPcZryxYwsLNCgPEtLzym1Ex5ACpd9IKMgIBouiqFIJjWIiXTyIrOrSAgHiWr4gTJCEvhD1EqM0rWPZjHVVU4x2HNsOUcc1BxJxMSLfYiRfe1tK3eKuvq+hEuieIaFyAowpwdqQP24Fut63j+MjYboMs1KY01NVE17A4bWwwq0ScLQdjmbDcyJHbThuzq7sO4yzOSsaTzQqStDMZRczRPRMSwrEJk0OYPHfZFTGqn9ojgABXGhRAyZgAEEAHFzJG8MUvG4YAFpppWwi+d0bR0StJaDQQHFgYocoh1VRy8shnTofCCnYGp2n6AAYQAGVYemACVEYVDnEE5+Zpvs7hxl7HElnTNFdXUZF5GBkxdR2ZQyZFZXVYyABlemADUWde9mT052M1VjUwR0tSkXNtg4kPcp33zGTE9A9y4vZpjJ1YACUYRgfaD0bDdDjCNATaZYw2IxdDUKZbecyWlIHDa8qq3aOqVqns-oenmDYdgTIN494M5jC+ytDQ0XNImdDUdNxjs+vHItnQ5OOTvFcoTAwHICAKBoNA8AgMgoCuOgCDyBraPCXi2r2y5d-3w-j9P0hz8iS-r76pinsEvgI8rITR5uMAwuxNDUm0EcUYy0nZOD0N4WMPg0SbyhnFJ+GA96QFfifM+F8wBX0gI1O+-UH5dx3lgl+R88EfwIUQh6-V-5DUAQeNmSN4I6D7NMC2uY4zyB8BoOBxJYyVWQXXJQGdwjPxwTQ9+59WhfAyLfeiZC2LbwoDIg+cj8GKOiLAX+A1nqANZh2UuY8kQmktHGcBj5nZplFsgtQ2YNhoiRI5cYzgpGUOwQfL+hDxAfxIao1q6iMHSKoTg-xV8z6GOYaQF6JdR7WS8JLLws8pjaDKveHsqTjDIivLqa83gO7oLIhE3xuCIDELzvTdgzMgHvWNliSYRIMSOSMCoBxqxRg7HUCqTJ3klALG8ZoyJDUi56zzo0o2YsBEiLRGMLy9dFg5NPGebMBg0aZjRkTbCoytFVOIUXbW6sAAqMzkaUjWvPNGcwJwFVFqMTETgnaDnyeiIwBzxlHIalrQuxd2HmOsvXI4pptREQwqnUwil7bo0tEoBwXlJFb3CUyHqAACWAeAGJgCxcQKApA8A0GCc1UJ100VXExdi3F+LCXEriYNBJJjg4cOsmHDCxUtlIi8NoKYswsIrSQpSQiKpkTR3KP4bSpA0DVPgD0R+5AknAK5mSPsuYlDTzmBheuQjRYCOmsLO0aMjDTE0KM6gdBlVNLFgLVQRx9DIncPYEc44DiqBKvw20GM66jLAta2Zto5jZnwj4HYYqlJYQtoa7Ueg67uGFmghWlL9KKMlOkANJ5nl9g8AU7GEiHCCvNAmWNWzXyaBxH6iiEp2SZvgqMcYTgxh6G1DeI0rlHHlUlvhSO0b9CStReUoKrpSBiDrdZJE5h1RTAcrHXKuNDAILruMeu+SjDy0VcOysohx0TQcH06eYq4z2CUooZa55OkwOmNoaYVaKxcTALuxEJgJgOW0B+OYOhHk9PKM4rQyIFhGnySu0pyah2-luMdJ9BJbRIWimGo0BTv0EhNcVTwcY9TAe9Xe2GPVoOTX2JLcw4xooywEYVIsThTZFhXpmYwoys603w5zKYziVoYlVB4QwGJumGgtqoEmmoli2nKPswdgUxm+OY2eaa09tg+H0DXNZj4ebTG8NSZt2FQObsk9Qt+Z9mNjG4ZSfQCmQZbMKv+kkamsQqjJGib5lSdF0OidfZjBxswgxkhSNw8gsI8PUGprwX6MYorKRJw5zmFGJCUYZqYLj5MYXM8pgLmhLTBc8KFpNOnDmuYM0C5JIDX0IvMIWeYSY1lEnyeoMko5DDDg3RQ3Tsi36QHw0aL6I58l6lGIODCHaekHGJNs+5OpTONY0ZEalOK8UiHpTQdzi69hXlknaAR9XbZIIvEZosFIdr+CAA */
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
              44: {
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
      },

      results: {
        on: {
          PAGE: {
            actions: assign({
              page: (context, event) => event.page,
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
                  param: (context, event) => event.value,
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
      incrementSave: assign((context, event) => {
        return {
          saved: event.data,
          message: `Saved ${context.save_index} of ${context.chosen.length}`,
          progress: 100 * ((context.save_index + 1) / context.chosen.length),
          save_index: context.save_index + 1,
          // track_to_save: null,
          track_info: null,
          // stars_to_add: null
        };
      }),
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

          message: `Searching ${currentDomain}. ${context.results.length} matches for "${context.param}"...`,
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
          message: `Searching ${context.currentDomain}. ${context.results.length} matches for "${context.param}"...`,
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
