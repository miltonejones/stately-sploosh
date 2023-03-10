import React from "react";
import {
  styled,
  Box,
  Avatar,
  Badge,
  Stack,
  Drawer,
  Snackbar,
  Button,
  Pagination,
  LinearProgress,
  TextField,
  Collapse,
} from "@mui/material";
import { useMachine } from "@xstate/react";
import { shoppingMachine } from "../../../machines";
import { Flex, Nowrap } from "../../../styled";

import {
  // Avatar,
  Card,
  Typography,
  CardMedia,
  CardContent,
} from "@mui/material";

import { getPagination } from "..";

import {
  getParsers,
  getVideosByText,
  getVideoByURL,
  getVideosByURL,
} from "../../../connector/parser";

// import Observer from '../../../services/Observer';
import dynamoStorage from "../../../services/DynamoStorage";
import {
  getVideoInfo,
  getModelsByName,
  addModelToVideo,
  saveVideo,
} from "../../../connector";
import { ScrollingText, Photo, ModelCard } from "..";
import { usePhoto } from "..";
import HilitText from "../../../styled/HilitText";

const cookieName = "selected-parser-items";

const ERR_IMAGE = "https://s3.amazonaws.com/sploosh.me.uk/assets/XXX.jpg";

export const useShoppingDrawer = (onRefresh) => {
  const store = dynamoStorage();
  const [state, send] = useMachine(shoppingMachine, {
    services: {
      refreshList: async () => {
        onRefresh && onRefresh();
      },

      castModels: async (context) => {
        const { stars_to_add, track_to_save } = context;
        if (stars_to_add?.length) {
          const { ID } = track_to_save;
          const IDs = stars_to_add.map((s) => s.ID);

          if (isNaN(ID)) {
            return false;
          }

          if (!IDs.length) return false;
          return Promise.all(IDs.map((s) => addModelToVideo(ID, s)));
        }
        return false;
      },

      loadModels: async (context) => {
        // const { track_to_save, track_info } = context;
        // const { title } = track_to_save;
        const { stars } = context.track_info;
        if (stars?.length) {
          // const wanted = stars.filter(f => !title.toLowerCase().indexOf(f.toLowerCase()) > -1);

          // if (!wanted?.length) {
          //   return false;
          // }

          const downloaded = await Promise.all(
            stars.map((s) => getModelsByName(s))
          );

          if (downloaded?.length) {
            const list = downloaded
              .filter((star) => {
                const model = stars.find(
                  (name) => !!star[0] && star[0].name === name
                );
                if (model) return model[0];
                return false;
              })
              .filter((f) => !!f);

            // console.log({
            //   stars,
            //   downloaded,
            //   list: list.map((f) => (Array.isArray(f) ? f[0] : f)),
            // });
            return list.map((f) => (Array.isArray(f) ? f[0] : f));
          }
        }
        return false;
      },

      curateVideo: async (context) => {
        const { track_to_save } = context;
        const { title, image, URL } = track_to_save;

        const key =
          URL.indexOf("xvideo") > 0
            ? /\.com\/(.*)/.exec(URL)
            : /([a-z|A-Z]+[-\s]\d+)/.exec(title);

        // console.log ({
        //   key,
        //   URL,
        //   domain
        // })

        if (key) {
          const info = await getVideoInfo(key[1]);
          return {
            ...info,
            key: key[1],
            old: title,
            image,
          };
        }
        return false;
      },
      loadByURL: async (context) => {
        const address = context.chosen[context.save_index];
        return await getVideoByURL(address);
      },
      saveVideoObject: async (context) => {
        const { track_to_save } = context;
        return await saveVideo(track_to_save);
      },
      saveByURL: async (context) => {
        const address = context.chosen[context.save_index];
        const track = await getVideoByURL(address);
        const ID = await saveVideo(track);
        return {
          ...track,
          ID,
        };
      },
      searchByPage: async (context) => {
        const currentPage = context.addresses[context.page_index];
        const [address] = currentPage;
        const res = await getVideosByURL(address);
        return res.videos;
      },
      searchByText: async (context) => {
        const currentDomain = context.selected[context.search_index];
        const address = `https://${currentDomain}`;
        const answer = await getVideosByText(address + "/", context.param);
        console.log({
          address,
          answer,
        });
        return answer;
      },
      loadParserList: async () => {
        return await getParsers();
      },
      selectParser: async (context) => {
        const { parser, selected } = context;
        const updated = selected.some((f) => f === parser)
          ? selected.filter((f) => f !== parser)
          : selected.concat(parser);
        await store.setItem(cookieName, JSON.stringify(updated));
        return updated;
      },
      loadSelectedParsers: async () => {
        const list = await store.getItem(cookieName);
        return JSON.parse(list || "[]");
      },
    },
  });

  const handleClose = () => send("CLOSE");
  const handleClick = (value) => {
    send({
      type: "OPEN",
      value,
    });
  };
  const handleSearch = () => send("SEARCH");
  const handleClear = () => send("CLEAR");
  const handleChoose = (ID) => {
    send({
      type: "CHOOSE",
      ID,
    });
  };
  const handleChange = (e) => {
    send({
      type: "CHANGE",
      value: e.target.value,
    });
  };
  const handleSelect = (value) => {
    send({
      type: "SELECT",
      value,
    });
  };
  const handleAppend = (ID) => {
    send({
      type: "APPEND",
      ID,
    });
  };
  const setPage = (page) => {
    send({
      type: "PAGE",
      page,
    });
  };
  const handleSave = () => send("SAVE");
  const handleError = () => send("RECOVER");

  return {
    diagnosticProps: {
      ...shoppingMachine,
      state,
    },
    state,
    setPage,
    handleClose,
    handleClick,
    handleChange,
    handleSearch,
    handleClear,
    handleChoose,
    handleSelect,
    handleSave,
    handleError,
    handleRetry: () => send("RETRY"),
    handleMode: () =>
      send({
        type: "MODE",
        minimal: !state.context.minimal,
      }),
    handleAppend,
    ...state.context,
  };
};

