import React from 'react';
import ModelCard from './ModelCard';
 
export default {
 title: 'ModelCard',
 component: ModelCard
};
 
const Template = (args) => <ModelCard {...args} />;
export const DefaultView = Template.bind({});
DefaultView.args = {};
