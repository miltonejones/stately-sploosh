import React from "react";
import {
  Avatar,
  Button,
  Card,
  CardContent,
  CardMedia,
  Collapse,
  IconButton,
  InputAdornment,
  LinearProgress,
  Snackbar,
  Stack,
  Typography,
  TextField,
  styled,
  Box,
  Dialog,
} from "@mui/material";
import { ScrollingText, Photo, ModelCard } from "..";
import { Flex, HilitText, Nowrap, Spacer } from "../../../styled";
import { DEFAULT_IMAGE } from "../../../const";
import { usePhoto } from "..";
import VideoMedia from "../VideoCard/VideoMedia";

export const StyledTextField = styled(TextField)(() => ({
  "& .MuiInputBase-root": {
    borderRadius: 30,
    // backgroundColor: "#fff",
    paddingLeft: 16,
    paddingRight: 16,
  },
  "& .MuiOutlinedInput-notchedOutline": {
    border: "none",
  },
  "& .MuiInputAdornment-positionEnd": {
    marginRight: 8,
  },
  "& .MuiInputAdornment-root": {
    color: "rgba(0, 0, 0, 0.54)",
  },
}));

export const PhotoCard = ({
  Text,
  Photo,
  Time,
  URL,
  Key,
  dupes,
  domain,

  active,
  param,
  params,
  size = 200,
  onClick,
  existing,
  viewer,
}) => {
  const { image } = usePhoto(Photo, DEFAULT_IMAGE);

  const preview = (event, url) =>
    !viewer ? false : viewer.handleOpen(event, url);
  return (
    <Card
      sx={{
        outline: active ? "solid 2px green" : "",
        border: dupes?.length > 0 ? "dotted 1px red" : "",
        cursor: "pointer",
        width: size,
        opacity: existing || dupes?.length > 0 ? 0.5 : 1,
        position: "relative",
      }}
    >
      <VideoMedia
        onClick={onClick}
        component="img"
        size={size}
        sx={{ borderRadius: 2, width: size - 16, aspectRatio: "16 / 9" }}
        width="100%"
        height="auto"
        image={image}
        alt={Text}
      />
      <CardContent
        sx={{
          p: (t) => t.spacing(1) + " !important",
        }}
      >
        <Stack>
          {/* [{Key}][{dupes?.length}] */}
          <ScrollingText
            variant="body2"
            sx={{
              whiteSpace: "nowrap",
              fontWeight: 600,
              textOverflow: "ellipsis",
              overflow: "hidden",
              width: "100%",
            }}
            color="text.primary"
          >
            <HilitText values={params} value={param}>
              {Text}
            </HilitText>
          </ScrollingText>
          <Stack direction="row">
            <Typography variant="caption">{Time}</Typography>
            <Box sx={{ flexGrow: 1 }} />
            <Typography variant="caption">{domain}</Typography>
            <IconButton
              disabled={!viewer?.state.can("open")}
              sx={{ width: 18, height: 18 }}
              onClick={(event) => preview(event, URL)}
            >
              &crarr;
            </IconButton>
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
};

export const CuratorCard = ({ curator, minimal, handleMode, handleModel }) => {
  const [right, setRight] = React.useState(true);
  const saving = !["ready"].some(curator.state.matches);
  const { track_to_save, stars_to_add, pausing } = curator.state.context;

  return (
    <>
      <Dialog open={curator.state.matches("error")}>
        <Box sx={{ p: 2 }}>
          <Stack>
            <Nowrap variant="caption" muted>
              There was an error processing this request
            </Nowrap>

            <Typography width={360}>
              <b>{curator.source}</b>: {curator.error}{" "}
            </Typography>

            <Flex spacing={2}>
              <Spacer />
              <Button
                variant="contained"
                onClick={() => curator.send("recover")}
              >
                Next
              </Button>
            </Flex>
          </Stack>
        </Box>
      </Dialog>
      <Snackbar
        anchorOrigin={{
          vertical: "bottom",
          horizontal: right ? "right" : "center",
        }}
        open={!!saving}
      >
        <Card onClick={handleMode}>
          {!!track_to_save && (
            <Flex>
              <Stack sx={{ p: 2, minWidth: 360 }} spacing={1}>
                <Typography variant="caption" onClick={() => setRight(!right)}>
                  {JSON.stringify(curator.state.value)}
                </Typography>
                {!minimal && (
                  <Photo
                    backup={DEFAULT_IMAGE}
                    src={track_to_save.image}
                    alt={track_to_save.title}
                    style={{
                      width: 360,
                      aspectRatio: "16 / 9",
                      borderRadius: 4,
                    }}
                  />
                )}

                <Stack
                  direction="row"
                  sx={{ alignItems: "center" }}
                  spacing={1}
                >
                  {!!minimal && (
                    <Avatar
                      sx={{ aspectRatio: "16/9" }}
                      variant="square"
                      src={track_to_save.image}
                    />
                  )}
                  <Typography sx={{ maxWidth: 360 }} variant="body2">
                    {curator.message}
                  </Typography>
                </Stack>

                <Typography sx={{ maxWidth: 360 }} variant="caption">
                  {track_to_save.title}
                </Typography>
                {/* 
              {curator.state.matches("error") && (
                <Stack>
                  <Nowrap variant="caption" muted>
                    There was an error processing this request
                  </Nowrap>

                  <Nowrap width={360}>
                    <b>{curator.source}</b>: {curator.error}{" "}
                  </Nowrap>

                  <Flex spacing={2}>
                    <Button
                      variant="contained"
                      onClick={() => curator.send("recover")}
                    >
                      Next
                    </Button>
                  </Flex>
                </Stack>
              )} */}

                <Stack>
                  {!!curator.chosen?.length && (
                    <Flex spacing={1}>
                      <Typography variant="caption">
                        {curator.save_index} of {curator.chosen.length}
                      </Typography>
                      <Typography color="error" variant="caption">
                        {curator.skipped} skipped
                      </Typography>{" "}
                    </Flex>
                  )}
                  <Box>
                    <LinearProgress
                      variant={
                        !curator.progress ? "indeterminate" : "determinate"
                      }
                      value={curator.progress}
                    />
                  </Box>
                </Stack>
              </Stack>

              <Collapse orientation="horizontal" in={pausing}>
                {!!stars_to_add?.length && (
                  <Flex spacing={2} sx={{ p: 2 }}>
                    {stars_to_add.map((star) => (
                      <ModelCard
                        modelClicked={handleModel}
                        small={stars_to_add.length > 3}
                        key={star.ID}
                        model={star}
                      />
                    ))}
                  </Flex>
                )}
              </Collapse>
            </Flex>
          )}
        </Card>
      </Snackbar>
    </>
  );
};

export const PreviewCard = ({ handleMode, minimal, finder }) => {
  const {
    param_list,
    latest: result,
    results,
    progress,
    message,
    param,
    busy,
  } = finder;

  const [searchOn, setSearchOn] = React.useState(false);
  const [temp, setTemp] = React.useState("");
  const handleClick = () => {
    finder.send({
      type: "append",
      param: temp.split("|"),
    });
    setTemp("");
    setSearchOn(false);
  };

  if (!(busy && results?.length)) {
    return <i />;
  }
  if (!result) return <i />;
  return (
    <Snackbar open>
      <Card>
        <Stack spacing={2} sx={{ width: 360, p: 1 }}>
          <Typography variant="subtitle2">
            Finding "
            <HilitText values={[param]}>{param_list.join(" or ")}</HilitText>"
          </Typography>
          <PhotoCard
            onClick={handleMode}
            size={360}
            {...result}
            params={param_list}
          />
          <Stack direction="row" sx={{ alignItems: "center" }} spacing={1}>
            {!!minimal && <Avatar src={result.Photo} />}
            <Typography
              variant="caption"
              sx={{ maxWidth: 360, overflow: "hidden" }}
            >
              {message}
            </Typography>
          </Stack>
        </Stack>
        {!searchOn && (
          <Nowrap hover onClick={() => setSearchOn(true)} sx={{ ml: 1 }}>
            <Typography variant="caption">Add search</Typography>
          </Nowrap>
        )}
        <Collapse sx={{ width: "100%" }} in={searchOn}>
          <Flex sx={{ width: "100%" }}>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleClick();
              }}
            >
              <StyledTextField
                fullWidth
                onChange={(e) => setTemp(e.target.value)}
                size="small"
                label="search"
                value={temp}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={() => setSearchOn(false)}>
                        &times;
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </form>
          </Flex>
        </Collapse>
        <LinearProgress
          variant={!progress ? "indeterminate" : "determinate"}
          value={progress}
        />
      </Card>
    </Snackbar>
  );
};
