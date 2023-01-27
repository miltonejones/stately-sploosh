import React from 'react';
import ModelModal from './ModelModal';
 
export default {
 title: 'ModelModal',
 component: ModelModal
};
 
const Template = (args) => <ModelModal {...args} />;
export const DefaultView = Template.bind({});
DefaultView.args = {};
