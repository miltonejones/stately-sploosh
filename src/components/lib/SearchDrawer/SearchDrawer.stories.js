import React from 'react';
import SearchDrawer from './SearchDrawer';
 
export default {
 title: 'SearchDrawer',
 component: SearchDrawer
};
 
const Template = (args) => <SearchDrawer {...args} />;
export const DefaultView = Template.bind({});
DefaultView.args = {};
