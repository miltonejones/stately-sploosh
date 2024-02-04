import { Box, Button, Checkbox, Popover } from "@mui/material";
import { useMenu } from "../../../machines";
import React from "react";
import { Columns, Flex, Nowrap } from "../../../styled";

const SettingsPrompt = ({ store, tabs, navigate }) => {
  const [checked, setChecked] = React.useState([]);
  const tabMenu = useMenu(async (ok) => {
    if (!ok) return;
    const values = checked.map((val) => tabs[val].param);
    const searches = tabs.filter((t) => !values.some((e) => e === t.param));
    await store.setItem("search-tabs", JSON.stringify(searches));
    setChecked([]);
    navigate(`/video/1`);
  });
  const handleToggle = (value) => () => {
    const currentIndex = checked.indexOf(value);
    const newChecked = [...checked];

    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }

    setChecked(newChecked);
  };
  return (
    <>
      <i onClick={tabMenu.handleClick} class="fa-solid fa-chevron-down"></i>
      <Popover {...tabMenu.menuProps}>
        <Box sx={{ p: 2 }}>
          <Columns columns="1fr 1fr 1fr">
            {tabs.map((item, index) => (
              <Flex>
                <Checkbox
                  onClick={handleToggle(index)}
                  edge="start"
                  checked={checked.indexOf(index) !== -1}
                  tabIndex={-1}
                  disableRipple
                />
                <Nowrap
                  hover
                  variant="body2"
                  width={200}
                  onClick={() => {
                    navigate(`/${item.type}/1/${item.param}`);
                    tabMenu.handleClose();
                  }}
                >
                  {item.param}
                </Nowrap>
              </Flex>
            ))}
          </Columns>
          <Button
            disabled={!checked.length}
            onClick={tabMenu.handleClose(true)}
          >
            Delete selected
          </Button>
        </Box>
      </Popover>
    </>
  );
};

SettingsPrompt.defaultProps = {};
export default SettingsPrompt;
