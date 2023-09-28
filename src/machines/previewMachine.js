import { assign, createMachine } from "xstate";
export const previewMachine = createMachine(
  {
    /** @xstate-layout N4IgpgJg5mDOIC5QAcBOYBuBLMB3ABALYCGAxgBZYB2YAdFhADZgDEA9smFQNoAMAuohRtYWAC5Y2VISAAeiAEy9etAMwA2ABwBWAIwBOVbu36TCzQBoQAT0QB2fbWOqALOt52jHlwF8fVtEwcAhIKajoYMXxsCDA2fFixYixGWBYIKTpqDDYAazpA7DwiMkoaWkjohjiEsCSU2ARstlJiCSk+fk6ZZBFxSWkkOURtJSddT2NtFxddVX0XK1sEBRdVJxd9BVVNO15NXhMNPwD0IpDS8Iq6qtj4xOTUljBUVDZUWmRGNoAzd8JPmdgiUwuVKjEag8Gk0qDlWu0eAJukNeqIETJ5Ag9LpaA4HPpePNdMoFktEABadQuWiaXTuTTqKkuA56bQnECFYGhMp0QhsCDERj4DhcFikRgiMDI4RogYYilbWiM3QKbbqOkMwyLGyIFzTGlufT6YwKdT6ensznFblXF5vVBiiWwKUCHp9dFDTHk4k41SqBT6TQKOwGWa6XRkhDk7Z2Wh6Wk7VXKfa+dlUflwHpA62XGhu2VSeVR3SbNT+wPB0PhlWR8n+7S0Xi6BNG5kE9TTS3Zi6grJMMD5-qFz0Ujs00yHUYmEvqVR2SM+mkHXiqvSrVeaLtBHO965RCH3OqPeAo91ykcIZkKWgKasrpRuOy7bSRzSaJVbc0qtx67RNrfnCCPK0HyApCiKgwykOkHDFiay0Gs6gOB4vDuC4niRm477aG+-quDsdh-my-gct2QG2q87yDh6oCYtM17NnYHYamsriWDqxbmk4OEaHsc5+toSF+H4QA */
    id: "preview machine",
    initial: "idle",
    context: {
      URL: null,
      video: null,
      open: false,
      anchorEl: null,
    },
    states: {
      idle: {
        on: {
          open: {
            target: "get video details",
            actions: assign((_, event) => ({
              URL: event.URL,
              anchorEl: event.anchorEl,
              open: true,
            })),
          },
        },
      },

      "get video details": {
        invoke: {
          src: "loadVideo",

          onDone: {
            target: "modal open",
            actions: assign((_, event) => ({
              video: event.data,
            })),
          },

          onError: {
            target: "error",
            actions: "assignProblem",
          },
        },
      },

      "modal open": {
        on: {
          close: {
            target: "idle",
            actions: "assignClose",
          },
        },
      },

      error: {
        on: {
          close: {
            target: "idle",
            actions: "assignClose",
          },
        },
      },
    },
  },
  {
    actions: {
      assignClose: assign({
        open: false,
        video: null,
        URL: null,
        anchorEl: null,
      }),
      assignProblem: assign((_, event) => {
        return {
          errorMsg: event.data.message,
          stack: event.data.stack,
          open: true,
        };
      }),
    },
  }
);
