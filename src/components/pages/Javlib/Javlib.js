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
  LinearProgress,
  Link,
  Stack,
  Step,
  StepLabel,
  Stepper,
  TextField,
  Typography,
} from "@mui/material";
import { javlibMachine } from "../../../machines/javlibMachine";
import { useMachine } from "@xstate/react";
import { Flex, Nowrap, Spacer } from "../../../styled";
import { PhotoCard } from "../../lib/ShoppingDrawer/Cards";
import { useMenu } from "../../../machines";
import { usePreview } from "../../../services/usePreviewMachine";
import PreviewBar from "../../lib/ShoppingDrawer/PreviewBar";

const DIALOG_WIDTH = 400;

const path_placeholders = JSON.parse(
  localStorage.getItem("path_placeholders") || "{}"
);
export default function Javlib() {
  const [paths, setPaths] = React.useState([]);
  const [placeholders, setPlaceholders] = React.useState(path_placeholders);
  const menu = useMenu((val) => {
    if (!val) return;
    let path = val;
    if (path.indexOf("/") > 0) {
      path = path.split("/").pop();
    }
    setPaths((c) => c.concat(path));
  });
  const width = Math.floor(window.innerWidth / paths.length) - 8;
  const dropPlaceholder = React.useCallback(
    (path) => {
      delete placeholders[path];
      setPlaceholders(placeholders);
      localStorage.setItem("path_placeholders", JSON.stringify(placeholders));
    },
    [placeholders]
  );
  return (
    <>
      {/* <Dialog open={!!doomed}>
        <Stack spacing={1} sx={{ width: DIALOG_WIDTH, p: 2 }}>
          <Typography variant="subtitle2">Confirm Close</Typography>
          <Typography>Close {doomed}?</Typography>
          <Flex>
            <Spacer />
            <Button onClick={() => setDoomed(null)}> cancel</Button>
            <Button
              onClick={() => {
                setPaths((f) => f.filter((e) => e !== doomed));
                setDoomed(null);
              }}
              variant="contained"
            >
              close
            </Button>
          </Flex>
        </Stack>
      </Dialog> */}

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
      {/* {JSON.stringify(path_placeholders)} */}
      <Flex sx={{ alignItems: "flex-start", p: 1 }} spacing={1}>
        {paths.map((path) => (
          <JavlibBit
            key={path}
            startPath={path}
            size={width}
            remove={() => setPaths((f) => f.filter((e) => e !== path))}
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

function JavlibBit({ startPath, size, remove }) {
  const [state, send] = useMachine(javlibMachine);
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
  } = state.context;
  const viewer = usePreview();
  const menu = useMenu((val) => !!val && remove());
  const preview = (event, url) =>
    !viewer ? false : viewer.handleOpen(event, url);
  React.useEffect(() => {
    send({
      type: "work",
      path: startPath,
    });
  }, [startPath]); //<i class="fa-solid fa-pause"></i>
  const buttons = {
    pause: "fa-solid fa-pause",
    resume: "fa-solid fa-play",
    skip: "fa-solid fa-forward",
    stop: "fa-solid fa-stop",
  };
  return (
    <>
      <PreviewBar viewer={viewer} />
      {/* <Dialog {...menu.menuProps}>

      </Dialog> */}

      <Card sx={{ width: size, maxWidth: 532 }}>
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
            </Stack>
            {/* <Spacer /> */}
          </Flex>
          <Collapse in={menu.menuProps.open}>
            <Card
              sx={{ p: 2, backgroundColor: (theme) => theme.palette.grey[200] }}
            >
              <Stack spacing={1}>
                <Typography variant="subtitle2">Confirm Close</Typography>
                <Typography>Close "{title}"?</Typography>
                <Flex spacing={1}>
                  <Spacer />
                  <Button onClick={menu.handleClose()}> cancel</Button>
                  <Button onClick={menu.handleClose(true)} variant="contained">
                    close
                  </Button>
                </Flex>
              </Stack>
            </Card>
          </Collapse>
          <Collapse in={state.can("yes")}>
            <Card
              sx={{ p: 2, backgroundColor: (theme) => theme.palette.grey[200] }}
            >
              <Stack spacing={1}>
                <Flex>
                  <Spacer>
                    <Typography variant="subtitle2">Confirm action</Typography>
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
                  <Typography variant="subtitle2">Added videos</Typography>
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
                            `${ordinal(i, added.length, 5)}. ${line.Text}`,
                            70
                          )}
                        </Nowrap>
                      </Flex>
                    ))}
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
                      <i className={buttons[word]} onClick={() => send(word)} />
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
                <LinearProgress variant="determinate" value={page_progress} />
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
            in={state.matches("process keys.drop old videos.apply favorite")}
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
      </Card>
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
