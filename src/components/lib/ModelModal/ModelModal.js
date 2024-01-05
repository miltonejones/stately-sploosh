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
import {
  VideoCard,
  ModelSelect,
  FloatingMenu,
  ModelCard,
  ConfirmPopover,
} from "..";
import { ModelMenu } from "..";
import { IconTextField } from "../../../styled";
import { Flex, Spacer } from "../../../styled";
import { useCast } from "../../../machines";
import { useDedupe } from "../../../machines/dedupeMachine";
import DomainMenu from "../DomainMenu/DomainMenu";
import ModelMemory from "../ModelMemory/ModelMemory";
import { batchCastMachine } from "../../../machines/modelMachine";

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

const useBatch = (onDone) => {
  const [state, send] = useMachine(batchCastMachine, {
    services: {
      castModel: async (context) => {
        return await addModelToVideo(context.items[context.index], context.ID);
      },
      sendCompeteSignal: async () => !!onDone && onDone(),
    },
  });
  return {
    ...state.context,
    state,
    send,
  };
};

export const useModelModal = () => {
  const agent = useCast(() => send("REFRESH"));
  const batch = useBatch(() => send("complete"));
  const [state, send] = useMachine(modelMachine, {
    services: {
      sendBatch: async (context) => {
        batch.send({
          type: "cast",
          items: context.selected,
          ID: context.ID,
        });
      },
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
        const args = {
          page: context.page,
          favorite: context.favorite,
          param: context.filterText,
          domain: context.domain,
        };
        const models = await getModel(context.ID, args);
        console.log({ ID: context.ID, args, models });
        return models;
      },
      loadCostars: async (context) => {
        return await getModelCostars(context.ID);
      },
    },
  });

  const openModel = (ID) => {
    !!ID &&
      send({
        type: "OPEN",
        ID,
      });
  };

  const handleClose = () => send("CLOSE");

  const setState = (name, value) =>
    send({
      type: "SET",
      name,
      value,
    });

  const setPage = (e, index) => {
    send({
      type: "PAGE",
      page: index,
    });
  };

  const setTab = (tab) => {
    send({
      type: "REPROP",
      value: tab,
      name: "tab",
    });
  };

  const handleSelect = (ID) => {
    send({
      type: "SELECT",
      ID,
    });
  };

  const handleBatch = () => send("BATCH");
  const handleAlias = () =>
    send({
      type: "SET",
      name: "aliasMode",
      value: !state.context.aliasMode,
    });

  const handleRename = (alias) =>
    send({
      type: "RENAME",
      alias,
    });
  const handleChange = (value) => setState("filterText", value);
  // send({
  //   type: "CHANGE",
  //   value,
  // });

  const setFavorite = () => send("FAVORITE");
  const refresh = () => send("REFRESH");
  const setDomain = (domain) =>
    send({
      type: "REPROP",
      name: "domain",
      value: domain,
    });

  return {
    diagnosticProps: {
      ...modelMachine,
      state,
    },
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
    setDomain,
    agent,
    batch,
    ...state.context,
  };
};

const ModelModal = ({
  open,
  agent,
  state,
  setDomain,
  domain,
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
  batch,
}) => {
  // const [tab, setTab] = React.useState(0)
  // const pages = usePagination(costars, { pageCount: 10, page})
  const tab = Number(tabnum);
  const dedupe = useDedupe(refresh);
  // const [domain, setDomain] = React.useState("");

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

  const duplicates = model.videos.records
    .filter(
      (film) => film.models.filter((who) => who.ID === star.ID).length > 1
    )
    .map((rec) => ({
      modelFk: star.ID,
      trackFk: rec.ID,
    }));

  const imposters = model.videos.records
    // .filter((film) => !film.models.some((who) => who.name === star.name))
    .map((rec) => ({
      modelFk: star.ID,
      trackFk: rec.ID,
    }));

  const handleDrops = () => {
    dedupe.send({
      type: "DROP",
      items: imposters,
    });
  };

  const handleDrop = (trackFk) => {
    dedupe.send({
      type: "DROP",
      items: [
        {
          modelFk: star.ID,
          trackFk,
        },
      ],
    });
  };

  const handleDedupes = () => {
    dedupe.send({
      type: "DEDUPE",
      items: duplicates,
    });
  };

  const handleDedupe = (trackFk, modelFk) => {
    dedupe.send({
      type: "DEDUPE",
      items: [
        {
          modelFk,
          trackFk,
        },
      ],
    });
  };

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

  const domains = model?.domains
    ?.sort((a, b) => (a.amt < b.amt ? 1 : -1))
    .reduce((out, res) => {
      out[res.domain] = res;
      return out;
    }, {});

  const domainProps = {
    domains,
    domain,
    limit: 3,
    navigate: (suffix) => setDomain(suffix),
  };

  const modalProps = {
    memory,
    openModel,
    ID: star.ID,
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

            {!!model?.videos?.records?.length && (
              <i
                onClick={() => {
                  window.open(
                    `/jav/${model.videos.records[0].Key}`,
                    `${model.videos.records[0].Key}_window`,
                    "width=500,height=800,toolbar=0,location=0"
                  );
                }}
                className="fa-solid fa-book"
              ></i>
            )}

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
          </Flex>
        </Stack>

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

            <ConfirmPopover
              message={`Are you sure you want to drop this model?`}
              caption="This action cannot be undone!"
              onChange={(val) => !!val && handleDrops && handleDrops()}
            >
              <Chip
                variant={"outlined"}
                color="primary"
                label="Drop"
                size="small"
                disabled={!dedupe.state.can("DROP")}
              />
            </ConfirmPopover>

            <Chip
              variant={"outlined"}
              color="primary"
              label="Dedupe"
              size="small"
              disabled={!duplicates.length || !dedupe.state.can("DEDUPE")}
              onClick={handleDedupes}
            />
            <Pagination count={pageCount} page={page} onChange={setPage} />
            <Box sx={{ flexGrow: 1 }} />
            <Typography variant="caption">
              {recordCount} {tab === 0 ? "videos" : "costars"}
            </Typography>
          </Stack>
        )}
        {!!dedupe.progress && (
          <LinearProgress variant="determinate" value={dedupe.progress} />
        )}
        {/* {JSON.stringify(dedupe.state.value)} */}
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

        {tab === 0 && (
          <Grid>
            {model.videos.records.map((record) => (
              <VideoCard
                deleteClicked={deleteClicked}
                favoriteClicked={favoriteClicked}
                selectedID={star.ID}
                modelClicked={openModel}
                handleDedupe={handleDedupe}
                handleDrop={handleDrop}
                bookClicked={bookClicked}
                small
                allowDrop
                video={record}
              />
            ))}
          </Grid>
        )}

        {tab === 2 && !!missing && (
          <>
            <Box sx={{ p: 1, width: "100%" }}>
              {!!batch.progress && (
                <LinearProgress variant="determinate" value={batch.progress} />
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
              {!!selected?.length && (
                <Chip
                  size="small"
                  label={`Add model to  ${selected.length} videos`}
                  color="warning"
                  onClick={handleBatch}
                />
              )}
              <Spacer />
              <i onClick={() => setTab(0)} className="fa-solid fa-xmark" />
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

        {!!model.domains && tab === 0 && (
          <Flex spacing={2} sx={{ p: 1 }}>
            <DomainMenu {...domainProps} /> <ModelMemory {...modalProps} />
          </Flex>
        )}

        <FloatingMenu />
      </Stack>
    </Dialog>
  );
};
ModelModal.defaultProps = {};
export default ModelModal;
