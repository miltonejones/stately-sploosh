import { useMachine } from "@xstate/react";
import { cartMachine } from "../machines/cartMachine";
import {
  getVideoInfo,
  getModelsByName,
  addModelToVideo,
  saveVideo,
  getVideo,
} from "../connector";
import { getVideoByURL } from "../connector/parser";

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

export const useCartMachine = (onRefresh) => {
  const [state, send] = useMachine(cartMachine, {
    services: {
      refreshList: async () => {
        onRefresh && onRefresh();
      },
      checkVideoContent: async (context) => {
        const address = context.chosen[context.save_index];
        const ok = await validateVideo(address);
        console.log({ ok: ok.result });
        return ok;
      },
      loadByURL: async (context) => {
        const address = context.chosen[context.save_index];
        return await getVideoByURL(address);
      },
      saveVideoObject: async (context) => {
        const { track_to_save } = context;
        return await saveVideo(track_to_save);
      },
      castModel: async (context) => {
        // alert(context.curateId);
        return addModelToVideo(context.ID, context.curateId);
      },
      castModels: async (context) => {
        const { stars_to_add, track_to_save } = context;
        if (stars_to_add?.length) {
          const { ID } = track_to_save;
          const IDs = stars_to_add.map((s) => s.ID);

          if (isNaN(ID)) {
            return false;
          }

          if (!IDs.length) return false;
          return Promise.all(IDs.map((s) => addModelToVideo(ID, s)));
        }
        return false;
      },
      loadModels: async (context) => {
        const { stars } = context.track_info;
        if (stars?.length) {
          const downloaded = await Promise.all(
            stars.map((s) => getModelsByName(s))
          );

          if (downloaded?.length) {
            const list = downloaded
              .filter((star) => {
                const model = stars.find(
                  (name) => !!star[0] && star[0].name === name
                );
                if (model) return model[0];
                return false;
              })
              .filter((f) => !!f);

            return list.map((f) => (Array.isArray(f) ? f[0] : f));
          }
        }
        return false;
      },
      verifyVideo: async (context) => {
        const video = await getVideo(context.ID);
        console.log({ video });
        return video;
      },
      curateVideo: async (context) => {
        const { track_to_save } = context;
        const { title, image, URL } = track_to_save;

        if (!URL) return false;

        const key =
          URL.indexOf("xvideo") > 0
            ? /\.com\/(.*)/.exec(URL)
            : /([a-z|A-Z]+[-\s]\d+)/.exec(title);

        if (key) {
          const info = await getVideoInfo(key[1]);
          return {
            ...info,
            key: key[1],
            old: title,
            image,
          };
        }
        return false;
      },
    },
  });

  const beginImport = (chosen, curateId) => {
    const type = state.can("start") ? "start" : "append";
    send({
      type,
      chosen,
      curateId,
    });
  };

  return {
    state,
    diagnosticProps: {
      id: cartMachine.id,
      states: cartMachine.states,
      state,
    },
    send,
    ...state.context,
    beginImport,
  };
};
