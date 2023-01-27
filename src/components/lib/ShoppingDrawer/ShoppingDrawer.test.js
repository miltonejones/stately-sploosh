import React from 'react';
import { render, screen, cleanup } from '@testing-library/react';
import ShoppingDrawer from './ShoppingDrawer';
 
afterEach(() => cleanup());
 
describe('<ShoppingDrawer/>', () => {
 it('ShoppingDrawer mounts without failing', () => {
   render(<ShoppingDrawer />);
   expect(screen.getAllByTestId("test-for-ShoppingDrawer").length).toBeGreaterThan(0);
 });
});

