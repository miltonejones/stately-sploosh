import React from "react";
import { Drawer, Box, Typography } from "@mui/material";
import { Diagnostics } from "..";
import { useMenu } from "../../../machines";
import { Flex, Nowrap } from "../../../styled";

const SettingsMenu = ({ value, onChange }) => {
  const menu = useMenu(onChange);
  const machines = {
    sploosh_machine: "Application",
    shop_machine: "Shopping Drawer",
    photo_modal: "Photo Drawer",
    video_machine: "Video Drawer",
  };

  return (
    <>
      <i onClick={menu.handleClick} class="fa-solid fa-gear"></i>

      <Drawer
        anchor="right"
        open={menu.state.matches("opened")}
        onClose={menu.handleClose()}
      >
        <Box sx={{ p: 2 }}>
          <Typography>Select a state machine to view its status.</Typography>

          {Object.keys(machines).map((mac) => (
            <Flex
              key={mac}
              onClick={menu.handleClose(mac)}
              sx={{ width: 300, p: 1 }}
            >
              <Nowrap bold={value === mac}> {machines[mac]} </Nowrap>
            </Flex>
          ))}
        </Box>
      </Drawer>
      <Diagnostics {...menu.diagnosticProps} />
    </>
  );
};

SettingsMenu.defaultProps = {};
export default SettingsMenu;
