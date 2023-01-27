import React from 'react';
import ShoppingDrawer from './ShoppingDrawer';
 
export default {
 title: 'ShoppingDrawer',
 component: ShoppingDrawer
};
 
const Template = (args) => <ShoppingDrawer {...args} />;
export const DefaultView = Template.bind({});
DefaultView.args = {};
