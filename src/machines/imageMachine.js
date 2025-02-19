import { createMachine, assign } from "xstate";
import { useMachine } from "@xstate/react";

export const imageMachine = createMachine(
  {
    /** @xstate-layout N4IgpgJg5mDOIC5QEsC2BDGB9DBjAFsgHZgB0ANgPboTFQDEElJpxAbpQNZlqZg7oCxMlRp0E7SrnQAXZMwDaABgC6ylYlAAHSrGRzmmkAA9EAFgDMAdlJWAbACYHAVmcXn99xYA0IAJ6IALQAjA7BpB52ZlbODnZ2Me7OAL7JvrzYeIQsorREDGAAToWUhaRa5LIAZqWorBiZgtki1HlQEkQc0gZE6upGOno9RqYIgc4AnBHBEwAcwQlWM3ZKE-a+AQgOszZKSitubhOrVtap6Q38WcIUrXT0RSVlFdW19XwCQjl3+R1dsvJeqoFMENEgQIN9ICRohjmZSCszE5Zk4HFYrLNZhtEBZtrYLMFZq4EnMJmTziAMlcmjdCmAZIU-PRjLAZLIyOgqjIigAKZx7ACU9Cpn2apDpDL8-XBkOG4NGgTMwWcpGCpwmZlce1mZn2dmxY2CwXhjms1ismv5SIsqTSICIlAgcCMIuuJAGuihhnlQTMdgsqvVlu1uviBsCDlW+NDswSRqsEwWFNdNO+YnyHqG0J9Y0jpCRK1jE2cmIsE3N4aNdlIxzszirFgsdlCyuTl1FtPpjMzXqIMLGZfhS3LricZmOSgcBosSlmpAcuMmxaLM4XbY+bpaNEgPbloFGcwDjdjyuWkfW-iCwT2pAs44mDgfhIf+xStqAA */
    id: "image_machine",
    initial: "loading",
    states: {
      loading: {
        invoke: {
          src: "loadPhoto",
          onDone: [
            {
              target: "loaded",
              actions: "applySource",
            },
          ],
          onError: [
            {
              target: "retry",
              cond: "can retry",
              actions: "assignRetry",
            },
            "loaded",
          ],
        },
      },

      retry: {
        after: {
          500: "loading",
        },
      },

      loaded: {},
    },
    context: {
      retries: 0,
      src: "https://s3.amazonaws.com/sploosh.me.uk/assets/XXX.jpg",
      ok: false,
    },
  },
  {
    guards: {
      "can retry": (context) => context.ok,
    },
    actions: {
      applySource: assign((_, event) => ({
        src: event.data,
      })),
      assignRetry: assign({
        ok: true,
      }),
    },
  }
);

export const useImage = (source) => {
  const [state, send] = useMachine(imageMachine, {
    services: {
      loadPhoto: async (context, event) => {
        return await new Promise((resolve, reject) => {
          const im = new Image();
          im.onload = () => {
            resolve(source);
          };
          im.onerror = () => {
            reject(true);
          };
          im.src = source;
        });
      },
    },
  });
};
