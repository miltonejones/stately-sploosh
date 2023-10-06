import React from "react";
import { useMachine } from "@xstate/react";
import { photoMachine } from "../../../machines";
import {
  Snackbar,
  LinearProgress,
  Card,
  Typography,
  CardMedia,
  CardContent,
  Stack,
  Button,
} from "@mui/material";
import { getPhoto } from "../../../connector";
import { usePhoto } from "..";
import { ERR_IMAGE } from "../../../const";
import { Flex, Spacer } from "../../../styled";

function googlePhotoLink(title) {
  return `https://www.google.com/search?q=${title.replace(
    /\s/g,
    "+"
  )} xxx&source=lnms&tbm=isch`;
}

export const usePhotoModal = (onChange) => {
  const [state, send] = useMachine(photoMachine, {
    services: {
      loadPhoto: async (context) => {
        return await getPhoto(context.name);
      },
      googlePhoto: async (context) => {
        const address = googlePhotoLink(context.name);
        window.open(address);
      },
      photoClicked: async (context) => {
        onChange && onChange(context.value, context.ID);
      },
    },
  });

  const openPhoto = (name, ID) => {
    send({
      type: state.can("append") ? "append" : "OPEN",
      name,
      ID,
    });
  };

  const choosePhoto = (value) => {
    send({
      type: "CLOSE",
      value,
    });
  };

  return {
    diagnosticProps: {
      ...photoMachine,
      state,
    },
    openPhoto,
    choosePhoto,
    state,
    send,
    ...state.context,
  };
};

const PreviewCard = ({ src, size, onClick, caption }) => {
  const { image } = usePhoto(src, ERR_IMAGE);
  return (
    <Card sx={{ cursor: "pointer", width: size }}>
      <CardMedia
        onClick={onClick}
        component="img"
        sx={{ borderRadius: 2, width: size - 16, aspectRatio: "2.1 / 3" }}
        width="100%"
        height="auto"
        image={image}
        alt={caption}
      />
      <CardContent sx={{ p: (t) => t.spacing(1) + " !important" }}>
        <Typography
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
          {caption}
        </Typography>
      </CardContent>
    </Card>
  );
};

const PhotoModal = ({
  photo,
  choosePhoto,
  pending = [],
  state,
  name,
  open,
  send,
}) => {
  const size = 200;
  return (
    <Snackbar
      maxWidth="md"
      open={open}
      onClose={() => choosePhoto()}
      anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
    >
      <Card>
        <Stack spacing={2} sx={{ p: 2, minWidth: 600, minHeight: 200 }}>
          {/* {JSON.stringify(state.value)} */}
          {state.matches("opened.loading") && (
            <Stack>
              <LinearProgress />
              Getting photo info for {name}
              {!!pending.length && (
                <Typography variant="caption">
                  Up next: {pending[0].name}
                </Typography>
              )}
            </Stack>
          )}
          {state.can("confirm") && (
            <Stack>
              You didn't chose anything. Really close modal?
              <Typography color="error" variant="subtitle2">
                Your model image will not be updated
              </Typography>
              <Flex spacing={1}>
                <Spacer />
                <Button onClick={() => send("cancel")}>Cancel</Button>
                <Button variant="contained" onClick={() => send("confirm")}>
                  Yes
                </Button>
              </Flex>
            </Stack>
          )}
          {state.matches("opened.error") && (
            <Stack>
              Could not get photo for {name}. After 3 tries.
              <Flex spacing={1}>
                <Spacer />
                <Button onClick={() => send("google")}>Google</Button>
                <Button onClick={() => send("cancel")}>Cancel</Button>
                <Button variant="contained" onClick={() => send("retry")}>
                  Retry
                </Button>
              </Flex>
            </Stack>
          )}

          {!!photo?.length && state.matches("opened.loaded") && (
            <Stack>
              Found {photo.length} photos for {name}
              <Stack direction="row">
                {photo?.map((pic) => (
                  <PreviewCard
                    src={pic.src}
                    size={size}
                    caption={pic.alt}
                    onClick={() => choosePhoto(pic.src)}
                  />
                ))}
              </Stack>
              <Flex spacing={1} sx={{ p: (t) => t.spacing(2, 0) }}>
                <Spacer />
                <Button onClick={() => send("google")}>Google</Button>
                <Button variant="contained" onClick={() => send("retry")}>
                  Retry
                </Button>
              </Flex>
            </Stack>
          )}
        </Stack>
        {/* {JSON.stringify(state.value)} */}
        {/* <pre>
      {JSON.stringify(photo,0,2)}
     </pre> */}
      </Card>
    </Snackbar>
  );
};

PhotoModal.defaultProps = {};
export default PhotoModal;
