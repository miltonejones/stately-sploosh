import React from "react";
import { Card, Snackbar, Typography, styled } from "@mui/material";
import { useMachine } from "@xstate/react";
import { carouselMachine } from "../../../machines/carouselMachine";

const CardCarousel = ({ images }) => {
  const [state, send] = useMachine(carouselMachine, {
    services: {
      loadImages: async () => images,
    },
  });
  const { running, first, index, second } = state.context;
  if (!first) return <>No images to display {JSON.stringify(images)}</>;
  const sec = images[(index + 1) % images.length];
  return (
    <Snackbar open>
      <Carousel>
        <Slide
          onClick={() => send({ type: "next", second: sec })}
          first
          src={first.src}
          moving={running}
        />
        <Slide src={second.src} moving={running} />
        <Caption moving={running}>
          <Text variant="subtitle2">{first.title}</Text>
          <Text variant="subtitle2">{first.caption}</Text>
        </Caption>
      </Carousel>
    </Snackbar>
  );
};

const Text = styled(Typography)(() => ({
  color: "white",
  mixBlendMode: "difference",
  whiteSpace: "nowrap",
  overflow: "hidden",
  textOverflow: "ellipsis",
  lineHeight: 1.1,

  maxWidth: "400px",
  width: "100%",
}));

const width = 400;
const height = width * 0.5625;

const Carousel = styled(Card)(({ theme }) => ({
  position: "relative",

  width,
  height,

  overflow: "hidden",
  marginTop: theme.spacing(1),
  borderRadius: 15,
  cursor: "pointer",
}));

const Slide = styled("img")(({ first, moving }) => {
  const transition = moving ? "left 0.4s linear" : "none";
  const firstLeft = moving ? "-100%" : 0;
  const secondLeft = moving ? 0 : "100%";
  const obj = {
    width: 480,
    aspectRatio: "16 / 9",
    position: " absolute",
    top: 0,
    transition,
    left: first ? firstLeft : secondLeft,
  };
  return obj;
});

const Caption = styled(Card)(({ theme, moving }) => ({
  position: "absolute",
  bottom: 40,
  left: 20,
  minWidth: 300,
  opacity: moving ? 0 : 0.7,
  transition: "opacity 0.4s linear",
  backgroundColor: theme.palette.common.black,
  padding: theme.spacing(1, 2),
}));

export default CardCarousel;
