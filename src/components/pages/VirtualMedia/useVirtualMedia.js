import { useMachine } from "@xstate/react";
import { assign, createMachine } from "xstate";
import { fetchRows } from "./connector";
import { getTracks } from "./getTracks";
import { getPagination } from "./getPagination";
import { despaced } from "./despaced";

const machine = createMachine(
  {
    id: "Untitled",
    initial: "load next page",
    context: {
      page: 1,
    },
    states: {
      "load next page": {
        invoke: {
          src: "loadVideoPage",
          input: {},
          onDone: [
            {
              target: "viewing current page",
              actions: [
                {
                  type: "assignVideos",
                },
                {
                  type: "assignPages",
                },
              ],
            },
          ],
        },
      },
      "viewing current page": {
        on: {
          page: {
            actions: [
              {
                type: "assignPage",
              },
              {
                type: "assignPages",
              },
            ],
          },
          find: {
            actions: [
              {
                type: "assignParam",
              },
              {
                type: "assignPages",
              },
            ],
          },
        },
      },
    },
    predictableActionArguments: true,
    preserveActionOrder: true,
  },
  {
    actions: {
      assignParam: assign((context, event) => {
        return {
          param: event.param,
          page: 1,
        };
      }),
      assignPage: assign((context, event) => {
        return {
          page: event.page,
        };
      }),
      assignVideos: assign((context, event) => {
        const videoList = event.data;
        const modelData = videoList.reduce((out, datum) => {
          if (datum.info?.stars) {
            datum.info.stars.map((star) => {
              if (!out[star]) out[star] = [];
              out[star].push(star);
            });
          }
          return out;
        }, {});

        return {
          videoList,
          modelData,
        };
      }),
      assignPages: assign((context, event) => {
        const { param } = context;
        const validData = context.videoList;

        const filteredData = !param
          ? validData
          : validData.filter((track) => {
              const unspaced = despaced(track.title.toLowerCase());
              const params = param.split("|");
              const exact = param.split(",");
              let ok = params.some(
                (f) => unspaced.indexOf(f.toLowerCase()) > -1
              );
              const matchParam = params.some(
                (f) => track.title.toLowerCase().indexOf(f.toLowerCase()) > -1
              );
              ok = either(ok, matchParam);
              if (track.info?.title) {
                const { title, stars } = track.info;
                const matchTitle = params.some(
                  (f) => title.toLowerCase().indexOf(f.toLowerCase()) > -1
                );
                const matchModel = stars.some((star) =>
                  params.some(
                    (f) => star.toLowerCase().indexOf(f.toLowerCase()) > -1
                  )
                );
                ok = either(ok, matchTitle);
                ok = either(ok, matchModel);
              }

              return ok;
            });

        const pages = getPagination(filteredData, {
          page: context.page,
          pageSize: 30,
          sortkey: "title",
          sortDir: "ASC",
        });

        return {
          pages,
        };
      }),
    },
    services: {
      loadVideoPage: (context, event) => async () => {
        return await getTracks();
      },
    },
    guards: {},
    delays: {},
  }
);

const either = (a, b) => a || b;

export const useVirtualMedia = () => {
  const [state, send] = useMachine(machine);

  const setParam = (param) => {
    send({
      type: "find",
      param,
    });
  };

  const setPage = (page) => {
    send({
      type: "page",
      page,
    });
  };

  return {
    state,
    send,
    setPage,
    setParam,
    ...state.context,
  };
};
