import React from "react";
import {
  Alert,
  Avatar,
  Box,
  Button,
  Card,
  Chip,
  Collapse,
  Dialog,
  Divider,
  Fab,
  IconButton,
  LinearProgress,
  Link,
  Stack,
  Step,
  StepLabel,
  Stepper,
  Tab,
  Tabs,
  TextField,
  Typography,
} from "@mui/material";
import { Helmet } from "react-helmet";
import { javlibMachine } from "../../../machines/javlibMachine";
import { useMachine } from "@xstate/react";
import { Flex, Nowrap, Spacer } from "../../../styled";
import { PhotoCard } from "../../lib/ShoppingDrawer/Cards";
import { useMenu } from "../../../machines";
import { usePreview } from "../../../services/usePreviewMachine";
import PreviewBar from "../../lib/ShoppingDrawer/PreviewBar";
import { TabButton, TabList } from "../../../App";
import { useParams } from "react-router-dom";

const DIALOG_WIDTH = 400;

const path_placeholders = JSON.parse(
  localStorage.getItem("path_placeholders") || "{}"
);
export default function Javlib() {
  const { routedpath } = useParams();
  const [paths, setPaths] = React.useState([]);
  const [selectedPath, setSelectedPath] = React.useState("");
  const [metrics, setMetrics] = React.useState({});
  const [placeholders, setPlaceholders] = React.useState(path_placeholders);

  const executePath = (val) => {
    if (!val) return;
    let path = val;
    if (path.indexOf("/") > 0) {
      path = path.split("/").pop();
    }
    setSelectedPath(path);
    setPaths((c) => c.filter((f) => f !== path).concat(path));
  };

  React.useEffect(() => {
    !!routedpath && executePath(routedpath.split("^").join("?"));
  }, [routedpath]);

  const handleChange = (event, newValue) => {
    setSelectedPath(paths[newValue]);
  };

  const menu = useMenu(executePath);
  const width = 480; // Math.floor(window.innerWidth / paths.length) - 8;
  const dropPlaceholder = React.useCallback(
    (path) => {
      delete placeholders[path];
      setPlaceholders(placeholders);
      localStorage.setItem("path_placeholders", JSON.stringify(placeholders));
    },
    [placeholders]
  );

  const pageTitle = !metrics[selectedPath]
    ? "Loading"
    : metrics[selectedPath].title;
  return (
    <>
      <Helmet>
        <meta charSet="utf-8" />
        <title>{pageTitle}</title>
      </Helmet>

      <Dialog {...menu.menuProps}>
        <Stack spacing={1} sx={{ p: 2, width: DIALOG_WIDTH }}>
          <Typography>Enter path</Typography>
          <TextField
            onChange={menu.handleChange}
            name="value"
            value={menu.value}
            size="small"
            label="Enter path"
            autoFocus
            autoComplete="off"
          />

          {!!placeholders && !!Object.keys(placeholders).length && (
            <Stack sx={{ p: 2 }}>
              <Typography variant="subtitle2"> Saved searches:</Typography>
              {Object.keys(placeholders).map((path) => (
                <Flex spacing={1}>
                  <i
                    onClick={() => dropPlaceholder(path)}
                    className="fa-solid fa-trash-can"
                  ></i>
                  <Nowrap
                    hover
                    onClick={menu.handleClose(placeholders[path])}
                    key={path}
                    variant="caption"
                  >
                    {path}
                  </Nowrap>
                </Flex>
              ))}
            </Stack>
          )}

          <Flex>
            <Spacer />
            <Button onClick={menu.handleClose()}>cancel</Button>
            <Button variant="contained" onClick={menu.handleClose(menu.value)}>
              start
            </Button>
          </Flex>
        </Stack>
      </Dialog>

      <Box sx={{ width: 480, p: 1 }}>
        <TabList
          variant="scrollable"
          value={paths.indexOf(selectedPath)}
          onChange={handleChange}
        >
          {paths.map((path) => (
            <TabButton
              key={path}
              label={!metrics[path] ? path : metrics[path].title}
            />
          ))}
        </TabList>
      </Box>

      <Flex sx={{ alignItems: "flex-start", p: 1 }} spacing={1}>
        {paths.map((path) => (
          <JavlibBit
            key={path}
            startPath={path}
            size={width}
            update={(name, object) => {
              setMetrics((value) => {
                return {
                  ...value,
                  [name]: object,
                };
              });
            }}
            visible={path === selectedPath}
            remove={() => {
              setPaths((f) => f.filter((e) => e !== path));
              setSelectedPath(paths.find((f) => f.find(f !== path)));
            }}
          />
        ))}
      </Flex>

      <Box
        onClick={menu.handleClick}
        sx={{ position: "fixed", bottom: 20, right: 20 }}
      >
        <Fab color="primary">+</Fab>
      </Box>
    </>
  );
}

