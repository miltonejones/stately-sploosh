import React from 'react';
import { render, screen, cleanup } from '@testing-library/react';
import VideoCard from './VideoCard';
 
afterEach(() => cleanup());
 
describe('<VideoCard/>', () => {
 it('VideoCard mounts without failing', () => {
   render(<VideoCard />);
   expect(screen.getAllByTestId("test-for-VideoCard").length).toBeGreaterThan(0);
 });
});

