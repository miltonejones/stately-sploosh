import React from 'react';
import FloatingMenu from './FloatingMenu';
 
export default {
 title: 'FloatingMenu',
 component: FloatingMenu
};
 
const Template = (args) => <FloatingMenu {...args} />;
export const DefaultView = Template.bind({});
DefaultView.args = {};
