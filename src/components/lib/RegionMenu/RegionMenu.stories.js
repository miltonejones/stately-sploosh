import React from 'react';
import RegionMenu from './RegionMenu';
 
export default {
 title: 'RegionMenu',
 component: RegionMenu
};
 
const Template = (args) => <RegionMenu {...args} />;
export const DefaultView = Template.bind({});
DefaultView.args = {};
