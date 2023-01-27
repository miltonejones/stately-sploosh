import React from 'react';
import { Box, Typography, Stack, Divider, TextField, Button,  Popover } from '@mui/material';
import { useMachine } from '@xstate/react'; 
import { menuMachine } from '../../../machines';
  
 
const ConfirmPopover = ( { onChange, message, prompt, caption, children }) => {
  const [state, send] = useMachine(menuMachine, {
    services: {
      menuClicked: async (context, event) => {
        // alert(JSON.stringify(event.value))
        onChange(event.value);
      },
      readClipboard: async() => null
    },
  });
  const { anchorEl } = state.context;
  const handleClose = (value) => () =>
    send({
      type: 'close',
      value,
    });
  const handleClick = (event) =>
    send({
      type: 'open',
      anchorEl: event.currentTarget,
    });
 return (
   <>
   <Box onClick={handleClick}>{children}</Box>
   <Popover anchorEl={anchorEl} open={!!anchorEl} onClose={() => send('close')}>
      <Stack sx={{p: 2,  maxWidth: 600,  minWidth: 400}}>
        <Typography>{message}</Typography>
        {!!caption && <Typography variant="caption" color="error" sx={{fontWeight: 600}}>{caption}</Typography>}
        {!!prompt && <TextField size="small" value={prompt} onChange={e => send({
          type: 'CHANGE',
          value: e.target.value
        })}/>}
        <Divider sx={{width: '100%', m: t => t.spacing(1,0)}} />
        <Stack direction="row" sx={{ justifyContent: 'flex-end'}}>
          <Button onClick={() => send('close')}>cancel</Button>
          <Button variant="contained" onClick={handleClose(prompt || true)}>okay</Button>
        </Stack>
      </Stack>
   </Popover>
   </>
 );
}
ConfirmPopover.defaultProps = {};
export default ConfirmPopover;
