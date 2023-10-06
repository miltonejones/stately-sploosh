import { Avatar, Stack, Tooltip, Typography } from "@mui/material";

export const StarAvatar = ({ star, openModel, ID, mr = 0 }) => (
  <Tooltip
    title={
      <Stack
        sx={{
          backgroundColor: "white",
          textAlign: "center",
        }}
      >
        {!!star.image && (
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
