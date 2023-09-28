import { createMachine, assign } from "xstate";

export const finderMachine = createMachine(
  {
    /** @xstate-layout N4IgpgJg5mDOIC5QDMCWA7CYBOB9AtgIYDGAFhmAMSEAONYmA2gAwC6ioNA9rKgC6ou6DiAAeiAEzMAbNIB0AZgUAOaQBYF0gOwS10gJwBWADQgAnogC0h6czkBGTWvuOtMo8oC+n02kw4CEnJ0MDkaQmxYMFxw7EJ8WEpRWD5CPlDCZHTsAAo1AEpKPyw8IjIKMIiomIj42BZ2JBBuXgEhEXEENUNlOWUJXXsNCR77LSHTCwRLCQdx5Tc1LWUFQzUJLX1vXwwSwPKQuRDRPhq4-CSUtIysnDzC4oCy4NDj09j4hpEW-kFhJs6+m0ci0hi00gUY1WeiWkysszG9mUNhWjn0RmY+gk2xAj1KQQqbzO8UuqXScky2XuRV2TwJhyJH3wjHsjU4PF+7QBiH04LkzD0BnW0PUWjh0yR8kx9kMYMMI3sEmUai8PlxtPxB1CGH4pOuFNuuXsDw1+xech1fC+TR+bX+oE6iqMcm0Cj0+mYylcBnFEjGLsFyixoI2-WxarxZsJYBOevJlLuxpp-k15re1vZrT+HUQWhV-K9awMNlsRnF83560MMi0SkcKpxkee0djyTJNypSab9NeMatrO+HLtOYQedmqiF9mkEn0CgGJnMiA0vTcCk2KyB8uYhkbpubDL7cY7iZNKajB5OjAkbOaQ+z3NHAocBmYtZcoM0yl9G0U0i9G2YRUhV3M991CcIYEoCAhG1dAADcuAAa1CbstUqGAEAwBDiDSP4GgzW8sy5B0eWBGUemYFRMSMDRxX0NR9DkDQ3FUFZBQGEC9jAuQcGwLhsEobAwGILg4JwAjbXvEiECnSi5H0IMFH0ewgUVMEFHFFxlLkateX6Dxq26Ti6TQ4ooJgi14KQlC9x7ORikwqycLtfC2EHIj7TERAnVmAURnWdxHE0985jUboZ1WZEtC0YzUwqMzeP4sIABs0mQfj8Hs2zTN2RzsNwoRXJvSTiK8mTorUOQJCUQwXHUlUIXFZxDHk6Lqp6TcpB3CNsvNET8BoZKwHSczDiw6ystAuz+sG4awDyrhnLwtgJLvUrOmrFqlHooYpCUaQS3FSxIVmZT0QUg6VM2IZYvPbUICGygrmwK03JtNbPMdFQXRLZU-XBNc1COqdGNqsZmAFVRIRU27uNQB6qGe-tio+kdLCGRinFBdFDAUvNa2BsEHDWVYkV08FHFhuyYD4AACOD4bAHhaeQPj8FpwgIAgITYESaCxqs5DJq46nhvpxnmdZrh2c57m4FgBalsKla3szTlPtIxi9DcT083o-oxUXaY-0qkZlELZVDDdGxvDVdAuCweAmlQl53PVtGpF6BTeQOkZxitucjuihQmO0TFpChTYBSptDYmqJknbV4cHynewXQWIEsQWUEVU0xjtyWbdZFUCGGJjtM+2JfA3eT6T8ZBWUIYhv0wTzPP+TWNxftsAUth6qa0MtGupLKp00-rNRXznXQ8w0o2VI7wvu9LvudgHiuTmH9bEFREFqoUSjlE9IFxmCpZn36XH1BnCRp3LioILALeNZk5hb76D9dZkP0gXLFx5KxECZEs5URqHvocRK2Bn4jiRK+EEdZVBjGVPRYK2lyYYxhNIcBNlMDQJTipFqu0BgMVvmFbQTURhMQWEoZU2hqyqjXiLNCM0hrpDwdJIEp0-w2CxCKWERtjprnklIZuUgFKAWRNgi0CN2Gj02A4fyEdALRXNvoI6kJKoBQhtOGeQI3RSJpuLLAks2Ycy5jzROhF3YPnRrYeSQZwTyjBDKJQEgjrcPktoewAoVSaGquGbwQA */
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
              actions: assign({
                param_index: (context) => context.param_index + 1,
              }),
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
              actions: assign((_, event) => ({
                error: event.data.message,
                stack: event.data.stack,
              })),
            },
          ],
        },

        description: `Call the search API using the current param.`,
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
      },

      idle: {
        on: {
          start: [
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
        actions: assign({
          param_list: (context, event) =>
            context.param_list.concat(event.param),
        }),
      },
    },
  },
  {
    actions: {
      assignResults: assign((context, event) => {
        const currentDomain = context.selected[context.search_index];
        const { videos = [], pages } = event.data;
        const addresses = !pages
          ? null
          : pages.map(dressAddress(currentDomain));

        const results = combine(videos, context.results);
        const latest = videos.filter(timeFilter).find((f) => !!f.Photo);
        return {
          latest: latest || context.latest,
          results,

          message: `Searching ${currentDomain} page ${
            context.page_index + 1
          }. ${context.results.length} matches for "${context.param}"...`,
          addresses,
          page_index: 0,
          currentDomain,
          progress:
            100 * ((context.search_index + 1) / context.selected.length),
          search_index: context.search_index + 1,
        };
      }),
      assignParseResults: assign((_, event) => ({
        results: event.data,
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

  console.log({ source, destination, timed });
  return timed;
};

function mergeArrays(arr1, arr2) {
  const merged = [...arr1, ...arr2];
  const uniqueUrls = new Set(merged.map((obj) => obj.URL));
  const result = Array.from(uniqueUrls).map((url) => {
    return merged.find((obj) => obj.URL === url);
  });
  return result;
}

const timeFilter = (file) => !file.CalculatedTime || file.CalculatedTime > 899;

const dressAddress = (domain) => (p) => {
  const address = p[0].indexOf("://") > 0 ? p[0] : `https://${domain}${p[0]}`;
  return [address, p[1], domain];
};
