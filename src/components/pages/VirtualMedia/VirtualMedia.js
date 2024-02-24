import {
  Card,
  IconButton,
  Pagination,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useVirtualMedia } from "./useVirtualMedia";
import MediaCard from "./MediaCard";
import Columns from "../../../styled/Columns";
import { getModelsByName } from "./connector";
import React from "react";

export default function VirtualMedia() {
  const media = useVirtualMedia();
  const [stars, setStars] = React.useState({});
  const [busy, setBusy] = React.useState(false);

  const getModel = async (s) => {
    if (stars[s]) return;
    setBusy(true);
    const [star] = await getModelsByName(s);
    if (star) {
      setStars((c) => ({
        ...c,
        [s]: star.image,
      }));
    }
    setBusy(false);
  };

  const { pages, param, page } = media.state.context;

  if (!pages) return <>Loading</>;
  return (
    <Stack sx={{ p: 2 }} spacing={1}>
      count: {pages.totalCount}
      <TextField
        value={param}
        label="Search for videos"
        placeholder="Search"
        fullWidth
        onChange={(e) => {
          media.setParam(e.target.value);
        }}
        size="small"
        InputProps={{
          endAdornment: !param ? null : (
            <IconButton
              onClick={() => {
                media.setParam("");
              }}
            >
              <i className="fa-solid fa-xmark"></i>
            </IconButton>
          ),
        }}
      />
      {pages.pageCount > 1 && (
        <Pagination
          count={pages.pageCount}
          page={page}
          onChange={(_, num) => media.setPage(num)}
        />
      )}
      <Columns sx={{ alignItems: "start" }} columns="1fr 1fr 1fr 1fr 1fr 1fr">
        {pages.visible.map((row) => (
          <MediaCard
            data={row}
            key={row.videoURL}
            getModel={getModel}
            setParam={media.setParam}
            stars={stars}
          />
        ))}
      </Columns>
    </Stack>
  );
}
