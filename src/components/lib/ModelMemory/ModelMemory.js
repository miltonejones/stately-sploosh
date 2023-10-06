import React from "react";
import { Collapse, Menu, MenuItem, Typography } from "@mui/material";
import { Flex } from "../../../styled";
import { useMenu } from "../../../machines";
import { StarAvatar } from "./StarAvatar";

export default function ModelMemory({ memory, openModel, ID }) {
  const [open, setOpen] = React.useState(true);
  const menu = useMenu((val) => !!val && openModel(val));
  const first = memory.slice(0, 5);
  const rest = memory.slice(5);
  return (
    <>
      {!!memory.length && (
        <Typography variant="caption" onClick={() => setOpen(!open)}>
          <i className={open ? "fa fa-user-times" : "fa fa-user"} />
        </Typography>
      )}
      <Collapse orientation="horizontal" in={open}>
        <Flex sx={{ p: 1 }} spacing={1}>
          {first.map((star) => (
            <StarAvatar star={star} openModel={openModel} ID={ID} />
          ))}
          {!!rest.length && (
            <i
              onClick={menu.handleClick}
              className="fa-solid fa-ellipsis-vertical"
            ></i>
          )}
        </Flex>
      </Collapse>

      <Menu {...menu.menuProps}>
        {rest.map((star) => (
          <MenuItem key={star.ID} onClick={menu.handleClose(star.ID)}>
            <StarAvatar mr={1} star={star} openModel={openModel} />
            {star.Name}
          </MenuItem>
        ))}
      </Menu>
    </>
  );
}
