import React from 'react';
import { styled, Box } from '@mui/material';
 
const Layout = styled(Box)(({ theme }) => ({
 margin: theme.spacing(4)
}));
 
const Home = () => {
 return (
   <Layout data-testid="test-for-Home">
     Home Component
   </Layout>
 );
}
Home.defaultProps = {};
export default Home;
