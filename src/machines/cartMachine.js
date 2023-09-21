import { createMachine, assign } from "xstate";

export const cartMachine = createMachine(
  {
    /** @xstate-layout N4IgpgJg5mDOIC5QGMCGAnALgfQLauQAsBLAOzADpyAPTAYmtk1U0tQDNX0AKARgAZ+ASjposeAiXJUwtANr8AuolAAHAPaximYutIqQ1RAFoArADZeFAEwBmACwAOW716PztxwHYANCACeiG5ephT2vLamjk7mjqamXuYAvkl+Yjj4RGSUNPSMzKwUHFx8giLpElnSuXK8ykggGlo6egZGCMYR-PYUXvZevB5enhGWfoEIbvbmFACc9tO2iZ6zjtb2KWkYGZLZFMjquLjadBB6lGQAbuoA1pQVmVL3h8eYCFfqaC2kCoq-Bk1tLp9A12utbL1rMNTLZrNZYolpuMguFQgJrLM4eZwrFrJsQA9dtIDkcTmdpB87vttpUnvsXtp3qRrl9gb9avU1Joga1QUF+LMvDZ1k5+HFzKt+OZkZNURR0bMEi5rKYBbZ8YSqs9SfQwOh0Op0BRVAAbFjsQ24aniR57EmvJkslhspT-BqA75tRCRGaCOJLUyDaYxGVeVYUUyi-i8DGmWYuDU023E1BMCgm9SoCCnc4USn3JNEgtpjNZx2fZ16dlKAHcz18yZLIWOVwqlwS2zdGUxqzTeNS7wLXheaOJm1F6klzPZvUGo2m82W607LWTzDp6fl1lV1019114FehDmCVhcKDeHYk+ubuwihrLxQwNuRz8H1jld0tBp1SoACusBgAwTAsGwnB6nwsxQeUhart+66-gBYBulyzSHg2w6BhQ-DWPwkYtoq8Iwt23ihOEkTRO4cQJMkqQErBX6puuqCqKa-g5hSzK3AW45wUxRSsSa-hbpWPy7pyjQHryoDtMO4QUA4qy8KKgpOLYMr2JE2HYjEXghF4LaRB+tJ2vxLFsXQs6GsaZqYBa6BWpqjFpuZQkid81YSR66EyYgjjuHMb7WNR2IwrwpjdrMVgWP0phQlK8RRMZyaUFZ6B0OgYAHJceooZJaHSYYJhxbM8odp4eGtlB3bmNYYRRcpI6zJV8TJROyB-ugoEcRcXFUk5dqdaB7kun8e6oTyIK+ZMUQKbV8JxNMUIqjK7ihJ2eEthYeEhLMbVwUNrCWfq1kLnZS4DcSh1gCNO5jV5UlTUVCDWAIFDmGK-kqqsUGKrwGkjjYUTRCEsIwoK+10qW2bkr11z9QxezQ7dYn3bWBVPe0ay9PYca2M10b2MF3gyg4QoGVtdixLjMJeJDeyZVm7EgVgeXeYV7TGP5MwwhK8TrHpRPqQE3rmEK6yvpYAgeJ4-T09I7BkMQsCED1eZ9Txn57IrpDK4QKOeejk1Hp0dilQKEsCETUT9Kt3g40TYYxgZkamPLQHmWApAQGzj0m+Fr69N0qpRQZYZxTKxguI495OPYb6vhYCIpHRpDqBAcAGJdYBG-W02dJEdV9AMQwjLYYwix0irynF822IpzWeO7Mi0LnPnPTGPQSm4zXBfYzVfSRwU2GGbb4wsfTN-a2htxzQQnve3gvgsmmuLM3b8AZ96YuEI7OIG3hT0xs+Y-yUH3vXRMLJYjhRfYkdCuYtfxY+vAE27dHZ2uG5ZifR6uP0C+DgRQ3zvqGUqINy4ESlOiRwR8fz-kAn-DCfQIRwnmPER8cJogRUrmsfgNhcZ9H3mFPC8DmKCQmBNPOHdlhnmGHCBYmJ8a+ErspGOm8Qjx2mGsGMZDP6I2kGlZB011ilTjHYYc+NaqChjN2OMYRIj9Hrq+OErgp7XRER3cugVJahw+m-CIMpLAQkFEME8cJIy1WbtDLRnMD7vXhJ4bua0MSkwXv0IhelVhUzpgI3idJGYQCoflY2DZTYLBsPjeusxaq40FKTFsEYojRjDNiVSvBm46z1nYkwMY4rvUEMFMWwxujWG7AIR+Qt3Ankvt0FOSQgA */
    id: "cart_machine",

    initial: "ready",

    context: {
      save_index: 0,
      chosen: [],
      track_info: null,
      track_to_save: null,
      counter: 0,
    },

    states: {
      next: {
        after: {
          100: [
            {
              target: "load",
              cond: (context) => context.save_index < context.chosen.length,
            },
            {
              target: "finish",
              actions: assign({
                results: [],
                message: "",
                progress: 0,
                auto_search: false,
              }),
            },
          ],
        },

        description: `Iterate counter and move to next item in the import collection.`,
      },

      commit: {
        entry: assign({
          message: () => `Saving video details...'`,
        }),

        invoke: {
          src: "saveVideoObject",

          onDone: [
            {
              target: "next",
              cond: (context) => !context.track_info?.stars,
              actions: "incrementSave",
            },
            {
              target: "cast",
              actions: assign((context, event) => ({
                track_to_save: {
                  ...context.track_to_save,
                  ID: event.data,
                },
              })),
            },
          ],

          onError: [
            {
              target: "error",
              actions: "assignProblem",
            },
          ],
        },

        description: `Save video record to database and return the ID`,
      },

      cast: {
        initial: "load",
        states: {
          load: {
            entry: assign({
              message: () => `Getting models...'`,
            }),
            invoke: {
              src: "loadModels",
              onDone: {
                target: "apply",
                actions: assign({
                  stars_to_add: (_, event) => event.data,
                }),
              },
              onError: {
                target: "#cart_machine.error",
                actions: "assignProblem",
              },
            },
          },
          pause: {
            after: {
              1999: {
                target: "#cart_machine.next",
              },
            },
          },
          apply: {
            invoke: {
              src: "castModels",
              onDone: {
                target: "pause",
                actions: "incrementSave",
              },
              onError: {
                target: "#cart_machine.error",
                actions: "assignProblem",
              },
            },
          },
        },
      },

      error: {
        description: `An error has occured somewhere in the process.`,
        on: {
          recover: { target: "load", actions: "incrementSave" },
        },
      },

      curate: {
        entry: assign({
          message: () => `Looking up video details...'`,
        }),
        invoke: {
          src: "curateVideo",
          onDone: [
            {
              target: "commit",
              actions: assign((context, event) => ({
                track_info: event.data,
                track_to_save: {
                  ...context.track_to_save,
                  title: event.data?.title || context.track_to_save.title,
                },
              })),
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

      load: {
        invoke: {
          src: "loadByURL",
          onDone: [
            {
              target: "curate",
              actions: assign({
                track_to_save: (_, event) => event.data,
              }),
            },
          ],
        },
      },

      ready: {
        on: {
          start: {
            target: "load",
            actions: "assignChosen",
          },
        },
      },

      finish: {
        invoke: {
          src: "refreshList",
          onDone: [
            {
              target: "ready",
            },
          ],
        },
      },
    },

    on: {
      append: {
        actions: "appendChosen",
        description: `Add items to the import list`,
      },
    },
  },
  {
    actions: {
      assignProblem: assign((_, event) => ({
        error: event.data.message,
        stack: event.data.stack,
      })),
      appendChosen: assign((context, event) => {
        return {
          chosen: context.chosen.concat(event.chosen),
        };
      }),
      assignChosen: assign((_, event) => {
        return {
          chosen: event.chosen,
          save_index: 0,
        };
      }),
      incrementSave: assign((context, event) => {
        return {
          saved: event.data,
          message: `Saved ${context.save_index} of ${context.chosen.length}`,
          progress: 100 * ((context.save_index + 1) / context.chosen.length),
          save_index: context.save_index + 1,
          track_info: null,
        };
      }),
    },
  }
);
