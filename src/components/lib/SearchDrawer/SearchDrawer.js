import React from "react";
import {
  LinearProgress,
  styled,
  Drawer,
  Box,
  Stack,
  Typography,
  Card,
} from "@mui/material";
import { useMachine } from "@xstate/react";
import { searchMachine } from "../../../machines";
import { SearchPersistService } from "../../../services";
import { ConfirmPopover } from "..";
import InBox from "../../../styled/InBox";

const Text = styled(Typography)(({ theme }) => ({
  width: 300,
  cursor: "pointer",
  textOverflow: "ellipsis",
  overflow: "hidden",
  whiteSpace: "nowrap",
  padding: theme.spacing(0, 0, 1, 0),
}));

export const useSearchDrawer = (onSearch) => {
  const [state, send] = useMachine(searchMachine, {
    services: {
      loadSearches: async () => {
        return await SearchPersistService.getSavedSearches();
      },
      dropSearch: async (context) => {
        await SearchPersistService.dropSearch(context.value);
      },
      pinSearch: async (context) => {
        await SearchPersistService.pinSearch(context.value);
      },
      modalClose: async (context) => {
        onSearch && onSearch(context.value);
      },
    },
  });

  const handleClose = (value) =>
    send({
      type: "CLOSE",
      value,
    });
  const handleDrop = (value) =>
    send({
      type: "DROP",
      value,
    });
  const handlePin = (value) =>
    send({
      type: "PIN",
      value,
    });
  const handleClick = () => send("OPEN");

  return {
    diagnosticProps: {
      id: searchMachine.id,
      states: searchMachine.states,
      state,
    },
    state,
    send,
    handleClose,
    handleClick,
    handleDrop,
    handlePin,
    ...state.context,
  };
};

// const InBox = styled(Card)(({ open }) => ({
//   width: 300,
//   opacity: open ? 1 : 0,
//   height: `calc(100vh - 170px)`,
//   overflow: "auto",
//   backgroundColor: "#ebebeb",
// }));

const SearchDrawer = ({
  handleClose,
  handlePin,
  handleDrop,
  searches,
  state,
  send,
  open,
  fixed,
  setFixed,
}) => {
  const pinned = searches?.filter((text) => !!text && text.indexOf("^") > 0);
  const unpinned = searches?.filter((text) => !!text && text.indexOf("^") < 0);
  const Component = fixed ? InBox : Drawer;
  return (
    <Component
      anchor="left"
      onClose={(e) => handleClose()}
      open={open}
      data-testid="test-for-VideoDrawer"
    >
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Stack direction="row" sx={{ p: 1, justifyContent: "space-between" }}>
          <Typography>Saved searches</Typography>
          <i
            className="fa-solid fa-angles-left"
            onClick={() => setFixed(!fixed)}
          ></i>
        </Stack>
      </Box>
      {!state.matches("opened.loaded") && <LinearProgress />}
      <Box sx={{ p: 1 }}>
        <Typography variant="subtitle2">Pinned searches</Typography>

        {pinned?.map((item) => (
          <Line direction="row" sx={{ alignItems: "center", width: 400 }}>
            <Text
              variant="body2"
              onClick={() => handleClose(item.replace("^", ""))}
            >
              {item.replace("^", "")}
            </Text>
            <Box sx={{ flexGrow: 1 }} />
            <i
              onClick={() => handlePin(item)}
              class="fa-solid fa-thumbtack"
            ></i>
          </Line>
        ))}

        <Typography sx={{ mt: 2 }} variant="subtitle2">
          Unpinned searches
        </Typography>

        {unpinned?.map((item) => (
          <Line
            spacing={2}
            direction="row"
            sx={{ alignItems: "center", width: 400 }}
          >
            <Text variant="body2" onClick={() => handleClose(item)}>
              {item}
            </Text>
            <Box sx={{ flexGrow: 1 }} />
            <i
              onClick={() => handlePin(item)}
              class="fa-solid fa-thumbtack"
            ></i>

            <ConfirmPopover
              message={`Are you sure you want to delete "${item}"?`}
              caption="This action cannot be undone!"
              onChange={(val) => !!val && handleDrop(item)}
            >
              <i className="fa-solid fa-trash-can"></i>
            </ConfirmPopover>
          </Line>
        ))}
      </Box>
      {/* <pre>{JSON.stringify(state.value, 0, 2)}</pre> */}
    </Component>
  );
};

const Line = styled(Stack)(() => ({
  "& i": {
    opacity: 0,
    transition: "opacity 0.3s linear",
  },
  "&: hover": {
    "& i": {
      opacity: 1,
    },
  },
}));
SearchDrawer.defaultProps = {};
export default SearchDrawer;
