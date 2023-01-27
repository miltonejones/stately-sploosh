import React from 'react';
import ModelGrid from './ModelGrid';
 
export default {
 title: 'ModelGrid',
 component: ModelGrid
};
 
const Template = (args) => <ModelGrid {...args} />;
export const DefaultView = Template.bind({});
DefaultView.args = {};
