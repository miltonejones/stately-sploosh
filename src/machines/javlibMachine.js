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
import { getJavKeys, getJavNames } from "../connector/librarian";
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
    /** @xstate-layout N4IgpgJg5mDOIC5QCsCGA3ANgSwEYDpsJMwBiWAF1QCcKBtABgF1FQAHAe1mwuw4DtWIAB6IAtACYAnADZ8DCQFYAjKoYyAHABZtAdhkAaEAE9xErRIbyN+mTIDMM3feUaAvm6NoseQsTIAxgAWqPwwjCxIIJzcvAJCogj2ior4UsoK9jauMtKyRqYIkroW+Lq2Uoq6yjKKEhoyHl4YOAREJPjUYKgQxqQA7hzUANYRQjE8fIJRiRK6Evg1irJS9gwaVRLKBWYS5mkaycqKWloljk0g3q1+HV09fYMjdMqR7FyT8TOIe8r4Gq4pFI9ipKnNFDsisp9PZ8NJdADyioNOktJdrr52mB8DAKAACYZgYx47D8ABmHFIEAE2NJ6A4hPwGLa-hxYHxhOJpIpCDpHACqDi-AiYyiEyFCUQilhMi0LnWDEUThSKUhkgYJXwsuBugYWhksjO6JamNZwQ4XDAeKew1JUDxbEFQVI5stovesSmkoQOi1KJspw0DCk+sqEJM4hqp3kawcWj1Z2U9gkxp8BBtdqpNMI-HpjOZ+AzYV5uf5gqmIuY4w+Eu+RXMKX+dU04IN63DhTEylOVhs6QY3cVigHjU8VxNBDY1H5cFgBKJsFIXVg7Pd0RrXrr0LkSn0QY2FiqpzVykscnWBpRGtkylTNynM9gc85i4g07Ya-Fm9AiS7Gp35TrM4SpRlokK6KkwYqFs5RnHYCJ3r4D4BLO87GIusC2h+VZihuXw-lKqTmKewb2DeCjqGBEZFLkCwIpYli6ECVRJohk7TihT5oYujoAK4rp+eHTARCBbFofzJFoVQaBIyZSVIJ6WFI8i1BkcqnGs9hsfgyGoS+5AUBw2FvOunr4SIiCuFJ-x7KGipiR2kZKqkSzzPGhw6BB2m6VxL6EBQYDUIKVp+Su-AQHi-BgMI+KUGAbCkIJZnCRZSRaMpMjKFIAKyns6zJmqshWPYurVPudhKKOzRpjpHF6Qu-mBcF3H4GFEVRTFeJxQlLwmV+5mJPGWj4C49jiUxazQvY00nq4fxqHMFjQikhzeXVvkNTwTUBS1gXTtQeL8gEvFdBApDCJQwX4KgZIBdQAAUyQMAwACUpAFj5z6bXdzV+XtQyHQEx2nUlnwpYksoaP8uSOCVDTDnUkLLDK9QOECQJbIo7hjh961feh+BkqSEXoEQYAcPgmAWsMvFsHipMQOTWZRTmebYrjj747AhPE-TZMU1TDK03zjMcCW9ICkKlZ9UJ3qZQsWXxvMQZKnMGhqjJykNLq0oNFkLhVeONWfS1RPhSL5OU9TwsM0z1Is3y+YTrVnOm7ztsC9bdMe+LZZS8wvXVsl3rSroNkQQwyaaCkUi6GqexQyrtTiac6WyWiOPOybflmyT-NW0L3v86Q-3UDpmCChS1AALZMlneNu+bHsFzTRei77ksVgHOEemD3obLCwJQel1Q1N2GvnkquQAlIA5nMma2uzn7v5+gqA4BAzXN8EYABMMeK8BQJCJT3pl91uuVlLqS3y8CY1qjr-zAsc0LzJDuiL5xXM803q-r0QW9847z3gfHgx9A64WDhfOofo9gOEVPPY4aosZQyUOoAc6gAQuCkJ-eqBNc4WwpmvDegDRb4GAfvKueIAgCACvwCgzNaSlidsbBuy9f5kOIQAna28gi70oQDGh9CwD0I7uWAQ0sg7nxErJBQaQiqTQRHrB+voshVGBOJPYqwcGZ1YUvBqBDm5cM3jwoBfCQFUKEXQhh9smFszrnor+jc86cP-iYq0vD+F4ksbQkRFAxH+yYBA3utYZHLTKEmQCGQMFykhCVMOKh9SOD1FeVQGdqr3jYQYleriSGmLIRQ7xgjfH0JLtQfa5dK5DFrhzJx7CXGW2MaQy2hSfHCNEXyTuEju4yygSJbKxUQzJCON2ZMcdqJzHkHMEoxxlhInqLgja+CcmNLcc0imQiiY1zxFAacT5SDGDgKDUJqVTyz3+AidKMhnrzAkAaZBTgr5kW7HYIEqgUy6Myfo5ZHDVl5I8UAgQWzq47L2YufgHBjnflOVlWEJQWwlFnjJJikIkywhQQCKSEFNb6EWd-Qxf9-mEPIUC7A2zdlcG5jQ3i9DqT9H4OdS6AVrq3UCvdaJb1al4O5gS3J3CAUFNJeSsFJKaUUDpcKU+-VwaWQsMpSo3YsbZU0Gik8zhFhODlM4Q86gdEZKQlkn5DSiFrPyS0oVIKKVPlFbSjg9LGVUGZTdO67Lnqcvrt8nlKyTVEu3ha0FlKbXirtcKV4UiTmJDRbCa8GwKpKKkpCPYdFDjaE8tIMShsuVLK9b8n1-LiWbLJZakVvBq7k14gwqFA1LLOAypc9Q01hzDPjq4fAKhYy6m0A0WQ2N9XsU9a1DAArLawCHYw1mDJ2YerqQ1Ud6Bh0UznWAAJXcglStlluQEbamLrCxRYfUjlRIamGscCCjgh7iVvJ8g1A6l3EqXWUipbAK4UCrjU6d3LB3zvvUOld3S129Okac8wYc1jQWHMCVY2hUVJisJYHQ01rnBhsIoPFLU73bxOsFcdjsp2OM-RhoBWGAp-slQB8N0LI3XMTnMiwJUVj6kTY2ka1QVD6DOM4TNH7s1foXeQ4jZBS6VNfdUhxXyZ0E0IwUgTpHJGQKA5G9QYdDj1DlCGLYeoYNrDhHqRtZFNBgjQ6FIdBbUCUEakFHaApKAn0AxGn4GD5B31npHTK98JlIbhMcfUOhcix1OEZ2dJnt5mYoBZ5q1nK1hvk-ZhAZy5Advg2ROoCaPPHCfjHSopxmwfL7S7CT3MpMtNC2yfE1cOCM0wCScklJbETpYeJgjwWgEldxHicrlXqs8k6eIsjVaZWiWSOefU1QlpiXMEx4E+B9QOHTiiCCH9r39oK7x0z5m2sdbAFV7ktXsy4bEzelbRWNmtfZO1irW2utix64E4JZ9YvmEsFqC8z0tghkVIYCZQY-iHBOKM95KXAuSeawU07ZWLvbZq4+oYwm30HeW0179IX1tnc25D7rpYul9fXX01KWwlBwlWIqSJIYsafcKHMOR1zKfrHSEidJRtGs8eO+QkrkXzuVZw8wvDTPv4s8i6zygHOtuyZ6RR6tokPLTfjNIWUz0FC1ETTYBY0gXBYyVExI0S38sEe6NQYIRSDrRWwJQTMdX9tZr53rg3VDjem+LDd1d-XvRKTkAiZMKJoQojGlRQozgVcvKyAOVwdyr15ezrO63QRDd4jt7wMIXP7GW-Q1HmPce7Si6CdFkJlGfiyUHrThE2Vyixxg-GLUyR5jBnKFkLj+Hmep9t8IE38eoDQ7Ls+qpNd4c64bzQG3AN08O8x71uTOeJc1A2Cx5MyxNAAj1OTqUqwtSozIujTGvbGeHc-W+Iyh1MDGu5ltSzVoOAH9s+Lgb56-Sx1kSVGGJUmPJDSHcsa9RsW0SB9zXfdMz+H-CztH-olNnvdrnnFr2CUCkGro4AaFjExgiFqFBmjJHOsLJF-vgD-vvv-sfs1EAXQBIHZmAZIArPBMsPuCXs4FplYFlkmEoCtO-ugZgX-oQkftzniD-onpOj3hHgTEwQfiwfVlaD-pns7nWHUAkiUOJMGFsFeOMhTssPNBsGCPMCobllvgjjxnwf-qgGwM+sSGSBgEMFtJwQ1tvpoe+FgQIToXod4oYdQFtCITjgppZGRCNDYFBKoExGkovnFrBjpnKMMj2oZtrjwd-hYUusaiSuSEWgckck4bFl2PUMpFjJYEqkCBYPctRMOGHICMmKsLfHsItuHoamEXvhEQWhaqQBCqISJJIEqP8OoAxLInUNKEjK2giNcnThkNKNCIweEUOpEZgR7CYTzmYd-JgeUc3EMfzI4YQRLmIAESNHKCcE4KiAaIxlkcvtPGjOvscJvsnn5BMQMcStMaLO3rDqJgcQ1EcfOoMRYT7I7v+jUalGILkFYK-NlOnLkBBJCE4AsENukFGN2uJOgYWtsphNgAlIcrAM8YkAgfUDPtKGRPoAoIeulmRHoOmrJNEtoKCf6hCQlNUfEWAaevIFGFNMijUMCGqLRGUDJBRExJUNUFpNrq6CuJFNFLFAFD1MSRLlkH8LJNKCgmjMmDUCeGplqFlOYO5CGMCGoQWGyVaB1FyfFMAXMQNkNCNEmONETlNMeNRF2NUHIG5i5oqI4FJNpPxIFNVmwBWiMT3laQdKSLaf4o8djuqd6OqOijrO2tlgaOPAaTUFsNukqCsFlLKJoNpCuLFKnpdGXK0gDHGRfjFkQcRO8WRI0ckMsOkEjMGNNmRCVPUJPqcPKc7NGV1LGVQPGeYgIgdEmXdtKp6VlKeCNNiTkHMN2PkFkXmWpoWTlKmhqFGWdiuP3tHnGS3HiMLEmebtzj3uWSOfrmOVWROVOVWbMZfk2ZBtNjHMOKmvMF2YULASNDDPqFKWNCUHinaA6KgFaWdMuLxGWrCXnvsBBC-DXmGHIZGEpCpCoLphpJHNpGCSCpQEZLETCbyQNoOH8GQUmEGErOsOrAaVon8AqoWfGAqmgayfiYZISZChBd6KoDYNuqPNUMGJ4b7mYGMmUEBOkHcicLBNpFiOQkEBaOyUWPaI6BQM6AKPwChJgE+UUNNNNrBYcHYDcm5vHM9MpP7t2PGHqNXh4GOBCozPAFEMyBuXWHUeoIsBmTDJltsEhYcHBhUA0DYKNoxf4BpbUQCMJVkKJUhvoKePHBYAsE4NCKsM4OUNUBZXcN0L0FZalJlMNK-jJUobEkhQxHCKGSibIkxD5diG1pyFdgFYNOmc2DJFkBBCcPHLJDkdUF5ShnPAzgWExYqdaEMLaGENeVxSlZGMNI4KoI2qePBF5SeBoDZQ0FlMOHsGNNmdpOxbVVCKUNibPKTktLYOKfsGTiVJepYAoMVdxlzINV2Gom2vSWkeppkZ2N0fVekIcLINcrqCVOgTgTtC+INWHMGICYcCUPJWsBIHEocGUGcLINgukNqCycUQOqdSFJHubMqV1NyYNY2FdYRTNXdUjCcM9UxJlJlN9rkCdT9GdQ1KXIDMDJAINasAKYeKRaeDYFtYgJlJBIUaiRlacGHuob3vit6sDbKIsO9srB9mrIVHYE-M2XlDPplOgbypbILK3IQhdbkGkNKBpiLXYEmMguqq9VNG9nKnqpTaET-JEU0mahwINRkEmFqUrECNihrGNGzdlD7iqgaNzd6vgCrXxoUofCQINZYFlAcBmZIS5skA-OsIsEtFjGaWpEUQrSUUrcShbQWjWTHlYn4ureoBJIOIybrQaSUKBs-KReooUabbmubaapbf6laqpePpBaeMTekUoMCB5IegselrqLBXMHYHoLiiEX7TzXmu4hUdEcKoGtSravSurVNFMgXcsAialp2FsLCHbd2NinNXoCncrenU3cCgGtaqWuWhQOrfNmtRBHcg4GsNfPHNpnbY4CkfGCkegcduHQgdqK+StL3WiQaOeKsFincqcEFYfSDiOkOurfnosJVLBT6YqKikZW2h5RkG5h9o-UjkRifp3XclqCPCoOfcCIevntGp8aeDNcOHKMA5baFurbIAsNIRma5tqYmvCPmXnanHJKhrXbek-SduZj9dQhgymRLpYM-sodIACPtXYErs-tBO1aVLKAtfXnzpQ4LmFhthDslfQwNgxChWcBlcXgCHcpNu8UXb3eJG5nw7zuhoIwLuzmjrbUGHRBrdUHMKsDNUxtoGkGrh2Q2nUIfY3oPs3vblALbYqlfKoP5kGJUJUG0S5NIP+HLblX0XvswR7NnaAfMSVO-ScPqNoOvXqA9RMjclMplBkCGPGNHAE7-vwcEwAafgfoNeNIsB0ZlCGDJNIImqiGkPJAti4HkPsYtS1FoQIbhuwe+INVkMpG08cMUxjJlImsGMNM2PrIdctGo2MfUxYUE-zNzNYZgPoXYVtOHVDP9kmBGVlN2ommoHCOxrLYqOkOk11McR7MtWigkutSiAXQTT6BqHSbkNcpJIqnXuo4cf0bcdPUWstSiKkO9pUA2lJG9pCOlERHrAoO1XPAjeQytjcZACcfcfzEc9MjpicDJBYAOIjNRJ5mcD1WJRsM4J9b7QOkBV1FhINaza9grncsHvGAZZ2MkAsEGExMirPLZLiwqSxZaByZ1N1K08vqJcY9COlI4J+VCGsHBkmCcLPKoFfSMwQI6TaRWstYQ04NoKROJAbBRVCIcH8JriCxK+9Q874POZWTQPK1JIs7pYKdmVSz8A4AU8HscEoIKbUEOTGaOYDTQMxV4lQnGfK1kAsJ8ZrN2BkA0HEsOFqOXScMTrJLkFK61MOYa2XHzZOXTF6+I56bJOkNLgqqVMXnMOBM9PmfZN80BKWfw1eXxCuBAE49GAoOXawx4-YCePrG2vCP+BHKoIBdhUZOrbUG7nBK9bHCXiXenAsL+aro4NoDPopW4EAA */
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
        },

        description: `Machine is idle and waiting for automatic or user input. Machine can also be started with a work message.`,

        states: {
          ready: {
            on: {
              work: [
                {
                  target: "get key info",
                  cond: "path is a key",
                  actions: "assignWork",
                },
                {
                  target: "#javlib.working",
                  actions: "assignWork",
                },
              ],
            },
          },

          "get key info": {
            invoke: {
              src: "getJavInfo",
              onDone: {
                target: "choose working path",
                actions: "assignInfo",
              },
            },
          },

          "choose working path": {
            on: {
              choose: {
                target: "#javlib.working",
                actions: "assignWork",
              },

              cancel: "#javlib.idle",
            },
          },
        },

        initial: "ready",
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
      assignInfo: assign((_, event) => ({
        info: event.data,
      })),
      assignWork: assign((_, event) => ({
        path: event.path,
        added: [],
      })),
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
      "path is a key": (_, event) => event.path.indexOf("-") > 0,
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
      getJavInfo: async (context) => {
        return await getJavNames(context.path);
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
