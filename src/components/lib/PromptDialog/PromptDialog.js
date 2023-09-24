import React, { useState } from "react";
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from "@mui/material";

function PromptDialog({ menu, title, onSubmit }) {
  // const [value, setValue] = useState(defaultValue);

  const setValue = (val) =>
    menu.send({
      type: "change",
      name: "value",
      value: val,
    });

  const handleClose = () => {
    menu.send({
      type: "close",
      value: menu.state.context.value,
    });
  };

  const handleSubmit = () => {
    onSubmit && onSubmit();
    handleClose();
  };

  const handleChange = (event) => {
    setValue(event.target.value);
  };

  return (
    <Dialog open={menu.state.can("close")} onClose={handleClose}>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleClose();
          }}
        >
          <TextField
            size="small"
            autoFocus
            margin="dense"
            label="Value"
            type="text"
            value={menu.state.context.value}
            onChange={handleChange}
            fullWidth
          />
        </form>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="primary">
          Cancel
        </Button>
        <Button onClick={handleSubmit} color="primary">
          OK
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default PromptDialog;
