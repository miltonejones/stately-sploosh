
import { createMachine, assign } from 'xstate';
import { useMachine } from "@xstate/react";

import { addModelToVideo, removeModelFromVideo } from '../connector';


// add machine code
const dedupeMachine = createMachine({
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
            onDone: [
              {
                target: "#dedupe.completed",
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
  },
  context: {},
  predictableActionArguments: true,
  preserveActionOrder: true,
},
{
  actions: {
    clearProblems: assign((context, event) => {
      return {
        errorMsg: null,
        stack: null
      }
    }),
    assignProblem: assign((context, event) => {
      return {
        errorMsg: event.data.message,
        stack: event.data.stack
      }
    }),
    assignTrackModelInfo: assign((_,  event) => ({
      trackFk:event.trackFk ,
      modelFk:event.modelFk 
    }))
  }
});

export const useDedupe = (onComplete) => {
  const [state, send] = useMachine(dedupeMachine, {
    services: { 
      removeModel: async (context) => await removeModelFromVideo(context.trackFk, context.modelFk),
      applyModel: async (context) => await addModelToVideo(context.trackFk, context.modelFk),
      castingCompleted: async () => onComplete && onComplete()
    },
  }); 

  return {
    state,
    send, 
    ...state.context
  };
}
