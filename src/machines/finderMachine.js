import { createMachine, assign } from "xstate";

export const finderMachine = createMachine(
  {
    /** @xstate-layout N4IgpgJg5mDOIC5QDMCWA7CYBOB9AtgIYDGAFhmAMSEAONYmA2gAwC6ioNA9rKgC6ou6DiAAeiAEzMAbNIB0AZgUAOaQBYF0gOwS10gJwBWADQgAnogC0h6czkBGTWvuOtMo8oC+n02kw4CEnJ0KgBZAHkAEQBRFnYkEG5eASERcQR7LS0FOWZmRzVmTUNmNT1TCwRrWwdNBS0XXQlpCQVvXwwsPCIyCjkaQmxYMFwB7EJ8WEpRWD5CPjA5QmQF7AAKNQBKSj8uwN6Q-sHh0cGJ2DiRJP5BYQT0tUNlOWUJXXsNCSfMj4qrCQcDWUbjUWmUCkMagkWn07RAuwCPWCixCoj4p3G+Gms3mi2Wqw22wR3SCfVR6LGE0uCWuKTuoHS+m0ci0hi00gUmQhelBfyqAJ+yhs4Mc+iMzH0EjhxP2yLk5IxE2xcwWSxWOEJO06iNJhwVlPwjHs8U4PBuqXuiH07NyegMUO56i0fMs9lUuX09kMbMMX3sEmUai8Pnh2pJB0WGH4ytxaoJ9iJYdlfSjfGppuStzSiH9Rjk2gUen0zGUrgMfIkmXzduUktZ0NeUpDMqRZLAaJjqvxGoTWv84bl5PTiTNdOzCC0QdypchBhstiMfKBtq+MmynMLwY6-eTevbfE7ePV617Ld1KP3RpNI8zFoZiEnANU9vsLX0CjeJnMiA0zzc9X0cEmV9ZhDGlJNWz3DsZhVI940THdIIvNFGAka9aSzS0J1KBwDGYbIXFZTRlAraFFGkUtoXyZp9DUcDEPPI4YEoCAhEjdAADcuAAa0WM8IyYsAEAwLjiHmW44mHDC7zEK1mS9J4imUCUjA0PlaP0OQNDcVRwTtN56L2JC5BwbAuGwShsDAYguA4nApNHTD7wyWwckA99PSZf02QUPkXE9OQSmtV4PBKR5DJ1ATdhYti5BEni+IgxjdmEziuDEulJLYK5HJk9JcwBUovihdxHD8wjATKX13yeNktAigc+mi0zzP6AAbeZkHM-A5H4uUUvijKJLYBzb3pWSMiyNQ5FaCEXB8oMOT5ZxDDka0dAhWtpBAsDmySgSbPwGg2rABYYsOeLeN6-a5UO47TqEwbxKELL0Ny8b0hKValFoj4pCUbbZBdTkAU8sVVEMexrU9Oi9oYgTUAgE7KBxbA02yml3vHN15FeIVgUMJllHBVQXVfLRAs9b160hgMg28EN0C4LB4ASPqKBysbsccfNgSZSVgVZIN7BdKFVpKvI3glZS3V27cjMYsYTgNVmM3ND6c2kexeZhAwAyySESO-DJNNA0FQNkVQ8jUWE4YVgT9TOfBOfV8dJwp1kSjyZhKzqtQ-NNyE3HnK3Slt+XIrlVMXbHLDc21gpCmyN5QTU42odyIOLYo2ww4a3dkL4GOnImkUWVmpSSyZBpytBXDXkJ9QJElFp8+MgYYGLvKcx93GiJLNwWih6QlxcNbJSJwmVE5WGI8aw4WuwLuNYyZSPaUHHMkDWjyoCoKGhtnlpDb5LOmX7m8z+lOW7KbRlq+LTgSUQNtBKLdQ3h26uCOk6FnPrCmSgwojYSUjpeTG0sEoCmkpvZS0AvkIUJ8EZIzAP-ZymRNLeT0PYfIWRib6GBh8LSUg8gtF0LrQsDNPBAA */
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
            actions: assign((context) => ({
              param_list: context.param.split("|"),
              param_index: 0,
              results: !!context.resume ? context.results : [],
            })),
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
          start: {
            target: "parse_params",
            actions: assign((_, event) => ({
              param: event.param,
              selected: event.selected,
              resume: event.resume,
            })),
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
