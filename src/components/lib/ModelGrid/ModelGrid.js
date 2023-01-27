import React from 'react';
import { styled, Box } from '@mui/material';
import { ModelCard } from '..';
 
const Layout = styled(Box)(({ theme }) => ({
 margin: theme.spacing(1)
}));
 
const Grid = styled(Box)(({ theme, }) => ({
  // width: '60vw',
  // paddingTop: 2,
  gap: theme.spacing(1),
  display: 'grid',
  gridTemplateColumns:  '1fr 1fr 1fr 1fr 1fr 1fr'  
}));

const ModelGrid = ({ models, modelClicked }) => {
 return (
   <Layout data-testid="test-for-ModelGrid">
      <Grid>
        {models.map(model => <ModelCard modelClicked={modelClicked} model={model} />)}
      </Grid>
   </Layout>
 );
}
ModelGrid.defaultProps = {};
export default ModelGrid;
