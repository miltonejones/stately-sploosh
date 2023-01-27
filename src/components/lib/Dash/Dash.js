import React from 'react';
import { styled, Box, Stack, Collapse, Typography } from '@mui/material';
import { useMachine } from '@xstate/react'; 
import { appMachine } from '../../../machines';
import { getDash, getVideos, getVideoKeys, getFavorites } from '../../../connector';
import { VideoCard, ModelCard } from '..';
import { VideoPersistService } from '../../../services';
import { useModelModal } from '..';
import { ModelModal } from '..';
 
const Layout = styled(Box)(({ theme }) => ({
 margin: theme.spacing(4)
}));

const Grid = styled(Box)(({ theme, wide }) => ({
  width: '60vw',
  pt: 2,
  gap: theme.spacing(1),
  display: 'grid',
  gridTemplateColumns: wide ?  '1fr 1fr 1fr 1fr 1fr 1fr' :  '1fr 1fr 1fr 1fr 1fr',
}));

const VideoSection = ({ title, modelClicked, items }) => {
  const [expanded, setExpanded] = React.useState(false);
  const dir = expanded  ?  'up' : 'down'
  const more = expanded  ?  'less' : 'more'
  const first = items.slice(0, 5);
  const rest = items.slice(5);

  return (<Stack sx={{mb: 2}}>
    <Stack direction="row" sx={{justifyContent: 'space-between', width: 1300}}>
      <Typography variant="h6">
      {title}
      </Typography>
      <Typography sx={{ cursor: 'pointer'}} onClick={() => setExpanded(!expanded)}>show {more} <i className={`fa-solid fa-chevron-${dir}`}></i></Typography>
    </Stack>
    <Grid>
        {first.map(video => <VideoCard modelClicked={modelClicked} video={video} key={video.ID} />)}
    </Grid>
    <Collapse in={expanded}>
    <Grid  sx={{mt: 1}}>
        {rest.map(video => <VideoCard modelClicked={modelClicked} video={video} key={video.ID} />)}
    </Grid>
    </Collapse>
  </Stack>)
}
 
const ModelSection = ({  items, modelClicked }) => {
  const [expanded, setExpanded] = React.useState(false);
  const first = items.slice(0, 6);
  const rest = items.slice(6);
  const dir = expanded  ?  'up' : 'down'
  const more = expanded  ?  'less' : 'more'
  return (<Stack sx={{mb: 2}}>
    <Stack direction="row" sx={{justifyContent: 'space-between', width: 1300}}>
      <Typography variant="h6">
       Top Models
      </Typography>
      <Typography sx={{ cursor: 'pointer'}} onClick={() => setExpanded(!expanded)}>show {more} <i className={`fa-solid fa-chevron-${dir}`}></i></Typography>
    </Stack>
    <Grid wide>
        {first.map(model => <ModelCard modelClicked={modelClicked} model={model} key={model.ID} />)}
    </Grid>
    <Collapse in={expanded}>
    <Grid wide sx={{mt: 1}}>
        {rest.map(model => <ModelCard  modelClicked={modelClicked} model={model} key={model.ID} />)}
    </Grid>
    </Collapse>
  </Stack>)
}
 
const Dash = () => {
  const modal = useModelModal();
  const [state] = useMachine(appMachine, {
    services: {
      loadDashboard: async () => {
        return await getDash() 
      },
      loadLatestVideos: async() => {
        return await getVideos(1);
      },
      loadFavorites: async() => {
        return await getFavorites(1);
      },
      loadRecentVideos: async() => {
        const videos = await VideoPersistService.get()
        const Keys = videos.slice(0, 40)
        return await getVideoKeys(Keys);
      }
    },
  });
  const { favorites, latest, recent, dashboard } = state.context; 
 return (
   <Layout data-testid="test-for-Dash">
     {/* <Box>{JSON.stringify(state.value)}</Box> */}

     {!!recent && <VideoSection modelClicked={modal.openModel} title="Recently Watched" items={recent.records} />}
     {!!dashboard && <ModelSection  modelClicked={id => { 
       modal.openModel(id);
     }} items={dashboard} />} 
     {!!favorites && <VideoSection modelClicked={modal.openModel} title="Favorites" items={favorites.records} />}
     {!!latest && <VideoSection modelClicked={modal.openModel} title="Latest Added" items={latest.records} />}
 
 <ModelModal {...modal} />
{/* 
     <pre>
      {JSON.stringify({ recent},0,2)}
     </pre> */}
   </Layout>
 );
}
Dash.defaultProps = {};
export default Dash;
