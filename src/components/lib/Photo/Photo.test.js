import React from 'react';
import { render, screen, cleanup } from '@testing-library/react';
import Photo from './Photo';
 
afterEach(() => cleanup());
 
describe('<Photo/>', () => {
 it('Photo mounts without failing', () => {
   render(<Photo />);
   expect(screen.getAllByTestId("test-for-Photo").length).toBeGreaterThan(0);
 });
});

