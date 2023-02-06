import React from 'react';
import { Drawer, Stack, Avatar, Typography, Snackbar, Button, Box } from '@mui/material';
import { useMachine } from '@xstate/react'; 
import { ModelSelect,  Diagnostics, ConfirmPopover } from '..'
import { videoMachine } from '../../../machines';
import { getVideo, deleteVideo, addModelToVideo, addModel, removeModelFromVideo } from '../../../connector';
import { Flex } from '../../../styled';


export const useVideoDrawer = (onRefresh) => {
  const [state, send] = useMachine(videoMachine, {
    services: {
      refreshList: async() => {
        onRefresh && onRefresh()
      },
      dropModel: async (context) => {
        return await removeModelFromVideo(context.video.ID, context.ID)
      },
      dropVideo: async (context) => {
        return await deleteVideo(context.video.ID)
      },
      loadVideo:  async (context) => {
        const { video, videos } = context;
        const { ID } = !!videos && Array.isArray(videos) && videos[0] ? videos[0] : video; 
        const vid = await getVideo(ID);
        if (vid.records?.length) {
          return vid.records[0]
        }
      },
      createModel: async(context, event) => {  
      
        return await addModel(context.model.value)
      } ,
     applyModel: async(context, event) => {  
      // alert (JSON.stringify(context.model))
      if  (!context.model) return;
       await addModelToVideo(context.video.ID, context.model.ID)
     }
    },
  });
 
  const handleClose = () => send('CLOSE')
  const handleClick = video => {
    send({
      type: 'OPEN',
      video
    })
  }
  const castModel = model => { 
    send({
      type: 'ADD',
      model
    })
  }
  const loseModel = ID => { 
    send({
      type: 'DROP',
      ID
    })
  }

  const selectMode = () => {
    send('MULTIPLE')
  }
  const editMultiple = () => {
    send('EDIT')
  }
  return {
    diagnosticProps: {
      ...videoMachine,
      state 
    },
    state, 
    multiple: state.matches('multiple'),
    editMultiple,
    selectMode,
    handleClose,
    handleError: () => send('RECOVER'),
    handleDrop: () => send('REMOVE'),
    handleClick,
    castModel,
    loseModel,
    ...state.context
  }
}
 
const VideoDrawer = ({  diagnosticProps, state, handleDrop, 
    handleClose, handleError, message, loseModel, castModel, msg, open, video, videos = []}) => {
  if (!video) return <Diagnostics {...diagnosticProps} />
  
  // const titleTrack = videos.find(f => !!f.models.length);


  if (state.matches('opened.error')) {
    return <Snackbar open>
      <Box>

      Error: {message} <Button onClick={handleError}>
        okay
      </Button>
      </Box>
    </Snackbar>
  }

 return (
  <>
   <Drawer anchor="left" onClose={handleClose} open={open} data-testid="test-for-VideoDrawer">
    <Box sx={{ borderBottom: 1, borderColor: 'divider'}}>
      <Flex sx={{ p: 1 }} between>
        <Typography>Edit Video</Typography>
        {/* {JSON.stringify(state.value)} */}
        <i className="fa-solid fa-pen"></i>
      </Flex>
    </Box>
     <Box sx={{maxWidth:  400,overflow: 'hidden',p:2}}>
      <img src={video.image} alt={video.title} style={{
        width: 400,
        aspectRatio: '16 / 9',
        borderRadius: 4
      }} />
      <Typography sx={{mb: 2}}>{video.title}</Typography>

      {!!videos.length && <Stack direction="row" spacing={1}>
          {videos.map(vid =>  <Avatar key={vid.ID} src={vid.image} />)}
        </Stack>}

      {!!video.models?.length && (
        <Box>
         <Typography sx={{mt: 2, mb: 1}}> Models:</Typography>
          {video.models.map(model => <Stack sx={{alignItems: 'center'}} spacing={2} direction="row">
        <Avatar src={model.image} />
        <Typography>{model.Name}</Typography>
        <Box sx={{flexGrow: 1}} />
        <ConfirmPopover 
        onChange={ok => !!ok && loseModel(model.ID)}
          message={`Remove ${model.Name}?`}
          ><i className="fa-solid fa-trash-can"></i></ConfirmPopover>
      </Stack>)}
        </Box>

      )}

<Typography>Add model</Typography>
      <ModelSelect onValueSelected={castModel}/>

      <Box sx={{mt:  2}}>
       {!!videos?.length && (
          <ConfirmPopover 
          onChange={ok => !!ok && handleDrop()}
            message={`Remove ${videos.length} videos?`}
            > <Button variant="contained" color="error">delete {videos.length} videos</Button></ConfirmPopover>
      )}
      </Box>
     
{msg}

      {/* <pre>
        {JSON.stringify(video,0,2)}
      </pre> */}
     </Box>
   </Drawer>
  </>
 );
}
VideoDrawer.defaultProps = {};
export default VideoDrawer;
