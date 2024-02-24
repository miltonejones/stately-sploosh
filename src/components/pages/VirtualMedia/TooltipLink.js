import { Link, Stack, Tooltip, Typography } from "@mui/material";

export default function TooltipLink({ stars, first, ...props }) {
  return (
    <Tooltip
      title={
        <Stack>
          {!!stars[first] && (
            <img
              src={stars[first]}
              alt={first}
              style={{ width: 180, aspectRatio: "3/4" }}
            />
          )}
          <Typography>{first}</Typography>
        </Stack>
      }
      onOpen={() => props.getModel && props.getModel(first)}
    >
      <Link
        sx={{ cursor: "pointer" }}
        onClick={() => {
          props.setParam(first);
        }}
        underline="hover"
        variant="caption"
      >
        {first}
      </Link>
    </Tooltip>
  );
}
