import React from 'react';
import VideoCard from './VideoCard';
 
export default {
 title: 'VideoCard',
 component: VideoCard
};
 
const Template = (args) => <VideoCard {...args} />;
export const DefaultView = Template.bind({});
DefaultView.args = {};
