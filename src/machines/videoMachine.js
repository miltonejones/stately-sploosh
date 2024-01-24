import { createMachine, assign } from "xstate";

export const videoMachine = createMachine(
  {
    /** @xstate-layout N4IgpgJg5mDOIC5QDcCWEwHsD6BbAhgMYAWqAdmAHToA2YAxALICqAMgCoCSACqwKIBtAAwBdRKAAOmWKgAuqTGXEgAHogC0ARgBsAVkraAnDp0AmIQBYAzKatCrAGhABPDQHZNQyptO6PVt0shS0MAX1CnNAwcAhJyKloGAHluPgA5YTEkECkZeUVlNQR1KyNKUsMrXUN7AA43c1MnV2LdU00DTQtNM0D20zdwyPQsPCJSCkpcAFcaeQk6JjYuXkFRZVy5BSVsovVbDt9qw2Na20DHFw1azVqDQ20Laos3OzOhkCjR2ImqGbnUAsGHwACKcdiZDbSLYFXYaLraSjmBraUoDbRuQy2ZoaAKmby6WraTRtXRWIkPD5fGLjeJTWbzRYpdKQ7KbfI7UBFQxuSh+NzHB7GXSo2o44raWoWShCSqWWpCbSyqwvKkjGlxSYQABOmAk2GplAwsjAhFk9BUsFk+BNlHwADMTdqABSaACU9GpY01VB1eoN6qNYBNZtZkmhHMK7nslEMFksVR5fl0Fgs4oedwspilHjjQl0ZIsaui3t+Rt1+sNxtN5st1ttDqdro9Xp+dL9lcD1dDmiy4by2yjxR6qMobhztT8j0xhjFVwQcf0gU0caxqMMBaLEU+6tL7YrAeilBomD1lEwyDA2voEEUCTIyEwAGsqK3aVqD4aT2eL1eEORH0IG1tkyMMcgjQc4WHeMvFuTE9F8JNqnFKovD8PEbALAY2i3YYSzbD9-S-U8JEoCgVFrK0bSoRsr1dYIW13AjfU-QNv1I8jZDA9lIK5DRkUzXR7AsJUuiEUwN3FScrAMJ4qhXB43AFWpi2+d8WKItiSLIsAKItKiG0dOjPCERj8PU8tNKPdidIogReyhAdYT44clPxU5RUCIS7CaeciWlHlTAxTQAkeRVTFUjUyw7Q8sGPbSr11a862ou0jJdCwTkMMy1J9SzO2shLtSS7iIOc1R4RORFXh0YkeisTQGl0cUfElSgXgLEksVMJ4RMivdCIKuKbKgTAbzvagH2fV8mIsmLiLPUb-ymoCOVA9Y2TKzkKuKUweq8WcgvE4JPFnFr7EMJE9Clax6hC7N+uY-LYsweLFrGxLMG1SgFhte0vtwSg3zy+atPe5bAOAxR1r7cCnO2vZfFlJFzksawdDJZr51azMBV0Lq9t67RHrm1ijw7cbJgA6agdmkGybijsIcwVaQNEUr4aHBSDCEHQsVa1NavTUokQLSUs0sSU9BJ+mrMZit6E+77ftkf7tUB4HooZ16mep1nofZjb+xhBH4VTbxySUnx8yVbRfJaHwQvKdoU2tl5sJlrX-VwTAMBoSn70fF9afM2X9R9v3mf1sgYcck2hyEjolSsWcsQLM4qjTedXgCpTan525UV0T26XwCAIDwX2wBoIMQ0o+saPS5tPTpssy4riPq9rmsOfjqCVSEXklMeBr8zabRxTcR52vJMfswxbNi+3TXS-Lyu-e7s19IbtKm3dFvQ7btfO5r7suIczbOf78Sk9uXmBRHxfJ4xJEeky8kLBuKel7w3Kj47qup9gw1m3qlWiLp94r0mO3deXcz4CFMLDHi5UigNXxnyTKjVyQ2FKFjFo5gegygLCqPOwoVLL1bqvABG9CDajAKlcgsArzmlvFTKawcoE0WPoAygtD6G2kYcwqOUMY6GyQVtIciZLrdCniSOwNRJLY0wTKSwIU2ipz2uQ3+UUqGwJrnwhhZAmHanNErH6NA-oAxDn-XRJ9eF0MMcY2Qwi1piLjpGfu2hRxeXzLYPabhMotQ3F4WoRJHjxnxk8WcJdoHcJoQ420JBTRPgAASoHtCkk+KTdKoCtLAAOk0g4zUPrYnhBjEnEGSWkjJWScl5JcWzEQvcPEuRTq8SgtRQrZmtiuTQLUBh3FkSJQkdt8b1BiVw6hXdylUCSYQVJ6TMmAOySoXJsh8msMDjTThdo4nTISbMyp8zqlLL9istZsAGkGyaRfY2LSdrdBVO1KqKZsypgFC1JSMkXgeA8L4J4N0Jm7Kmfog51AnTURSWQfAuA4D0GabxB55JETElRK8TOvM5wOz2h0BUg9hQ+ECLhHcJTYkgvsfwhIEKTRQphXC+y4ir4uUFh0WcpQFKfzROKTKXhfCokVIScwQh6hWCBTAux7dwVXkhSffJCKUGICCiSbwdsBghSsBUAJ6YuhIkxCSX5IoehaJJTYslejgVSu1DKwBcrblwz7i5WqdxJzEKMOJBUDRha8mCH4doGqajJjFXsmukr26nOrik2QmAUnUgKdTDhlCzUSvLsC8NNBI3RupFc0RTSjb2vuUUAY5Ixw3BXJ0zBaCWo9HxCST+e1zCEkHj-E1Oik08NDeXNNGaY3qkVsVL65jLHq2sa2yZ5qO0QC7VGnt0Rs2x0vg6naAxMoqMag0WtsosWICeLyAhcZ841HsAEQYFDSVjrsTZTioDDJ7wYgfU156eGXt0lxPNyDTYIBsE8Pkk4NwKRtmScUPUp4yjRVUO2IVxLEp2eKp92kr0pRvcZO9MHg1vQ4i+hl7jEVFFduUFMoTszZhsKEoDbQOiO0eJjawgbT0PuBeamyStr2NybJlE4OVR0MYvUVEqb6JFQXjFKDpPlGp7Q1UpIDUp8RGEygqeMxJZwnu0QNR9G8RpjU2YU7Zia1Ndw03OtxC6C2IFwV4XmK4jD1HLXoIDRhd2bu6O0OMdhm2ofJRpvtSVB2qyse5xj2klp6xEfOu5OHTNqr5LcQ1bQ9qYyk8SGUK4AjBEVPnIFdD7R0NgMQMimB5D2mcCkkg+AyAwBY7vYyQlTL3q45l7LuWyD5fSUVkrZWwDyo-Z0mSnTB7kkQoTNw502p+Pk5KYIoTRV0bq2ALLcBctMLIJO+r82UkyCgNC-2Wn43FPoytnLlBFvLdmw1tbqANv4BoIZ3NjLF1FC8dKBo1nxzdGOluhA43YzBSxA8N5JwgV6jABQCA9AACCIIQSdaHBJAJzsx6ZXaPUIb859gKjHI1R4PUJMnGUy21T54JBA8gPQEEAAlFIUPBPZgtgK6oLrAiGBQpOcop0p4YhFRJgHhPgf0FJ3wRgSQABqaxbsmeHHtDpN9B4BLLRibl1OVzCV+wKO+xNpv48B8DygzG+cAGEhd8FJ5TlyWg3neAktmO6BN3vqA3IiFLZxhkYhFFzonEB4pl3IFAON7Ddtcc15AD3EAvfXeNztLQHgDAik6vnRT73rYGFRW0FUiYZeu61yeT3ZWvMDpVmrDWumCdu6DyH4LribvYYVcOHy5vCWBEnJOZHLR1BKnR9gqoCpRm2HT4HzPGAQe69YEkAAyiLyvH7AhDwavGPVXUbjilt0Jdq+Nqtz0JT393ffA8kFPEw+F-GmU7WJAdBo7RouzxTi1MkX3xICnzAEiSbnC8B835gMugfphkBPPM4n3+nxh6KDOG9XQnulCWnCb0VRsBE3ME6QUiFQLA3yD232IF3wYCw2M3CwQE8CCj5G6gGExACUFSvxkgeFvyEj8CzA3EQK31fx-xB0-z-wAMQGwMuhvgUWd0b25WFQMH62n0ajaCnnCG3CawwHgGyE4XHyHH2GXDHF8BuBTwf1IxR08GsA6XrxxRsEamNR2USEkKghKGqHaiJExV8HJDOD6RRw3H0HzizAfilDOGqCBX+EZDAD0JNwbQMACUlHExTBTEsAXxTERFgJ6EqCzE-luCBVBmiDcPDyCmvyankOsEUPeyVGlFcx8kxGsA1TVxUyeiiLiiVhiL2HVSREXAswiXHjwWYNTBkjJHJFiynilEHkiO1k3lkCKI0FEgJB5FCTtxVElHFCMFxV8XMCxA8GqAinVzyNaPYg6N2iVCXDkJCiSKzCUJaDZ28DkmzD63MO0ML3yNehsl-G1DmK0BeHtxsFsBTAIPRSkkJBlCUixEVFKBCEmNyNJjlkOPgxfVOIUjuGTHxjxmXF8GGy8AR36JuBwizBaM+PQ2137ROIwKr32FsDuCljaCJCaL2n6Q3CRCJFKCUmHkHjeLx2mNhI01OKOCHiWIUNWPj3sERBOFRMCJFFsJhKGh1grF+LKCVAuB0E-mPwnnnGFHKGsGMD0C6FJGg32IPBPjmLFNkO6C6FeDP3qHFGjz5A8FCQCVzCtiDRBTmN8BXBVX8XVU1SznwXaE1NrXgixDCT2LPW4x4TPjmJT3xClHxlRHMDtgCG5Xzg6S8R9IFABVJH1PNRmVdLJDBPqDtMxMDOGw6DsGFVuF6mMCCjDLsRmXhKSldKMEuklBwQ1UVH3Xe0RxIL8EanjBVHugzLKTBUERMUjPHCMMxEtyli8U+RjFi0OjxHRlx380zLBTmQWRqWWTqXWXlK8RkgfgGGCCrPIP6REg6SzACCJHHAIJyNJIslg3iUpUtUhWhVhTELCyrzRBINCVuEqACHOP6RTD5CqGAx8DjHqlrI3kKKRI-XREujiMyheBVFGJQmRkHhJEvJ5Axyf0dJ3K7nbkNJFF5DMDVQ1XNPVJ5FjFLTsHRX6wdPoygpDRTTkGlRpVlUNNVXagCVlCsx6nLX6VHDChdRqAx1fOgpTTDSyWnWpBIr0GdjOEnCot+UuHWP9NnE8EDKVRJIHLgz1FdJXF5EJGqHxhOAAwEsgOVRFC6TUvxk0CYprmfQonlPzDRPAsLlnNLL6A6TTOqACWGW0rhPfJPI-XJFQp5ExE0sHlRSkzOCRCiRsGFQtxVBsopI-MkV8F5A1V6NuHkkJAtMVRkI8BJGLNXOXQyxO3mzmIxI6QmNOHsAIOFkexI1lExGFRsH7ML320a2a0K2K2IFKxgDmJMlkr+RqEaOTOG2qhI35Jlzk2SrmwOyOxSTKrOwuxoDSpA1-QkjvgCB5FarHHaunG6Eyk3J2Rf1+NQlr3wOFTkogPmOnIRBnwkgukWuf250DzsvzUwNNzR1P0nD0CVGLIXwx1fhEmsFMOJEaOoLf2DzK0pORkvKR2JFTCbRtztjQpqhXABS8VeEOsdJfyQIgDSuBsClVLJAVEvxRxFlFC6Giw3CuK0qmIshhpoN4RQOkFcKCqgi9PNzHi+XaA6m5UuiJELmtlKFRGlOhuOtf3f3dwYJZhfDhrJpcgputgLGpuVKqIQCOD5BGREgxw8Hv3es5vijoLqrRii0eRVCeBTBsDI30HTkeFeuCnCiENCCAA */
    id: "video_machine",
    initial: "idle",
    states: {
      idle: {
        on: {
          MULTIPLE: {
            target: "multiple",
            actions: assign({
              videos: [],
            }),
          },
          OPEN: {
            target: "opened",
            actions: assign((_, event) => {
              // alert(JSON.stringify(event.video));
              return {
                video: event.video,
              };
            }),
          },
        },

        description: `Drawer is closed and waiting for input.`,
      },
      multiple: {
        on: {
          MULTIPLE: "idle",
          EDIT: "opened",
          OPEN: {
            actions: assign({
              videos: (context, event) =>
                context.videos.find((e) => e.ID === event.video.ID)
                  ? context.videos.filter((f) => f.ID !== event.video.ID)
                  : context.videos.concat(event.video),
            }),
          },
        },

        description: `Handle multiple items somehow`,
      },
      drop_video: {
        initial: "detect",
        states: {
          error: {},
          detect: {
            after: {
              1: [
                {
                  target: "drop",
                  cond: "request has no videos",
                },

                {
                  target: "loop",
                  actions: assign({
                    loop_index: 0,
                    video: (context) => context.videos[0],
                  }),
                },
              ],
            },
          },

          loop: {
            initial: "go",
            states: {
              over: {
                invoke: {
                  src: "refreshList",
                  onDone: {
                    target: "#video_machine.opened",
                    actions: assign({
                      videos: [],
                      // open: false
                    }),
                  },
                },
              },
              next: {
                after: {
                  100: [
                    {
                      target: "go",
                      cond: "more videos",
                      actions: assign({
                        video: (context) => context.videos[context.loop_index],
                      }),
                    },
                    {
                      target: "over",
                    },
                  ],
                },
              },
              error: {
                after: {
                  4999: {
                    target: "next",
                    actions: assign({
                      loop_index: (context) => context.loop_index + 1,
                    }),
                  },
                },
              },
              go: {
                invoke: {
                  src: "dropVideo",
                  onDone: [
                    {
                      target: "next",
                      actions: assign({
                        loop_index: (context) => context.loop_index + 1,
                      }),
                    },
                  ],

                  onError: [
                    {
                      target: "error",
                      actions: assign((context, event) => ({
                        error: event.data.message,
                        stack: event.data.stack,
                      })),
                    },
                  ],
                },
              },
            },
          },

          drop: {
            invoke: {
              src: "dropVideo",
              onDone: [
                {
                  target: "#video_machine.refresh",
                  actions: assign({
                    message: "Deleted video.",
                  }),
                },
              ],

              onError: [
                {
                  target: "error",
                  actions: assign({
                    msg: (_, event) => event.data.message,
                  }),
                },
              ],
            },
          },
        },
      },
      drop_model: {
        invoke: {
          src: "dropModel",
          onDone: [
            {
              target: "refresh",
              actions: assign({
                message: "Removed model from video.",
              }),
            },
          ],
        },
      },
      add_model: {
        initial: "detect",

        states: {
          detect: {
            after: {
              1: [
                {
                  target: "create",
                  cond: "context model has value",
                  description: `Look for a "value" prop on the model object to detect a name.`,
                  actions: "resetCreateCounter",
                },

                {
                  target: "add",
                  cond: "video array is empty",
                  actions: "resetAddCounter",
                },

                {
                  target: "loop",
                  actions: assign({
                    loop_index: 0,
                    video: (context) => context.videos[0],
                  }),
                },
              ],
            },

            description: `Detect param type for this iteration and route to the correct state.`,
          },

          create: {
            initial: "iterate names",
            entry: [
              assign({
                stateName: "creating new models",
              }),
              "debug",
            ],
            states: {
              error: {},

              insert: {
                invoke: {
                  src: "createModel",
                  onDone: {
                    target: "iterate names",
                    actions: ["assignModelID", "iterateModelCounter"],
                    description: `Mutate "model" to remove the "value" prop.`,
                  },

                  onError: [
                    {
                      target: "error",
                      actions: assign({
                        msg: (_, event) => event.data.message,
                      }),
                    },
                  ],
                },

                description: `Create a new model and return the server response.`,
              },

              "check if model exists": {
                invoke: {
                  src: "checkModel",
                  onDone: [
                    {
                      target: "iterate names",
                      cond: "model name was found",
                      actions: ["assignFoundModel"],
                    },
                    { target: "#video_machine.add_model.create.insert" },
                  ],
                },
              },

              "iterate names": {
                always: [
                  {
                    target:
                      "#video_machine.add_model.create.check if model exists",
                    actions: "setCurrentModelName",
                    cond: "more model names",
                  },
                  {
                    target: "#video_machine.add_model.detect",
                    actions: assign({
                      model: {},
                    }),
                  },
                ],

                description: `Iterate over the name list and create each one`,
              },
            },
          },

          error: {},

          add: {
            // Natasha Nice,Spencer Scott,Kyler Quinn,Juan Small

            description: `Apply model ID to track ID`,
            entry: [
              assign({
                stateName: "applying models to videos",
              }),
              "debug",
            ],
            states: {
              "iterate models": {
                always: [
                  {
                    target: "add model to video",
                    cond: "more model ids",
                    actions: "setCurrentModelID",
                  },
                  {
                    target: "#video_machine.refresh",
                    actions: assign((context) => ({
                      message: `Added ${context.IDs.length} models`,
                    })),
                  },
                ],
                description: `Iterate over the model list and add each one`,
              },

              "add model to video": {
                invoke: {
                  src: "applyModel",

                  onDone: {
                    target: "iterate models",
                    actions: "iterateAddCounter",
                  },

                  onError: "#video_machine.add_model.error",
                },
              },
            },

            initial: "iterate models",
          },

          loop: {
            initial: "go",

            states: {
              next: {
                after: {
                  100: [
                    {
                      target: "go",
                      cond: "more videos",
                      actions: assign({
                        video: (context) => context.videos[context.loop_index],
                      }),
                    },
                    {
                      target: "#video_machine.refresh",
                    },
                  ],
                },
              },
              error: {
                after: {
                  4999: {
                    target: "next",
                    actions: assign({
                      loop_index: (context) => context.loop_index + 1,
                    }),
                  },
                },
              },
              go: {
                invoke: {
                  src: "applyModel",
                  onDone: [
                    {
                      target: "next",
                      actions: assign({
                        loop_index: (context) => context.loop_index + 1,
                      }),
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
              },
            },

            entry: [
              assign({
                stateName: "loop over videos",
              }),
              "debug",
            ],
          },
        },
      },
      refresh: {
        description: `Refresh video list after changes`,

        states: {
          "notify change": {
            entry: assign({ notify: true }),
            after: {
              1500: {
                target: "send refresh signal",
                actions: assign({ notify: false }),
              },
            },
          },

          "send refresh signal": {
            invoke: {
              src: "refreshList",
              onDone: [{ target: "#video_machine.opened" }],
            },
          },
        },

        initial: "notify change",
      },
      opened: {
        initial: "loading",

        states: {
          error: {
            on: {
              RECOVER: {
                target: "#video_machine.idle",
                actions: assign({
                  open: false,
                }),
              },
            },
          },
          loading: {
            invoke: {
              src: "loadVideo",
              onDone: [
                {
                  target: "loaded",
                  actions: assign({
                    video: (context, event) => event.data,
                    open: true,
                  }),
                },
              ],
              onError: [
                {
                  target: "error",
                  actions: assign({
                    error: (context, event) => event.data.message,
                    open: true,
                  }),
                },
              ],
            },
          },
          loaded: {
            on: {
              CLOSE: {
                target: "#video_machine.idle",
                actions: assign({
                  open: false,
                  videos: [],
                  video: null,
                }),
              },
            },

            states: {
              choose: {
                always: [
                  {
                    target: "unlocked",
                    cond: "is unlocked",
                  },
                  "locked",
                ],
              },

              unlocked: {
                on: {
                  lock: {
                    target: "locked",
                    actions: "assignLock",
                  },
                },
              },

              locked: {
                on: {
                  unlock: {
                    target: "unlocked",
                    actions: "assignUnlock",
                  },
                },
              },
            },

            initial: "choose",
          },
        },

        on: {
          ADD: {
            target: "add_model",
            actions: "assignInitialModels",
          },

          DROP: {
            target: "drop_model",
            actions: "assignEventID",
          },

          REMOVE: {
            target: "drop_video",
            actions: "assignEventID",
          },
        },
      },
    },
    context: {
      open: false,
      locked: false,
      IDs: [],
    },
    predictableActionArguments: true,
    preserveActionOrder: true,
  },
  {
    actions: {
      assignUnlock: assign({
        locked: false,
      }),
      assignLock: assign({
        locked: true,
      }),
      assignModelID: assign((context, event) => {
        console.log({
          created: event.data,
        });
        return {
          IDs: context.IDs.concat(event.data.insertId),
        };
      }),
      assignInitialModels: assign((_, event) => {
        // alert(JSON.stringify(event.model, 0, 2));
        return {
          model: event.model,
          IDs: !!event.model.ID ? [event.model.ID] : [],
        };
      }),
      // assignModelList: assign((context) => ({
      //   IDs: [context.model.ID],
      // })),
      resetCreateCounter: assign((context) => {
        const values = context.model.value.split(",").map((f) => f.trim());
        return {
          IDs: [],
          create_counter: 0,
          values,
        };
      }),
      resetAddCounter: assign((context) => {
        return {
          add_counter: 0,
        };
      }),
      iterateAddCounter: assign((context) => {
        const { add_counter, IDs } = context;
        console.log({ add_counter, IDs });
        return {
          add_counter: context.add_counter + 1,
        };
      }),
      setCurrentModelName: assign((context) => ({
        value: context.values[context.create_counter],
      })),
      setCurrentModelID: assign((context) => ({
        ID: context.IDs[context.add_counter],
      })),
      iterateModelCounter: assign((context) => ({
        create_counter: context.create_counter + 1,
      })),
      assignEventID: assign((context, event) => ({
        IDs: context.IDs.concat(event.ID),
        ID: event.ID,
      })),
      assignFoundModel: assign((context, event) => {
        const models = event.data;
        const model = models?.find((f) => f.name === context.value);
        const IDs = context.IDs.concat(model.ID);
        const create_counter = context.create_counter + 1;
        console.log({ models, create_counter, IDs });
        return {
          IDs,
          ID: model.ID,
          create_counter,
        };
      }),
      debug: assign((context) => {
        //Angela White, Mia Khalifa, Lana Rhoades, Lena Paul, Gabbie Carter, Skylar Vox
        console.log('Entered "%s" state', context.stateName);
      }),
    },
    guards: {
      "is unlocked": (context) => !context.locked,
      "request has no videos": (context) => !context.videos,
      "video array is empty": (context) => !context.videos?.length,
      "more model names": (context) =>
        !!context.values?.length &&
        context.create_counter < context.values.length,
      "more videos": (context) =>
        !!context.videos?.length && context.loop_index < context.videos.length,
      "context model has value": (context) => !!context.model.value,
      "more model ids": (context) => context.add_counter < context.IDs.length,
      "model name was found": (context, event) => {
        const models = event.data;
        const model = models?.find((f) => f.name === context.value);

        console.log({ model });
        if (model) {
          return model.ID;
        }

        return false;
      },
    },
  }
);
