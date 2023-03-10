import React from "react";
import {
  styled,
  Avatar,
  Chip,
  LinearProgress,
  Box,
  Pagination,
  Dialog,
  Stack,
  Typography,
} from "@mui/material";
import { useMachine } from "@xstate/react";
import { modelMachine } from "../../../machines";
import {
  getModel,
  getModelCostars,
  addModelAlias,
  updateModelPhoto,
  addModelToVideo,
  getModelMissingVideos,
} from "../../../connector";
import { VideoCard, ModelSelect, FloatingMenu, ModelCard } from "..";
import { ModelMenu } from "..";
import { IconTextField } from "../../../styled";
import { Flex, Spacer } from "../../../styled";
import { useCast } from "../../../machines";
import { useDedupe } from "../../../machines/dedupeMachine";


const U = styled("u")(() => ({
  cursor: "pointer",
}));

const I = styled("i")(({ theme }) => ({
  cursor: "pointer",
  "&:hover": {
    color: theme.palette.primary.main,
  },
}));

const Grid = styled(Box)(({ wide, theme }) => ({
  width: "100%",
  pt: 2,
  gap: theme.spacing(1),
  display: "grid",
  gridTemplateColumns: wide ? "1fr 1fr 1fr 1fr 1fr 1fr" : "1fr 1fr 1fr 1fr",
}));

export const useModelModal = () => {
  const agent = useCast(() => send("REFRESH"));
  const [state, send] = useMachine(modelMachine, {
    services: {
      assignAlias: async (context) => {
        return await addModelAlias(context.ID, context.alias.ID);
      },
      castModel: async (context) => {
        return await addModelToVideo(
          context.selected[context.add_index],
          context.ID
        );
      },
      loadMissing: async (context) => {
        return await getModelMissingVideos(context.ID);
      },
      loadModel: async (context) => {
        return await getModel(
          context.ID,
          context.page,
          context.favorite,
          context.filterText
        );
      },
      loadCostars: async (context) => {
        return await getModelCostars(context.ID);
      },
    },
  });

  const openModel = (ID) => {
    send({
      type: "OPEN",
      ID,
    });
  };

  const handleClose = () => send("CLOSE");

  const setPage = (e, index) => {
    send({
      type: "PAGE",
      page: index,
    });
  };

  const setTab = (tab) => {
    send({
      type: "TAB",
      tab,
    });
  };

  const handleSelect = (ID) => {
    send({
      type: "SELECT",
      ID,
    });
  };

  const handleBatch = () => send("BATCH");
  const handleAlias = () => send("ALIAS");

  const handleRename = (alias) =>
    send({
      type: "RENAME",
      alias,
    });
  const handleChange = (value) =>
    send({
      type: "CHANGE",
      value,
    });

  const setFavorite = () => send("FAVORITE");

  const refresh = () => send("REFRESH");

  return {
    state,
    refresh,
    openModel,
    handleClose,
    handleChange,
    handleSelect,
    handleBatch,
    setPage,
    setTab,
    handleRename,
    handleAlias,
    setFavorite,
    agent,
    ...state.context,
  };
};

