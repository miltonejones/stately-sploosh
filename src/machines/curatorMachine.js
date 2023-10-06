import { createMachine, assign } from "xstate";
import { useMachine } from "@xstate/react";
import {
  getVideos,
  getModelsByName,
  getVideoInfo,
  saveVideo,
  addModelToVideo,
} from "../connector";

export const curatorMachine = createMachine(
  {
    /** @xstate-layout N4IgpgJg5mDOIC5QGMCuAnAhgFwPboDoBLCAGzAGIB5ABQFEA5AbQAYBdRUAB11iOyK4AdpxAAPRAEYAHAE4ATAQCsANhYAWdQGYWkgOzrpAGhABPRAFp5slQWvr5erbPV6WLJ0oC+Xk2ix4hCTkFACSDABiVKwcSCA8fALCohIIkrK6BJJKOqpa6kqquibmaSwq6gTS0noq0vIe0kq63r4g-jj4xEIAZrgEsAAWuADuFADCADJUAMp0MaIJ-IIicanphgQtGVqFBjLGZoiy9XZ6slpaMoZKkpc+fhidQb39sNiY6BQQwmDdAG64ADWfw6gW6fQGH3QCCIQkByBwKxiCziSySq1AqUcSmkBDceicBlktxUNhKiEueL00nUGT0tyaWj08ge7Se4LhkPQYEwEG+vwBwNBHK6XP6PL5sPhuERGJR7EWvGWyTWiHkKjcynynjJkmy6gpCGkzIIJIy8gaKkkKhU8nUbLBYteBEl-J+Qj+cMBIIITpe3N5EGlCKRwhRkli3GVGJS6vUagIzKUNmy8hyZK0RtkLgIdJqBWashtu0dosIYLAAH0uJgYAMwNgq8hcKghNgKGJ3jg-pgetgwOgABSSACUFH9fo51dr9dgjebrfbqOjiRWcYQ8jxJKU1mkGkc7ms8iN6S0VRkOeLKmZNtkZYCXUrNbrf3nTZbbY7XY+A4IfYHYcxwncspwCGdXwbD8l2wJhIyVNdVSxKQWC2Gx5H0fcCjJC4TyOBArFzc4HBpLQyTqao9AfZ4wJ7F9609MQm34MAAFsBU9IVfUnZ9Zz+RjmIHViQ1lMMhAVKN4hjdc1QQHUtlve0clvWojW0PQsmqaR9RYJRXEkbDqPBXjIJgJtWNwCAwFIWACFIXA+Q4r0ZW40CTPrMyqwsqybLshzg29UT5XYFcpMQzFxCkdJZCqBQ7gZGwVGaPDSgTal8n0GRyguTQVCMp9p3ov5PO86zbMRd4nK4kVHwrQq+IIErLLKv1MHeES5WRELFTRaSkMihBCUUXZ0jkE5aicFRTwuC8xuvW8yXywhPL4qrAtc2rGoXPiOrEiSEJVCL1kcGKcLuVwcguLRDlKCxJHkc9d2LKlD3tfIfDaIRmvgOJ-QO2NZIsTUtk0Nx0iUFkcz0SQjQsa7KlUIbJF0nM6TytpJ2CMB-pk5C0gySQ7EuXFygJQws3wsilFizR7ScS0iXRx5NvFHH+uxB7qfyWl1DuLddyUI1rQ0rLoZqDVrv0JaITeYYRjZo71S3c9uc0PmmnTU8WnxdN7SSklL3vDHQPFKFPgVjdHC1ZHamuoa0sNfC3EqOpssuA4ZGl023Qt2TldQpwtC3E0agyFgKdKZH3AIM6SQTDJeaZ9lNvc7HevCjc7pijRXF0ElIdkNwbpQ2wrjkQlyjIlpWmZmjU6gxcv19vG6RihN01uVwy7pCP1WyEHCnpdNtBYappfrgSqxY1jm4Ghw8wafN6ZYQuDMd1LeYXkt9F0svpHH+rTIXUqbNn1I3FsGliw1C5zg1PQjWZRRA-OYl0xqQkD-AoqtvM5rfPsnyM+UgEyEw8BcKGBQmh1DUraPMagyTizJIHJOPFD4eWPv-cqbVsDAMGnpfEch7qZjvpqWBqEHrMhZKPZKDhpYrVfHg4hth0h3HcDaFgW4H74UIhpUmiDzQmm0B9LwQA */
    id: "curator",
    initial: "idle",
    states: {
      idle: {
        on: {
          OPEN: {
            target: "get_page",
            actions: assign({
              page: (context, event) => event.page,
              open: true,
            }),
          },
          INFO: {
            target: "info",
            actions: assign({
              key: (context, event) => event.value,
              open: true,
            }),
          },
        },
      },

      info: {
        initial: "read",
        states: {
          show: {
            on: {
              CLOSE: {
                target: "#curator.idle",
                actions: assign({
                  open: false,
                }),
              },
            },
          },
          star: {
            invoke: {
              src: "loadModels",
              onDone: [
                {
                  target: "#curator.idle",
                  actions: assign({
                    stars: (context, event) => event.data,
                  }),
                },
              ],
            },
          },
          read: {
            invoke: {
              src: "getInfoFromKey",
              onDone: [
                {
                  target: "star",
                  cond: "resultContainsModels",
                  actions: assign((context, event) => ({
                    current_title: event.data,
                  })),
                },
                {
                  target: "show",
                  actions: assign((context, event) => ({
                    current_title: event.data,
                  })),
                },
              ],
            },
          },
        },
      },

      curate_page: {
        initial: "set_count",
        states: {
          set_count: {
            after: {
              1: [
                {
                  target: "next_item",
                  cond: "hasMoreItems",
                  actions: "assignKeyFromCurrentTrack",
                },
                {
                  target: "#curator.get_page",
                  actions: "incrementPageCounter",
                },
              ],
            },
          },
          next_item: {
            invoke: {
              src: "getItemInfo",
              onDone: [
                {
                  target: "get_models",
                  actions: assign({
                    current_title: (context, event) => event.data,
                  }),
                },
              ],
            },
          },
          // write_title: {
          //   invoke: {
          //     src: "updateTrackTitle",
          //     onDone: [
          //       {
          //         target: "get_models",
          //         cond: (context) => !!context.current_title?.stars?.length,
          //       },
          //       {
          //         target: "#curator.curate_page.set_count",
          //         actions: "incrementCounter",
          //       },
          //     ],
          //   },
          // },
          get_models: {
            initial: "load",
            states: {
              load: {
                invoke: {
                  src: "loadModels",
                  onDone: [
                    {
                      target: "cast",
                      actions: assign({
                        stars: (context, event) => event.data,
                      }),
                    },
                  ],
                },
              },
              cast: {
                invoke: {
                  src: "castModels",
                  onDone: [
                    {
                      target: "#curator.curate_page.set_count",
                      actions: "incrementCounter",
                    },
                  ],
                },
              },
            },
          },
        },
      },

      get_page: {
        invoke: {
          src: "loadPage",
          onDone: [
            {
              target: "#curator.curate_page",
              actions: assign({
                items: (context, event) => event.data,
                item_index: 0,
              }),
            },
          ],
        },
      },
    },
    context: { page: 1, item_index: 0 },
    predictableActionArguments: true,
    preserveActionOrder: true,
  },
  {
    guards: {
      resultContainsModels: (context, event) => !!event.data.stars,
      hasMoreItems: (context) =>
        context.item_index < context.items.records.length,
    },
    actions: {
      incrementCounter: (context) => {
        return {
          item_index: context.item_index + 1,
        };
      },
      incrementPageCounter: (context) => {
        return {
          page: context.page + 1,
        };
      },
      assignKeyFromCurrentTrack: (context, event) => {
        const track = context.items.records[context.item_index];
        const key = /([a-z|A-Z]+[-\s]\d+)/.exec(track.title);
        return {
          key,
        };
      },
    },
  }
);

