import React from 'react';
import Dash from './Dash';
 
export default {
 title: 'Dash',
 component: Dash
};
 
const Template = (args) => <Dash {...args} />;
export const DefaultView = Template.bind({});
DefaultView.args = {};
