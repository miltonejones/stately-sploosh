import { createMachine, assign } from "xstate";
import { useMachine } from "@xstate/react";

import { addModelToVideo, removeModelFromVideo } from "../connector";

// add machine code
const dedupeMachine = createMachine(
  {
    /** @xstate-layout N4IgpgJg5mDOIC5QUgVwA5gHQCcwEMIBPAYgBEBRMgVQAUKBtABgF1FR0B7WASwBcenAHbsQAD0QBaABwBOLACZpARgAsshU03SAbAGYFAGhBFEe2dMVNly6Ux0B2ZZod6Avm+MoIGbAGNOAFt0ABswPkgSCGFsHiEAN04Aa2xvXywA4LCIiAQ4xL98AWFmFlLRLl5ikSRxKScFLCZVNWUdHRtm1T1jUwQHFqw9AFZR1QVZJmHpVSZZDy80TCx0HE4-OF4hKFwwQM54sAB9fZQQqJisfOTUpexV9c24nbx9w5POM7yE9aLBIVK5VqlX4-1EEgQOmGqiGkwUOlkamsemUsl6iGUTGsQx09mmAyYeh0qlUCxAaWWDw2sC2Lz2B2OpzA5zAODWOBWISKADNODhAlgKfc1tTabs3ozPszvgU-iVWECONxQcJwYgNMosMN7EwHNJhrZJrIHOiEAoHA5FLp2pMHLJVDMFGShSsRU9tlhCBAPmcLkJYj8UoK7q7HjTnp6IN6mSEZb9qoDWBVldU1WbpJa9CTVMM9QZHMMdKbc0wsMos7IERpNAj3J5ySGqe6dl6fcySKz2ZyeXyBS6m+GPa2Y3HCgmFUngSmwbUIQ4mJZnKpcToJiNcT0TGZZPJ5zZdAuLQplLnnY23YOdj5MEdO3ySAAlCgAYQA8gA1CgPxUgEGp2f1NMigWMe5bKA4HQqKa5rDFgertBahYKMMiJqGe17YP6Yh8AABPwewkD+f4zqAEKSE4TQLnMdoKAo4yyFmpqYhMigtN0UyGu0pL1i6WG4fhgSEcobBTlUJF1Agkh6LoWAWC00y2FoKJQkxWjyHRajTCi0jaA4Hj1kIUrwLUQrJmJqoAZJdg6MBOk2CiEG2MoqmNEoCE5t0qgOMMRLoekeCEH0SrmTUpGATCswLuB0gqHIDqmuYliOBa7E6QoBijH5yyZKE4SQGZKqhRJ5HIVq6jwnozROOMm59MxNnHnYszDOlajGllwphrSBX-mFkL2LCWgIkiYFoluCCGnB1oWkp0h6BaHWhqKEavAybYhD14kQjFmoWJVegVuoOgzKasiFkM+oIuVLULk6PHnl1EbDlKG2iYVaa1rJJIMaMx2zLoxaOFgugnh0eranmi0DmKGG3myfKbRZfUOEowPdNJJ6IhBB3QRYWrlultEZsS3GLBhWB8XhESBIjRVkeoijanRyHfVm0LFoiOInj5xqVrien6UAA */
    id: "dedupe",
    initial: "ready",
    states: {
      ready: {
        on: {
          DEDUPE: {
            target: "processing",
            actions: "assignTrackModelInfo",
          },
        },

        description: `Machine is idle and waiting for commands`,
      },

      completed: {
        invoke: {
          src: "castingCompleted",
          onDone: [
            {
              target: "ready",
            },
          ],
        },
      },

      processing: {
        initial: "remove_model",
        states: {
          remove_model: {
            invoke: {
              src: "removeModel",
              onDone: [
                {
                  target: "add_model",
                },
              ],
              onError: [
                {
                  target: "dupe_error",
                  actions: "assignProblem",
                },
              ],
            },
          },
          add_model: {
            invoke: {
              src: "applyModel",
              onDone: {
                target: "#dedupe.next item",
                actions: "incrementIndex",
              },
              onError: [
                {
                  target: "dupe_error",
                  actions: "assignProblem",
                },
              ],
            },
          },
          dupe_error: {
            on: {
              RECOVER: {
                target: "#dedupe.ready",
                actions: "clearProblems",
              },
            },
          },
        },
      },

      "next item": {
        always: [
          {
            target: "processing",
            cond: "more items",
            actions: "incrementItems",
          },
          {
            target: "completed",
            actions: assign({
              item_index: 0,
              items: [],
              progress: 0,
            }),
          },
        ],
      },
    },
    context: { item_index: 0, items: [], progress: 0 },
    predictableActionArguments: true,
    preserveActionOrder: true,
  },
  {
    actions: {
      clearProblems: assign({
        errorMsg: null,
        stack: null,
      }),
      incrementIndex: assign((context) => {
        return {
          item_index: context.item_index + 1,
        };
      }),
      incrementItems: assign((context) => {
        return {
          trackFk: context.items[context.item_index].trackFk,
          modelFk: context.items[context.item_index].modelFk,
          progress: 100 * ((context.item_index + 1) / context.items.length),
        };
      }),
      assignProblem: assign((_, event) => {
        return {
          errorMsg: event.data.message,
          stack: event.data.stack,
        };
      }),
      assignTrackModelInfo: assign((_, event) => ({
        items: event.items,
        item_index: 0,
        trackFk: event.items[0].trackFk,
        modelFk: event.items[0].modelFk,
        progress: 0,
      })),
    },
    guards: {
      "more items": (context) => context.item_index < context.items.length,
    },
  }
);

export const useDedupe = (onComplete) => {
  const [state, send] = useMachine(dedupeMachine, {
    services: {
      removeModel: async (context) =>
        await removeModelFromVideo(context.trackFk, context.modelFk),
      applyModel: async (context) =>
        await addModelToVideo(context.trackFk, context.modelFk),
      castingCompleted: async () => onComplete && onComplete(),
    },
  });

  return {
    state,
    send,
    ...state.context,
  };
};
