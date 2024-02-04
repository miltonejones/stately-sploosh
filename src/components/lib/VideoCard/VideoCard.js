import React from "react";
import {
  Avatar,
  Stack,
  Box,
  Card,
  Typography,
  CardMedia,
  CardContent,
  Menu,
  MenuItem,
  Tooltip,
  styled,
} from "@mui/material";
import { Spacer } from "../../../styled";
import { RegionMenu, usePhoto, ConfirmPopover } from "..";
// import { useWindowManager } from '../../../services';
import Marquee from "react-fast-marquee";
import { useMachine } from "@xstate/react";
import { menuMachine } from "../../../machines";
import { AppStateContext } from "../../../context";
import { DEFAULT_IMAGE } from "../../../const";
import ModelList from "./ModelList";
import VideoMedia from "./VideoMedia";

const Block = styled(Card)(({ cursor, opacity, width, selected }) => ({
  cursor,
  opacity,
  width,
  outline: selected ? "solid 2px blue" : "",
  outlineOffset: 1,
  position: "relative",
  "--menu-right": "-200px",
  "&:hover": {
    "--menu-right": 0,
  },
}));

const BlockMenu = styled(Box)(({ theme, width }) => ({
  height: 32,
  width,
  backgroundColor: "black",
  color: "white",
  position: "absolute",
  top: 10,
  paddingLeft: theme.spacing(1),
  right: "var(--menu-right)",
  transition: "all 0.2s linear",
  display: "flex",
  alignItems: "center",
  gap: theme.spacing(2),
  opacity: 0.2,
  "&:hover": {
    opacity: 1,
  },
  "& .red": {
    color: theme.palette.error.main,
  },
}));

export const ScrollingText = ({ children, deleted, ...props }) => {
  const [hover, setHover] = React.useState(false);
  const sx = deleted
    ? { ...props.sx, textDecoration: "line-through", color: "red" }
    : props.sx;
  if (!hover) {
    return (
      <>
        <Typography {...props} sx={sx} onClick={() => setHover(true)}>
          {children}
        </Typography>
      </>
    );
  }

  return (
    <Box onClick={() => setHover(false)}>
      <Marquee speed={110} play gradientColor="#222">
        <Typography variant="body2" color="text.primary">
          {children}
        </Typography>
      </Marquee>
    </Box>
  );
};

const ModelName = ({ model, onClick }) => {
  if (!model.image) {
    return <em onClick={onClick}>{model.Name}</em>;
  }
  return (
    <Tooltip
      onClick={onClick}
      title={
        <Stack
          sx={{
            backgroundColor: "white",
            textAlign: "center",
          }}
        >
          <img
            src={model.image}
            alt={model.Name}
            style={{
              width: 160,
              aspectRatio: "2.1 / 3",
            }}
          />{" "}
          <Typography variant="caption" sx={{ color: "black" }}>
            {model.Name}
          </Typography>
        </Stack>
      }
    >
      <u onClick={onClick}>{model.Name}</u>
    </Tooltip>
  );
};

