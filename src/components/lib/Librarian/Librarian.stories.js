import React from 'react';
import Librarian from './Librarian';
 
export default {
 title: 'Librarian',
 component: Librarian
};
 
const Template = (args) => <Librarian {...args} />;
export const DefaultView = Template.bind({});
DefaultView.args = {};
