import React from 'react';
import { render, screen, cleanup } from '@testing-library/react';
import VideoDrawer from './VideoDrawer';
 
afterEach(() => cleanup());
 
describe('<VideoDrawer/>', () => {
 it('VideoDrawer mounts without failing', () => {
   render(<VideoDrawer />);
   expect(screen.getAllByTestId("test-for-VideoDrawer").length).toBeGreaterThan(0);
 });
});