const VideoCard = ({
  video,
  small,
  medium,
  send,
  favoriteClicked,
  editClicked,
  domainClicked,
  deleteClicked,
  photoClicked,
  bookClicked,
  selected,
  selectedID,
  modelClicked,
  studioClicked,
  handleDedupe,
  handleDrop,
}) => {
  const [expanded, setExpanded] = React.useState(false);
  const [showRegion, setShowRegion] = React.useState(false);
  const [cursor, setCursor] = React.useState("pointer");
  const { WindowManager } = React.useContext(AppStateContext);

  const source = usePhoto(video.image, DEFAULT_IMAGE);

  const { models: modelList = [] } = video;

  const modelObj = modelList.reduce((out, res) => {
    out[res.ID] = res;
    return out;
  }, {});

  const models = Object.keys(modelObj).reduce((out, res) => {
    out.push(modelObj[res]);
    return out;
  }, []);

  const modelProps = models[0] ?? {
    Name: <b style={{ color: "red" }}>add model</b>,
  };

  const moreText =
    models?.length > 1 ? (
      <b onClick={() => setExpanded(!expanded)}>
        + {models.length - 1} more...
      </b>
    ) : (
      <i />
    );
  const costars =
    models?.length > 1 && expanded ? (
      models.slice(1).map((f) => (
        <>
          <ModelName model={f} onClick={() => modelClicked(f.ID)} />,{" "}
        </>
      ))
    ) : (
      <i />
    );

  const size = small ? 200 : medium ? "230" : 230;
  const opacity = WindowManager?.visited(video) ? 0.5 : 1;

  const shop = () => {
    const { Key } = video;
    window.open("/jav/" + Key, Key, "width=500,height=800,addressbar=no");
  };

  const modelListProps = {
    setExpanded,
    expanded,
    modelClicked,
    models,
  };
  return (
    <Block cursor={cursor} opacity={opacity} width={size} selected={selected}>
      <RegionMenu
        width={size - 20}
        open={showRegion}
        click={async (i) => {
          setCursor("progress");
          await WindowManager.launch(video, i);
          setCursor("pointer");
          setShowRegion(false);
        }}
      />
      <BlockMenu width={!video.Key ? 120 : 150}>
        {!!editClicked && (
          <i onClick={() => editClicked(video)} className="fa-solid fa-pen"></i>
        )}
        <i
          onClick={() => favoriteClicked && favoriteClicked(video.ID)}
          className={`${
            video.favorite ? "red fa-solid" : "fa-regular"
          } fa-heart`}
        ></i>

        <ConfirmPopover
          message={`Are you sure you want to delete "${video.title}"?`}
          caption="This action cannot be undone!"
          onChange={(val) => !!val && deleteClicked && deleteClicked(video.ID)}
        >
          <i className="fa-solid fa-trash-can"></i>
        </ConfirmPopover>

        <i
          onClick={() => window.open(video.URL)}
          className="fa-solid fa-up-right-from-square"
        ></i>

        {!!handleDrop && (
          <ConfirmPopover
            message={`Are you sure you want to remove this model?`}
            caption="This action cannot be undone!"
            onChange={(val) => !!val && handleDrop && handleDrop(video.ID)}
          >
            <i className="fa fa-user-times" />
          </ConfirmPopover>
        )}

        {!!video.Key && (
          <i
            onClick={() =>
              window.open(
                `https://www.javlibrary.com/en/vl_searchbyid.php?keyword=${video.Key}`
              )
            }
            className="fa-solid fa-book"
          ></i>
        )}
      </BlockMenu>
      <Tooltip title={video.title}>
        <VideoMedia
          onClick={() => setShowRegion(!showRegion)}
          onError={() => source.handleError()}
          component="img"
          sx={{
            borderRadius: (t) => t.spacing(0.5, 0.5, 0, 0),
            width: size,
            aspectRatio: "16 / 9",
          }}
          width="100%"
          height="auto"
          size={size}
          image={source.image}
          alt={video.title}
        />
      </Tooltip>

      {!!small && (
        <CardContent sx={{ p: (t) => t.spacing(1) + " !important" }}>
          <Stack direction="row" sx={{ alignItems: "center" }} spacing={1}>
            <ModelMenu
              handleDedupe={(id) => handleDedupe(video.ID, id)}
              selectedID={selectedID}
              onChange={(e) => !!e && modelClicked(e)}
              models={models}
              modelList={modelList}
            >
              <i className="fa-solid fa-ellipsis-vertical"></i>
            </ModelMenu>
            <ScrollingText
              variant="caption"
              deleted={video.deleted}
              sx={{
                whiteSpace: "nowrap",
                fontWeight: !!video.favorite ? 600 : 400,
                textOverflow: "ellipsis",
                overflow: "hidden",
                width: size - 30,
              }}
              color={!!video.favorite ? "error" : "text.primary"}
            >
              {video.title}
            </ScrollingText>
          </Stack>
        </CardContent>
      )}
      {!small && (
        <CardContent sx={{ p: (t) => t.spacing(1) + " !important" }}>
          <Stack direction="row" spacing={1}>
            {!!modelProps.image && (
              <Box>
                <Avatar
                  src={modelProps.image}
                  onClick={() =>
                    photoClicked && photoClicked(modelProps.Name, modelProps.ID)
                  }
                  variant="rounded"
                />
              </Box>
            )}
            <Stack>
              <ScrollingText
                variant="body2"
                deleted={video.deleted}
                sx={{
                  whiteSpace: "nowrap",
                  fontWeight: !!video.favorite ? 600 : 400,
                  textOverflow: "ellipsis",
                  overflow: "hidden",
                  width: !!modelProps.image ? 160 : 200,
                }}
                color={!!video.favorite ? "error" : "text.primary"}
              >
                {video.title}
              </ScrollingText>
              <ModelList {...modelListProps} model={modelProps} />
              {/* <Typography variant="caption" color="text.secondary">
                {costars}
                <ModelName
                  onClick={() => modelClicked(modelProps.ID)}
                  model={modelProps}
                />
                {moreText} 
              </Typography> */}
            </Stack>
          </Stack>
          <Stack
            spacing={1}
            direction="row"
            sx={{ justifyContent: "space-between" }}
          >
            <Typography
              onClick={() => domainClicked && domainClicked(video.domain)}
              variant="caption"
            >
              {video.domain}
            </Typography>
            <Spacer />
            <Typography
              onClick={() => !!video.studio && shop(video.studio)}
              variant="caption"
            >
              {video.studio}
            </Typography>

            {!!bookClicked && !!video.studio && (
              <i
                onClick={() => {
                  shop();
                }}
                className="fa fa-cart-arrow-down"
              ></i>
            )}
          </Stack>
        </CardContent>
      )}
    </Block>
  );
};
VideoCard.defaultProps = {};
export default VideoCard;

