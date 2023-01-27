import React from 'react';
import PhotoModal from './PhotoModal';
 
export default {
 title: 'PhotoModal',
 component: PhotoModal
};
 
const Template = (args) => <PhotoModal {...args} />;
export const DefaultView = Template.bind({});
DefaultView.args = {};
