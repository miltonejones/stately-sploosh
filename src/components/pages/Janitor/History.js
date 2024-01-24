import React from "react";
import { VideoPersistService } from "../../../services";
import { getVideo } from "../../../connector";

import { createMachine } from "xstate";
import { assign } from "@xstate/fsm";
import { useMachine } from "@xstate/react";
import { Button, LinearProgress, Typography } from "@mui/material";
import videoStore from "../../../services/HistoryIndex";
const historyMachine = createMachine(
  {
    /** @xstate-layout N4IgpgJg5mDOIC5QFszIPYCcCWAvMmAdGAIaYA2AngMSwAuZdA2gAwC6ioADurNndnQA7TiAAeiALQBWaYQDsARhaKATC3mrFAZgAsLXat0AaEJSkBObYUPSWq7as3y78iwF93p1Bhz4iXJjoAMZwsIQwdAAEQmBi0QBu2BBg6NQQwmCE2EIJ6ADWWT5YeASEgSFhEWDRsfFRSSnoCDl5wSQCwqxs3aI8fJ0iSOKIinLa0toAbAAcqqoWbqpTLtqm5giTU4RO0opuLHYTY57eaCX+5UGhsOGRMXGJyanpmdm5BUXnfmUVN3c1B71RqpFofdqDbpMRQcYb9fiCIagCQICZyaTyKbaKyObQsKZTCzSdaILY7FxOIkWamY7SnEDFH4Ba5VWAkBJgKJ0dBRAAW2HoWBoGVi7zyhUIjNKzMqt0IbI5XJ5-MFmEoYLaHURUPYfV4COEohRU0U210uhmigs+N0Fix8hJCGU0l0hCm0hmuhcXsmpt09Kllz+rPZnO5fIF3LV1AIQQC5A6ADMsMhJd9pVdZeEFWHlZGhRqQlquuxenD9YMjYhzYpCCpZlaDBYZtITQ6zKN7KobLoPR63J77NIA+mgyy5RhFXU6NQxPQOlkSIm6AQABTSACU1EDv3H4UnnOnZe4FcRVc2eMIEyUFq0mMUM0d2hmFkIMxY03UNN7e39XgZo67lmkroFOjyzvOK6EEuK6YOuW47jK-wgWB8TQrCJ4DGewwopMcj7PItpTPYYyqLIjpqDMbrPtotHSMsD7Np4-5COgKTwMMiF6lhho4VIyjWEoKjqJoOj6IYjqSA+LCEBYZH2NomgaJ6Uwjr4GakBQGyYQaSIjJsHpXqa7rUlMPryGsHYIJI8gyYSKmto4RgaMO-6IZm-zcbp56SI4bq6FiBH2BojjElZCzyOSewWGo8gvh+rlnOpY7Afc04NM86BeZWfEIASboWdSXqLHJKxhRsz6uvILj7NaRx7C6akXEByE5kqEaqtpIDwjlyKICshCKIYhEsCw76tgsFiOtSciLIRM1xTMbgeG5gFIVUB5AnQ2XYX1CDmq+2impiB1WISjorFRbi9mNcnNmNqjMe4QA */
    id: "memorizer",
    initial: "early",
    context: {
      index: 0,
      added: [],
    },
    states: {
      early: {
        on: {
          start: {
            target: "process",
            actions: ["assignList"],
          },
        },
      },

      process: {
        states: {
          "get next video": {
            invoke: {
              src: "loadVideo",
              onDone: [
                {
                  target: "save to history",
                  cond: "video was found",
                  actions: "assignVideo",
                },
                {
                  target: "move next",
                  actions: "iterate",
                },
              ],
            },
          },

          "save to history": {
            invoke: {
              src: "commitVideo",

              onDone: {
                target: "move next",
                actions: ["iterate", "announce"],
              },

              onError: {
                target: "move next",
                actions: "iterate",
              },
            },

            description: `Save item to index db.`,
          },

          "move next": {
            after: {
              5: [
                {
                  target: "get next video",
                  cond: "more tracks",
                },
                "#memorizer.early",
              ],
            },

            description: `Move to the next item in the video array.`,
          },
        },

        initial: "get next video",
      },
    },
  },
  {
    guards: {
      "video was found": (_, event) => {
        if (!event.data.records?.length) {
          return false;
        }
        const vid = event.data.records[0];
        return ["ashemaletube.com", "javdoe.sh", "xvideos.com"].some(
          (f) => vid.domain === f
        );
      },
      "more tracks": (context) => {
        return context.index > 0;
      },
    },
    actions: {
      assignVideo: assign((context, event) => {
        return {
          video: event.data.records[0],
          index: context.index - 1,
          message: event.data,
          progress:
            100 - Math.floor((context.index / context.itemList.length) * 100),
        };
      }),
      announce: assign((context) => ({
        message: `Video ${context.video.title} was added`,
        added: context.added.concat(context.video.title),
      })),
      iterate: assign((context) => ({
        index: context.index - 1,
        progress:
          100 - Math.floor((context.index / context.itemList.length) * 100),
      })),
      assignList: assign((_, event) => ({
        itemList: event.items,
        index: event.items.length - 1,
      })),
    },
    services: {
      commitVideo: async (context) => {
        return videoStore.addItem(context.video);
      },
      loadVideo: async (context) => {
        const video = context.itemList[context.index];
        return await getVideo(video);
      },
    },
  }
);

export default function Historian() {
  const [state, send] = useMachine(historyMachine);
  const [items, setVideos] = React.useState([]);

  React.useEffect(() => {
    VideoPersistService.get().then((res) => {
      setVideos(res.slice(0, 7000));
    });
  }, []);

  return (
    <>
      {!!items.length && (
        <Button
          onClick={() =>
            send({
              type: "start",
              items,
            })
          }
        >
          start
        </Button>
      )}
      <Typography variant="subtitle1">
        {JSON.stringify(state.context.message)}
      </Typography>
      <LinearProgress value={state.context.progress} variant="determinate" />
      <pre>{JSON.stringify(state.value, 0, 2)}</pre>
      <pre>{JSON.stringify(state.context.index, 0, 2)}</pre>
      <pre>{JSON.stringify(state.context.video, 0, 2)}</pre>
      <pre>{JSON.stringify(state.context.added, 0, 2)}</pre>
      <pre>{JSON.stringify(state.context.itemList, 0, 2)}</pre>
    </>
  );
}
