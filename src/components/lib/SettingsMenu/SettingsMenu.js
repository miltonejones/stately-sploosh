import React from "react";
import {
  Drawer,
  Box,
  Typography,
  Popover,
  Link,
  Stack,
  Dialog,
  Checkbox,
  Button,
} from "@mui/material";
import { List, ListItem, ListItemText } from "@mui/material";
import { useMenu } from "../../../machines";
import { Flex, Nowrap } from "../../../styled";

const SettingsMenu = ({ store, value, items, tabs, navigate, onChange }) => {
  const [checked, setChecked] = React.useState([]);
  const parserMenu = useMenu(onChange);
  const tabMenu = useMenu(async (ok) => {
    if (!ok) return;
    const values = checked.map((val) => tabs[val].param);
    const searches = tabs.filter((t) => !values.some((e) => e === t.param));
    await store.setItem("search-tabs", JSON.stringify(searches));
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
      <i onClick={parserMenu.handleClick} class="fa-solid fa-gear"></i>
      <Dialog {...tabMenu.menuProps}>
        <Box sx={{ p: 2 }}>
          <Typography>Open tabs</Typography>
          {/* [ <pre>{JSON.stringify(checked, 0, 2)}</pre>] */}
          {!!tabs && (
            <List dense>
              {tabs.map((item, index) => {
                const labelId = `checkbox-list-label-${index}`;

                return (
                  <ListItem
                    key={index}
                    role={undefined}
                    dense
                    button
                    onClick={handleToggle(index)}
                  >
                    <Checkbox
                      edge="start"
                      checked={checked.indexOf(index) !== -1}
                      tabIndex={-1}
                      disableRipple
                      inputProps={{ "aria-labelledby": labelId }}
                    />
                    <ListItemText
                      id={labelId}
                      primary={item.param}
                      secondary={`Type: ${item.type}`}
                    />
                  </ListItem>
                );
              })}
            </List>
          )}
          <Button variant="contained" onClick={tabMenu.handleClose(true)}>
            Save
          </Button>
        </Box>
      </Dialog>

      <Popover {...parserMenu.menuProps}>
        <Box sx={{ p: 2 }}>
          <Typography>Select a state machine to view its status.</Typography>

          {items.map((mac) => (
            <Flex
              key={mac.diagnosticProps.id}
              onClick={parserMenu.handleClose(
                value === mac.diagnosticProps.id ? "" : mac.diagnosticProps.id
              )}
              sx={{ width: 300, p: 1 }}
            >
              <Nowrap
                sx={{
                  textTransform: "capitalize",
                }}
                bold={value === mac.diagnosticProps.id}
              >
                {" "}
                {mac.diagnosticProps.id.split("_").join(" ")}{" "}
              </Nowrap>
            </Flex>
          ))}
          <Stack>
            <Link sx={{ m: 1 }} href="/editor">
              Open parser editor
            </Link>
            <Link sx={{ m: 1 }} href="/janitor">
              Open migration tool
            </Link>
            <Link sx={{ m: 1 }} href="/jav">
              Open import tool
            </Link>
            <Link sx={{ m: 1 }} onClick={tabMenu.handleClick}>
              Edit tabs
            </Link>
          </Stack>
        </Box>
      </Popover>
    </>
  );
};

SettingsMenu.defaultProps = {};
export default SettingsMenu;
