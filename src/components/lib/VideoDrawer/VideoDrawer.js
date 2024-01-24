import React from "react";
import {
  Drawer,
  Stack,
  Avatar,
  Typography,
  Snackbar,
  Button,
  Box,
  Alert,
} from "@mui/material";
import { useMachine } from "@xstate/react";
import { ModelSelect, Diagnostics, ConfirmPopover } from "..";
import { videoMachine } from "../../../machines";
import {
  getVideo,
  deleteVideo,
  addModelToVideo,
  addModel,
  removeModelFromVideo,
  getModelsByName,
} from "../../../connector";
import { Flex, Spacer } from "../../../styled";
import InBox from "../../../styled/InBox";

export const useVideoDrawer = (onRefresh) => {
  const [state, send] = useMachine(videoMachine, {
    services: {
      refreshList: async () => {
        onRefresh && onRefresh();
      },
      dropModel: async (context) => {
        return await removeModelFromVideo(context.video.ID, context.ID);
      },
      dropVideo: async (context) => {
        return await deleteVideo(context.video.ID);
      },
      loadVideo: async (context) => {
        const { video, videos } = context;
        const { ID } =
          !!videos && Array.isArray(videos) && videos[0] ? videos[0] : video;
        const vid = await getVideo(ID);
        if (vid.records?.length) {
          return vid.records[0];
        }
      },
      checkModel: async (context) => {
        return await getModelsByName(context.value);
      },
      createModel: async (context) => {
        return await addModel(context.value);
      },
      applyModel: async (context) => {
        // if (!context.model) return;
        await addModelToVideo(context.video.ID, context.ID);
      },
    },
  });

  const handleClose = () => send("CLOSE");
  const handleClick = (video) => {
    send({
      type: "OPEN",
      video,
    });
  };
  const castModel = (model) => {
    send({
      type: "ADD",
      model,
    });
  };
  const loseModel = (ID) => {
    send({
      type: "DROP",
      ID,
    });
  };

  const selectMode = () => {
    send("MULTIPLE");
  };
  const editMultiple = () => {
    send("EDIT");
  };
  return {
    diagnosticProps: {
      ...videoMachine,
      state,
    },
    state,
    send,
    multiple: state.matches("multiple"),
    editMultiple,
    selectMode,
    handleClose,
    handleError: () => send("RECOVER"),
    handleDrop: () => send("REMOVE"),
    handleClick,
    castModel,
    loseModel,
    ...state.context,
  };
};

const VideoDrawer = ({
  diagnosticProps,
  state,
  handleDrop,
  handleClose,
  handleError,
  message,
  loseModel,
  castModel,
  msg,
  open,
  send,
  video,
  videos = [],
  shop,
  notify,
}) => {
  if (!video) return <Diagnostics {...diagnosticProps} />;
  const fixed = state.context.locked; //("unlock");

  const Component = fixed ? InBox : Drawer;

  // const titleTrack = videos.find(f => !!f.models.length);

  if (state.matches("opened.error")) {
    return (
      <Snackbar open>
        <Box>
          Error: {message} <Button onClick={handleError}>okay</Button>
        </Box>
      </Snackbar>
    );
  }

  return (
    <>
      <Snackbar open={notify}>
        <Alert sx={{ minWidth: 400 }}>{message}</Alert>
      </Snackbar>
      <Component
        anchor="left"
        onClose={handleClose}
        open={open}
        data-testid="test-for-VideoDrawer"
      >
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <Flex spacing={1} sx={{ p: 1 }}>
            <Typography>Edit Video</Typography>
            <Spacer />
            {/* <Typography variant="caption">
              {" "}
              {JSON.stringify(state.value)}
            </Typography> */}

            <i
              onClick={() => {
                shop.handleClick(video.URL);
                handleClose();
              }}
              className="fa fa-cart-arrow-down"
            />
            {/* <i className="fa-solid fa-pen"></i> */}
            <i
              className="fa-solid fa-angles-left"
              onClick={() => send(fixed ? "unlock" : "lock")}
            ></i>
          </Flex>
        </Box>
        <Box sx={{ maxWidth: 400, overflow: "hidden", p: 2 }}>
          <img
            src={video.image}
            alt={video.title}
            style={{
              width: "100%",
              aspectRatio: "16 / 9",
              borderRadius: 4,
            }}
          />
          <Typography variant="body2" sx={{ mb: 2 }}>
            {video.title}
          </Typography>

          {!!videos.length && (
            <Stack direction="row" spacing={1}>
              {videos.map((vid) => (
                <Avatar key={vid.ID} src={vid.image} />
              ))}
            </Stack>
          )}

          {!!video.models?.length && (
            <Box>
              <Typography sx={{ mt: 2, mb: 1 }}> Models:</Typography>
              {video.models.map((model) => (
                <Stack
                  sx={{ alignItems: "center" }}
                  spacing={2}
                  direction="row"
                >
                  <Avatar src={model.image} />
                  <Typography variant="body2">{model.Name}</Typography>
                  <Box sx={{ flexGrow: 1 }} />
                  <i
                    onClick={() => {
                      shop.handleClick(model.Name);
                      handleClose();
                    }}
                    className="fa fa-cart-arrow-down"
                  />
                  <ConfirmPopover
                    onChange={(ok) => !!ok && loseModel(model.ID)}
                    message={`Remove ${model.Name}?`}
                  >
                    <i className="fa-solid fa-trash-can"></i>
                  </ConfirmPopover>
                </Stack>
              ))}
            </Box>
          )}

          <Typography>Add model</Typography>
          <ModelSelect onValueSelected={castModel} />

          <Box sx={{ mt: 2 }}>
            {!!videos?.length && (
              <ConfirmPopover
                onChange={(ok) => !!ok && handleDrop()}
                message={`Remove ${videos.length} videos?`}
              >
                {" "}
                <Button variant="contained" color="error">
                  delete {videos.length} videos
                </Button>
              </ConfirmPopover>
            )}
          </Box>

          {msg}

          {/* <pre>
        {JSON.stringify(video,0,2)}
      </pre> */}
        </Box>
      </Component>
    </>
  );
};
VideoDrawer.defaultProps = {};
export default VideoDrawer;
