import { useMachine } from "@xstate/react";
import { cartMachine } from "../machines/cartMachine";
import {
  getVideoInfo,
  getModelsByName,
  addModelToVideo,
  saveVideo,
} from "../connector";
import { getVideoByURL } from "../connector/parser";

export const useCartMachine = (onRefresh) => {
  const [state, send] = useMachine(cartMachine, {
    services: {
      refreshList: async () => {
        onRefresh && onRefresh();
      },
      loadByURL: async (context) => {
        const address = context.chosen[context.save_index];
        return await getVideoByURL(address);
      },
      saveVideoObject: async (context) => {
        const { track_to_save } = context;
        return await saveVideo(track_to_save);
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
      curateVideo: async (context) => {
        const { track_to_save } = context;
        const { title, image, URL } = track_to_save;

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

  const beginImport = (chosen) =>
    send({
      type: state.can("start") ? "start" : "append",
      chosen,
    });

  return {
    state,
    send,
    ...state.context,
    beginImport,
  };
};