export const JavlibBit = (props) => {
  const [state, send] = useMachine(javlibMachine);
  const { title, page_progress } = state.context;
  React.useEffect(() => {
    if (!page_progress) return;
    props.update(props.startPath, { page_progress, title });
  }, [page_progress, title]);
  return <JavlibBody {...props} state={state} send={send} />;
};

function JavlibBody({ startPath, size, remove, state, send, visible }) {
  const {
    path,
    message,
    progress,
    title,
    index,
    keys,
    pages,
    candidate,
    added,
    page_progress,
    cast,
    cast_index,
    success,
    modelProp,
    dialogMessage,
    info,
  } = state.context;

  const [expanded, setExpanded] = React.useState(true);
  const viewer = usePreview();
  const menu = useMenu((val) => !!val && remove());
  const preview = (event, url) =>
    !viewer ? false : viewer.handleOpen(event, url);
  React.useEffect(() => {
    send({
      type: "work",
      path: startPath,
    });
  }, [startPath]);
  const buttons = {
    pause: "fa-solid fa-pause",
    resume: "fa-solid fa-play",
    skip: "fa-solid fa-forward",
    stop: "fa-solid fa-stop",
  };
  return (
    <>
      <PreviewBar viewer={viewer} />
      <Collapse in={visible} orientation="horizontal">
        <Card sx={{ width: size, maxWidth: 532 }}>
          {!!state.can("choose") && (
            <Stack sx={{ p: 2 }}>
              {" "}
              <Nowrap variant="caption">
                {JSON.stringify(state.value)
                  .replace(/[\{\}"]/g, "")
                  .replace(/:/g, ".")}
              </Nowrap>
              {/* {JSON.stringify(state.nextEvents)} */}
              Models
              {info.names.map((name) => (
                <Nowrap
                  sx={{ mb: 1 }}
                  hover
                  variant="caption"
                  key={name}
                  onClick={() =>
                    send({
                      type: "choose",
                      path: name.href.split("/").pop(),
                    })
                  }
                >
                  {name.title}
                </Nowrap>
              ))}
              <Flex spacing={1}>
                <Button
                  variant="contained"
                  color="error"
                  onClick={() => send("cancel")}
                >
                  Cancel
                </Button>
                <Spacer />
                {/* {!!info.names.length && (
                  <Button
                    variant="contained"
                    onClick={() =>
                      send({
                        type: "choose",
                        path: info.names[0].href.split("/").pop(),
                      })
                    }
                  >
                    Model ({info.names[0].title})
                  </Button>
                )} */}
                {!!info.studio && (
                  <Button
                    variant="contained"
                    onClick={() =>
                      send({
                        type: "choose",
                        path: info.studio.split("/").pop(),
                      })
                    }
                  >
                    Studio
                  </Button>
                )}
              </Flex>
            </Stack>
          )}
          {!state.can("choose") && (
            <Stack spacing={1} sx={{ width: size - 32, maxWidth: 500, p: 2 }}>
              <Flex spacing={1}>
                {!!modelProp && modelProp.image && (
                  <Avatar
                    sx={{
                      width: 56,
                      height: 56,
                    }}
                    src={modelProp.image}
                    alt={modelProp.name}
                  />
                )}
                <Stack>
                  {!!title && (
                    <Flex>
                      <Chip
                        label={title}
                        color="primary"
                        size="small"
                        onDelete={menu.handleClick}
                      />
                    </Flex>
                  )}
                  <Nowrap variant="caption">
                    Path:{" "}
                    <Link
                      target="_blank"
                      variant="caption"
                      href={`https://www.javlibrary.com/en/${path}`}
                    >
                      {path}
                    </Link>
                  </Nowrap>
                  <Flex spacing={1}>
                    {/* <Typography variant="subtitle2">State:</Typography> */}
                    <Nowrap variant="caption">
                      {JSON.stringify(state.value)
                        .replace(/[\{\}"]/g, "")
                        .replace(/:/g, ".")}
                    </Nowrap>
                  </Flex>
                  {state.matches("idle.get key info") && <LinearProgress />}
                </Stack>
                {/* <Spacer /> */}
              </Flex>
              <Collapse in={menu.menuProps.open}>
                <Card
                  sx={{
                    p: 2,
                    backgroundColor: (theme) => theme.palette.grey[200],
                  }}
                >
                  <Stack spacing={1}>
                    <Typography variant="subtitle2">Confirm Close</Typography>
                    <Typography>Close "{title}"?</Typography>
                    <Flex spacing={1}>
                      <Spacer />
                      <Button onClick={menu.handleClose()}> cancel</Button>
                      <Button
                        onClick={menu.handleClose(true)}
                        variant="contained"
                      >
                        close
                      </Button>
                    </Flex>
                  </Stack>
                </Card>
              </Collapse>
              <Collapse in={state.can("yes")}>
                <Card
                  sx={{
                    p: 2,
                    backgroundColor: (theme) => theme.palette.grey[200],
                  }}
                >
                  <Stack spacing={1}>
                    <Flex>
                      <Spacer>
                        <Typography variant="subtitle2">
                          Confirm action
                        </Typography>
                      </Spacer>
                      <Box onClick={() => send("no")}>&times;</Box>
                    </Flex>
                    <Typography variant="caption">{dialogMessage}</Typography>
                    {/* <Typography variant="subtitle2" color="error">
                  This action cannot be undone.
                </Typography> */}
                    <Flex spacing={1}>
                      <Spacer />
                      <Button onClick={() => send("no")}> no</Button>
                      <Button
                        onClick={() => send("yes")}
                        variant="contained"
                        color="error"
                      >
                        yes
                      </Button>
                    </Flex>
                  </Stack>
                </Card>
              </Collapse>
              {state.can("start") && !!added.length && (
                <>
                  <Typography>Operation complete.</Typography>
                  {added.map((line, i) => (
                    <Typography variant="caption" key={i}>
                      {space(`${i + 1}. ${line.Text}`, 70)}
                    </Typography>
                  ))}
                  <Flex>
                    <Button variant="contained" onClick={menu.handleClick}>
                      close
                    </Button>
                  </Flex>
                </>
              )}
              <Collapse in={state.can("reset")}>
                <Stack spacing={1}>
                  {!!candidate && (
                    <PhotoCard
                      viewer={viewer}
                      existing={!success}
                      size={Math.min(size - 32, 500)}
                      {...candidate}
                    />
                  )}{" "}
                  {!!added.length && (
                    <Stack spacing={1}>
                      <Flex>
                        <Typography variant="subtitle2">
                          Added videos
                        </Typography>
                        <Spacer />
                        <IconButton onClick={() => setExpanded(!expanded)}>
                          &times;
                        </IconButton>
                      </Flex>
                      <Collapse in={expanded}>
                        {[...added]
                          .reverse()
                          .slice(0, 5)
                          .reverse()
                          .map((line, i) => (
                            <Flex spacing={1}>
                              <i
                                onClick={(e) => preview(e, line.URL)}
                                className="fa-solid fa-film"
                              ></i>
                              <Nowrap
                                onClick={() =>
                                  send({
                                    type: "drop",
                                    dropTarget: line.ID,
                                  })
                                }
                                variant="caption"
                                hover
                                key={i}
                              >
                                {space(
                                  `${ordinal(i, added.length, 5)}. ${
                                    line.Text
                                  }`,
                                  70
                                )}
                              </Nowrap>
                            </Flex>
                          ))}
                      </Collapse>
                    </Stack>
                  )}
                </Stack>
              </Collapse>
              <Collapse in={!state.can("start")}>
                <Stack spacing={1}>
                  <Divider />
                  <LinearProgress
                    variant={
                      state.can("reset") && !!progress
                        ? "determinate"
                        : "indeterminate"
                    }
                    value={progress}
                  />
                  {!!keys.length && index < keys.length && (
                    <Flex spacing={1}>
                      <Typography variant="caption">
                        {index + 1} of {keys.length} Key: <b>{keys[index]}</b>
                      </Typography>
                      <Spacer />
                      {Object.keys(buttons)
                        .filter((word) => state.can(word))
                        .map((word) => (
                          <i
                            className={buttons[word]}
                            onClick={() => send(word)}
                          />
                          // <Link
                          //   variant="caption"
                          //   sx={{ textTransform: "capitalize" }}
                          //   onClick={() => send(word)}
                          // >
                          //   {word}
                          // </Link>
                        ))}
                    </Flex>
                  )}

                  {state.matches("working") && (
                    <Typography variant="caption">Working....</Typography>
                  )}

                  {!!page_progress && (
                    <LinearProgress
                      variant="determinate"
                      value={page_progress}
                    />
                  )}
                  {!!pages.length && (
                    <Flex spacing={2}>
                      <Typography variant="caption">Page</Typography>
                      {pages.map((page) => (
                        <Typography
                          onClick={() => {
                            const path = page.href.split("/").pop();
                            send({
                              type: "reset",
                              path,
                            });
                          }}
                          variant={!page.href ? "subtitle2" : "caption"}
                          color={!page.href ? "primary" : "text.secondary"}
                          key={page.page}
                        >
                          {page.page}
                        </Typography>
                      ))}
                    </Flex>
                  )}
                  <Divider />
                  <Typography variant="caption" color="text.secondary">
                    {message}
                  </Typography>
                </Stack>
              </Collapse>
              <Collapse
                in={state.matches(
                  "process keys.drop old videos.apply favorite"
                )}
              >
                <Alert>Setting favorite to TRUE.</Alert>
              </Collapse>
              <Collapse in={state.matches("process keys.save video.cast")}>
                <>
                  <Typography variant="subtitle2">Adding models</Typography>
                  {!!cast?.stars?.length && (
                    <Stack sx={{ p: 1 }} spacing={1}>
                      {/* vl_star.php?&mode=&s=afhes&page=28 */}
                      <Stepper activeStep={cast_index} orientation="vertical">
                        {cast.stars.map((model, i) => (
                          <Step key={model}>
                            <StepLabel>{model}</StepLabel>
                          </Step>
                        ))}
                      </Stepper>
                    </Stack>
                  )}
                </>
              </Collapse>
            </Stack>
          )}
        </Card>
      </Collapse>
    </>
  );
}

const ordinal = (index, num, max = 5) => {
  if (num < max) {
    return index + 1;
  }
  return num - max + index + 1;
};

export const space = (value, len = 15) => {
  if (!value) return "...";
  let str = value;
  if (typeof value !== "string") str = JSON.stringify(value);
  if (str.length > len) {
    return str.substr(0, len - 3) + "...";
  }
  return str + " ".repeat(len - str.length);
};
