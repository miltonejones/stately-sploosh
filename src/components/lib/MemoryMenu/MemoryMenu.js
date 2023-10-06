import { Menu, MenuItem } from "@mui/material";
import { useMenu } from "../../../machines";

export default function MemoryMenu({ finder, handleClick }) {
  const menu = useMenu((val) => !!val && handleClick(val));

  return (
    <>
      {!!Object.keys(finder.memory).length && (
        <i onClick={menu.handleClick} className="fa-regular fa-clock"></i>
      )}
      <Menu {...menu.menuProps}>
        {Object.keys(finder.memory).map((key) => (
          <MenuItem key={key} onClick={menu.handleClose(key)}>
            {key}
          </MenuItem>
        ))}
      </Menu>
    </>
  );
}
