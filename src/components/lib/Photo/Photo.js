import React from "react";

import { useMachine } from "@xstate/react";
import { imageMachine } from "../../../machines";

export const usePhoto = (source, backup) => {
  let src = source;
  if (source?.indexOf("img.javdoe.sh") > 0) {
    src = source
      .replace("img.javdoe.sh", "javdoe.sh/media/videos")
      .replace("/javdoe.sh/media", "/pics.javdoe.sh/media");
  }
  if (source?.indexOf("/javdoe.sh/media") > 0) {
    src = source.replace("/javdoe.sh/media", "/pics.javdoe.sh/media");
  }

  const [state, send] = useMachine(imageMachine, {
    services: {
      loadPhoto: () =>
        new Promise((resolve) => {
          const im = new Image();
          im.onload = () => {
            resolve(src);
          };
          im.onerror = () => {
            throw new Error("could not load image '" + src + "'");
          };
          if (!src) {
            throw new Error("no source");
          }
          im.src = src;
        }),
    },
  });

  return {
    image: state.matches("loaded") ? src : backup,
    tries: state.context.retries,
    handleError: () => send("ERROR"),
  };
};

const Photo = ({ src, backup, ...props }) => {
  const img = usePhoto(src, backup);

  return <img src={img.image} alt={img.image} {...props} />;
};
Photo.defaultProps = {};
export default Photo;
