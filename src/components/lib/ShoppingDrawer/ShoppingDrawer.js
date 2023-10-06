import React from "react";
import {
  styled,
  Box,
  Badge,
  Stack,
  Drawer,
  Button,
  Pagination,
  LinearProgress,
  TextField,
  Checkbox,
  FormControlLabel,
  Dialog,
} from "@mui/material";
import { useMachine } from "@xstate/react";
import { shoppingMachine } from "../../../machines";
import { Typography } from "@mui/material";

import { getPagination } from "..";

import { getParsers } from "../../../connector/parser";

import dynamoStorage from "../../../services/DynamoStorage";

import { useCartMachine } from "../../../services";
import { useFinderMachine } from "../../../services/useFinderMachine";
import { CuratorCard, PhotoCard, PreviewCard } from "./Cards";
import { usePreview } from "../../../services/usePreviewMachine";
import PreviewBar from "./PreviewBar";
import { Flex, Nowrap, Spacer } from "../../../styled";
import MemoryMenu from "../MemoryMenu/MemoryMenu";

const cookieName = "selected-parser-items";

export const useShoppingDrawer = (curator) => {
  const store = dynamoStorage();

  // const curator = useCartMachine(onRefresh);

  const finder = useFinderMachine(() => send("searchdone"));

  const [state, send] = useMachine(shoppingMachine, {
    services: {
      sendSaveSignal: async (context) => {
        curator.beginImport(context.chosen);
      },
      sendSearchSignal: async (context) => {
        const begin = finder.state.can("start");
        // alert(context.param);
        finder.send({
          type: begin ? "start" : "append",
          param: begin ? context.param : context.param.split("|"),
          selected: context.selected,
          resume: context.source !== "opened",
        });
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

  const handleClose = () => send(state.can("CLEAR") ? "CLEAR" : "CLOSE");
  const handleClick = (value) => {
    if (!finder.state.can("start")) {
      return finder.send({
        type: "append",
        param: [value],
      });
    }
    if (state.can("SEARCH")) {
      // alert("search-->" + value);
      return send({
        type: "SEARCH",
        param: value,
      });
    }
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
    curator,
    finder,
    state,
    setPage,
    send,
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

const Grid = styled(Box)(({ theme }) => ({
  width: "fit-content",
  padding: theme.spacing(2),
  gap: theme.spacing(1),
  display: "grid",
  gridTemplateColumns: "1fr 1fr 1fr 1fr 1fr 1fr",
}));

const timeSort = (a, b) => (a.CalculatedTime > b.CalculatedTime ? -1 : 1);

const ShoppingDrawer = (props) => {
  const {
    state,
    // results,
    page = 1,
    // message,
    handleChoose,
    handleSelect,
    handleSave,
    chosen,
    setPage,
    progress,
    handleClear,
    handleClick,
    handleClose,
    handleSearch,
    handleAppend,
    param,
    handleChange,
    handleModel,
    selected,
    parsers,
    open,
    finder,
    send,
  } = props;

  const { results, message } = finder;

  const [existingChecked, setExistingChecked] = React.useState(false);
  const sortedResults = results?.sort(timeSort);
  const curatedResults = !existingChecked
    ? sortedResults
    : sortedResults?.filter((f) => !f.existing);

  // console.log({ sortedResults });

  const pages = getPagination(curatedResults, { page, pageSize: 24 });
  const viewer = usePreview();

  const handleCheckboxChange = (event) => {
    setExistingChecked(event.target.checked);
  };
  return (
    <>
      <CuratorCard {...props} handleModel={handleModel} />
      <PreviewCard {...props} />
      <PreviewBar viewer={viewer} />
      <Dialog open={state.can("CANCEL")} onClose={() => send("CANCEL")}>
        <Stack sx={{ p: 2 }}>
          <Typography>Really close?</Typography>
          <Typography variant="subtitle2" color="error">
            This will erase your search results
          </Typography>
          <Flex spacing={1}>
            <Spacer />
            <Button onClick={() => send("CANCEL")}>Cancel</Button>
            <Button variant="contained" onClick={() => send("CLOSE")}>
              Close
            </Button>
          </Flex>
        </Stack>
      </Dialog>

      <Drawer
        anchor="left"
        onClose={(e) => handleClose()}
        open={open && !finder.busy}
      >
        <Box sx={{ borderBottom: 1, minWidth: 360, borderColor: "divider" }}>
          <Stack direction="row" sx={{ p: 1 }} spacing={1}>
            <Typography>Shop</Typography>
            <Spacer />
            <i className="fa-solid fa-cart-shopping"></i>
            <MemoryMenu finder={finder} handleClick={handleClick} />
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
        {!state.matches("results") && (
          <Box sx={{ width: "100%", p: 2 }}>
            <TextField
              autoFocus
              disabled={!state.can("SEARCH")}
              label="Search"
              placeholder="Type search param"
              fullwidth
              onKeyUp={(e) => e.keyCode === 13 && handleSearch()}
              size="small"
              value={param}
              onChange={handleChange}
            />
            <Button disabled={!state.can("SEARCH")} onClick={handleSearch}>
              Search
            </Button>
            {/* <i class="fa-solid fa-floppy-disk"></i> */}
          </Box>
        )}

        {state.matches("results") && (
          <>
            <Stack
              direction="row"
              sx={{ alignItems: "center", justifyContent: "space-between" }}
            >
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleClick(param);
                }}
              >
                <TextField
                  value={param}
                  onChange={handleChange}
                  sx={{ ml: 1 }}
                  size="small"
                  label="Search"
                />
              </form>
              <Box sx={{ flexGrow: 1 }} />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={existingChecked}
                    onChange={handleCheckboxChange}
                    name="existingChecked"
                    color="primary"
                  />
                }
                label="Hide Existing Videos"
              />

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
                <Nowrap width={240} variant="body2" color="text.secondary">
                  Results for "{finder.param_list.join(" or ")}"
                </Nowrap>

                <Badge
                  max={999}
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
                      .filter((f) => !(f.existing || f.dupes?.length > 0))
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

        {!!results?.length && state.matches("results") && (
          <Grid>
            {pages.visible.map((result, o) => (
              <>
                {!!result?.URL && (
                  <PhotoCard
                    param={finder.param}
                    params={finder.param_list}
                    active={chosen?.indexOf(result.URL) > -1}
                    onClick={(e) => handleChoose(result.URL)}
                    key={o}
                    viewer={viewer}
                    {...result}
                  />
                )}
              </>
            ))}
          </Grid>
        )}
        {/* <pre>{JSON.stringify(finder.memory)}</pre> */}
        {!!parsers && state.matches("opened") && (
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
