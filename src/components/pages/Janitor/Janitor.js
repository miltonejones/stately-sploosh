import React from "react";

import { useMachine } from "@xstate/react";
import {
  Avatar,
  AvatarGroup,
  Box,
  Button,
  Card,
  Chip,
  Dialog,
  LinearProgress,
  Skeleton,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { PhotoCard } from "../../lib/ShoppingDrawer/Cards";
import { Flex, Spacer } from "../../../styled";
import { VideoCard } from "../../lib";
import { janitorMachine } from "../../../machines/janitorMachine";

function extractPaths(obj, currentPath = [], paths = []) {
  Object.keys(obj).forEach((key) => {
    const newPath = currentPath.concat(key);
    if (typeof obj[key] === "object" && obj[key] !== null) {
      extractPaths(obj[key], newPath, paths);
    } else {
      paths.push(newPath.join("."));
    }
  });
  return paths;
}

export default function Janitor() {
  const [domains, setDomains] = React.useState([
    "javdoe.tv",
    "javdoe.to",
    "javdoe.com",
    "javfinder.la",
  ]);
  const [domain, setDomain] = React.useState();
  const [doomed, setDoomed] = React.useState(null);

  const width = Math.floor((1 / domains.length) * 100) - 2;
  const third = Math.floor(window.innerWidth / domains.length) - 80;

  return (
    <>
      <Dialog open={!!doomed}>
        <Stack spacing={1} sx={{ width: 400, p: 2 }}>
          <Typography variant="subtitle2">Confirm Close</Typography>
          <Typography>Close {doomed}?</Typography>
          <Flex>
            <Spacer />
            <Button onClick={() => setDoomed(null)}> cancel</Button>
            <Button
              onClick={() => {
                setDomains((f) => f.filter((e) => e !== doomed));
                setDoomed(null);
              }}
              variant="contained"
            >
              close
            </Button>
          </Flex>
        </Stack>
      </Dialog>

      <Flex sx={{ alignItems: "baseline" }} spacing={1}>
        {domains.map((domain) => (
          <Card
            elevation={2}
            variant="elevation"
            sx={{ m: 1, width: `${width}vw` }}
          >
            <JanitorBit
              key={domain}
              domain={domain}
              remove={() => setDoomed(domain)}
              width={third}
            />
          </Card>
        ))}
      </Flex>

      <Flex sx={{ p: 1 }} spacing={1}>
        <TextField
          label="Domain"
          size="small"
          name="domain"
          onChange={(event) => {
            setDomain(event.target.value);
          }}
          value={domain}
        />
        <Flex>
          <Button
            variant="contained"
            onClick={() => {
              setDomain("");
              setDomains(domains.concat(domain));
            }}
          >
            add
          </Button>
        </Flex>
      </Flex>
    </>
  );
}

function JanitorBit({ remove, domain, width }) {
  const [state, send] = useMachine(janitorMachine);
  const {
    page,
    index,
    // videos,
    count,
    replacement,
    missing,
    innerText,
    deprecated,

    validated,
    progress,
    message,
    hue,
    remaining,
    model_index,
    models,
  } = state.context;

  // const [domain] = excludedDomains;
  let path = extractPaths(state.value);

  // console.log(JSON.stringify(state.value));

  const stars = models?.filter((f) => !!f.image);

  return (
    // <Stack>

    <Stack sx={{ justifyContent: "flex-start", alignItems: "flex-start" }}>
      <Stack sx={{ width: "100%", p: 1 }}>
        {!state.can("start") && (
          <>
            <Typography variant="caption">
              Page: {page}/{index}, Count: {count} , Remaining: {remaining}
            </Typography>
            <Box>
              {" "}
              <LinearProgress
                variant={!!progress ? "determinate" : "indeterminate"}
                value={progress}
              />
            </Box>
            <Stack sx={{ p: 1 }} spacing={1}>
              <Box sx={{ width }}>
                {!!deprecated.length && (
                  <VideoCard medium video={deprecated[0]} />
                )}
                {!deprecated.length && (
                  <Skeleton
                    variant="rectangular"
                    width={width}
                    height={width * 0.75}
                  />
                )}
              </Box>
              <Box sx={{ pt: 1 }}>
                {!!replacement && !validated.length && (
                  <PhotoCard size={width} {...replacement} existing={missing} />
                )}
                {!replacement && !validated.length && (
                  <Skeleton
                    variant="rectangular"
                    width={width}
                    height={width * 0.7}
                  />
                )}
              </Box>
              <Box sx={{ width }}>
                {!!validated.length && (
                  <VideoCard medium video={validated[0]} />
                )}
              </Box>
            </Stack>
            {!!stars.length && (
              <Flex sx={{ p: 1 }} spacing={1}>
                <AvatarGroup>
                  {stars.map((model, i) => (
                    <Avatar
                      sx={{
                        width: 56,
                        height: 56,
                        border: `solid 2px ${
                          i === model_index ? "red" : "gray"
                        }`,
                      }}
                      src={model.image}
                      key={model.ID}
                      alt={model.Name}
                    />
                  ))}
                </AvatarGroup>
              </Flex>
            )}
          </>
        )}

        <Flex spacing={1} sx={{ p: 1 }}>
          <Typography variant="caption">{path.join(".")}</Typography>
        </Flex>
        <Flex sx={{ pb: 2 }} spacing={1}>
          <Chip label={domain} color="primary" size="small" onDelete={remove} />
          <Button
            variant="contained"
            disabled={!state.can("start")}
            onClick={() =>
              send({
                type: "start",
                domain,
              })
            }
          >
            go
          </Button>
          <Button
            variant="contained"
            disabled={!state.can("pause")}
            onClick={() => send("pause")}
          >
            pause
          </Button>
          <Button
            variant="contained"
            disabled={!state.can("resume")}
            onClick={() => send("resume")}
          >
            resume
          </Button>
        </Flex>

        {!state.can("start") && (
          <>
            <Typography>
              Key: <b>{innerText}</b>
            </Typography>
            {!!deprecated.length && (
              <Typography
                color={!replacement ? "error" : "success"}
                variant="caption"
              >
                <b>From:</b> {deprecated[0].title}
              </Typography>
            )}
            <Typography variant="caption" color={missing ? "error" : "success"}>
              <b>To:</b> {replacement?.Text || "Finding replacement..."}
            </Typography>
            <Typography color="text.secondary" variant="caption">
              {message}
            </Typography>
          </>
        )}
      </Stack>
    </Stack>

    // </Stack>
  );
}