export const ModelMenu = ({
  onChange,
  children,
  clipText,
  selectedID,
  models,
  modelList,
  handleDedupe,
}) => {
  const [state, send] = useMachine(menuMachine, {
    services: {
      menuClicked: async (context, event) => {
        onChange(event.value);
      },
      readClipboard: async () => await navigator.clipboard.readText(),
    },
  });
  const { anchorEl, clipboard } = state.context;

  const handleClose = (value) => () =>
    send({
      type: "close",
      value,
    });
  const handleClick = (event) =>
    send({
      type: "open",
      anchorEl: event.currentTarget,
    });
  return (
    <>
      <Box onClick={handleClick}>{children}</Box>

      <Menu anchorEl={anchorEl} open={!!anchorEl} onClose={() => send("close")}>
        {models.map((model) => (
          <ModelItem
            handleDedupe={handleDedupe}
            modelList={modelList}
            key={model.ID}
            model={model}
            selectedID={selectedID}
            onClick={handleClose(model.ID)}
          />
        ))}
        {!!clipboard && !!clipText && (
          <MenuItem
            onClick={handleClose(clipboard)}
            handleDedupe={handleDedupe}
          >
            <Stack direction="row" sx={{ alignItems: "center" }} spacing={1}>
              <Avatar src={clipboard} />
              <Typography>{clipText}</Typography>
            </Stack>
          </MenuItem>
        )}
        {/* {!!clipText && <MenuItem onClick={() => window.open ( googlePhotoLink(models[0].name))}>
          find {models[0].Name}
        </MenuItem>} */}
      </Menu>
    </>
  );
};

// function googlePhotoLink(title) {
//   return `https://www.google.com/search?q=${title.replace(
//     /\s/g,
//     '+'
//   )} xxx&source=lnms&tbm=isch`;
// }

const ModelItem = ({ model, onClick, selectedID, modelList, handleDedupe }) => {
  const count = modelList?.filter((f) => f.ID === model.ID);
  return (
    <>
      <MenuItem onClick={onClick}>
        <Stack direction="row" sx={{ alignItems: "center" }} spacing={1}>
          <Avatar src={model.image} />
          <Typography sx={{ fontWeight: selectedID === model.ID ? 600 : 400 }}>
            {model.Name}
          </Typography>
        </Stack>
      </MenuItem>
      {count?.length > 1 && (
        <MenuItem onClick={() => handleDedupe(model.ID)}>
          <Typography>Remove duplicate</Typography>
        </MenuItem>
      )}
    </>
  );
};
