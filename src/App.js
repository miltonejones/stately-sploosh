import React from "react";
import { AppStateContext } from "./context";
import {
  VideoCard,
  Dash,
  useModelModal,
  ModelGrid,
  SearchDrawer,
  useSearchDrawer,
  usePhotoModal,
  PhotoModal,
  ModelModal,
  VideoDrawer,
  ShoppingDrawer,
  FloatingMenu,
  Diagnostics,
  getPagination,
  useShoppingDrawer,
  useVideoDrawer,
  SettingsMenu,
  Librarian
} from "./components/lib";
import { useWindowManager, VideoPersistService } from "./services";

import {
  Avatar,
  Box,
  Stack,
  Tooltip,
  Tabs,
  Tab,
  LinearProgress,
  Button,
  Pagination,
  // TextField,
  Typography,
  styled,
} from "@mui/material";
import {
  getVideos,
  getModels,
  getModelsByName,
  deleteVideo,
  getVideosByDomain,
  updateModelPhoto,
  toggleVideoFavorite,
  findVideos,
  getFavorites,
  getVideoKeys,
} from "./connector";
import { useMachine } from "@xstate/react";
import { splooshMachine, useLibrarian } from "./machines";
import dynamoStorage from "./services/DynamoStorage";
import "./App.css";

import {
  BrowserRouter,
  Routes,
  Route,
  useNavigate,
  useLocation,
  useParams,
} from "react-router-dom";
import "./App.css";
import { SearchPersistService } from "./services";
import { Flex, PhotoGrid, IconTextField } from "./styled";

const Btn = styled(Button)(({ theme }) => ({
  textTransform: "capitalize",
}));

export const TabButton = styled(Tab)(({ theme, uppercase }) => ({
  textTransform: uppercase ? "uppercase" : "none",
  margin: 0,
  padding: theme.spacing(1),
  height: 24,
  minHeight: 24,
  fontSize: "0.85rem",
}));

export const TabList = styled(Tabs)(() => ({
  minHeight: 24,
}));

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Application />} />
        <Route path="/:type" element={<Application />} />
        <Route path="/:type/:page" element={<Application />} />
        <Route path="/:type/:page/:param" element={<Application />} />
      </Routes>
    </BrowserRouter>
  );
}

