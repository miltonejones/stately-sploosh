import React from 'react';
import { render, screen, cleanup } from '@testing-library/react';
import SearchDrawer from './SearchDrawer';
 
afterEach(() => cleanup());
 
describe('<SearchDrawer/>', () => {
 it('SearchDrawer mounts without failing', () => {
   render(<SearchDrawer />);
   expect(screen.getAllByTestId("test-for-SearchDrawer").length).toBeGreaterThan(0);
 });
});