export const useCurator = () => {
  const [state, send] = useMachine(curatorMachine, {
    services: {
      loadPage: async (context, event) => {
        return await getVideos(context.page);
      },

      castModels: async (context) => {
        const { sourceModels = [[]], current_title } = context;
        const { models } = current_title;
        const IDs = sourceModels[0]
          .map((s) => s.ID)
          .filter((m) => !models.map((e) => e.ID).find((f) => f.ID === m.ID));

        console.log({ IDs });
        if (!IDs.length) return false;
        return Promise.all(
          IDs.map((s) => addModelToVideo(current_title.ID, s))
        );
      },
      loadModels: async (context) => {
        const { stars } = context.current_title;
        const downloaded = await Promise.all(
          stars.map((s) => getModelsByName(s))
        );
        if (downloaded?.length) {
          const list = downloaded[0].filter((star) =>
            stars.find((name) => star.name === name)
          );
          return [list];
        }
        return;
      },
      updateTrackTitle: async (context, event) => {
        const { ID, title } = context.current_title;
        if (ID && title) {
          const save = await saveVideo(ID, title);
          console.log({ save });
          return save;
        }
      },
      getInfoFromKey: async (context, event) => {
        return await getVideoInfo(context.key);
      },
      getItemInfo: async (context, event) => {
        const track = context.items.records[context.item_index];
        // alert(JSON.stringify(track, 0, 2));
        const { title, image, ID, models } = track;

        const key = /([a-z|A-Z]+[-\s]\d+)/.exec(title);

        if (key) {
          const info = await getVideoInfo(key[1]);
          return {
            ...info,
            key: key[1],
            old: title,
            image,
            models,
            ID,
          };
        }

        console.log({ title });
        return { title, key: !key ? null : key[1] };
      },
    },
  });

  return {
    state,
    send,
  };
};
