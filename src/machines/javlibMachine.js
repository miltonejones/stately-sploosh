import { createMachine, assign } from "xstate";

import {
  addModelToVideo,
  deleteVideo,
  findVideos,
  getModelsByName,
  getVideoInfo,
  saveVideo,
  toggleVideoFavorite,
} from "../connector";
import { getJavKeys } from "../connector/librarian";
import { getVideoByURL, getVideosByText } from "../connector/parser";
import { GROSS_WORDS, approvedDomain, includedDomains } from "../const";
import { HilitText } from "../styled";
import { LinearProgress } from "@mui/material";
const isValidDomain = (domain) =>
  includedDomains.some((name) => name === domain);

const validateVideo = async (url) => {
  const ENDPOINT =
    "https://sd03bu0vvl.execute-api.us-east-1.amazonaws.com/check";
  const requestOptions = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ url }),
  };

  const response = await fetch(ENDPOINT, requestOptions);
  return await response.json();
};

export const javlibMachine = createMachine(
  {
    /** @xstate-layout N4IgpgJg5mDOIC5QCsCGA3ANgSwEYDpsJMwBiWAF1QCcKBtABgF1FQAHAe1mwuw4DtWIAB6IAtAHYAbPgkAWAJwBWOQGZVAJgAcC1Vo0AaEAE9xGhhNX4AjMrlyGj61Lla5AX3dG0WPIWJkAMYAFqj8MIwsSCCc3LwCQqIIqlLW+EpSUgxaWtZaqVqqDHJGpghiGhpKGvhZRZbOEgx1nt4YOAREJKQA7hzUANaRQrE8fILRSc4yqvKpmrMM1pqGJuLOqkrp2stSKfoMKq0gPh34fYPY4aQQAmCE-OgcA-enfhcDV1AIV0+BqPF+JFhtFRoDEmY5EotlpqlJ9BIMgpskpSut7Ax8FoJAprEsHNCllJjm8CGxqBxAnBYAACF7GWCkahwMD0ZgjLhjBKTRDWaT4KrSLQouSC+xo8rWcwybJSBQ6CwKVIk9p+cmU6l0sAMm4Utgg9ic8E8yUWGQaCRNbGbVIuEprBCI-AMZRSvnyaRSCRaFW+MkUqmwWn0xmwT769mgo3jCEIaECuRSl2qJV46X2spiKSVWQHcw45QSZa+s7qwPB7WMtioACusDABpi0e5oCmegUNg0UiUCjUszkLlWmesthhXvy1iRPYkGhLaoDmpD5AoHAjUUNcRjJrxTXwCiL2RxULlzglYknGg7qih15T+75OTn-o1Qa1DMIFDA1ABYDfsHw9b8BANL8GAwgUDSlBgGwpCNmCW6tog14dqk8rOKK5iFEO4hKpiixFsK+TZhkT74GWi6Vh+X4-n+AFgEBIFgRBUEwXQ1jrk2m4tiIiAOHI+CqMsiY4kUfLqKoZ4jrkNhpvIGh8tChSkeRr4hlR36frRX4UtQNKUoENbMhApDCJQP74KgABmn7UAAFJsjgAJSkKSZELqplE8NRmlqdp-R6YEBlGXBzYTIhCAuFoWLZiksz5EohzYXGui1NoewKBlCjyUoPpeCcqrPuWtGWVcwHoEQYAcPgmAcM8NZsDS5UQJVNx3A8TwvPgrkqRW74lQxTWVdVtUDPVjUVRwPyPJSALjMCkYblyYU8RFUo2L2FjaIc2beme+gdvkTRKHoeyFM4ynub1-79WVE3DXVDWDRwrWge1zyvAVbkvld+A3eNzVVTVD3-ZVU1-LNAjAuxHJcctSTHRIWIWglmjwtC+5npUUXChkKjWPYigaNeF3fcVpUg4DI1jU9pB+dQZGYACln9AAtl1n09WTA13UDo2PRNYMzYC80cfB3FJLCVhZS6Kj3s4+N7TKGTZrkyL45Ys55d1l1c7dAP4OgqA4BANFPfgIRgIEAw0rwFDdCFsOxuhNSWsU8mpJeRMZuIR1Yllk7ul2rgSCTRVqX9ZuG8bpt3RbVs2zw9vQ1Gjvbt2NTwpUeyHHIDSog6Yg5VFVTNEszS5IJCihxRfXk5HRtEDH+tx9bzO6YEAifvwFAvfcvzvezfpfWHlER3dUeN5pZstzSbc0h33f0RQgv-MLzAO0tsZEwwNQZXUSzevkEkF-IUV6EoOIaImlS6FXWsczr4d1+PDcm1PsfBJbrf+QvXc97cr1+6dW1qTJ+3N9YTzfr+aen945z1-kvFeEMgTr2TotY04V5JOiLLMJoeIy5qAlLg9I+M9hZFcGrfG1cPK13AUNSBTchoz3gZ3JetNqA6QZkzVmg9SyP1Hs-CBr9GFVWYT-Vh3ckFryYBvDBK15R4V7JsTYI41AWglBaZ0Fp5CTmnIibQ1CfpjyEdHd+zcBAlWoCzGkUAKRBlIMYOAsiEIrSlMiLE3pFBZE2l2BQZ4MiI0tCmUhcpcRSkMbrCmBthFmKYRY7AVibF2MZPwDgzjxa8lsFYOYCJFDZAtH4h0ywrBF1yFCRE+1pARLAXrehMToGx3iYk2xXB-wdxrN3W4PR+AmTMp+Cy1kvy2Xwc5EBI9aG1Kqgw2JoimnWJaUGc2HAOkUC6Sg0WoUnaig7K6KEOh8gV2PsOSwNgvRqEsKKBKcpqkCLoVM+pUSF6WPmckpZKy1m9KoP0qyNlhlORcg-UBtzJnRNMQ08x-BnlJNaW8zpHBulsQ2ancKxSrCKlhJkC0OQoQaJzN6PQ9hsSe1ITciZUTpngriZChJLyYW8BZpVGsPd0lw15JYFCnjmjqBRsdTGeQSFFC9NkVwcp4Skv-LADAlKqqSvQGQABfdprAMBeMiVUqomyrAFIua68FqcU3tuPIHYL7IjcBfUUA585lHzPxSciIUjS0TNYcVAF1Vm01ewzhbBGYUDbmzMZNc1Vyo1VK7VkNdVIoNSiq+iMihKClAlLKug3AShHEUAUxRCgpEcPKRELrNWPMMj+Xub1lVD05mpAt08i2fjDesllTssjY2nKKWYSpexSA0dygSRZ43SFzpYYk99y38PfFW2ONayB0y4b6nhAaaFBulebSddaRYwyja45oiMsJuBTKKPE3sEBpsxOYPsx0lQ6GqPmt1sdUCUHUjRf4lBYJ6rFqyhA5g8TOiyimRwKQhIaO8QKScA4RWXnkB4YdfCgVjpvc3O9FAH2aSfcytB+q5FTEvDMLdp6UzVBxQ6Lsk4-bozsFCLsms2gjpg4ux5CH8AwAgizDgzVMA0iuMzEtQCPrUdVa64N096OMZpMx1j7HIWTX7qvHVMjX2bJNETDIzoBxFn3fJC1Xasr4AHHsL2OhEQhyg-OGj-Gl0oYY6yETLGwBsY489BVpaePQb4+O+D97hOiZs+J5mq7UGRow4gK+5haiykcPJDaGQNHCjSIUPGagRxVCvtegTt73OWc87ZiTnr+gzr9bw4zLm4NMKE+l6zmWfNSeQWulOG6kjySqAKXQhxlhHhyp2wjTQM47yaNkXElojhGcKoG0zdH70oas6xrjSqnMFeG654rY2EMTZs752T-mXF1cKPxDEWGHBhe7FFmcjXBI5QCb2QzVHnNzbADQEIs9-JgWwJQL4U2OozaGwuuit3gj3d0o9574RVsNoUy6GQ+LtB9Z0NeQ9GtgMDj0EsPIRH803eoHdue-3eDXAc9x-LH2fr1m+79mkmOvhA7Q2+reRMpa9e9LmnEEhU340xHsC+5h9yWHyCjonGPhBPax1AbL9NvXcKsXj4e12ecPb5wD74lXpHA5RWjHtmgezwlyMUdrZQexWBVulTK2VcqXdm59iAeo9KYEmf+LyGlfwcEty+9bGTkhylqPp7eswYqzC7ZsPcXZrzaAqdmSj+VePDbN6uC3VukN24d4i9dAWj2YmxFCY6k4Uhyhyl270tRk3pQYEUfQqgXUR4avb6PNuaLl9ghoJ376Kg1GmIiBR2IGdHMyemuwywqiKUDyX835eKbW+mzSUvr2B7zp+qXqPQ-HOj71EDuTyKVrVERuaxMLp5IKkZ4RnsaQ8g9lXxaY--fI+D6ev+VAbBvXGFnhgfoXlx9lqu6bgflvZ9X5v3fp41AvKL7r07CmAJNiDLCODiKolrh3iesUNyimPCMoCHpPrRNPpqiCk8jSg4k4kvrVusBDukAcDlJlKKHKBKAlIjEapoLoB7FlBaKfg1KgY8nMqQKkoritBUEpsKNmDvNvNULyg6PGlFN6FkH1niGnhdqHi-lPubgwWbNPjTDjtNuLhWpRCgVKiCnIQLPLjJqwUkGIH2AJGoCoF6LiAOB2qQSlHrneBlIbnQZBGoVEhoQDELrlnOiquHtIfYbIebk9P-gnhtuIFwTYJaPKF7DtFaogF6DUDaGEpFHKImC6ugYkmGNgDBI4rADoYgDntoKrsdCmNIDvOEUelsCmG4DODQYJI4G4AkXMpBOGMwWktgYnnas6OhGJAiM4FlGeMHrmOYPmBlBfMWINubMELVPWIxOBJBJ+KxI0f4ckNJIppsDkOlJoKeAXPjEAahFfA4DoITIgZ9CEKMb+KBBMSxLBBTvJuFHxAJEJHyE1mJOKGsUWDIPMMiI4MdC4EoKRHWF+OJmwEyk-u9vgN8bpFcH8cvFoeGmtn4c7noTUETAeEsLhPuD2JJHsPxDvPtJeK4J7EOsbgQPWMxKjndmZPTGIrpCSY7tCfXlfF+ssMiDFKRtYKQS6NpimLMDsPCPYHsUPASZBEST9iScMV-MThSfHjVonueLiFEUTFJDtPjEqMyR2GoLoDOLkJyQ4OIa5LyYTmjgKVQPTLzDSGNBSQoW9uLtqfyZMTQPdNbMafqb4eKbMZKZeNpujAlG4LnFhhKJngJDFAOLYF7PIIYl8DSNWN8cZMyLADWAyhkUUTvG7pweRk0GjJJKONFLkJUHyBYM0LiRIX4IkdYpQKuJgekTMc7jOPxN6PjLkLut2EyQXJ+vxGUh6KfBfLma5AWZMcWSwWWe+naLULot2B8cYe3uUPmFYKOBkKnl2EdJ4HlKks1PANEKSFSbGOwc0DYL+gyT2LiJjNeJiHiPUIQYoHkJqZ9F0GAKuduNeAJHhvDvoFfGqZjPkrUC4EqGjHaMXkMR8F8FeeFOeIUM6EUC6FKJkMiIsZJMQdpk8WzjiN2HfHiRLgun+WwcsLCPgeYIQRlMQYUsODnAJP7HkjkDiEpEMcoe+JXj5JWChUkIjC6GEoUPIMUAXjvEQoBR6IUPKAjN3i6pRb+JWvRMBMccxFMTRYgPGPRVJP2MxaOdCJWbnKmAUESNyZIbRHxVpBwv5PpIZJAGJQgLoGkEFgMUsIHiQQ6KkFsNwZ1jlF7PEWRaOtdIIpVHpVOetBqVtBkFimeO+X7OpmQi6A4F+YheRY5XcjadTBNHpdILvMdPJIcKjPMP4ickqIJBrLYNsghXmfjpEvXGChTHpXiMsNcRqRlBUntDeToPJPjMsDvPCEFVlUhUYk5fcnlTAsKbbCQHpZ+jspxRYPYK8ZsGeFaDYPujlPFQemeWHp9sYnUq1R-MKSwovN3AVc0GkIJCVciVoENbnARVgqIZfLQfZSZjNS1ZPGZjUQskuegrMQlpZZeL2FUFlFtoUXocRngjaPYOsfKC6idaCmdYwdSs0q8u0nCt0gVWJFothY9dkQRpmPJFYJ+urDZZUbnD9c1X9VAgDVCpdfgPSoyhQAVfpvgfopkOoNmYehUOmp+ikDZQSPoMltKitTnm+YiLorCFlIUR0TKFQb2A+ZipBsFQ5SNu6lKgVdTp2BkGhUdAlJzYUJiDrgePMNtAzYWrbuDV2LUIoKzYpD2FUD7miiEVKP2AlGoCrYJpQAVUqDUJvr+gXvMIejfIjPFr2LYEKrkGbalohupShl1QXlsAgWUTWXAZAR+rFiQtoCAf2gLQ1SFcLZ7RZkxmVt5hwL7fJHuLnEXrmhmSHUTO4gGezTSfbR7W5ohuNhll1cKC7IVUWAUuoPIF2m4HuCdhaHiKzipSbgTpabzvzr+Y6c7uplsJaCOPuK4DLMoKQcRm4maBlfCbYefhNFdehk6bMBLfYJyXsEUKKBoo4HRV2OjGarCK4HPe-hfjHlHnpcJEEUROlQ+bhYFiYendOBfIJPdUbjHULdPvPQDMPm9vPquHpe2MAbiD2BQllKkNvb2NsKdNmkWIiNHUgWpJ-SfQvRZNfpgLfpZPfr-p+CtVFOsWmi4KhPkHfR+iOCev2uFgSLiLYTIZFX3fXsUmvgQToFDWZWUBqbmNmHxEqP1nmkdXxqoXKmgXMnpWIJeunTLFyuRrYBKIoFsGlEUBHfiNmDQ54XdI4c5fQ2uVKJaBmioPoKKEsNUN6Y4NBZUBniiJYPVQg5RJ2ckWwHpZkM6DvLVV2Ijg4PWZmJsDUMKCRQUtwabUMQcVwEcUxJMdBAAylIUHKOoHyIoCkDvsOMBcBpsHkiOKKvA59MCb8UyqI-yEYzoHKIcPIPKBTUjmtXWYmCoJaImG-VqZZjqcSfqaI1fDlJufSYpjuZ44FnsEETmk3vFHU59BaUToKWSVadQC03oLvPoPtNVbKEQglLUHgioM1kTFw6RCM7qRMzaUafQc01oyaJTbiNpnI1mSRTOIk5kaY2oIlMoJUTOMGeEKGbWPWBAAVR4wKFUFCEsJoDkArGsX81iFOcoBmRepNWcHYyuA44c+FLoC7BlOhPKKlQC3DZtHuNWb8zQToHOe4EAA */
    id: "javlib",
    initial: "idle",
    context: {
      path: null,
      keys: [],
      index: 0,
      errors: [],
      message: "Waiting...",
      pages: [],
      existing: [],
      added: [],
      deprecated: [],
    },
    states: {
      idle: {
        entry: assign({
          message: "waiting for input",
          path_placeholders: JSON.parse(
            localStorage.getItem("path_placeholders") || "{}"
          ),
        }),

        on: {
          start: "user input",
          change: {
            actions: "assignProp",
          },

          work: {
            target: "working",
            actions: assign((_, event) => ({
              path: event.path,
              added: [],
            })),
          },
        },

        description: `Machine is idle and waiting for automatic or user input. Machine can also be started with a work message.`,
      },

      working: {
        entry: assign((context) => ({
          message: `Finding keys for "${context.path}"`,
        })),

        invoke: {
          src: "getKeysFromPath",
          onDone: {
            target: "set search star",
            actions: [
              "assignPathKeys",
              "assignPageProgress",
              "assignSearchModel",
            ],
          },
        },

        description: `Get all keys from the library location in path. Return an array of keys and pages.`,
      },

      "process keys": {
        states: {
          "iterate keys": {
            states: {
              "send next step": {
                always: [
                  {
                    target: "#javlib.process keys.find video",
                    cond: "has more keys",
                  },
                  "#javlib.choose next step",
                ],

                description: `Process next step normally. This is always the state unless an error occurs somewhere else.`,
              },

              "error occured": {
                description: `An error occured somewhere in the process. Pause to display the error then continue the loop.`,

                after: {
                  3500: {
                    target: "send next step",
                    actions: "iterateKey",
                  },
                },

                entry: "persistProblem",
              },
            },

            description: `Move to the next item in the list if one is present. Otherwise exit loop and return to idle state. Any action preceding this one has the responsibility of iterating the index for the next item in the loop.`,
            initial: "send next step",
          },

          "find video": {
            // invoke: {
            //   src: "searchByText",

            //   onDone: [
            //     {
            //       target: "process response",
            //       actions: ["assignResponse"],
            //       cond: "event contains data",
            //     },
            //     {
            //       target: "iterate keys",
            //       actions: "iterateKey",
            //     },
            //   ]
            // },

            description: `Find new video at parser domain.`,

            states: {
              "lookup video": {
                entry: assign((context) => ({
                  message: `Searching online for videos like "${
                    context.keys[context.index]
                  }"`,
                })),
                invoke: {
                  src: "searchByText",

                  onDone: [
                    {
                      target: "validate video",
                      cond: "event contains data",
                      actions: "assignResponse",
                    },
                    {
                      target: "#javlib.process keys.iterate keys",
                      actions: "iterateKey",
                    },
                  ],

                  onError: {
                    target: "#javlib.process keys.iterate keys.error occured",
                    actions: "assignProblem",
                  },
                },
              },

              "validate video": {
                // invoke: {
                //   src: "checkVideoContent",

                //   onDone: [
                //     {
                //       target: "#javlib.process keys.search for existing",
                //       cond: "video content is not missing",
                //     },
                //     {
                //       target: "#javlib.process keys.iterate keys",
                //       actions: "iterateKey",
                //     },
                //   ],

                //   onError: {
                //     target: "#javlib.process keys.iterate keys.error occured",
                //     actions: "assignProblem",
                //   },
                // },

                states: {
                  "check title": {
                    always: [
                      {
                        target: "check for content",
                        cond: "not gross subject",
                      },
                      {
                        target: "confirm gross",
                        actions: assign({
                          gross_countdown: 10,
                        }),
                      },
                    ],
                  },

                  "check for content": {
                    invoke: {
                      src: "checkVideoContent",

                      onDone: [
                        {
                          target: "#javlib.process keys.search for existing",
                          cond: "video content is not missing",
                        },
                        {
                          target: "#javlib.process keys.iterate keys",
                          actions: "iterateKey",
                        },
                      ],

                      onError: {
                        target:
                          "#javlib.process keys.iterate keys.error occured",
                        actions: "assignProblem",
                      },
                    },

                    description: `Check the URL to see if it actually contains content`,
                  },

                  "confirm gross": {
                    entry: assign((context) => {
                      return {
                        dialogMessage: `Add potentially gross video "${context.candidate.Text}"?`,
                      };
                    }),

                    states: {
                      countdown: {
                        after: {
                          100: [
                            {
                              target: "timeout",
                              cond: (context) => context.gross_countdown > 0,
                              actions: assign((context) => ({
                                gross_countdown: context.gross_countdown - 0.1,
                              })),
                            },
                            {
                              target: "#javlib.process keys.iterate keys",
                              actions: "iterateKey",
                            },
                          ],
                        },

                        description: `Countdown to auto-close event.`,
                      },

                      timeout: {
                        entry: assign((context) => {
                          return {
                            dialogMessage: (
                              <>
                                Closing in {context.gross_countdown.toFixed(1)}
                                ...
                                <hr />
                                <HilitText values={GROSS_WORDS}>
                                  Add potentially gross video "
                                  {context.candidate.Text}"?
                                </HilitText>
                              </>
                            ),
                          };
                        }),
                        always: "countdown",
                        description: `Always go back to countdown state.`,
                      },
                    },

                    on: {
                      yes: "check for content",

                      no: {
                        target: "#javlib.process keys.iterate keys",
                        actions: "iterateKey",
                      },
                    },

                    description: `Check with user to confirm adding items with potentially objectionable titles.`,
                    initial: "countdown",
                  },
                },

                initial: "check title",
              },
            },

            initial: "lookup video",
          },

          "save video": {
            entry: assign((context) => ({
              message: `Saving "${context.candidate.Text}"`,
            })),

            initial: "save",
            states: {
              save: {
                invoke: {
                  src: "persistReplacement",

                  onDone: {
                    target: "curate",
                    actions: [
                      assign((context, event) => ({
                        ID: event.data,
                        added: isNaN(event.data)
                          ? context.added
                          : context.added.concat({
                              ...context.candidate,
                              ID: event.data,
                            }),
                      })),
                    ],
                  },

                  onError: {
                    target: "#javlib.process keys.iterate keys.error occured",
                    actions: "assignProblem",
                  },
                },
              },

              curate: {
                invoke: {
                  src: "curateVideo",

                  onDone: {
                    target: "cast",
                    actions: assign((_, event) => ({
                      cast: event.data,
                      cast_index: 0,
                    })),
                  },

                  onError: {
                    target: "#javlib.process keys.iterate keys.error occured",
                    actions: "assignProblem",
                  },
                },
              },

              cast: {
                states: {
                  "iterate cast": {
                    always: [
                      {
                        target: "get model info",
                        cond: "more cast",
                        actions: "assignCast",
                      },
                      "#javlib.process keys.drop old videos",
                    ],

                    description: `Find next cast member in the list if there is one.`,
                  },

                  "get model info": {
                    invoke: {
                      src: "getCurrentModel",

                      onDone: [
                        {
                          target: "cast model",

                          actions: assign((_, event) => ({
                            star: event.data,
                          })),

                          cond: "model was found",
                        },
                        {
                          target: "iterate cast",
                          actions: "iterateCast",
                        },
                      ],

                      onError: {
                        target: "iterate cast",
                        actions: "iterateCast",
                      },
                    },
                  },

                  "cast model": {
                    invoke: {
                      src: "assignModel",
                      onDone: {
                        target: "iterate cast",
                        actions: "iterateCast",
                      },
                    },
                  },
                },

                initial: "iterate cast",
              },
            },
          },

          "search for existing": {
            entry: assign((context) => ({
              message: `Finding existing matches for "${
                context.keys[context.index]
              }"`,
            })),

            invoke: {
              src: "findMatchingVideos",

              onDone: [
                {
                  target: "iterate keys",
                  cond: "existing videos found",
                  actions: [
                    "iterateKey",
                    assign((context) => ({
                      message: `Video already exists`,
                      deprecated: [],
                      existing: context.existing.concat(
                        context.keys[context.index]
                      ),
                    })),
                  ],
                },
                {
                  target: "save video",
                  actions: [
                    assign((_, event) => {
                      const records = event.data;
                      if (!records) return;
                      const deprecated = records.filter(
                        (record) => !isValidDomain(record.domain)
                      );
                      return { deprecated };
                    }),
                  ],
                },
              ],

              onError: {
                target: "iterate keys.error occured",
                actions: "assignProblem",
              },
            },

            description: `Find existing videos in the database and skip any that already exist.`,
          },

          "drop old videos": {
            states: {
              "iterate old": {
                always: [
                  {
                    target: "invoke drop",
                    cond: "more old videos",
                    actions: assign((context) => ({
                      favorite: context.deprecated[context.drop_index].favorite,
                    })),
                  },
                  {
                    target: "apply favorite",
                    cond: "old video was favorite",
                  },
                  {
                    target: "#javlib.process keys.iterate keys",
                    actions: "iterateKey",
                  },
                ],

                description: `Iterate over deprecated videos`,
              },

              "invoke drop": {
                entry: assign((context) => ({
                  message: `Deleting ${
                    context.deprecated[context.drop_index].title
                  }`,
                })),

                invoke: {
                  src: "dropVideo",
                  onDone: {
                    target: "iterate old",
                    actions: "iterateDrop",
                  },
                },

                description: `Delete current video from the deprecated items loop.`,
              },

              "apply favorite": {
                entry: assign({
                  message: `Setting favorite to TRUE`,
                }),
                invoke: {
                  src: "setFavorite",
                  onDone: {
                    target: "#javlib.process keys.iterate keys",
                    actions: "iterateKey",
                  },
                },
              },
            },

            initial: "iterate old",
          },

          "drop saved video": {
            states: {
              confirm: {
                entry: assign((context) => {
                  const { added, dropTarget } = context;
                  const doomed = added.find((f) => f.ID === dropTarget);
                  return {
                    dialogMessage: `Delete "${doomed?.Text}"?`,
                  };
                }),
                on: {
                  yes: "drop video",
                  no: "#javlib.process keys.iterate keys",
                },
              },

              "drop video": {
                invoke: {
                  src: "dropAdHoc",

                  onDone: {
                    target: "#javlib.process keys.iterate keys",
                    actions: "truncateAdded",
                  },

                  onError: {
                    target: "#javlib.process keys.iterate keys.error occured",
                    actions: "assignProblem",
                  },
                },

                description: `Delete video that has already been saved.`,
              },
            },

            initial: "confirm",
          },

          "confirm skip": {
            entry: assign((context) => {
              const { index, keys } = context;
              return {
                dialogMessage: `Skip item ${index}: "${keys[index]}"?`,
              };
            }),
            on: {
              yes: {
                target: "iterate keys",
                actions: "iterateKey",
              },
              no: "#javlib.process keys",
            },
          },
        },

        initial: "iterate keys",

        on: {
          reset: {
            target: "working",
            actions: assign((_, event) => ({
              path: event.path,
              added: [],
            })),
          },

          drop: {
            target: ".drop saved video",
            actions: assign((_, event) => ({
              dropTarget: event.dropTarget,
            })),
          },

          skip: ".confirm skip",
          pause: "processing paused",
          stop: "confirm stop",
        },
      },

      "choose next step": {
        always: [
          {
            target: "working",
            cond: "more pages found",
            actions: ["assignPathFromPages"],
          },
          "idle",
        ],
      },

      "user input": {
        invoke: {
          src: "getUserInput",
          onDone: {
            target: "working",
            actions: ["assignPath"],
          },
        },
      },

      "set search star": {
        states: {
          "check for star": {
            always: [
              {
                target: "look up star",
                cond: "search is for model",
              },
              "#javlib.process keys",
            ],
          },

          "look up star": {
            invoke: {
              src: "getSearchModel",
              onDone: {
                target: "#javlib.process keys",
                actions: assign((_, event) => ({
                  modelProp: event.data,
                })),
              },
            },
          },
        },

        initial: "check for star",
      },

      "processing paused": {
        on: {
          resume: "process keys",
        },
      },

      "confirm stop": {
        entry: assign({ dialogMessage: `Save path before closing?` }),
        on: {
          yes: {
            target: "idle",
            actions: "assignPlaceholder",
          },
          no: "idle",
        },

        description: `Ask if user wants to save their place before stopping`,
      },
    },
  }, //{"vl_label.php?&mode=&l=bvkq&page=100":"Videos By Madonna","vl_genre.php?&mode=&g=aayq&page=91":"Videos related to Huge Butt"}
  {
    actions: {
      assignPlaceholder: assign((context) => {
        const { path, title } = context;
        const old = JSON.parse(
          localStorage.getItem("path_placeholders") || "{}"
        );
        localStorage.setItem(
          "path_placeholders",
          JSON.stringify({
            ...old,
            [title]: path,
          })
        );
      }),
      persistProblem: assign((context) => ({
        errors: context.errors.concat({
          error: context.error,
          stack: context.stack,
        }),
      })),
      assignProblem: assign((_, event) => ({
        error: event.data.message,
        stack: event.data.stack,
      })),
      iterateDrop: assign((context) => ({
        drop_index: context.drop_index + 1,
      })),
      iterateCast: assign((context) => ({
        cast_index: context.cast_index + 1,
      })),
      iterateKey: assign((context) => ({
        index: context.index + 1,
        progress: 100 * (context.index / context.keys.length),
        // candidate: null,
      })),
      truncateAdded: assign((context) => {
        const added = context.added.filter((f) => f.ID !== context.dropTarget);
        const candidate = !added.length ? null : added[added.length - 1];
        return {
          added,
          candidate,
        };
      }),
      assignPath: assign((_, event) => ({
        path: event.data,
        added: [],
      })),
      assignResponse: assign((_, event) => ({
        candidate: event.data,
        drop_index: 0,
        favorite: false,
      })),
      assignPathKeys: assign((_, event) => {
        const { keys, pages, title } = event.data;
        let collated = [];
        // console.log({ pages });
        if (pages?.length) {
          const array = [...new Set(pages.map((p) => p.page))];
          // console.log({ array });
          collated = array.map((num) => pages.find((p) => p.page === num));
        }

        return {
          keys,
          pages: collated,
          title,
          index: 0,
          progress: 1,
        };
      }),
      assignSearchModel: assign((context) => {
        const nameReg = /Videos starring (.*)/.exec(context.title);
        if (nameReg) {
          return {
            starProp: nameReg[1],
            modelProp: null,
          };
        }

        return { starProp: null, modelProp: null };
      }),
      assignProp: assign((_, event) => ({
        [event.name]: event.value,
      })),
      assignCast: assign((context) => ({
        starName: context.cast.stars[context.cast_index],
      })),
      assignPageProgress: assign((context) => {
        const { pages } = context;
        const sorted = pages.sort((a, b) =>
          Number(a.page) > Number(b.page) ? 1 : -1
        );
        const currentPage = sorted.find((page) => !page.href);
        const finalPage = sorted[sorted.length - 1];
        return {
          page_progress: 100 * (currentPage?.page / finalPage?.page),
        };
      }),
      assignPathFromPages: assign((context) => {
        const { pages } = context;
        const sorted = pages.sort((a, b) =>
          Number(a.page) > Number(b.page) ? 1 : -1
        );
        const currentPage = sorted.find((page) => !page.href);
        // const finalPage = sorted[sorted.length - 1];

        const nextPage = sorted.find(
          (page) => Number(page.page) > Number(currentPage.page)
        );
        const { href } = nextPage;
        const path = href.split("/").pop();
        return {
          path,
          existing: [],
          // page_progress: 100 * (currentPage?.page / finalPage?.page),
        };
      }),
    },
    guards: {
      "search is for model": (context) => !!context.starProp,
      "old video was favorite": (context) => !!context.favorite,
      "model was found": (_, event) => !!event.data?.ID,
      "more old videos": (context) =>
        context.drop_index < context.deprecated.length,
      "more cast": (context) =>
        context.cast_index < context.cast?.stars?.length,
      "has more keys": (context) => context.index < context.keys.length,
      "video content is not missing": (_, event) => !event.data,
      "event contains data": (_, event) => !!event.data && !event.data.existing,
      "not gross subject": (context) =>
        !GROSS_WORDS.some(
          (word) => context.candidate.Text.toLowerCase().indexOf(word) > -1
        ),
      "existing videos found": (_, event) => {
        const records = event.data;
        if (!records) return false;
        return records.some((record) => isValidDomain(record.domain));
      },

      "more pages found": (context) => {
        const { pages } = context;

        const currentPage = pages.find((page) => !page.href);
        const nextPage = pages.find(
          (page) => Number(page.page) > Number(currentPage.page)
        );
        return !!nextPage;
      },
    },
    services: {
      getUserInput: () =>
        new Promise((resolve) => {
          const answer = prompt("Enter path");
          !!answer && resolve(answer);
        }),
      setFavorite: async (context) => {
        await toggleVideoFavorite(context.ID);
      },
      dropAdHoc: async (context) => {
        await deleteVideo(context.dropTarget);
      },
      dropVideo: async (context) => {
        await deleteVideo(context.deprecated[context.drop_index].ID);
      },
      assignModel: async (context) => {
        await addModelToVideo(context.ID, context.star.ID);
      },
      getCurrentModel: async (context) => {
        const models = await getModelsByName(context.starName);
        if (!models?.length) return false;
        return models.find((model) => model.name === context.starName);
      },
      getSearchModel: async (context) => {
        const models = await getModelsByName(context.starProp);
        if (!models?.length) return false;
        return models.find((model) => model.name === context.starProp);
      },
      curateVideo: async (context) => {
        const key = context.keys[context.index];

        if (key) {
          const info = await getVideoInfo(key);
          return {
            ...info,
            key,
          };
        }
        return false;
      },
      getKeysFromPath: async (context) => {
        return await getJavKeys(context.path);
      },
      persistReplacement: async (context) => {
        const address = context.candidate.URL;
        const video = await getVideoByURL(address);
        const res = await saveVideo(video);
        // console.log("Saved '%s'", video.title, { res });
        return res;
      },
      checkVideoContent: async (context) => {
        if (!context.candidate?.URL) return true;
        const address = context.candidate.URL;
        const ok = await validateVideo(address);
        // console.log({ ok: ok.result });
        if (!!ok && ok.hasOwnProperty("result")) {
          return ok.result;
        }
        return true;
      },
      findMatchingVideos: async (context) => {
        const videos = await findVideos(context.keys[context.index], 1);
        console.log({ key: context.keys[context.index], videos });
        const { records } = videos;
        return records;
      },
      searchByText: async (context) => {
        const address = `https://${approvedDomain}`;
        const answer = await getVideosByText(
          address + "/",
          context.keys[context.index]
        );
        // console.log({ answer });
        if (answer.videos) {
          return answer.videos[0];
        }
        return false;
      },
    },
  }
);
