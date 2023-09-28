import { useMachine } from "@xstate/react";
import { previewMachine } from "../machines/previewMachine";
import { getVideoByURL } from "../connector/parser";

export const usePreview = () => {
  const [state, send] = useMachine(previewMachine, {
    services: {
      loadVideo: async (context) => {
        return await getVideoByURL(context.URL);
      },
    },
  });

  return {
    state,
    send,
    ...state.context,
    handleClose: () => send("close"),
    handleOpen: (event, URL) => {
      // alert(URL);
      // alert(JSON.stringify(state.value));
      send({
        type: "open",
        anchorEl: event.currentTarget,
        URL,
      });
    },
  };
};
