import { createMachine, assign } from "xstate";
import { useMachine } from "@xstate/react";

import { addModelToVideo, removeModelFromVideo } from "../connector";

// add machine code
const dedupeMachine = createMachine(
  {
    /** @xstate-layout N4IgpgJg5mDOIC5QUgVwA5gHQCcwEMIBPAYgBEBRMgVQAUKBtABgF1FR0B7WASwBcenAHbsQAD0QBaAIzSATFmlMAzKukA2OXIAsADmXbtAGhBFEc6QFYsm9Zbn3t6gJzTd6gOwBfLyZQQMbDxCUjIAJQB5WmY2JBAuXgFhUQkEGR1nLA9nHUsNdU9lXV0TMwQddUVtC0tdJiY5Z2V1Jm9fEH9ArABjTgBbdAAbMD5IEghhbB4hADdOAGtsTswe-qGRyARpue78JKEYmNEE-kERONTJDwMsd2UHTXkCp1LES1qsuuKPPSt7ZR8fjQK3QOE43TgvCEUFwYD6nBmYAA+vCUINxpMsNsFktgdhQeDIdMYXh4YiUZw0VtZuC9mdDqxjtxTskLoh1MppFhLOpdNVnJYinkNK8ELo3J8WipOS0PLVAR08VgCRDYFCSXCEcjUWB0WAcGCcMrBnsAGacHB9LDLfFg1Xq2Fk7WU3XUnZ04QM2IcZn7FKIXTOXQ2PlyIquDxyQOWUXObRZeRMaTNd7SAUchU25V2onQrCECAUtEYoRTGmLa1KlW5mEFouu7G7fZepmJM7+8rqeP2OTqNxhpTvVSiooebktTmGZweDx1NpAgIgnNq4n5iCFnV6g0W41mi1WrPVld5uubt205usI5xE5+tkIXnWZQNDwFFxp7RJ0UWMdPQVMAoDHuZx1EzKtlwdRdkX1Q0SDCCgAGEIgANQoMJrx9NtWVAS5smDB56hcPInAcUVdDHd5LGnOVLH5ciwKgrBSzEPgAAJ+DhEgMPiX123vSQmluRpil5QNqiYdwyMaW5BUDOpXEsVptAYrpmLYji+i46RvR4rDzhwqRtHkLAcg0XsrD7QVSNMANpN0WSgyYBSlJUlYIDBdB0FXdzOHQVjNxLMs5grLMfM87yPP8l1BnPJt6SvRkb147DxCkaRtGuEzDBcJzXGcJNlFFSMmCwORWgMcqMneVylg8ry8zCqLixgnchj3S1K0YsL6phRqz0bD0DgSnTbz4gy0mkSMuT5WcnEHJhamMGyEH5GxlEjQMOUePkautOqIt81iWpwODEJQtDuNGlLLnShasHuApilaQNX2-NMsAaDQ4xaO5qksXbGrUrjEswll9NSiaB25NwgwUjwJMjKTMns5RTPcNw7AByKgYYbTWzBjsZHqaxtEU+oGmaVxdDkJGZNHbR7lkbQQJ8dohBdeA4htfG73GmR7MqHRPz7fK7AnUVJDqUryOnVHrgF2RduCYgebGiGrhnUqtDsH59DyGNlosSolGfcidbjVH-vaLNegGYZRggVXrqkXX7o8WRicpiMpMqfQmFJxMQMm3RdqPdUnfB1JamUcdQwFIVZHUIrSsTZM5IklQtFDiDV1JLV60GCOO3szINFkJpA1UX4isy8UTYFeo8tA63wMJY9a3XAui-vTwuXkZ8BRAzxiiWsohWlnKtueofs7byDAiRY7u-G+HKk+2i03y9LOVFWRrAryxXzuZQhxDlvGLU9jRj6Zf1cjD7iup9K7FouVRU-YNZ15INKPWiwsd8j1W+N0vilUMABNMAEeQqF3pybkRsv59hTL2AB4UGqRU3MAtKr4SpCwgaLaBhVlo-EqLUTwOgigSVNqgnqe1DpLySnpQmk0lDciDNcfsU10pvUyJ9HK5F3gzmqufLogMwAsSwZDVhn4QL+1kDOXsRUjJYAZuGf2woBTSFZl4IAA */
    id: "dedupe",
    initial: "ready",
    states: {
      ready: {
        on: {
          DEDUPE: {
            target: "processing",
            actions: "assignTrackModelInfo",
          },

          DROP: {
            target: "dropping",
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

      dropping: {
        states: {
          "drop model": {
            invoke: {
              src: "removeModel",
              onDone: {
                target: "#dedupe.drop next",
                actions: "incrementIndex",
              },
              onError: {
                target: "drop error",
                actions: "assignProblem",
              },
            },
          },

          "drop error": {
            on: {
              RECOVER: "#dedupe.ready",
            },
          },
        },

        initial: "drop model",
      },

      "drop next": {
        always: [
          {
            target: "dropping",
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
