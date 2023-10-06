import { createMachine, assign } from "xstate";
import { findMatches } from "../util/findMatches";
export const editorMachine = createMachine(
  {
    /** @xstate-layout N4IgpgJg5mDOIC5SQJYBcD2AnAxAYwAsBDAOxgG0AGAXUVAAcNZ0UMS6QAPRARgCYALHwB0ADgDMAVkoA2PgHY+kgJwDxogDQgAnogC0-HsJ7zlMngIGielMzIEBfB1tSZcAV3oQiaMFVpIIIzMaKzsgdwIembywnzWonz24il8Clq6UeKmwpTxojKSKQL2lDwyTi4Q6Ng4WGAwnP4cwSxsHJHR8gLCkjLilPL95pTiZhn6fIO9fOKWkpJ8ypTSJZXg1W44YAC2AEaQzYGtoe0R+mbKuZQrMt3KYyXyE1lXyqJq4nLy2fLSoutXNhhBh6GASJAcLAiAA3Pw0FpMNrhUCRdQiJIyWRTKZFP4yF56eRGZSk5T8LGiCTiJKAzbA0HgyF4AA2THhAQYSNOKK4+ikPXeVkEUg+Ah4RUJhWEin68lGeT+kgBzg2NSwwhQEBZYBwjJIRy5ITCHX0PBMMyk5UKP346R0Zr4JMpRRp8gKywqqqBGq1Ovw9R8HMRxrOqP0q16onkQ1MlGs-QEzwdCAUMmEcgW0fENiWSUc3vpGoOADNsGAAARsogQHAQNhgTUkGEYADWjZ9wlL5arGBrCBQzYweB8YX8hqC3JN5yiKh69lEDx4H0oajKhIW6f4AneaUK1iEdPVwhgaArEIA7hX6EQsLAwFhz0QdrqRyQ8GAWROTtPw7PlJIGZCDwZirn0AEEimYxGDatg3GkliDAWVTHqe55gFeN53g+T4vlCsLBscU5hnyUSzOIcQSEkVIpFSoijC8WKUMI7zKokCjmokKooW4wh4IGvjXre964PWEJNi27bCJ2-FgEGQnYVgA5DiOPLjgiRGhrykTynEig2EUSYATm4gvGo85CEs-TbmU9hHrxsnyVhInbFgWDAvQLI+GWWA7NJRZ8QJlbOQ+yktqpY40N+xHaYgEjpsSyizEUkjikKjFOixqUyP0AxMdxaq8dCcIKS5YmNoOkkdgFxXBcJoWVcOo5sOpnKTlppoIKlsTKncCg5jGDyQZkOZbraSj8KlVJ8PZwK1aVD6ue5Gqed52B+Z280hUpjURS1UUaUayKdSogEKGoy6KDm0jDZM1hZQMXzlO86jyLNK31Y+D7LXUYAYHCWDRR1M5UsxuVSPK5hsQIG5KBmE1JaS6gfDNhbHvUJb1LABAAAqfbAdYNhJbbVejYCY3AuP42FTVqQdbU-iRkRUsYVg7rYWImPKMMpjwUgPTGy6pUIEgFqqJAYBAcAcD6IbHTORJ5MIvxjH0oiusmmR6Mk8M7lxQgyElyGFQyYIQhAcs8p1MYsdipLigsUh5ISqhxDuSWGzcyyqMo72atqYCW7+pF6JIQy9KoSjEvEZhpC7PSCKSSTLHBPt+929S9jWQdM4gKi5BK1mFKMIF3Lds45ixAiLOrygxjcQx+2hl4LY+JDPoHmny3+2upcrMaqzI6spJrefujKoqLiBEiqDwfuOYJ2057FXUJfY+QPHuOWSC8yoURSEofPwshrGjRUEa3y8nfdtglAM8qpWYPCEjYRgWGU7pfKo41+9tFbfdgK+INpRhwKKkaMKg5iEniBRauAwFAqEKOSOeZ9gQYyxlTRS8Au5WxnN0ICshFBWAMncHeKZ4giBMEkZUMZo4WC9E4IAA */
    id: "editor",

    initial: "before load",
    context: {
      specimenText: null,
      specimenEmbedText: null,
      specimenPageText: "",
      parsers: null,
      parser: null,
      result: null,
      tab: 1,
    },

    states: {
      opened: {
        on: {
          save: "save parser",

          close: {
            target: "idle",
            actions: "clearParser",
          },
        },

        description: `Parsers are being edited.`,
      },

      idle: {
        on: {
          open: {
            target: "opened",
            actions: "assignParser",
          },

          create: "get new parser name",
        },

        description: `No parser is selected`,
      },

      "before load": {
        invoke: {
          src: "loadParsers",
          onDone: {
            target: "idle",
            actions: [
              "assignParsers",
              "assignParserTestResult",
              "assignStorage",
            ],
          },
        },
      },

      "get new parser name": {
        on: {
          cancel: "idle",
          save: "create parser",
        },

        description: `Pause to allow user to enter parser name.`,
      },

      "create parser": {
        invoke: {
          src: "generateParser",
          onDone: {
            target: "refreshParsers",
            actions: "assignNewParserName",
          },
          onError: "parser error",
        },
      },

      "save parser": {
        invoke: {
          src: "updateParser",
          onDone: "refreshParsers",
          onError: "parser error",
        },
      },

      "parser error": {
        on: {
          reover: "before load",
        },
      },

      refreshParsers: {
        invoke: {
          src: "loadParsers",
          onDone: {
            target: "opened",
            actions: "assignParsers",
          },
        },
      },
    },

    on: {
      change: {
        internal: true,
        actions: ["assignChange", "assignColumns", "assignParserTestResult"],
      },

      update: {
        internal: true,
        actions: ["assignParserProp", "assignParserTestResult"],
      },

      regex: {
        internal: true,
        actions: ["assignRegexProp", "assignEmbedTestResult"],
      },
      embed: {
        internal: true,
        actions: ["assignEmbedProp", "assignEmbedTestResult"],
      },
    },
  },
  {
    actions: {
      assignNewParserName: assign((context) => ({
        parserName: null,
        parser: context.parserName,
      })),
      assignStorage: assign((context) => {
        const memory = Object.keys(context).reduce((out, key) => {
          const value = localStorage.getItem(key);
          if (value) {
            out[key] = isNaN(value) ? value : Number(value);
          }
          return out;
        }, {});
        console.log({ memory });
        return {
          ...memory,
        };
      }),
      clearParser: assign((_, event) => ({
        parser: null,
      })),
      assignParser: assign((_, event) => ({
        parser: event.parser,
      })),
      assignParsers: assign((_, event) => ({
        parsers: event.data,
      })),
      assignChange: assign((_, event) => {
        localStorage.setItem(event.name, event.value);
        return {
          [event.name]: event.value,
        };
      }),

      assignRegexProp: assign((context, event) => {
        if (!context.parser) return;
        const selectedParser = context.parsers.find(
          (p) => p.domain === context.parser
        );

        if (!selectedParser) return;

        const regexParser = {
          ...selectedParser,
          fields: {
            ...selectedParser.fields,
            embed: {
              M: {
                ...selectedParser.fields.embed.M,
                regexTag: {
                  S: event.value,
                },
              },
            },
          },
        };

        const embedParser = {
          ...selectedParser,
          fields: {
            ...selectedParser.fields,
            embed: {
              M: {
                ...selectedParser.fields.embed.M,
                regexProp: {
                  M: {
                    ...selectedParser.fields.embed.M.regexProp.M,
                    [event.name]: {
                      S: event.value,
                    },
                  },
                },
              },
            },
          },
        };

        const updatedParser =
          event.name === "regexTag" ? regexParser : embedParser;
        return {
          parsers: context.parsers.map((parser) =>
            parser.domain === context.parser ? updatedParser : parser
          ),
        };
      }),

      assignEmbedProp: assign((context, event) => {
        if (event.name === "embed" || !context.parser) return;
        const selectedParser = context.parsers.find(
          (p) => p.domain === context.parser
        );

        if (!selectedParser) return;
        const updatedParser = {
          ...selectedParser,
          fields: {
            ...selectedParser.fields,
            [event.name]: {
              S: event.value,
            },
          },
        };
        return {
          parsers: context.parsers.map((parser) =>
            parser.domain === context.parser ? updatedParser : parser
          ),
        };
      }),

      assignParserProp: assign((context, event) => {
        if (!context.parser) return;
        const selectedParser = context.parsers.find(
          (p) => p.domain === context.parser
        );
        if (!selectedParser) return;
        const updatedParser = {
          ...selectedParser,
          [event.name]: event.value,
        };

        return {
          parsers: context.parsers.map((parser) =>
            parser.domain === context.parser ? updatedParser : parser
          ),
        };
      }),
      assignColumns: assign((context) => {
        if (!context.parser) return;
        const selectedParser = context.parsers.find(
          (p) => p.domain === context.parser
        );
        console.log({ selectedParser });
        if (!context.columns || !selectedParser) return;
        const cols = context.columns.split(",").reduce((out, col) => {
          out.push({
            S: col,
          });
          return out;
        }, []);

        const fieldProp = {
          fields: {
            L: cols,
          },
        };

        const updatedParser = {
          ...selectedParser,
          pageMatrix: fieldProp,
        };
        console.log({ updatedParser });
        return {
          parsers: context.parsers.map((parser) =>
            parser.domain === context.parser ? updatedParser : parser
          ),
        };
      }),
      assignEmbedTestResult: assign((context) => {
        if (!context.parser) return;
        const selectedParser = context.parsers.find(
          (p) => p.domain === context.parser
        );
        if (!selectedParser) return;

        const fields = ["title", "image", "model"].filter(
          (field) => !!selectedParser.fields[field]
        );
        const cols = ["width", "height", "src"].filter(
          (field) => !!selectedParser.fields.embed.M.regexProp.M[field]
        );

        const embedResult = {};

        fields.map((field) => {
          const regex = new RegExp(selectedParser.fields[field].S).exec(
            context.specimenEmbedText
          );
          !!regex && Object.assign(embedResult, { [field]: regex[1] });
          console.log({ regex, field });
        });

        const framex = new RegExp(
          selectedParser.fields.embed.M.regexTag.S
        ).exec(context.specimenEmbedText);

        console.log({ framex });
        if (framex) {
          cols.map((field) => {
            const regex = new RegExp(
              selectedParser.fields.embed.M.regexProp.M[field].S
            ).exec(framex[1]);
            !!regex && Object.assign(embedResult, { [field]: regex[1] });
            console.log({ regex, field });
          });
        }

        return {
          embedResult,
        };
      }),
      assignParserTestResult: assign((context) => {
        if (!context.parser) return;
        const selectedParser = context.parsers.find(
          (p) => p.domain === context.parser
        );
        if (!selectedParser) return;

        const { specimenText, specimenPageText } = context;
        const { pageMatrix, domain, pageParser, pageRegex } = selectedParser;
        const columns = pageMatrix.fields.L.map((field) => field.S).join(",");
        let pages;

        if (pageRegex && specimenPageText) {
          const regex = new RegExp(pageRegex, "g");
          pages = findMatches(regex, specimenPageText);
        }

        if (pageParser && specimenText) {
          const result = new RegExp(pageParser, "g").exec(specimenText);
          const results = findMatches(
            new RegExp(pageParser, "g"),
            specimenText
          );

          console.log({ result, pageParser, specimenText });

          const specimen = processResult(result, domain, pageMatrix.fields.L);
          const specimens = results.map((result) =>
            processResult(result, domain, pageMatrix.fields.L)
          );

          // pageMatrix.fields.L.map((field, i) => {
          //   specimen[field.S] = result[i + 1];
          // });

          // if (specimen.URL.indexOf("://") < 0) {
          //   specimen.URL = `https://${domain}${specimen.URL}`;
          // }

          return {
            specimen,
            specimens,
            result,
            columns,
            pages,
          };
        }

        return {
          columns,
        };
      }),
    },
  }
);

function processResult(result, domain, fields) {
  const specimen = {};

  if (result) {
    fields.map((field, i) => {
      const index = i + 1;
      if (result[index]) {
        specimen[field.S] = result[index];
      }
    });

    if (specimen.URL.indexOf("://") < 0) {
      specimen.URL = `https://${domain}${specimen.URL}`;
    }
  }
  return specimen;
}
