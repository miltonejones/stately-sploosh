import React from "react";
import { Avatar, Box, Button, Stack, Tooltip, Typography } from "@mui/material";

export const StarAvatar = ({ star, openModel, ID, mr = 0 }) => {
  const [loaded, setLoaded] = React.useState(false);

  React.useEffect(() => {
    const im = new Image();
    im.onload = () => {
      setLoaded(true);
    };
    im.src = star.image;
  }, [star.image]);

  return (
    <Tooltip
      title={
        <Stack
          sx={{
            backgroundColor: "white",
            textAlign: "center",
          }}
        >
          {!loaded && (
            <Box sx={{ p: 2 }}>
              <Button onClick={() => openModel(star.ID)}>
                Open model details
              </Button>
            </Box>
          )}

          {!!star.image && loaded && (
            <img
              onClick={() => openModel(star.ID)}
              src={star.image}
              alt={star.Name}
              style={{
                width: 160,
                aspectRatio: "2.1 / 3",
              }}
            />
          )}
          <Typography variant="caption" sx={{ color: "black" }}>
            {star.Name}
          </Typography>
        </Stack>
      }
    >
      <Avatar
        onClick={() => openModel(star.ID)}
        src={star.image}
        alt={star.name}
        sx={{
          mr,
          border: `solid 2px ${star.ID === ID ? "red" : "gray"}`,
        }}
      />
    </Tooltip>
  );
};
