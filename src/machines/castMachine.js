import { createMachine, assign } from "xstate";
import { useMachine } from "@xstate/react";
import { findVideos, saveVideo, addModelToVideo } from "../connector";
import { getVideoByURL } from "../connector/parser";

const castMachine = createMachine(
  {
    id: "add_video",
    initial: "idle",
    states: {
      detect: {
        invoke: {
          src: "detectParamType",
          onDone: [
            {
              target: "key",
              cond: (context, event) => !!event.data,
            },
            {
              target: "url",
            },
          ],
        },
      },
      key: {
        initial: "find",
        states: {
          find: {
            invoke: {
              src: "findVideoByKey",
              onDone: [
                {
                  target: "#add_video.cast",
                  actions: "assignIDtoContext",
                },
              ],
              onError: [
                {
                  target: "#add_video.error",
                  actions: "assignProblem",
                },
              ],
            },
          },
        },
      },
      url: {
        initial: "get",
        states: {
          get: {
            invoke: {
              src: "findVideoByURL",
              onDone: [
                {
                  target: "save",
                  actions: assign({
                    track: (context, event) => event.data,
                  }),
                },
              ],
              onError: [
                {
                  target: "#add_video.error",
                  actions: "assignProblem",
                },
              ],
            },
          },
          save: {
            invoke: {
              src: "commitVideo",
              onDone: [
                {
                  target: "#add_video.cast",
                  actions: assign({
                    videoID: (context, event) => event.data,
                  }),
                },
              ],
              onError: [
                {
                  target: "#add_video.error",
                  actions: "assignProblem",
                },
              ],
            },
          },
        },
      },
      cast: {
        invoke: {
          src: "castModelInVideo",
          onDone: [
            {
              target: "success",
            },
          ],
          onError: [
            {
              target: "error",
              actions: "assignProblem",
            },
          ],
        },
      },
      error: {},
      success: {
        invoke: {
          src: "refreshModel",
          onDone: [
            {
              target: "idle",
            },
          ],
          onError: [
            {
              target: "error",
              actions: "assignProblem",
            },
          ],
        },
      },
      idle: {
        on: {
          ADD: {
            target: "detect",
            actions: "assignParamToContext",
          },
        },
      },
    },
    context: { address: "", modelID: "" },
    predictableActionArguments: true,
    preserveActionOrder: true,
  },
  {
    actions: {
      assignParamToContext: assign((context, event) => {
        return {
          address: event.address,
          modelID: event.modelID,
        };
      }),
      assignIDtoContext: assign((context, event) => {
        const { records } = event.data || {};
        if (!records?.length) return {};

        return {
          videoID: records[0].ID,
        };
      }),
      assignProblem: assign((context, event) => {
        return {
          errorMsg: event.data.message,
          stack: event.data.stack,
        };
      }),
    },
  }
);

export const useCast = (onRefresh) => {
  const [state, send] = useMachine(castMachine, {
    services: {
      refreshModel: async (context) => {
        onRefresh && onRefresh();
      },
      detectParamType: async (context) => {
        const regex = /\w+-\d+$/;
        return !!regex.exec(context.address);
      },
      findVideoByKey: async (context) => {
        return await findVideos(context.address);
      },
      findVideoByURL: async (context) => {
        return await getVideoByURL(context.address);
      },
      commitVideo: async (context) => {
        return await saveVideo(context.track);
      },
      castModelInVideo: async (context) => {
        if (!context.videoID) {
          throw new Error("No video ID was found");
        }
        return await addModelToVideo(context.videoID, context.modelID);
      },
    },
  });

  return {
    ...state.context,
    status: JSON.stringify(state.value),
    add: (address, modelID) => {
      send({
        type: "ADD",
        address,
        modelID,
      });
    },
  };
};
