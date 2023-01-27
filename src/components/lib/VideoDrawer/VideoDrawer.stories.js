import React from 'react';
import VideoDrawer from './VideoDrawer';
 
export default {
 title: 'VideoDrawer',
 component: VideoDrawer
};
 
const Template = (args) => <VideoDrawer {...args} />;
export const DefaultView = Template.bind({});
DefaultView.args = {};
