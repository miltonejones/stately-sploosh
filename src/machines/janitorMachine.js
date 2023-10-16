import { assign, createMachine } from "xstate"; //1
import {
  addModelToVideo, //1
  deleteVideo, //1
  findVideos, //1
  getVideosByDomain, //1
  saveVideo, //1
} from "../connector";

import { getVideoByURL, getVideosByText } from "../connector/parser";

import { approvedDomain, includedDomains } from "../const";

export const janitorMachine = createMachine(
  {
    /** @xstate-layout N4IgpgJg5mDOIC5QCsCGA7AlgFwPYCcA6AYwBswMACAVwAdKA3TCMXWQmbR51y21GIVK5UEPgLABiCLnRhCmdA1wBreWix4iZCuhr0mLNhzBdDvfoOGjxMBIuXFU2TLIDaABgC6nr4lC0bDiu6P4gAB6IALQAjACsMR6EAMwATB7JyQAcWak5AJwxADQgAJ6IcfkAbIRZAOz1dQAs+U1VTU1ZMQC+3SUaOAQk5FR03EbsnOMWEkIiYpZSMnIKSqrqGIPaI3pj5sZT+7by1gsS9mtOLu7ebjF+SCCBsMGyYZEIsW01VZUeTWk4pVmqkSuUEE1CDFOtUmnUqjEqllKqken0QAMtMNdPppgdTHjjoQAGaKMRgcKYWAudBQShqUqwaSyeQOdaETFDHSjAw8fFmPlE0nocmU6mKOkM2AXRzOEK+XxhZ6vUKPD5ROIeOKEDxZZJAxLJRJZfJxJpgxAIrKEOqa5J1fJGvWO-K9fqbLHc3a8iaEI6LSinSCSfjUWBgRWPZXXVWgdXwwhVBpdU2pOFVZL-C2faFNbUOmImurJJOpW2u9Gc7Y4vZ89j+iSB+aQExcYjUfD4MDoLgMwgAd1QOEk4WpznkqGJ2DA+AAFDF8ouAJSSKvYnl4+uCgNBiCtyjtzvd3tgUoDofYSMBIIx96IFrJQj5HLxRIxGJl35VbOF1KEVLtECmTpE0MTJBW7qaFyOy4vsW5GMcTaiC2UyHl2Pb0qeHC4MyKxsmoHIetBNY+qw8EzDASEsHuqEduhJ5nlAuAyrgVzyrc3hKjeIR3gg8T5FChZZLqOR5B4HjfmU0RdDUcR1KkcRVFUZZ5PktpuhiRHVhucF+tuja7vuaHHphjE4csrJrARa5erBdZ6QhO7NjRBLGRhfZMSxbE3D49xcS8t5qogSRxNkHgxHUDqZiWrRltmGqaomEUIiWkUOgBGk2TBta+g2lGGbRR7uVhTG4ZZyjWVp67epuDkUWAVEoa5dEmR5zFst56AKqkDzXgFPFBTmWQAjqyRtKi+QAQBcTxYpSTwnC8npKk1QNJlVW2TlZF1bgiGGcKopUjSdJwWVqwVRsUHaTVul5Q1+1kpQFJHRKm5eXKPlXk83FvINDRJEpTTpNUc1mnU8WGgJpr6nmqRjcNSLrVd1V2bl+n5c5hBgAwqCkNQ46UAAts4xAABZwAo074ATxPYGTcCSF90YDXGiDgfNSIfuFQLPh0yTZgCf7w8mAEfouEGacjm2kcYd2NXu2O4-j05EyT5PsDgM402rDN3L1339b9rN8QpibFsNkUrUpoUzVJEIeAJymorq4W6hmyRI1sKNbbL6P3Zjit49rdPq5TWsq7T9NMm4PX+SqvFRM0dSEJUCRltCBRagLJaEHmmpwouxpmnEnuetlMvkbtTnIQrONBxHOvsCw5ANyHZ34ZdXvS7VcuGYHysNZHofN6Yg9q+9MYKpxUY-bGESWi0KftCtJYZCv4N2-CMS1B+TRahFz7-HUpfETp9m95jB2UF2tCkKgxBgITx4kOTxAqJQxIEE9YrHYz099fHQa75QI2gXHEZEJoPwfniouGoHh4T5HCitSK4ES6Vg2uXHuft5YkkejfO+D8n49hfmAN+H8v7PXFLSRmfkZ6Gznh8Y0ycWiRVyApBEKDszgUhGDYS0JbSpDLGgyCXdMG3WwQ9EU18wC33vo-Z+4ZUD4DJpQNADAZBLBZOddkWUSJYMcgZS+eCZEEPkcQxRyjSaqNQOo3AYAJ7sR8P-A2gDjbQgzCkIGhc9T1AAuaO2UQuiQiTAkNoqZWidBPtdVG20L411wVI-BciiHYD9LjZgBMkmEOPO3Kyncy56PEQYjG8Sr5ZLMakuuGSVblJSQ4z6zjmZG3nnxPe1oV7wORM0NSSl4otBqJFQoCRdS8ziGmKJ3sK47T2kYxJJjknP1EHuemZDiCyGnD2P++smkMMQB+NMUJUQCKWsmSS4IkyPkGZNCKDtOhohEQUs+aNin+1KcY2R2TiFLJIas9ZOS9Zx0Cm4+GOoHa5FTh4YGG9wRREzCkOoYFi6FDyApXIEzu5FPqjgsp8zPmpO+bAGxDVak5IstoyqUsxHnwkbMsQJKvkQD3IShgxLcUVPqV1Di2zZ68QzgJAEHRURGidopAWikU6mjaIpF09phGS1EYU6lLzsXvNMSkwgBKiXSI+RU3JF1CKUsVc8rFki6VsvVZqll2q1XHg5QqWhACgUtPfKFJ84UOFiQRNAzetpRrIvaOBQox90GGqebEml8SID4FwPQagIowDCmDGSjuBqFVht9sqwyUaY00HjYmiAdquWApZs69IoC0wfmRLmCK0LohphqMNCKgjbRVAdtCD2Ia003SVSazGThqR4jDtTCOuBm7R0aTyoBVRnz-giguadw19T1GzCaHh7REHPkPsiDtDzT7duNVXQx8T+0CiMEOmmo6wCkGjg6lxTrGFpEhKBc2eQ8yLjSCuxBudW2IkqIUDIhZ0VUoPTM49qAB37BIOBrghNL2kD1TojBRrw2Zr7dBwdJ6iZwcLU47l9DeWmnacNf4z5KjKTzD+aESRnwInAaWUK9ogPIeMKGcMEBJBdlgNQJ+TNJ3GzLemf4aREHlkLBDZSNQpoxQksWOoEkJnMHIJIMc+BLwTvw4NKIClIqJjGYkeBy1W22xheA6j+pIWdD1ApSovR0ToEvfAR4VZi3NPVKpH49pJUjMSPCeK6R4G1EPpNX4K1TTBt3dEn2jnHUlvVAuALwFmjrsEc+UEASFxlvAsJCJ4CVqQqY+m9gazCa31Hi53ZOZ7R-g-A0dIRZCjZAhl0WoEDl4mjNEugr+7tqHD9uVhOhZKgpDSElloKXcgC2UomLUJYbbTszFULrMT+SEkWHMGwix+uacLO+YbZY2hjZWhNu2lRgkzYaGNX4DpFudsed1lbd0EmHSoZKU80W72xeiMaR8hZWiZhkqBPU2ZTvTdChdqV12ltRemdXaiW3jZRDhN+hcbCJLVAWxDTM1HczmzzOBZoUOplxOokZFqxVwQxdc3srINRUqlkFmWJL2ZTZ+KBnJ4a1QV6pEJ-o3t8TCr0VMueHA8OWnyUdvJOT8I4bNHgT+YSNp2hjYSJFMjPPMWHpKSTgXrUSq4FFx8OGkI6fyQZ5FNoP45L-iV1VoGPNwHq57Zr15JOr6UOOpuA3iAjk2gyMXfOQIs7pa1LJSFiC+GZFAo7kDsOWz92DlHL3CAxp-nhF0dI8RKjDQBFwoGEr6gmmEuFRIcJo8ob5yT+Prco7nur+rJPvxt4An4WaVtdPs5JDBQ0JSGZ4HFhuxFyZvPnc4Kr2PEOFMR516T4GwSElUTKXiGkOG2Zywp2yDRtSU0tRl4zRXlsOKdUpKT4kR0oDCPgORd6mFUDHygQ6Ag3IAJ5O3b3ctyuoHXeqoWcQlZ79P74DfwvS0gn6DYpA5AsKQogTFDpYfjaiFAdB8ILhtDgS74f6x57iH42rmIUCWLWK2JgAn4AgNqFDQjxCtZjQwKLhQjiRs5wgyZ6hoEw5Hpf5zJH7PxVIQCZLmrHhEE5zZ7iSrqCFwjxRJid5ww2xyZAwLhMHE4H7f54oaqMqgF6i1AIohLTrTqohZDxSZDbxphhYo7vgOxjSyERqsFmrsEMrLKvzvxrI9i8F0KuKlpGhqGIgtrVDXI6F2zZDDbp7pCKQP6JByq6KFbMFa7yFsHYH4qMqEDMqspWHYAn7ZDagKTZANDwj-AWZ+YjTdJyQJA7ZAx5hmGoaRrRqxp5qKCQAn4BYgQIhphmh6jTrGbRAP61CKSCIzaIitChQlH77LLob7An6-BJBHLzq8xLq1oIDCSQhBKIJIhJjfDc6v6RZE7mEtiYaQaazDqDxwbvY7IEb6jW6tDdInEiSfpCzQiIL2iZgAhGh9Ej6GSbF8hQYDqwbNzDHUELi2j5E5DNCUF2zvi+EIoAQ04IqdB3JMGsbVFOH3qtHah-F5Bg5phdD-AtFDRpCBbZYSZLptAKYQDkBJ5abDTWgZgOhmjebwJnLRD5FQgCLuJdBoi9BAA */
    id: "janitor",
    initial: "idle",
    context: {
      videos: [],
      deprecated: [],
      validated: [],
      progress: 0,
      dirty: false,
      models: [],
    },
    states: {
      "clean up videos": {
        states: {
          complete: {},
          "get video page": {
            initial: "load page",
            states: {
              "load page": {
                invoke: {
                  src: "loadVideoPage",
                  onDone: [
                    {
                      target: "find existing keys",
                      actions: "assignVideoPage",
                      cond: "page has videos",
                    },
                    { target: "#janitor.clean up videos.complete" },
                  ],
                },
              },
              "find existing keys": {
                invoke: {
                  src: "loadVideoKeys",
                  onDone: "#janitor.clean up videos.video page loaded",
                },
              },
            },

            description: `Load a list of videos by page number.`,
          },

          "video page loaded": {
            states: {
              "get current key": {
                initial: "wait",
                states: {
                  wait: {
                    after: {
                      1999: {
                        target: "go",
                      },
                    },
                  },
                  go: {
                    invoke: {
                      src: "getCurrentKey",
                      onDone: [
                        {
                          target:
                            "#janitor.clean up videos.video page loaded.find existing videos",

                          actions: assign((_, event) => {
                            // console.log({
                            //   innerText: event.data,
                            // });
                            return {
                              innerText: event.data,
                            };
                          }),

                          cond: "video has a key",
                          description: `If the video has a key, look it up in the db to see if one already exists.`,
                        },
                        {
                          target:
                            "#janitor.clean up videos.video page loaded.drop undefined",
                          // actions: "iterateVideo",
                          cond: "more videos",
                        },
                        {
                          target: "#janitor.clean up videos.get video page",
                          actions: "iteratePage",
                        },
                      ],
                    },
                  },
                },

                // invoke: {
                //   src: "getCurrentKey",
                //   onDone: [
                //     {
                //       target: "find existing videos",

                //       actions: assign((_, event) => {
                //         console.log({
                //           innerText: event.data,
                //         });
                //         return {
                //           innerText: event.data,
                //         };
                //       }),

                //       cond: "video has a key",
                //       description: `If the video has a key, look it up in the db to see if one already exists.`,
                //     },
                //     {
                //       target: "drop undefined",
                //       // actions: "iterateVideo",
                //       cond: "more videos",
                //     },
                //     {
                //       target: "#janitor.clean up videos.get video page",
                //       actions: "iteratePage",
                //     },
                //   ],
                // },

                description: `Use a regular expression to get the key from the current video.`,
              },

              "find existing videos": {
                invoke: {
                  src: "findMatchingVideos",
                  onDone: {
                    target: "find replacement",
                    actions: "assignMatching",
                  },
                },
              },

              "evaluate matches": {
                states: {
                  "iterate matches": {
                    always: [
                      {
                        target: "delete match",
                        cond: "more matches",
                      },
                      {
                        target:
                          "#janitor.clean up videos.video page loaded.get current key",
                        actions: "iterateVideo",
                        cond: "more videos",
                      },
                      {
                        target: "#janitor.clean up videos.get video page",
                        actions: "iteratePage",
                      },
                    ],
                  },

                  "delete match": {
                    invoke: {
                      src: "dropMatch",
                      onDone: {
                        target: "iterate matches",
                        actions: ["iterateMatch", "assignMessage"],
                      },
                    },
                  },
                },

                initial: "iterate matches",
              },

              "find replacement": {
                states: {
                  "check for existing": {
                    always: [
                      {
                        target: "search javdoe",
                        cond: "no replacement found",
                        actions: assign({ replacement: null }),
                      },
                      "#janitor.clean up videos.video page loaded.evaluate matches",
                    ],
                  },

                  "search javdoe": {
                    invoke: {
                      src: "searchByText",
                      onDone: {
                        target: "validate replacement",
                        actions: "assignReplacement",
                      },
                    },
                  },

                  "validate replacement": {
                    invoke: {
                      src: "checkVideoContent",
                      onDone: {
                        target: "add",
                        actions: "assignMissing",
                      },
                    },
                  },

                  add: {
                    states: {
                      "check content": {
                        always: [
                          {
                            target:
                              "#janitor.clean up videos.video page loaded.evaluate matches",
                            cond: "javdoe video is missing",
                          },
                          "save replacement",
                        ],
                      },

                      "save replacement": {
                        entry: assign((context) => ({
                          message: `Saving ${context.replacement?.Text}...`,
                          hue: "error",
                        })),

                        invoke: {
                          src: "persistReplacement",
                          onDone: [
                            {
                              target:
                                "#janitor.clean up videos.video page loaded.cast video",

                              cond: "old video has models",
                              actions: "assignModels",
                            },
                            {
                              target:
                                "#janitor.clean up videos.video page loaded.evaluate matches",
                              actions: "assignMessage",
                            },
                          ],
                        },

                        description: `Save found video to the database and return the record ID.`,
                      },
                    },

                    initial: "check content",
                  },
                },

                initial: "check for existing",
              },

              "drop undefined": {
                invoke: {
                  src: "dropCurrent",
                  onDone: {
                    target: "get current key",
                    actions: [
                      "iterateVideo",
                      "assignMessage",
                      assign({ dirty: true }),
                    ],
                  },
                },
              },

              "cast video": {
                states: {
                  "iterate models": {
                    always: [
                      {
                        target: "cast model",
                        cond: "more models",
                      },
                      "#janitor.clean up videos.video page loaded.evaluate matches",
                    ],
                  },

                  "cast model": {
                    invoke: {
                      src: "castModel",
                      onDone: {
                        target: "iterate models",
                        actions: "iterateModel",
                      },
                    },
                  },
                },

                initial: "iterate models",
              },
            },

            initial: "get current key",

            on: {
              pause: "paused",
            },
          },

          paused: {
            on: {
              resume: "video page loaded",
            },

            description: `Workflow is paused.`,
          },
        },

        initial: "get video page",
      },
      idle: {
        on: {
          start: {
            target: "clean up videos",
            actions: assign((_, event) => ({
              page: 1,
              startTime: Date.now(),
              dirty: false,
              index: 0,
              excludedDomain: event.domain,
            })),
          },
        },
      },
    },
  },
  {
    guards: {
      "video has a key": (_, event) => {
        // console.log({ innerText: event.data });
        return !!event.data;
      },
      "javdoe video is missing": (context) => !!context.missing,
      "no replacement found": (context) =>
        !context.validated.length && !!context.innerText,
      "more videos": (context) => {
        const { index, videos } = context;
        const more = index < videos.length - 1;
        // console.log({ index, videos, more });
        return more;
      },
      "page has videos": (_, event) => event.data.count > 0,
      "old video has models": (context) =>
        !!context.deprecated &&
        !!context.deprecated.length &&
        context.deprecated[0].models?.length,
      "more models": (context) => context.model_index < context.models.length,
      "more matches": (context) =>
        context.match_index < context.deprecated.length,
    }, //   return await getVideoByURL(address);
    actions: {
      iterateModel: assign((context) => {
        return {
          model_index: context.model_index + 1,
        };
      }),
      iterateMatch: assign((context) => ({
        match_index: context.match_index + 1,
        dirty: true,
      })),
      assignModels: assign((context, event) => ({
        models: context.deprecated[0].models,
        model_index: 0,
        ID: event.data,
      })),
      iterateVideo: assign((context) => {
        const { startTime } = context;
        const now = Date.now();
        const elapsed = now - startTime;
        const percentComplete = context.index / context.videos.length;
        const estimatedTotal = elapsed / percentComplete;
        const remaining = estimatedTotal - elapsed;

        const minutes = Math.floor(remaining / 1000 / 60);
        const seconds = Math.floor(remaining / 1000) % 60;

        const formatted = `${minutes}:${seconds.toString().padStart(2, "0")}`;

        return {
          index: context.index + 1,
          remaining: formatted,
          progress: 100 * (context.index / context.videos.length),
        };
      }),
      iteratePage: assign((context) => ({
        page: context.dirty ? context.page : context.page + 1,
        index: 0,
        dirty: false,
        startTime: Date.now(),
      })),
      assignMessage: assign((_, event) => ({
        message: event.data,
        hue: "success",
      })),
      assignMissing: assign((_, event) => ({
        missing: event.data,
      })),
      assignVideoPage: assign((_, event) => {
        const videos = event.data.records?.map((record) => {
          const Key = /([a-z|A-Z]+-\d+)/.exec(record.title);
          return {
            ...record,
            Key: !Key ? null : Key[1],
          };
        });
        return {
          videos,
          count: event.data.count,
          index: 0,
          startTime: Date.now(),
          dirty: false,
        };
      }),
      assignReplacement: assign((_, event) => ({
        replacement: event.data,
      })),
      assignMatching: assign((context, event) => {
        if (!event.data?.length)
          return { deprecated: [], validated: [], match_index: 0 };

        const deprecated = event.data.filter(
          (video) => video.domain === context.excludedDomain
        );

        const validated = event.data.filter((video) =>
          includedDomains.some((domain) => domain === video.domain)
        );
        return {
          deprecated,
          validated,
          match_index: 0,
        };
      }),
    },
    services: {
      loadVideoKeys: async (context) => {
        const Keys = context.videos
          .filter((video) => !video.Key)
          .map((video) => video.ID);
        // console.log({ Keys });
        return Keys;
      },
      castModel: async (context) => {
        // console.log(context.ID, context.models, {
        //   ID: context.models[context.model_index].ID,
        // });
        await addModelToVideo(
          context.ID,
          context.models[context.model_index].ID
        );
      },
      dropCurrent: async (context) => {
        const video = context.videos[context.index];
        console.log("deleting %s because it has no key", video.ID);
        await deleteVideo(video.ID);
        return `Deleted ${video.title} because it had no key`;
      },
      dropMatch: async (context) => {
        const video = context.deprecated[context.match_index];
        console.log("deleting", video.ID);
        await deleteVideo(video.ID);
        return `Deleted ${video.title}`;
      },
      searchByText: async (context) => {
        const address = `https://${approvedDomain}`;
        const answer = await getVideosByText(address + "/", context.innerText);
        if (answer.videos) {
          return answer.videos[0];
        }
        return false;
      },
      getCurrentKey: async (context) => {
        // alert(context.index);
        const { title } = context.videos[context.index];

        const key = /([a-z|A-Z]+-\d+)/.exec(title);

        if (key) {
          // console.log({ key: key[1], title });
          return key[1];
        }
        return false;
      },
      findMatchingVideos: async (context) => {
        const videos = await findVideos(context.innerText);
        // console.log({ videos });
        return videos.records;
      },
      persistReplacement: async (context) => {
        let favorite = 0;
        if (context.deprecated?.length) {
          favorite = !!context.deprecated[0].favorite ? 1 : 0;
        }
        const address = context.replacement.URL;
        const video = await getVideoByURL(address);
        const saved = {
          ...video,
          favorite,
        };
        // console.log({ favorite, saved });
        const num = await saveVideo(saved);
        if (isNaN(num)) {
          return 0;
        }
        return num;
        // return `Saved ${video.title} `;
      },
      loadVideoPage: async (context) => {
        // const [domain] = excludedDomains;
        // alert(context.excludedDomain);
        const videos = await getVideosByDomain(
          context.excludedDomain,
          context.page
        );
        // console.log({ videos });
        return videos;
      },
      checkVideoContent: async (context) => {
        // console.log({ check: context.replacement });
        if (!context.replacement?.URL) return true;
        const address = context.replacement.URL;
        const ok = await validateVideo(address);
        // console.log({ ok: ok.result });
        if (!!ok && ok.hasOwnProperty("result")) {
          return ok.result;
        }
        return true;
      },
    },
  }
);

const validateVideo = async (url) => {
  const ENDPOINT =
    "https://sd03bu0vvl.execute-api.us-east-1.amazonaws.com/check";
  const requestOptions = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ url }),
  };

  // console.log({ url });
  const response = await fetch(ENDPOINT, requestOptions);
  return await response.json();
};