function Application() {
  const WindowManager = useWindowManager();
  const librarian = useLibrarian(() => {
    send("REFRESH");
  });
  const editor = useVideoDrawer(() => {
    send("REFRESH");
  });
  const store = dynamoStorage();
  const shop = useShoppingDrawer(() => {
    send("REFRESH");
  });
  const modal = useModelModal();
  const finder = useSearchDrawer(
    (val) => !!val && navigate(`/search/1/${val}`)
  );
  const saving = [
    "save.next",
    "save.load",
    "search.next",
    "search.page",
    "search.find",
  ].some(shop.state.matches);
  const { type, page = 1, param } = useParams();
  const [state, send] = useMachine(splooshMachine, {
    services: {
      getParam: async (context) => param,
      saveSearch: async (context) => {
        await SearchPersistService.saveSearch(context.value);
      },
      refreshList: async () => {
        modal.refresh();
      },
      getSearches: async (context) => {
        const tabs = await store.getItem("search-tabs");
        return JSON.parse(tabs);
      },
      loadVideos: async (context) => {
        return await getVideos(page);
      },
      loadModels: async (context) => {
        if (!param) {
          return await getModels(page);
        }
        const records = await getModelsByName(param);
        const pages = getPagination(records, { page, pageSize: 36 });
        return {
          count: records.length,
          records: pages.visible,
        };
      },
      loadFavorites: async () => {
        return await getFavorites(page);
      },
      loadDomain: async (context) => {
        await appendTab(context.domain, "domain");
        return await getVideosByDomain(context.domain, page);
      },
      loadRecentVideos: async () => {
        const videos = await VideoPersistService.get();
        const first = (page - 1) * 30;
        const Keys = videos.slice(first, first + 30);
        if (!Keys.length) return alert(["NO KEYS IN", videos.length]);
        const list = await getVideoKeys(Keys);
        const items = {
          records: list.records,
          count: videos.length,
        };
        return items;
      },
      dropVideo: async (context) => {
        await deleteVideo(context.ID);
      },
      updatePhoto: async (context) => {
        if (!context.src) return;
        await updateModelPhoto(context.ID, context.src);
      },
      setFavorite: async (context) => {
        return await toggleVideoFavorite(context.ID);
      },
      searchVideos: async (context) => {
        await appendTab(param, "search");
        return await findVideos(param, page);
      },
    },
  });

  const appendTab = async (param, type) => {
    const raw = param.replace("*", "");
    if (!tabs) return;
    const searches = tabs.find((t) => t.param === raw)
      ? tabs
      : tabs.concat({
          type,
          param: raw,
        });
    await store.setItem("search-tabs", JSON.stringify(searches));
  };

  const location = useLocation();
  const photo = usePhotoModal((src, ID) => {
    if (!src) return;
    send({
      type: "PHOTO",
      src,
      ID,
    });
  });

  React.useEffect(() => {
    if (!type) return; 
    send({
      type: type.toUpperCase(),
      page,
      param,
    });
  }, [send, type, page, param, location]);

  const { videos, search_param, tabs, view, active_machine } = state.context;
  const pageSize = 30;
  const navigate = useNavigate();
  const pageCount = Math.ceil(videos?.count / pageSize);
  const setPage = (e, num) => {
    const path = [type, num];
    if (param) path.push(param);
    navigate("/" + path.join("/"));
  };

  const tabList = tabs?.map((tab) => ({
    param: tab.param,
    type: tab.type,
  }));

  const removeTab = async (doomed) => {
    const searches = tabs.filter((t) => t.param !== doomed);
    await store.setItem("search-tabs", JSON.stringify(searches));
    if (param  !== doomed) { 
      send({
        type: 'VIDEO',
        page,
        param,
      }); 
      return;
    }
    navigate(`/video/1`);
  };

  const addFavorite = (ID) => {
    send({
      type: "HEART",
      ID,
    });
  };

  const removeVideo = (ID) => {
    send({
      type: "DROP",
      ID,
    });
  };

  const { windowLength } = WindowManager;

  const floatingProps = (windowLength
    ? [
        {
          icon: <i className="fa-solid fa-users-viewfinder" />,
          action: () => WindowManager.focus(),
          name: "Focus all windows",
        },
        {
          icon: <i className="fa-solid fa-xmark" />,
          action: () => WindowManager.exit(),
          name: "Close all windows",
        },
      ]
    : []
  ).concat([
    //   { icon: <i className="fa-solid fa-clipboard-check"/>, action: () =>  {
    //     send({
    //       type: 'CHANGE',
    //       debug: !state.context.debug
    //     })
    //   },
    //   name: 'Show machine state'
    // },
    {
      icon: <i className="fa-solid fa-rotate" />,
      action: () => send("REFRESH"),
      name: "Refresh",
    },
    {
      name: "Edit",
      action: !!editor.videos?.length
        ? () => editor.editMultiple()
        : () => editor.selectMode(),
      icon: !!editor.videos?.length ? (
        <i className="fa-solid fa-pen" />
      ) : editor.multiple ? (
        <i className="fa-solid fa-check red" />
      ) : (
        <i className="fa-solid fa-check" />
      ),
    },
  ]);

  const busy = [
    "save",
    "search.loading",
    "recent.loading",
    "model.loading",
    "video.loading",
    "domain.loading",
  ].some(state.matches);
  const modelPageCount = Math.ceil(state.context.models?.count / 36);
  return (
    <AppStateContext.Provider
      value={{ WindowManager, active_machine, floatingProps }}
    >
      <Flex spacing={2} sx={{ p: 2, borderBottom: 1, borderColor: "divider" }}>
        <i
          onClick={() => finder.handleClick()}
          className="fa-solid fa-bars"
        ></i>
        <Avatar
          src="https://s3.amazonaws.com/sploosh.me.uk/assets/sploosh.png"
          alt="sploosh"
        />

        <Btn
          size="small"
          variant={state.matches("dash") ? "contained" : "text"}
          onClick={() => navigate("/dash")}
        >
          home
        </Btn>
        <Btn
          size="small"
          variant={
            !state.matches("dash") &&
            ["video", "domain", "search"].some((f) => view === f)
              ? "contained"
              : "text"
          }
          onClick={() => navigate("/video/1")}
        >
          videos
        </Btn>
        <Btn
          size="small"
          variant={view === "favorites" ? "contained" : "text"}
          onClick={() => navigate("/favorite/1")}
        >
          favorites
        </Btn>
        <Btn
          size="small"
          variant={view === "recent" ? "contained" : "text"}
          onClick={() => navigate("/recent/1")}
        >
          recently watched
        </Btn>
        <Btn
          size="small"
          variant={view === "model" ? "contained" : "text"}
          onClick={() => navigate("/model/1")}
        >
          models
        </Btn>
        {/* <Typography variant="caption" color="grey[200]">[{view}] - {JSON.stringify(state.value)}</Typography> */}
        {state.matches("video_error") && (
          <>
            {state.context.errorMsg}
            {JSON.stringify(state.context.stack)}
            <Button onClick={() => send("RECOVER")}>home</Button>
          </>
        )}

        <Box sx={{ flexGrow: 1 }} />

        <IconTextField
          endIcon={
            !search_param ? null : (
              <i
                onClick={() => navigate("/video/1")}
                className="fa-solid fa-xmark"
              />
            )
          }
          placeholder="Type a title or model name"
          label="Search"
          onKeyUp={(e) =>
            e.keyCode === 13 &&
            navigate(
              `/${view === "model" ? "model" : "search"}/1/${search_param}`
            )
          }
          onChange={(e) => {
            send({
              type: "CHANGE",
              value: e.target.value,
            });
          }}
          value={search_param}
        />

        {/* <i onClick={() =>  WindowManager.focus()} className="fa-solid fa-users-viewfinder"></i>
<i onClick={() =>  WindowManager.exit()}  className="fa-solid fa-xmark"></i>  */}
        <i
          onClick={() => shop.handleClick()}
          className={
            busy || saving
              ? "fa-solid fa-rotate App-logo"
              : "fa-solid fa-cart-shopping"
          }
        ></i>  
       
        
          <i
        onClick={() => librarian.send('OPEN')}
        className="fa-solid fa-book"
      ></i>

        {/* <i onClick={() =>  send('REFRESH')} className="fa-solid fa-rotate"></i>
{!editor.videos?.length && <i onClick={() =>  editor.selectMode()} className={editor.multiple?"fa-solid fa-check red":"fa-solid fa-check"}></i>}
{!!editor.videos?.length && <i onClick={() =>  editor.editMultiple()} className="fa-solid fa-pen"></i>} */}
        <SettingsMenu
          value={active_machine}
          onChange={(value) =>
            send({
              type: "SET",
              key: "active_machine",
              value,
            })
          }
        />

        {/* [{JSON.stringify(editor.multiple)}]
[{editor.videos?.length}] */}
      </Flex>

      {/* onChange={(e,n) => { 
    if (n === 0) return navigate('/video/1')
    navigate(`/search/1/${tabList[n - 1].param}`)
  }} */}

  {/* {JSON.stringify(librarian.state.value)} */}
      {!!tabList && !state.matches("dash") && view !== "model" && (
        <Flex
          sx={{ borderBottom: 1, borderColor: busy ? "primary" : "divider" }}
        >
          {!!param && (
            <Flex sx={{ ml: 2 }} spacing={2}>
              <i
                onClick={() => {
                  send({
                    type: "SAVE",
                    value: param,
                  });
                }}
                className="fa-solid fa-floppy-disk"
              ></i>

              <i
                onClick={() => {
                  const parameter =
                    param.indexOf("*") > 0
                      ? param.replace("*", "")
                      : `${param}*`;
                  navigate(`/search/1/${parameter}`);
                }}
                className={`${
                  param.indexOf("*") > 0 ? "red fa-solid" : "fa-regular"
                } fa-heart`}
              ></i>
            </Flex>
          )}

          <TabList
            sx={{ height: 24 }}
            variant="scrollable"
            scrollButtons
            value={
              tabList.map((f) => f.param).indexOf(param?.replace("*", "")) + 1
            }
          >
            <TabButton
              label="All videos"
              onClick={() => navigate("/video/1")}
              sx={{ textTransform: "none" }}
            />
            {tabList.map((tab) => (
              <TabButton
                sx={{ textTransform: "none", height: 24 }}
                icon={
                  <i
                    onClick={() => removeTab(tab.param)}
                    className="fa-solid fa-xmark"
                  ></i>
                }
                iconPosition="end"
                key={tab.param}
                label={
                  <Tooltip title={tab.param}>
                    <Typography
                      variant="body2"
                      onClick={() => {
                        navigate(`/${tab.type}/1/${tab.param}`);
                      }}
                    >
                      {tab.param.substr(0, 15)}
                      {tab.param.length > 15 && <>...</>}
                    </Typography>
                  </Tooltip>
                }
              />
            ))}
          </TabList>
        </Flex>
      )}

      {(busy || saving) && <LinearProgress />}

      <div className="App">
        {state.matches("dash") && <Dash />}

        {view === "model" && !state.matches("dash") && !!state.context.models && (
          <Stack>
            <Flex spacing={1} sx={{ mt: 1 }}>
              {modelPageCount > 1 && (
                <Pagination
                  count={modelPageCount}
                  page={Number(page)}
                  onChange={setPage}
                />
              )}
              <Typography variant="caption">
                {state.context.models?.count} models
              </Typography>
              {!!param && (
                <Typography
                  onClick={() => navigate("/model/1")}
                  variant="caption"
                >
                  {" "}
                  like "<b>{param}</b>" <i className="fa-solid fa-xmark" />
                </Typography>
              )}
            </Flex>
            <ModelGrid
              modelClicked={modal.openModel}
              models={state.context.models.records}
            />
          </Stack>
        )}

        {!state.matches("dash") && !!state.context.videos && view !== "model" && (
          <Stack spacing={1}>
            {pageCount > 1 && (
              <Flex sx={{ mt: 1 }}>
                <Pagination
                  count={Number(pageCount)}
                  page={Number(page)}
                  onChange={setPage}
                />

                <Typography variant="caption">
                  {videos?.count} videos
                </Typography>
              </Flex>
            )}
            <Box sx={{ ml: 2 }}>
              <PhotoGrid sx={{ width: "97vw" }}>
                {state.context.videos.records.map((video) => (
                  <VideoCard
                    medium
                    selected={editor.videos?.find((f) => f.ID === video.ID)}
                    editClicked={editor.handleClick}
                    deleteClicked={removeVideo}
                    favoriteClicked={addFavorite}
                    studioClicked={(val) => navigate(`/search/1/${val}-`)}
                    domainClicked={(val) => navigate(`/domain/1/${val}`)}
                    photoClicked={photo.openPhoto}
                    modelClicked={(id) => {
                      modal.openModel(id);
                    }}
                    video={video}
                    key={video.ID}
                  />
                ))}
              </PhotoGrid>
            </Box>

            {pageCount > 1 && (
              <Box sx={{ ml: 1 }}>
                <Pagination
                  count={Number(pageCount)}
                  page={Number(page)}
                  onChange={setPage}
                />
              </Box>
            )}
          </Stack>
        )}
      </div>
      <Librarian librarian={librarian} />
      <FloatingMenu fixed />
      <VideoDrawer {...editor} />
      <SearchDrawer {...finder} />
      <ModelModal
        photoClicked={photo.openPhoto}
        searchClicked={shop.handleClick}
        deleteClicked={removeVideo}
        favoriteClicked={addFavorite}
        {...modal}
      />

      <PhotoModal {...photo} />
      <ShoppingDrawer {...shop} />

      <Diagnostics {...photo.diagnosticProps} />
      <Diagnostics {...editor.diagnosticProps} />
      <Diagnostics {...shop.diagnosticProps} />

      <Diagnostics
        open={state.context.debug || state.matches("video_error")}
        id={splooshMachine.id}
        state={state}
        send={send}
        states={splooshMachine.states}
      />
    </AppStateContext.Provider>
  );
}

export default App;
