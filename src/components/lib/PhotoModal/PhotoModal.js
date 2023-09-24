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
} from "@mui/material";
import { getPhoto } from "../../../connector";
import { usePhoto } from "..";
import { ERR_IMAGE } from "../../../const";

export const usePhotoModal = (onChange) => {
  const [state, send] = useMachine(photoMachine, {
    services: {
      loadPhoto: async (context) => {
        return await getPhoto(context.name);
      },
      photoClicked: async (context) => {
        onChange && onChange(context.value, context.ID);
      },
    },
  });

  const openPhoto = (name, ID) => {
    send({
      type: "OPEN",
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

const PhotoModal = ({ photo, choosePhoto, state, name, open }) => {
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
            <>
              <LinearProgress />
              Getting photo info for {name}
            </>
          )}

          {!!photo && state.matches("opened.loaded") && (
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
