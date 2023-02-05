import React from 'react';
import { styled, Box } from '@mui/material';
import SpeedDial from '@mui/material/SpeedDial';
import SpeedDialIcon from '@mui/material/SpeedDialIcon';
import SpeedDialAction from '@mui/material/SpeedDialAction';
import { AppStateContext } from "../../../context";
// import FileCopyIcon from '@mui/icons-material/FileCopyOutlined';
// import SaveIcon from '@mui/icons-material/Save';
// import PrintIcon from '@mui/icons-material/Print';
// import ShareIcon from '@mui/icons-material/Share';

{/* <i onClick={() =>  WindowManager.focus()} className="fa-solid fa-users-viewfinder"></i>
<i onClick={() =>  WindowManager.exit()}  className="fa-solid fa-xmark"></i> 
<i onClick={() =>  shop.handleClick()} className="fa-solid fa-cart-shopping"></i>
<i onClick={() =>  send('REFRESH')} className="fa-solid fa-rotate"></i>
{!editor.videos?.length && <i onClick={() =>  editor.selectMode()} className={editor.multiple?"fa-solid fa-check red":"fa-solid fa-check"}></i>}
{!!editor.videos?.length && <i onClick={() =>  editor.editMultiple()} className="fa-solid fa-pen"></i>} */}


// const actions = [
//   { icon: <i className="fa-solid fa-users-viewfinder" />, name: 'Copy' },
//   { icon: <i className="fa-solid fa-xmark" />, name: 'Save' },
//   { icon: <i className="fa-solid fa-cart-shopping" />, name: 'Print' },
//   { icon: <i className="fa-solid fa-rotate" />, name: 'Share' },
// ];

const Layout = styled(Box)(({ theme, fixed }) => ({
  height: 320, 
  transform: 'translateZ(0px)', 
  flexGrow: 1,
  position: fixed ? "fixed" : 'absolute',
  bottom: 50,
  right: 50
}));
 
const FloatingMenu = ({ fixed }) => {
  const { floatingProps: actions } = React.useContext(AppStateContext) 
 return (
  <Layout fixed={fixed}>
  <SpeedDial
    ariaLabel="SpeedDial basic example"
    sx=  {{ position: 'absolute', bottom: 16, right: 16 }}
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
}
FloatingMenu.defaultProps = {};
export default FloatingMenu;
