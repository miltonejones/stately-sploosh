import React from 'react';
import ModelSelect from './ModelSelect';
 
export default {
 title: 'ModelSelect',
 component: ModelSelect
};
 
const Template = (args) => <ModelSelect {...args} />;
export const DefaultView = Template.bind({});
DefaultView.args = {};
