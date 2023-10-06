import { createMachine, assign } from "xstate";

export const videoMachine = createMachine(
  {
    /** @xstate-layout N4IgpgJg5mDOIC5QDcCWEwHsD6BbAhgMYAWqAdmAHToA2YAxALICqAMgCoCSACqwKIBtAAwBdRKAAOmWKgAuqTGXEgAHogC0ARgBsAVkraAnDp0AmIQBYAzKatCrAGhABPDQHZNQyptO6PVt0shS0MAX1CnNAwcAhJyKloGAHluPgA5YTEkECkZeUVlNQR1KyNKUsMrXUN7AA43c1MnV2LdU00DTQtNM0D20zdwyPQsPCJSCkpcAFcaeQk6JjYuXkFRZVy5BSVsovVbDt9qw2Na20DHFw1azVqDQ20Laos3OzOhkCjR2ImqGbnUAsGHwACKcdiZDbSLYFXYaLraSjmBraUoDbRuQy2ZoaAKmby6WraTRtXRWIkPD5fGLjeJTWbzRYpdKQ7KbfI7UBFQxuSh+NzHB7GXSo2o44raWoWShCSqWWpCbSyqwvKkjGlxSYQABOmAk2GplAwsjAhFk9BUsFk+BNlHwADMTdqABSaACU9GpY01VB1eoN6qNYBNZtZkmhHMK7nslEMFksVR5fl0Fgs4oedwspilHjjQl0ZIsaui3t+Rt1+sNxtN5st1ttDqdro9Xp+dL9lcD1dDmiy4by2yjxR6qMobhztT8j0xhjFVwQcf0gU0caxqMMBaLEU+6tL7YrAeilBomD1lEwyDA2voEEUCTIyEwAGsqK3aVqD4aT2eL1eEORH0IG1tkyMMcgjQc4WHbpDCRMlaknKolUqcUqmlIJfG6G4ENMYtvnfX1P0Db8JEoCgVFrK0bSoRsr1dYIW13NsP39L9T1I8jZDA9lIK5DRkUzXR7AsJUuiEUwN3FRCDCeKoVweNwBVqPCNTLDtDywY92LIsAKItKiG0dOjPCERiS2YwjWOI7TOIEXsoQHWE+OHRT8VOUVAiEuwmnnIlpR5UwMU0AJHkVXDtzfH1yyso8SMoK9dWvOtqLtIyXQsE5DDM-CovUtizwSzBtW4iCnNUeETkRV4dGJHorE0BpdHFHxJUoF4CxJLFTCeESVL3FjO1i7SoEwG872oB9n1fJiCOiwbNLikb-0moCOVA9Y2VKzlyuKUxuq8WdAvE4JPFnZr7FgwLCVTcl-GzPqLLmjTMC0s8RvoQrtUoBYbXtIrcEoSK1KIoa3swZbAOAxR1r7cDHO2vZfFlJFzksawdDJJr5xazMBV0Tq9p67QHtmvKuwrMbJgAqbAZm3KQc0jsIcwVaQNEEr4aHeSDCEHQsRa1MavTUo4JFKVzBEoldBJ+mYsZinPu+mhfv+2nzNJhmXqZ6nWeh9mNv7GEEfhVNvFujxzBFMLmvaKxynaFMfEsBoBRl4H-VwTAMBoSn70fF81Zy939U973md1sgYYco2hyEjolSsWcsQLM40PFV5-MU2p+duVFpYiumy3wCAIDwL2wBoIMQ0o+saLS5tPULuli9L0OK6rmsOZjqCVSEXlFMeer8zabR08eNryWH7MMWzfPhnVqKW7L72O7NfTa9Spt3Ubhei5L5f2+7Lj7M2zme-E+Pbl5gVB9nsfeXaLpKilG43D0N3m-3tvK6P9eUtol028gaf1buXH+wZO6mFhjxMqRR6r4z5BlBq5IbClCxi0cwPQZQFhVFnYUykC67xAQfSuhBtRgBSuQWAV5zS3ippNAOwDJhL2-pQMhFDbRUJoeHKGkd9bQK2kORMsFuhvxJHYGoklsZIJlJYYKbQk57QIfPIOxDWHsMoWQah2pzSKx+rIP62oAZMJol-MBbDyGaO0bIHha1+HR0jD3bQo5PL5lsHtNwGVmobi8AhZxqZ8xdGqMoncRDmFmJXho20JBTRPgAASoHtHE7+cTdKoCtLAX2E1-bTTCaY0BkTLHROILEhJSSUlpIybYtmIgu6OOconV4lBaghWzE7FcmgbbjjHMSEShJtC+FuIMQhqjwkFPblEqgMTCDxMScksBqSVDpNkJkuhfsaYmLtBEiZRSpklJmWU+Z3tFnLNgNUvWtST6G3qTtboKo2qVRTNmVMApmqKTti8DwFsUzXS3Co1SajzGTOoE6aicSyD4FwHAegdTeK3PJIiYkqJXhoV5nOFoPh2jNOCJiEkPhAh-NCaM-JJCLEcISKCk04LIXQrsgIs+zlBYdFnKUeSFgWkDPFBlLwvhUSKkJOYIQ9QrAfzGaSluIKrxgu-pk2FsDECBRJN4AZAxgpWAqJ49MXQkS4r8A1EUPQQmbJYeYiVcgpVUplTCq5cNu7ORqncScOCjDiQVA0YWvJgh+FtonfMrsRkArFawiVLcjkVzibITAcTqRZOpowpuQbTUly2RAMNNAI1RupOcvhtSDa2puUUAY5Ixw3BXC0pB8Dmo9HxCSdle1LZurnkSwNJLg3JtDSkyN0b1QfW1IlJWKsjGBxbSm8V7aS5pozd26I2ao6nztTtAYGVZENQaLW2U6LEBPAfrzOM2caj2ACMM-5-VW3mLipxP+hkt4MR3sS0drCL26S4nmmBxsEA2CeHyScG55L5j0JcDBLxESKgCEhW24lCXGu2ZXJ9elkrXuMre6D4zYM2WfXShxcKiiO3KCmHCZwWnZk3QgXwWKfA6FkimKo-qT2PRNSvOKn0r11ybBlE42UR0MfbkxvtRU5XvvjFKZp3kGp7XVYpcUzz8RGAygqeMxJZzHubaeh957hqjTWdkjZCaz2MY07O+x86C2IDQV4XmK4jD1HLXoKTRgd2zm6O0OMdgm0odJYtUaejlYGNVu5x9Bmda8Lndc7DpnVV8luAatoe1MZSaJB0XdARgiKmzqKqg5D7TkNgMQMimB5D2mcHEkg+AyAwBY5vYyQlTJ3pHZl7LuWyD5cSUVkrZWwACaHC0u2LS+7kl8F1F451WruPk5KYICERUBtU-VuAuXqFkFTbNnLcSZBQAhT7LTcbcn3uW-NsAi24l7dW6gdb+AaCGdzfShdRR-FjmzOOcc3RjokfG7GIKWIHjPJOOl88EgDuQHoAAQRBCCTrUEJKePtsPDK7R6huHFPsBUY4GqPG6hJk4ynNl6gBxAegIIABKKRweMuzGbflwSCyBEMKhSc5RTpvwxMKiTv2ccUDxwTvgjAkgADU1jXZM8OPa2L2h908WWjEXKycrmEl9gUV9ibTcemzyA8U+PXk5wAYV53wAnJOdpaGed4CSxGPAExI+oDciJktnD6RiEUrP-vs60sXcgUBY0MJ2yOlXEAXcQDd5d-XewGrxxFB1bOimSNOwMEitoKpEzi8d7jv3bve39v0YY4xum-vJ5PK7srgfX2CKglobyxv8WBEnJOBH851BKhRygqoCoBlx6T87vPGA8ea9YEkAAyvzrD8qECBH7vVeMuLOo3ERz4tq+NqtT3xeEbcTWMDwGyCYwf779jLnu4SYK1hPHEcR54awzTK+3DuQfqbdHZqJE30OEo1Q2pEjRb4ckZxOm143PobOWYb4vwG1+3+EZDAHvxL0tgME8UlHEx+XjDTFrxTERBaR6BXBVG6mwl+zJmiDAOcn2AA13xuHj0PwQnFCVGlFcyGUlAzhVEwM1jV0ShwINzVSREXAs3jALCumahuj5HVUnA8UlHH1oLli1ggTNEYL2FEgJB5AQitxVElFIOMGxRi1lFVWqHChv1lnmhehInEP4iVCXF8EIIPyzBIPnEZ28FkiGRFAeF5iEK0NelIl-G1F0OgjfnKBsFsBTExHeUA0QCrxlEUixFAzIKxDsOegcJ0gohcK0BODuGTHxjxmXF8GGy8FhzkJuDaFTHUJU0eiwIWm0k+miPEzuElD0GnilHEh8gxQkn0GnlKEUgHj7myM2TyO0I0yKKpwIP3wCBMKj3sERBOFsEnDtz-zCKrArGiL5h5guEowS0VC1X0Hj2MD0CCUwjCO-hcOsFggaG6C6FeEfnqHFDDz5A8AQk8VzEUk0F+24xoBcMGVgjMFVXVQ1XgIwSxT1XZWTFeCVFeGuJg1XlkBcPj3xClHxlRHMAGQCC5WzmaWcUhIFCeD4Lc2zxuLJWoiBLJFSPqCxD8SJGcWGw6DsCFWnECGJCFT+NQzRNtEKOMzCw-SMFgklFQXVUVD3RIzhztg3C+XjBVGCmaJRP+OBS4R0QxO6XZUxGI1KPxOxguD5D2kOjxHRixwFMpOBWmVmXKQWUqRWU2OcTthvgGGCB5KEnQUQB8BEmaSzACCJEex5EVw0L3lVN2UlW1DBQhShTX1CyHzRE5IQluEqB6LfhthTB4MyItjjDqgpNJRpK9PfXREuj0AyheDQNlFQmRj7jxX3S+XfiV1mlRJbjuJFF5EeP8HVXs1eMQGqF5FnB6ExBVBuCeH5LyTUxXjNUpTADTU9PzTpMCmFxeHjCFFt3LRtlHFCidRqFRyjLbV9w7QWS7WpDuOcUWOzFnnQK+V8OHxhJrMVGcUVSbPvVRJ0NpO9JXF5EJGqHxhOH-TJCk3gT5FRD0FlBEiCmvxyLzP+Lg0BOPME3zBKNR3xiJENPZL6GaWMAG08T6SnPUwKnVyBOzmrMCPxk8DEVHnnGI3xG6mqBsCFRNxoNzMXg-PaO-KEV8F5F4OzluDkmuikx3zNyEiMGtKXV+z2xcLaEdTUNOHsG8OFmlH2LfiPTXHJPwrLD2zywK1a2IFKxgBcJMjPPDL7nGyn2xh3LHBsBuGnG6Dk2YrACyzm0oAWyWx0oaxOzO1uOIqginGaQ4qvgCB5GGyqjUso3FwyntLfKih90mKEwCIbLDMnER0Cn1IRDfgynjxVCg2zx93oKKkmOzC8AaFnj0CVFZOPzcPaBEmsDf2JDfiNQiqd1Vw7zd0mNKHM3HFWJeD8uxhFj7lfl5n6zOFcuxzyt9w70gBcMCC8AFR5CFXf36C4I6AQg-yE1TBqC3HCCAA */
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
      IDs: [],
    },
    predictableActionArguments: true,
    preserveActionOrder: true,
  },
  {
    actions: {
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
