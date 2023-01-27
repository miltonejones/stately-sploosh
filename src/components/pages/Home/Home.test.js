import React from 'react';
import { render, screen, cleanup } from '@testing-library/react';
import Home from './Home';
 
afterEach(() => cleanup());
 
describe('<Home/>', () => {
 it('Home mounts without failing', () => {
   render(<Home />);
   expect(screen.getAllByTestId("test-for-Home").length).toBeGreaterThan(0);
 });
});

