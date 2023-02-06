import React from "react";
import { styled, Box } from "@mui/material";
import SpeedDial from "@mui/material/SpeedDial";
import SpeedDialIcon from "@mui/material/SpeedDialIcon";
import SpeedDialAction from "@mui/material/SpeedDialAction";
import { AppStateContext } from "../../../context";

const Layout = styled(Box)(({ theme, fixed }) => ({
  height: 320,
  transform: "translateZ(0px)",
  flexGrow: 1,
  position: fixed ? "fixed" : "absolute",
  bottom: 50,
  right: 50,
}));

const FloatingMenu = ({ fixed }) => {
  const { floatingProps: actions } = React.useContext(AppStateContext);
  return (
    <Layout fixed={fixed}>
      <SpeedDial
        ariaLabel="SpeedDial basic example"
        sx={{ position: "absolute", bottom: 16, right: 16 }}
        icon={<SpeedDialIcon />}
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
  );
};
FloatingMenu.defaultProps = {};
export default FloatingMenu;
