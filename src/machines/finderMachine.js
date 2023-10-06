import { createMachine, assign } from "xstate";

export const finderMachine = createMachine(
  {
    /** @xstate-layout N4IgpgJg5mDOIC5QDMCWA7CYBOB9AtgIYDGAFhmAMSEAONYmA2gAwC6ioNA9rKgC6ou6DiAAeiAEzMAbNIB0AZgUAOaQBYF0gOwS10gJwBWADQgAnogC0h6czkBGTWvuOtMo8oC+n02kw4CEnJ0MDkaQmxYMFxw7EJ8WEpRWD5CPlDCZHTsAAo1AEpKPyw8IjIKMIiomIj42BZ2JBBuXgEhEXEENUNlOWUJXXsNCR77LSHTCwRLCQdx5Tc1LWUFQzUJLX1vXwwSwPKQuRDRPhq4-CSUtIysnDzC4oCy4NDj09j4hpEW-kFhJs69hkhjk+kcA1Uhg2mwUk0koIU+mUhhs+gUQOUKx62xAj1KQQqbzO8UuqXScky2XuRV2TwJhyJH3wjHsjU4PF+7QBiCBmjk0hcLi0CmYyOUcOmEhccjUGlUQ30bjWYxxeP2LzkGH4pOuFNuuXsD1p+IOoS1fC+TR+bX+oEBCjUvXU0nR9hGaNkWgl9n0+n56mUzE2hh0AdVxvVhLAJx15Mpd0NNP8Jo1b0t7Nafw6iGFvUV41sqxkUuk3r0vR0OmYEhFwokXh8uIjzyjMeSZJuVMTapbDOjFtZ3w5NuzCAFCjkwIGDsV6NUEr0ftkaLU+lkEkVG2k4eTkb7baucf1OW7zfpr37jAkbOaw6z3LH40Ustl1bFmJM5kkNbkVf03R6AwUQUHc9l7UJwhgSgICEM10AANy4ABrUIe3PSoYAQDBEOINI-gadNb0zLk7UQTReg2TEN3-ZhFRXb1lCMUFbEMBQtC0PRgK0UC6VNOQcGwLhsEobAwGILh4JwQjrXvUiEHsQx9FmJFxgU5hX0xWEv3kpT5DnOj9FFTQNh4lMKmKORBIAV3SAACPguFsqIIjIJyO0oaS7xIsQeSULQHHRNFmBkAsFAkCVNn86QpTC1RFUdNdTL3VDdksrgbLAezHOc7BXMPKgWRvGTvM6X01H5NY1GYTRDHsQMwoi5R7H5Kr1DqgxAx0JLwLkCz0hOJywBc0hoNgzUEOQlLdx6vr+0G4asIm3CbQItgh2I20fPkjZytlFZV2FF86oY9ZmJWTRbDUpZuvQ2aBpyshKAEoSwgAGzSZAhPwXqzz4u6+Hm3LSEWnC8KEVaiq8zbAXY2Z7FsYK11lMFpE-KYjHKkM5SalTopuvjxPwGhXrAdJRsObDJp+6b0MJ4nSbAEGuGW-C2E8jbR1qicNCMAVfVFBZxW0yw2OawwZFXJEN0U1R8Y1VAIBJygrmwC01qtKHRwU+QDCBICFkM5hFIlSxHTsDRRSAtcemrOWKgVpWVYHSGOYfSwfWalQ3AxmtWKqtGrFXOH1Jq5gxn-JZt0bNC+IdqgnavF3OWhqw6r9NdESU-oRlq+dhekZRyp2pHDZfQw7cOGAAfghWwB4WzkEE-BbMICAIFE2BEhgimJpQ6mwPQqvbJrrB68brhm9b9u4FgJmWfBtn1YzZPRyRP1VGC+tMSDN17BNxjehUFENmnEYBQrqaIDkKzsFewHHu7uDEL7mONQsm+74e4HKfn9AIfWleD4wSzFRo6WUKJ1JSC0lMes-lkRIiqoZDciDvCNnQFwLA8AmivwoAAkcbsRjNXhisN0MhopKXCsLJEIIPxQlFECdYjgL6VEiNEJkWDl74Lku7EYcgubClFGiHQhcJQbjkIQqUIYHSSPrMwxktR8B4NkltHQfojZxR6OWcW+hvSgnhusAuzgtDaELhoZh5olElV8rKBwQYJC63FqoaK3o1FrAMBxB0YxFIhjkf2SxKcED9DsEoRSfNnCYjGAxDik5bC6ConQtEzDIJgH8aOVYmMehuAUmFKQyIyxuAqusQyxlZCOmYc9bAqSHx1SNn0VYSggzVnAULKYPp7GKDTpsQyKxorl2jr9N+uwqlySUn6PQQIJbRWFPDBcT42KKTXiiFYjE+k7Bpn9VK1k7IOXvqQNy1xhlbXBLMSqBgpDGPFnvbS64YnaF6WuIY59+nrMGZgOQ-UAZf0OYCDc-lhTOgMEoX0DoJRGAnOLSqa4XSaNWU2F55lUof12d8xA+YZQCmCs6DY6JSzXOqooLQCzgyEs0NxZ5A8CYT3pukFFCAkQTiNkMDimxRRBlxVMU2yxxHsSNpkpStU9DmMVikjWrs5JSiXCsEY6x2JpxWCbGqMoFRLGqm6AFzCh4jzrrABuTcW5tw7hwoigDuFQIcAXdEUh1wUP3oZdFuhgLqTDqsVBnggA */
    id: "finder_machine",

    initial: "idle",
    context: {
      param: "",
      param_list: [],
      page_index: 0,
      addresses: [],
      search_index: 0,
      selected: [],
      param_index: 0,
      busy: false,
      results: [],
      memory: {},
    },

    states: {
      parse_params: {
        after: {
          4: {
            target: "next_param",
            actions: assign((context) => {
              const param_list = context.param.split("|");
              if (!!context.resume) {
                return {
                  param_list: context.param_list.concat(param_list),
                };
              }
              return {
                param_list,
                param_index: 0,
                results: [],
              };
            }),
          },
        },
      },

      next_param: {
        after: {
          4: [
            {
              target: "init",
              cond: "More params",
              actions: assign({
                busy: true,
                param: (context) => context.param_list[context.param_index],
              }),
            },
            {
              target: "complete",
              actions: assign({
                message: "",
                busy: false,
                open: true,
                chosen: [],
                // param: (context) => context.param_list.join(" OR "),
              }),
            },
          ],
        },

        description: `Search for the next param or exit if done.`,
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
            }),
          },
        },
      },

      next: {
        after: {
          1: [
            {
              target: "page",
              cond: "More pages",
            },
            {
              target: "#finder_machine.find",
              cond: "More parsers",
            },
            {
              target: "#finder_machine.next_param",
              actions: "incrementParam",
            },
          ],
        },

        description: `Move to next item in the param list`,
      },

      page: {
        invoke: {
          src: "searchByPage",
          onDone: [
            {
              target: "next",
              actions: "assignPage",
            },
          ],
        },

        description: `Call the search API using the current page.`,
      },

      error: {
        on: {
          recover: "next",
        },
      },

      find: {
        // invoke: {
        //   src: "searchByText",
        //   onDone: [
        //     {
        //       target: "next",
        //       actions: "assignTextResults",
        //     },
        //   ],
        //   onError: [
        //     {
        //       target: "error",
        //       actions: assign((_, event) => ({
        //         error: event.data.message,
        //         stack: event.data.stack,
        //       })),
        //     },
        //   ],
        // },

        description: `Call the search API using the current param.`,

        states: {
          "route to search state": {
            always: [
              {
                target: "text search",
                cond: "current param is not a URL",
              },
              {
                target: "url search",
                actions: assign((context) => ({
                  URL: context.param,
                })),
              },
            ],
          },

          "text search": {
            invoke: {
              src: "searchByText",
              onDone: {
                target: "#finder_machine.next",
                actions: "assignTextResults",
              },
              onError: "#finder_machine.error",
            },
          },

          "url search": {
            invoke: {
              src: "searchByURL",
              onDone: {
                target: "#finder_machine.next_param",
                actions: ["assignURLResults", "incrementParam"],
              },
            },
          },
        },

        initial: "route to search state",
      },

      complete: {
        invoke: {
          src: "sendCompeteSignal",
          onDone: [
            {
              target: "idle",
            },
          ],
        },

        entry: ["collateResults", "isolateResults", "assignMemory"],
        description: `Send complete signal to calling machine.`,
      },

      idle: {
        on: {
          start: [
            {
              cond: "param in memory",
              target: "complete",
              actions: ["assignMemoryResults"],
            },
            {
              target: "parse_params",
              actions: assign((_, event) => ({
                param: event.param,
                selected: event.selected,
                resume: event.resume,
              })),
              cond: "Param is not URL",
            },
            {
              target: "get videos from address",
              actions: assign((_, event) => ({
                URL: event.param,
              })),
            },
          ],
        },
      },

      "get videos from address": {
        invoke: {
          src: "searchByURL",
          onDone: {
            target: "complete",
            actions: "assignParseResults",
          },
        },
      },
    },

    on: {
      append: {
        actions: assign((context, event) => {
          const exists = context.param_list.some((f) =>
            event.param.some((e) => e === f)
          );
          if (exists) return;
          // alert(
          //   JSON.stringify(
          //     {
          //       list: context.param_list,
          //       param: event.param,
          //       exists,
          //     },
          //     0,
          //     2
          //   )
          // );
          // alert(context.param_list.indexOf(event.param));
          return {
            param_list: context.param_list.concat(event.param),
          };
        }),
      },
    },
  },
  {
    actions: {
      incrementParam: assign({
        param_index: (context) => context.param_index + 1,
      }),
      assignURLResults: assign((context, event) => {
        const currentDomain = context.selected[context.search_index];
        const videos = event.data;

        const results = combine(videos, context.results);
        const latest = videos.filter(timeFilter).find((f) => !!f.Photo);
        return {
          // set proview item as the first video with an image
          latest: latest || context.latest,

          results,

          // set progress message
          message: `Searching ${currentDomain} page ${
            context.page_index + 1
          }. ${context.results.length} found on "${context.param}"...`,

          // reset page to 0
          page_index: 0,

          // set current search domain
          currentDomain,

          // set progress
          progress:
            100 * ((context.search_index + 1) / context.selected.length),
          // increment search_index
          search_index: context.search_index + 1,
        };
      }),
      assignTextResults: assign((context, event) => {
        const currentDomain = context.selected[context.search_index];
        const { videos = [], pages } = event.data;
        const addresses = !pages
          ? null
          : pages.map(dressAddress(currentDomain));

        const results = combine(videos, context.results);
        const latest = videos.filter(timeFilter).find((f) => !!f.Photo);
        return {
          // set proview item as the first video with an image
          latest: latest || context.latest,

          results,

          // set progress message
          message: `Searching ${currentDomain} page ${
            context.page_index + 1
          }. ${context.results.length} matches for "${context.param}"...`,

          // add addition pages, if page numbers are present
          addresses,

          // reset page to 0
          page_index: 0,

          // set current search domain
          currentDomain,

          // set progress
          progress:
            100 * ((context.search_index + 1) / context.selected.length),
          // increment search_index
          search_index: context.search_index + 1,
        };
      }),

      isolateResults: assign((context) => {
        const results = context.results.map((f) => {
          const dupes = !f.Key
            ? []
            : context.results.filter(
                (d) => d.Key === f.Key && d.index > f.index
              );
          return {
            ...f,
            dupes,
          };
        });

        return {
          results,
        };
      }),
      collateResults: assign((context) => {
        const results = context.results.map((f, index) => {
          const key = /([a-z|A-Z]+[-\s]\d+)/.exec(f.Text);
          return {
            ...f,
            Key: !key ? null : key[0],
            index,
          };
        });

        return {
          results,
        };
      }),
      assignMemory: assign((context) => {
        if (!context.param_list.length) {
          return {};
        }
        const key = context.param_list.join("|");
        return {
          memory: {
            ...context.memory,
            [key]: context.results,
          },
        };
      }),
      assignParseResults: assign((_, event) => ({
        results: event.data,
      })),
      assignMemoryResults: assign((context, event) => ({
        results: context.memory[event.param],
        param_list: event.param.split("|"),
      })),
      assignPage: assign((context, event) => {
        const results = combine(event.data, context.results);
        const latest = event.data.filter(timeFilter).find((f) => !!f.Photo);
        return {
          latest: latest || context.latest,
          results,
          message: `Searching ${context.currentDomain} page ${
            context.page_index + 1
          }. ${context.results.length} matches for "${context.param}"...`,
          page_index: context.page_index + 1,
        };
      }),
    },
    guards: {
      "More params": (context) =>
        context.param_index < context.param_list.length,

      "More pages": (context) =>
        !!context.addresses && context.page_index < context.addresses.length,

      "More parsers": (context) =>
        context.search_index < context.selected.length,
      "Param is not URL": (_, event) => event.param?.indexOf("://") < 0,
      "param in memory": (context, event) => !!context.memory[event.param],
      "current param is not a URL": (context) =>
        context.param.indexOf("://") < 0,
    },
  }
);

const combine = (source, destination) => {
  // const merged = mergeArrays(source, destination);
  const trimmed = source?.filter(
    (src) =>
      !destination?.find((dest) => !!dest && !!src && dest.URL === src.URL)
  );
  const combined = destination.concat(trimmed);
  const timed = combined.filter(timeFilter);

  // console.log({ source, destination, timed });
  return timed;
};

const timeFilter = (file) => !file.CalculatedTime || file.CalculatedTime > 899;

export const dressAddress = (domain) => (p) => {
  const address = p[0].indexOf("://") > 0 ? p[0] : `https://${domain}${p[0]}`;
  return [address, p[1], domain];
};
