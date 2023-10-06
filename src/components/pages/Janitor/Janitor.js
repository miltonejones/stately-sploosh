import React from "react";
import { assign, createMachine } from "xstate";
import {
  addModelToVideo,
  deleteVideo,
  findVideos,
  getVideosByDomain,
  saveVideo,
} from "../../../connector";
import { useMachine } from "@xstate/react";
import {
  Avatar,
  Box,
  Button,
  Card,
  Chip,
  Dialog,
  LinearProgress,
  Skeleton,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { getVideoByURL, getVideosByText } from "../../../connector/parser";
import { PhotoCard } from "../../lib/ShoppingDrawer/Cards";
import { Flex, Spacer } from "../../../styled";
import { VideoCard } from "../../lib";
import { approvedDomain, includedDomains } from "../../../const";

function getObjectPath(obj, path = []) {
  for (let key in obj) {
    if (typeof obj[key] === "object") {
      getObjectPath(obj[key], [...path, key]);
    } else {
      return [...path, key].join(".");
    }
  }
}
function extractPaths(obj, currentPath = [], paths = []) {
  Object.keys(obj).forEach((key) => {
    const newPath = currentPath.concat(key);
    if (typeof obj[key] === "object" && obj[key] !== null) {
      extractPaths(obj[key], newPath, paths);
    } else {
      paths.push(newPath.join("."));
    }
  });
  return paths;
}

export default function Janitor() {
  const [domains, setDomains] = React.useState([
    "javdoe.tv",
    "javdoe.to",
    "javdoe.com",
    "javfinder.la",
  ]);
  const [domain, setDomain] = React.useState();
  const [doomed, setDoomed] = React.useState(null);

  const width = Math.floor((1 / domains.length) * 100) - 2;
  const third = Math.floor(window.innerWidth / domains.length) - 80;

  return (
    <>
      <Dialog open={!!doomed}>
        <Stack spacing={1} sx={{ width: 400, p: 2 }}>
          <Typography variant="subtitle2">Confirm Close</Typography>
          <Typography>Close {doomed}?</Typography>
          <Flex>
            <Spacer />
            <Button onClick={() => setDoomed(null)}> cancel</Button>
            <Button
              onClick={() => {
                setDomains((f) => f.filter((e) => e !== doomed));
                setDoomed(null);
              }}
              variant="contained"
            >
              close
            </Button>
          </Flex>
        </Stack>
      </Dialog>
      {/* {third}/{width} */}
      <Flex sx={{ alignItems: "baseline" }} spacing={1}>
        {domains.map((domain) => (
          <Card
            elevation={2}
            variant="elevation"
            sx={{ m: 1, width: `${width}vw` }}
          >
            <JanitorBit
              key={domain}
              domain={domain}
              remove={() => setDoomed(domain)}
              width={third}
            />
          </Card>
        ))}
      </Flex>
      <Flex sx={{ p: 1 }} spacing={1}>
        <TextField
          label="Domain"
          size="small"
          name="domain"
          onChange={(event) => {
            setDomain(event.target.value);
          }}
          value={domain}
        />
        <Flex>
          <Button
            variant="contained"
            onClick={() => {
              setDomain("");
              setDomains(domains.concat(domain));
            }}
          >
            add
          </Button>
        </Flex>
      </Flex>
    </>
  );
}

function JanitorBit({ remove, domain, width }) {
  const [state, send] = useMachine(janitorMachine);
  const {
    page,
    index,
    // videos,
    count,
    replacement,
    missing,
    innerText,
    deprecated,

    validated,
    progress,
    message,
    hue,
    remaining,
    model_index,
    models,
  } = state.context;

  // const [domain] = excludedDomains;
  let path = extractPaths(state.value);

  // console.log(JSON.stringify(state.value));

  const stars = models?.filter((f) => !!f.image);

  return (
    // <Stack>

    <Stack sx={{ justifyContent: "flex-start", alignItems: "flex-start" }}>
      <Stack sx={{ width: "100%", p: 1 }}>
        {!state.can("start") && (
          <>
            <Typography variant="caption">
              Page: {page}/{index}, Count: {count} , Remaining: {remaining}
            </Typography>
            <Box>
              {" "}
              <LinearProgress
                variant={!!progress ? "determinate" : "indeterminate"}
                value={progress}
              />
            </Box>
            <Stack sx={{ p: 1 }} spacing={1}>
              <Box sx={{ width }}>
                {!!deprecated.length && (
                  <VideoCard medium video={deprecated[0]} />
                )}
                {!deprecated.length && (
                  <Skeleton
                    variant="rectangular"
                    width={width}
                    height={width * 0.75}
                  />
                )}
              </Box>
              <Box sx={{ pt: 1 }}>
                {!!replacement && !validated.length && (
                  <PhotoCard size={width} {...replacement} existing={missing} />
                )}
                {!replacement && !validated.length && (
                  <Skeleton
                    variant="rectangular"
                    width={width}
                    height={width * 0.7}
                  />
                )}
              </Box>
              <Box sx={{ width }}>
                {!!validated.length && (
                  <VideoCard medium video={validated[0]} />
                )}
              </Box>
            </Stack>
            {!!stars.length && (
              <Flex sx={{ p: 1 }} spacing={1}>
                {stars.map((model, i) => (
                  <Avatar
                    sx={{
                      border: `solid 2px ${i === model_index ? "red" : "gray"}`,
                    }}
                    src={model.image}
                    key={model.ID}
                    alt={model.Name}
                  />
                ))}
              </Flex>
            )}
          </>
        )}

        <Flex spacing={1} sx={{ p: 1 }}>
          <Typography variant="caption">{path.join(".")}</Typography>
        </Flex>
        <Flex sx={{ pb: 2 }} spacing={1}>
          <Chip label={domain} color="primary" size="small" onDelete={remove} />
          <Button
            variant="contained"
            disabled={!state.can("start")}
            onClick={() =>
              send({
                type: "start",
                domain,
              })
            }
          >
            go
          </Button>
          <Button
            variant="contained"
            disabled={!state.can("pause")}
            onClick={() => send("pause")}
          >
            pause
          </Button>
          <Button
            variant="contained"
            disabled={!state.can("resume")}
            onClick={() => send("resume")}
          >
            resume
          </Button>
        </Flex>

        {!state.can("start") && (
          <>
            <Typography>
              Key: <b>{innerText}</b>
            </Typography>
            {!!deprecated.length && (
              <Typography
                color={!replacement ? "error" : "success"}
                variant="caption"
              >
                {deprecated[0].title}
              </Typography>
            )}
            <Typography color={missing ? "error" : "success"}>
              {replacement?.Text || "Finding replacement..."}
            </Typography>
            <Typography color="text.secondary" variant="caption">
              {message}
            </Typography>
          </>
        )}
      </Stack>
    </Stack>

    // </Stack>
  );
}

const janitorMachine = createMachine(
  {
    /** @xstate-layout N4IgpgJg5mDOIC5QCsCGA7AlgFwPYCcA6AYwBswMACAVwAdKA3TCMXWQmbR51y21GAGIIudGEKZ0DXAGtxaLHiJkK6GvSYs2HMF029+MBJOnFU2TKIDaABgC6tu4lC02OS+mcgAHogC0AKwALACchAAcAGwA7NGRAEzh0SHxQeEhADQgAJ6IAMx5YTHxecmFNilB0XkAvjVZCjgEJORUdNxa7Pq4fAJglKS4qCwQgvzUsGCOXq6w7qJevgh+AIwrYSEBNuE2kQErkStBe5k5-iupNoQh28dBNvHxIVHRdQ0YTcqtau3dXTw9Qz9QbDSA6LhybKUXAAM0oxGo+HwYHQegBwlE4hMsnkHyULVU6g6rH+Wl6MAGQxG4MokOhcIRSJRaK0xikuDMFms9mmSBAs3mnj5Sz8eSChCCeV2B3CeRWUryAXCWVyyxW23CEvC6qCAS2AXikSibxAjXxKjaGgBpIMfUpoIgNLpsPhiORqOJuAxYgk7LkhDNzQtPytnUI3XJwKpYM4tLAUJdjPdLNYbNM5g8jisKycfIFXKFoBF6yu8QCkQK8RW4XCqUi9ZV-iN4uiuoNups+yNJsDX0Jv2t4YBkft1NjzoZbuZnu9WL9uMUQe+RL+Q7JQNHMd0cYTk6ZHu6aY5Ge5DniuZcbgLi3O1ci13VkRSa2StcbyyfAWuyXWeSrUVlcIezxJd+1DEk11tCkQWpGFJAgSgwG8TBYAsdAoE9WBZ19aR-V7AlLUwyDATtGCwTg9AEKQlC0Iwv4j05TMeXsGYrw8G8EBucUVmifYxRCUIHkVd9Vl2eJrm1GxOxrQ0a0iYDFz7QjVwjDcyMdMAGFQUhqHMfoAFtzGIAALOAJGwMB8D0yhDOwEy4EEXlLzma9hXyG5CDibV4hsFY9WeIJJXfSVxLFJIZMOJ4QhCBTPgIkMiNU0jow0rSdOs2z7PYHBLIyozTKw7ML35NiFjc5Z4miQgjiqYJeKOPY0iCYKKkIBJHgOJVqmibZYvNZcBzDJLoJSwhNO03SLJs-KzJyqypsygrHPPViXPY8q-FbTVKqiEo9vudZgqrTyq2COSAmiHj4j60DlMHYaowdMa0smgyZvYFhyAW-LsOxPCQKUhKVOHNTRvG9LvrsgrCE+3Q3qhhiT3QLMWLzUrCx8RBIlCQhyyCJ48kiGw-xCUp3ziFYIgue59lfGwqhuwGV3ukHkqeiiEORWhSFQYgwH05kSFM4gZEoGECEQ5DUMkKBHNR5zBQ4pIvylHjjhSBJtQCETkiKWtdRp-H61qepTQB+LmaG1mRvZ+DKC5nm+YF1EhbAEWxYl6jpfQxyc1WxXys2cSacVQ4qkq05VXuMI4gE2UnmJhrGYtwaIIezdHQ5+2wG53n+cFyZUHwEzKDQBgRDAX75wDc3g0ttPrce2C7YdvPnewQhC+L4zS9QcvcDARGCxR4r83WotEAuMsJT2HYEliW5tbOD8tmqhI9RsOJtkSeTTfwuvU+0dP1MILPW6dwW0uYazz-z1Eq9whc4oP8Cj8bjPT5bnPHbvjur4gG+3827MiHkxBw8sSprTKhPBAFxdi4xiHkJIf4ggHD2CJfiEQ9Tyl-NEQ0IRqjJxfold+J8z5AIvi7YYnMKG-1du7YgogLL3ycpAgOMC1iBTajxTsMRgipHlO+DeEp8YhArHggKFQiEDVfjaEiNtm6UWzrnShHdqHKJ-u3ehotGGomZL7Ue6MOIXB6hEJBF1tTqkSJVd8tZqpxGCPWB4yDd7vEUinWRxERxkK-iouh6jb5aNgH3fogT9EiB9H9J+-UwIkPXGzRRNC-FaICbQoJISNHANRKA08rCx7QMxrAvUmpYjhGOL5A4xxEjvmxpTaooRqyPHCPsAIMU961xkXEqCTdyK+M0YLVJySC4ZLCffCJc5H413ccQ4G8SFG9KUaMtREAkn9JdsEhgoS0kgOxIxXJfs0ZQIxksdUPFqp6n2FJY4MRojKmXocMIUl45xFuftaRsTZndI-hAfAuB6DUEomACikAH44imc-Tpnz5E9MdD8v5NBAXAogDk5GzFDFHI4n4OxF1dilDwccKUMQRI+TyG1AScoerJH2I8a67TpmQsHOMSYoxkSwGoALPJRiNpKglDcC4coCGawNCJC4AkRH7GaYcescQTZuLiswcgghUJF2wJyjFG0GqUwOHKNIJRsGpBEuWK45Z1TxyiC0tpcqYl3StnMmFJBUCoU9OZXKC1cCfUKhA-JxzJ6lLap2Ks1QLh+TKbYjy5TfwvgOJdd5NqG52o-mYJ13QXXzQMu6sApBCoHIVq5DhRtrgCTLFKemRql6qnSFcCNpMo0xBWLGoGLME0nyTSmXADqnX6QzaQUF-16UfKbV8ltjq20dq4F2z6KKR7+zzYUklmpiib18kkfG+N3xrEJhEbUgVqwhAOH5Xept0AZvgHyXsM7x6FNWLxL8xRsZVLqtqEVF17x7D2FJaSzxXFm37XGtgF6CnFhKJqKUNY90VANDWPIIq0hhAPVUImspJQEIbfXbQsYHoAZ9WqEshBQPpHVEHKD75CbbSfLqisVTOyocPnI7xKUsOYuA4QMsFY-zVn1vWSIIqeJfmeI+OO2wjhATpRCgdtqh2jXHPGekrp9xtsYxtUoeGxQXQIVc250Hl5+SqqEKsRpqh-h6hWGjnjj6jSzl7WimFFMwP2JTbdT4bjajkvEEVuwvxlg7OWbGWwTOietY2iT0KP7g1etNKGcBbOFLFOJLycC-KtLKUFZesXcbPDiLJXicpdima6SFk+YW8qReyhZNNEWsrRaWHsSmkoji8XKYTOIwUpSEAqOFLjUpYiEzy1C+jT0iuQyyjDTNcMKvGSq+5ODj59OnT-CUcmrTcZIK-QQw0PkAi9cHQVizfSsnYEmwgAIf4WMyVKHW-GRwRKVpY52UmKQCFRE3lt4L-XEmZNUdoj2+BJY0RlodpUpYzsvKOFWZqy9NpJC3f5Vsm8SixBe-GyTttFnbPWRQbuvd+5gEO8G0KJMCOwYrNdh4nk7urpLJ+RHb9m27dR0Ml2-9AEM4O4c9hhTg1XCQaBqohReJ3NVIEVqtzOyBTEWKS71O6OgxR6s-bhBBlrNZ7my9JzqaeVg7EfG3OawwdJX+bYXVjjNL3d+-eDLXsy-e0shXKyPt0PsgwphzJcdXQ1+kLXwGkEC-8HqCIPkoh3jnjsETVrbpBaRzt2X9uUl25txsrZLPcd1Ta3cdjYjtjRRqSU6sDwl28QEtFKXXirdgjhf8xFkhICHdWKgh8uxJT3uCJvDBBDuGBRkhUeUFRXgBfD2h6XCSwSts9Lj6oVwiYGh4nKU6obl47DqaczYtZDTHdlT+sTf72BMur2z2dIpZQRF1A1zehwlTPBg75Nq5YjWhAafjZOCqcd79V+cSlbU8H3vXlUJ9EPjtVSQ2O0aVaUNF7zDyZloxLyH0dBHxTTmgym7VPRV0A0QB8j8mv1bE2Hmy2CiFsRrBY1OSiELxaWL3MyelgIBDHRsm7TH2SFxmaQuh-EajlHXXlHFCJmSCcwKFJjqDqCAA */
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
            invoke: {
              src: "loadVideoPage",
              onDone: [
                {
                  target: "video page loaded",
                  actions: "assignVideoPage",
                  cond: "page has videos",
                },
                { target: "complete" },
              ],
            },

            description: `Load a list of videos by page number.`,
          },

          "video page loaded": {
            states: {
              "get key of current video": {
                invoke: {
                  src: "getCurrentKey",
                  onDone: [
                    {
                      target: "find existing videos",

                      actions: assign((_, event) => {
                        console.log({
                          innerText: event.data,
                        });
                        return {
                          innerText: event.data,
                        };
                      }),

                      cond: "video has a key",
                      description: `If the video has a key, look it up in the db to see if one already exists.`,
                    },
                    {
                      target: "drop undefined",
                      // actions: "iterateVideo",
                      cond: "more videos",
                    },
                    {
                      target: "#janitor.clean up videos.get video page",
                      actions: "iteratePage",
                    },
                  ],
                },

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
                          "#janitor.clean up videos.video page loaded.get key of current video",
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
                    target: "get key of current video",
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

            initial: "get key of current video",

            on: {
              pause: "paused",
            },
          },

          paused: {
            on: {
              resume: "video page loaded",
            },
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
        console.log({ innerText: event.data });
        return !!event.data;
      },
      "javdoe video is missing": (context) => !!context.missing,
      "no replacement found": (context) =>
        !context.validated.length && !!context.innerText,
      "more videos": (context) => {
        const { index, videos } = context;
        const more = index < videos.length - 1;
        console.log({ index, videos, more });
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
      assignVideoPage: assign((_, event) => ({
        videos: event.data.records,
        count: event.data.count,
        index: 0,
        startTime: Date.now(),
        dirty: false,
      })),
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
      castModel: async (context) => {
        console.log(context.ID, context.models, {
          ID: context.models[context.model_index].ID,
        });
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
          console.log({ key: key[1], title });
          return key[1];
        }
        return false;
      },
      findMatchingVideos: async (context) => {
        const videos = await findVideos(context.innerText);
        console.log({ videos });
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
        console.log({ favorite, saved });
        return await saveVideo(saved);
        // return `Saved ${video.title} `;
      },
      loadVideoPage: async (context) => {
        // const [domain] = excludedDomains;
        // alert(context.excludedDomain);
        const videos = await getVideosByDomain(
          context.excludedDomain,
          context.page
        );
        console.log({ videos });
        return videos;
      },
      checkVideoContent: async (context) => {
        console.log({ check: context.replacement });
        if (!context.replacement?.URL) return true;
        const address = context.replacement.URL;
        const ok = await validateVideo(address);
        console.log({ ok: ok.result });
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

  console.log({ url });
  const response = await fetch(ENDPOINT, requestOptions);
  return await response.json();
};