const Row = styled(Box)(({ selected }) => ({
  fontWeight: selected ? 600 : 400,
  cursor: "pointer",
  "&:hover": {
    textDecoration: "underline",
  },
}));

// const ERR_IMAGE = 'https://s3.amazonaws.com/sploosh.me.uk/assets/XXX.jpg';
const PhotoCard = ({
  active,
  param,
  Text,
  Photo,
  Time,
  domain,
  size = 200,
  onClick,
  existing,
}) => {
  const { image } = usePhoto(Photo, ERR_IMAGE);

  return (
    <Card
      onClick={onClick}
      sx={{
        outline: active ? "solid 2px green" : "",
        cursor: "pointer",
        width: size,
        opacity: existing ? 0.5 : 1,
      }}
    >
      <CardMedia
        component="img"
        sx={{ borderRadius: 2, width: size - 16, aspectRatio: "16 / 9" }}
        width="100%"
        height="auto"
        image={image}
        alt={Text}
      />
      <CardContent sx={{ p: (t) => t.spacing(1) + " !important" }}>
        <Stack>
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
            <HilitText value={param}>{Text}</HilitText>
          </ScrollingText>
          <Stack sx={{ justifyContent: "space-between" }} direction="row">
            <Typography variant="caption">{Time}</Typography>
            <Typography variant="caption">{domain}</Typography>
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
};

const Grid = styled(Box)(({ theme }) => ({
  width: "fit-content",
  padding: theme.spacing(2),
  gap: theme.spacing(1),
  display: "grid",
  gridTemplateColumns: "1fr 1fr 1fr 1fr 1fr 1fr",
}));
const timeSort = (a, b) => (a.CalculatedTime > b.CalculatedTime ? -1 : 1);
const ShoppingDrawer = ({
  counter,
  handleRetry,
  latest,
  diagnosticProps,
  stars_to_add,
  track_to_save,
  state,
  handleError,
  results,
  page = 1,
  auto_search,
  message,
  handleChoose,
  handleSelect,
  handleSave,
  saved,
  chosen,
  setPage,
  progress,
  handleClear,
  handleClose,
  handleSearch,
  handleAppend,
  param,
  handleChange,
  selected,
  parsers,
  open,
  busy,
  minimal,
  handleMode,
}) => {
  const pages = getPagination(results?.sort(timeSort), { page, pageSize: 24 });
  const saving = ["save.next", "save.load", "save"].some(state.matches);

  if (!!saving && !!track_to_save) {
    return (
      <>
        <Snackbar open>
          <Card onClick={handleMode}>
            <Flex>
              <Stack sx={{ p: 2, minWidth: 360 }} spacing={1}>
                {!minimal && (
                  <Photo
                    backup={ERR_IMAGE}
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
                    {message}
                  </Typography>
                </Stack>
                <Typography sx={{ maxWidth: 360 }} variant="caption">
                  {track_to_save.title}
                </Typography>

                {state.matches("save.cast.error") && (
                  <Stack>
                    <Nowrap muted>
                      There was an error processing this request [{counter}]
                    </Nowrap>
                    <Nowrap width={360}>{message} </Nowrap>
                    <Flex spacing={2}>
                      <Button onClick={handleRetry}>Retry</Button>
                      <Button variant="contained" onClick={handleError}>
                        Next
                      </Button>
                    </Flex>
                  </Stack>
                )}

                <LinearProgress
                  variant={!progress ? "indeterminate" : "determinate"}
                  value={progress}
                />
              </Stack>

              <Collapse
                orientation="horizontal"
                in={!!stars_to_add?.length && state.matches("save.cast.pause")}
              >
                {!!stars_to_add?.length && (
                  <Flex spacing={2} sx={{ p: 2 }}>
                    {stars_to_add.map((star) => (
                      <ModelCard
                        small={stars_to_add.length > 3}
                        key={star.ID}
                        model={star}
                      />
                    ))}
                  </Flex>
                )}
              </Collapse>
            </Flex>
          </Card>
        </Snackbar>
      </>
    );
  }

  if (busy && results?.length) {
    const result = latest; //results[results.length - 1];
    if (!result) return <i />;
    return (
      <>
        <Snackbar open>
          <Card onClick={handleMode}>
            <Stack spacing={2} sx={{ width: 360, p: 1 }}>
              {!minimal && <PhotoCard size={360} {...result} />}
              <Stack direction="row" sx={{ alignItems: "center" }} spacing={1}>
                {!!minimal && <Avatar src={result.Photo} />}
                <Typography
                  variant="caption"
                  sx={{ maxWidth: 360, overflow: "hidden" }}
                >
                  {message}
                </Typography>
              </Stack>
              {/* <Nowrap onClick={() => window.open(result.Photo)} variant="caption" sx={{maxWidth:360,overflow:'hidden'}}>
          {result.Photo}
          </Nowrap> */}
            </Stack>
            {/* <pre>
          {JSON.stringify(result,0,2)}
        </pre> */}
            <LinearProgress
              variant={!progress ? "indeterminate" : "determinate"}
              value={progress}
            />
          </Card>
        </Snackbar>
      </>
    );
  }

  return (
    <>
      <Drawer anchor="left" onClose={(e) => handleClose()} open={open}>
        <Box sx={{ borderBottom: 1, minWidth: 360, borderColor: "divider" }}>
          <Stack direction="row" sx={{ p: 1, justifyContent: "space-between" }}>
            <Typography>Shop</Typography>
            <i className="fa-solid fa-cart-shopping"></i>
          </Stack>
        </Box>

        <Box>
          {/* [[{JSON.stringify(auto_search)}]] */}
          {!!message && (
            <Box sx={{ p: 2 }}>
              <LinearProgress
                variant={!progress ? "indeterminate" : "determinate"}
                value={progress}
              />
              {message}
            </Box>
          )}
        </Box>

        {!results?.length && (
          <Box sx={{ width: 360, p: 2 }}>
            <TextField
              autoFocus
              label="Search"
              placeholder="Type search param"
              fullwidth
              onKeyUp={(e) => e.keyCode === 13 && handleSearch()}
              size="small"
              value={param}
              onChange={handleChange}
            />
            <Button onClick={handleSearch}>Search</Button>
          </Box>
        )}

        {state.matches("results") && (
          <>
            <Stack
              direction="row"
              sx={{ alignItems: "center", justifyContent: "space-between" }}
            >
              {pages.pageCount > 1 && state.matches("results") && (
                <Box sx={{ ml: 1 }}>
                  <Pagination
                    count={Number(pages.pageCount)}
                    page={Number(page)}
                    onChange={(a, num) => setPage(num)}
                  />
                </Box>
              )}

              <Stack
                direction="row"
                sx={{ alignItems: "center", p: 2 }}
                spacing={2}
              >
                <Typography variant="body2" color="text.secondary">
                  Results for "{param}"
                </Typography>

                <Badge
                  onClick={handleSave}
                  sx={{ cursor: "pointer" }}
                  badgeContent={chosen?.length}
                  color="secondary"
                >
                  <i onClick={handleSave} class="fa-solid fa-floppy-disk"></i>
                </Badge>

                <i
                  onClick={() => {
                    const ids = pages.visible
                      .filter((f) => !f.existing)
                      .map((f) => f.URL);
                    handleAppend(ids);
                    // alert (JSON.stringify(ids));
                  }}
                  class="fa-solid fa-check"
                ></i>

                <i onClick={handleClear} className="fa-solid fa-xmark" />
              </Stack>
            </Stack>
          </>
        )}

        {!!results?.length && !saving && (
          <Grid>
            {pages.visible.map((result, o) => (
              <>
                {!!result?.URL && (
                  <PhotoCard
                    param={param}
                    active={chosen?.indexOf(result.URL) > -1}
                    onClick={(e) => handleChoose(result.URL)}
                    key={o}
                    {...result}
                  />
                )}
              </>
            ))}
          </Grid>
        )}

        {/* <pre>
 {JSON.stringify(chosen,0,2)} 
 </pre> */}
        {/* {param}
         */}
        {!!parsers && !results?.length && (
          <Stack sx={{ width: 360, p: 2 }}>
            {parsers
              .filter((f) => !!f.pageParser)
              .map((f) => (
                <Row
                  onClick={() => handleSelect(f.domain)}
                  selected={selected?.find((s) => s === f.domain)}
                  sx={{ pb: 1 }}
                >
                  {f.domain}
                </Row>
              ))}
          </Stack>
        )}
      </Drawer>
    </>
  );
};
ShoppingDrawer.defaultProps = {};
export default ShoppingDrawer;
