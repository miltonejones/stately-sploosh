import React from "react";
import { Box, CardMedia, Skeleton, Tooltip } from "@mui/material";

export default function VideoMedia(props) {
  const [loaded, setLoaded] = React.useState(false);
  const [tall, setTall] = React.useState(false);
  React.useEffect(() => {
    const im = new Image();
    im.onload = () => {
      setLoaded(true);
      setTall(im.width < im.height);
    };
    im.src = props.image;
  }, [props.image]);

  if (!loaded) {
    return <Skeleton width={props.size} height={Math.floor(props.size)} />;
  }
  if (tall) {
    return (
      <Tooltip title={props.alt}>
        <Box
          onClick={props.onClick}
          style={{
            backgroundImage: `url(${props.image})`,
            width: props.size,
            height: Number(props.size * 0.5625),
            backgroundSize: "50% 100%",
          }}
        >
          &nbsp;
        </Box>
      </Tooltip>
    );
  }

  return (
    <Tooltip title={props.alt}>
      <CardMedia {...props} />
    </Tooltip>
  );
}
