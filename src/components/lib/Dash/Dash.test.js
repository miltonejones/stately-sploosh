import React from 'react';
import { render, screen, cleanup } from '@testing-library/react';
import Dash from './Dash';
 
afterEach(() => cleanup());
 
describe('<Dash/>', () => {
 it('Dash mounts without failing', () => {
   render(<Dash />);
   expect(screen.getAllByTestId("test-for-Dash").length).toBeGreaterThan(0);
 });
});

