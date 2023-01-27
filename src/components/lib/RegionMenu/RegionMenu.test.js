import React from 'react';
import { render, screen, cleanup } from '@testing-library/react';
import RegionMenu from './RegionMenu';
 
afterEach(() => cleanup());
 
describe('<RegionMenu/>', () => {
 it('RegionMenu mounts without failing', () => {
   render(<RegionMenu />);
   expect(screen.getAllByTestId("test-for-RegionMenu").length).toBeGreaterThan(0);
 });
});

