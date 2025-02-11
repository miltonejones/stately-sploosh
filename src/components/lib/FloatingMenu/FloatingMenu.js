import React from "react";
import {
  styled,
  Box,
  Dialog,
  Stack,
  Typography,
  Button,
  TextField,
} from "@mui/material";
import SpeedDial from "@mui/material/SpeedDial";
import SpeedDialIcon from "@mui/material/SpeedDialIcon";
import SpeedDialAction from "@mui/material/SpeedDialAction";
import { AppStateContext } from "../../../context";
import { useMenu } from "../../../machines/menuMachine";
import Flex from "../../../styled/Flex";
import Spacer from "../../../styled/Spacer";

const Layout = styled(Box)(({ theme, fixed }) => ({
  height: 320,
  transform: "translateZ(0px)",
  flexGrow: 1,
  position: fixed ? "fixed" : "absolute",
  bottom: 50,
  right: 50,
  zIndex: 25000,
}));

const FloatingMenu = ({ fixed, curateId }) => {
  const { floatingProps: actions, curator } = React.useContext(AppStateContext);
  const menu = useMenu((address) => {
    !!address && curator.beginImport([address], curateId);
  });
  const initialURL = menu.clipboard?.indexOf("://") > 0;
  return (
    <>
      <Dialog open={menu.state.can("close")} onClose={menu.handleClose()}>
        <Stack spacing={2} sx={{ p: 2 }}>
          <Typography>Add new video [{curateId}]</Typography>
          {initialURL && (
            <>
              <Typography>
                Add <b>{menu.clipboard}</b> from clipboard?
              </Typography>
              <Flex spacing={2}>
                <Spacer />
                <Button
                  onClick={menu.handleChange({
                    target: {
                      name: "clipboard",
                      value: null,
                    },
                  })}
                >
                  No
                </Button>
                <Button
                  onClick={menu.handleClose(menu.clipboard)}
                  variant="contained"
                >
                  Yes
                </Button>
              </Flex>
            </>
          )}
          {!initialURL && (
            <>
              <TextField
                size="small"
                autoFocus
                sx={{ minWidth: 300 }}
                label="Type or paste video URL"
                onChange={menu.handleChange}
                name="address"
                value={menu.state.context.address}
              />
              <Flex spacing={2}>
                <Spacer />
                <Button onClick={menu.handleClose()}>Cancel</Button>
                <Button
                  onClick={menu.handleClose(menu.state.context.address)}
                  variant="contained"
                >
                  Save!!
                </Button>
              </Flex>
            </>
          )}
        </Stack>
      </Dialog>
      <Layout fixed={fixed}>
        <SpeedDial
          ariaLabel="SpeedDial basic example"
          sx={{ position: "absolute", bottom: 16, right: 16 }}
          icon={<SpeedDialIcon onClick={menu.handleClick} />}
        >
          {actions.map((action) => (
            <SpeedDialAction
              onClick={action.action}
              key={action.name}
              icon={action.icon}
              tooltipTitle={action.name}
            />
          ))}
        </SpeedDial>
      </Layout>
    </>
  );
};
FloatingMenu.defaultProps = {};
export default FloatingMenu;