const ModelModal = ({
  open,
  agent,
  state,
  tab: tabnum,
  memory,
  missing,
  selected,
  progress,
  handleAlias,
  filterText,
  photoClicked,
  favoriteClicked,
  deleteClicked,
  searchClicked,
  bookClicked,
  handleSelect,
  handleBatch,
  aliasMode,
  handleRename,
  refresh,
  setFavorite,
  handleChange,
  favorite,
  setTab,
  costars,
  openModel,
  handleClose,
  setPage,
  page = 1,
  model,
}) => {
  // const [tab, setTab] = React.useState(0)
  // const pages = usePagination(costars, { pageCount: 10, page})
  const tab = Number(tabnum);
  const dedupe = useDedupe(refresh);

  if (!model?.videos?.records) return <i />;
  const pageSize = Math.abs(tab) === 1 ? 18 : 16;
  const recordCount =
    Math.abs(tab) === 1 ? costars?.length : model.videos.count;

  const pageCount = Math.ceil(recordCount / pageSize);

  const startNum = (page - 1) * pageSize;

  const visible = costars?.slice(startNum, startNum + pageSize);

  const star = model.model[0];
  const photoOpts = [
    {
      ID: 1,
      Name: "Find images online",
    },
  ];

  const handleDedupe = (trackFk,modelFk) => {
    dedupe.send({
      type: 'DEDUPE',
      modelFk,
      trackFk
    })
  }

  const handleModelMenu = async (value) => {
    if (value === 1) {
      photoClicked(star.name, star.ID);
      return;
    }
    await updateModelPhoto(star.ID, value);
    refresh();
  };

  const handleKeyUp = (e) => {
    if (tab < 0) {
      agent.add(filterText, star.ID);
      handleChange("");
      return;
    }
    refresh();
  };

  return (
    <Dialog maxWidth="md" open={open} onClose={handleClose}>
      <Stack spacing={1} sx={{ p: 2, minHeight: 500, position: "relative" }}>
        <Stack direction="row" spacing={1} sx={{ pr: 2 }}>
          <ModelMenu
            onChange={handleModelMenu}
            models={photoOpts}
            clipText="Copy image from clipboard"
          >
            <Avatar
              sx={{ width: 48, height: 48 }}
              variant="rounded"
              src={star.image}
            />
          </ModelMenu>
          <Stack>
            <Typography sx={{ lineHeight: 1 }} variant="h6">
              {star.name}
            </Typography>
            {/* [{agent.status}] */}

            {!!model.aliases?.length && (
              <Typography sx={{ lineHeight: 1 }} variant="caption">
                AKA{" "}
                {model.aliases.map((alias) => (
                  <>
                    <U onClick={() => openModel(alias.ID)}> {alias.alias}</U>,
                  </>
                ))}{" "}
              </Typography>
            )}

            {/* <Typography variant="caption"><u onClick={handleAlias}><b>Add alias</b></u></Typography> */}
          </Stack>

          <I
            onClick={setFavorite}
            className={`fa-${favorite ? "solid" : "regular"} fa-star`}
          ></I>

          <Box sx={{ flexGrow: 1 }} />

          {!!aliasMode && (
            <ModelSelect
              onValueSelected={(val) => !!val && handleRename(val)}
            />
          )}
          {!aliasMode && (
            <IconTextField
              endIcon={
                !filterText ? null : (
                  <i
                    onClick={() => handleChange("")}
                    className="fa-solid fa-xmark"
                  />
                )
              }
              onKeyUp={(e) => e.keyCode === 13 && handleKeyUp(e)}
              size="small"
              autoComplete="off"
              label={tab < 0 ? "Add video" : "Filter videos"}
              value={filterText}
              onChange={(e) => handleChange(e.target.value)}
            />
          )}

          <Box sx={{ flexGrow: 1 }} />

          <Flex spacing={2}>
            {!!missing?.length && (
              <Chip
                variant={tab === 2 ? "contained" : "outlined"}
                label="Missing"
                color="error"
                size="small"
                onClick={() => setTab(2)}
              />
            )}

            <i
              onClick={() => setTab(tab < 0 ? 0 : -1)}
              className="fa-solid fa-film"
            ></i>

            <i
              onClick={() => {
                searchClicked(star.name);
                handleClose();
              }}
              className="fa-solid fa-cart-shopping"
            ></i>
    
    
    
          {!!model?.videos?.records?.length && <i 
              onClick={() => {
                bookClicked( {
                  key: model.videos.records[0].Key,
                  name: star.name, 
                  modelfk: star.ID ,
                  image: star.image
                });
                handleClose()
              }}
            className="fa-solid fa-book"
          ></i>}
          

            <i onClick={handleAlias} className="fa-solid fa-people-arrows"></i>

            {!!memory?.length && (
              <ModelMenu
                selectedID={star.ID}
                onChange={(e) => !!e && openModel(e)}
                models={memory}
              >
                <I className="fa-solid fa-ellipsis-vertical"></I>
              </ModelMenu>
            )}
            {/* [{memory?.length}] */}
          </Flex>
        </Stack>

        {/* <Box sx={{ borderBottom: 1, borderColor: 'divider', width: '100%'}}>
    <Tabs value={tab} onChange={(e,n) => setTab(n)} sx={{height: 24,p:0}} >
    <Tab label=" videos"  sx={{textTransform: 'none',p:0 }} /> 
    <Tab label=" costars"  sx={{textTransform: 'none',p:0 }} /> 
   </Tabs>
    </Box> */}

        {pageCount > 1 && tab < 2 && (
          <Stack
            sx={{ ml: 1, alignItems: "center" }}
            direction="row"
            spacing={1}
          >
            <Chip
              variant={tab === 0 ? "contained" : "outlined"}
              color="primary"
              label="Videos"
              size="small"
              onClick={() => setTab(0)}
            />
            <Chip
              variant={Math.abs(tab) === 1 ? "contained" : "outlined"}
              color="primary"
              label="Costars"
              size="small"
              onClick={() => setTab(1)}
            />
            <Pagination count={pageCount} page={page} onChange={setPage} />
            <Box sx={{ flexGrow: 1 }} />
            <Typography variant="caption">
              {recordCount} {tab === 0 ? "videos" : "costars"}
            </Typography>
          </Stack>
        )}

        {Math.abs(tab) === 1 && (
          <>
            <Grid wide>
              {visible?.map((star) => (
                <ModelCard modelClicked={openModel} small model={star} />
              ))}
            </Grid>
            {/* <pre>
      {JSON.stringify(missing,0,2)}
      </pre> */}
          </>
        )}
        {/* {JSON.stringify(state.value)}
{JSON.stringify(selected)} */}
        {tab === 0 && (
          <Grid>
            {model.videos.records.map((record) => (
              <VideoCard
                deleteClicked={deleteClicked}
                favoriteClicked={favoriteClicked}
                selectedID={star.ID}
                modelClicked={openModel}
                handleDedupe={handleDedupe}
                bookClicked={bookClicked}
                small
                video={record}
              />
            ))}
          </Grid>
        )}

        {tab === 2 && !!missing && (
          <>
            <Box sx={{ p: 1, width: "100%" }}>
              {!!progress && (
                <LinearProgress variant="determinate" value={progress} />
              )}
              {/* {progress} */}
            </Box>
            <Stack spacing={1} direction="row"> 
              <Chip
                size="small"
                label={`select all`}
                variant="outlined"
                color="success" 
                onClick={() => handleSelect(missing.map((f) => f.ID))}
              />
             {!!selected?.length && <Chip
                size="small"
                label={`Add model to  ${selected.length} videos`}
                color="warning"
                onClick={handleBatch}
              />}
              <Spacer />
              <i
                onClick={() => setTab(0)} 
                className="fa-solid fa-xmark"
              /> 
            </Stack>
            <Grid>
              {missing.map((record) => (
                <VideoCard
                  selected={selected?.indexOf(record.ID) > -1}
                  editClicked={(v) => handleSelect(v.ID)}
                  small
                  video={record}
                />
              ))}
            </Grid>
          </>
        )}

        <FloatingMenu />
      </Stack>
    </Dialog>
  );
};
ModelModal.defaultProps = {};
export default ModelModal;
