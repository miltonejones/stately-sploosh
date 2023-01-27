import React from 'react';
import { render, screen, cleanup } from '@testing-library/react';
import ModelGrid from './ModelGrid';
 
afterEach(() => cleanup());
 
describe('<ModelGrid/>', () => {
 it('ModelGrid mounts without failing', () => {
   render(<ModelGrid />);
   expect(screen.getAllByTestId("test-for-ModelGrid").length).toBeGreaterThan(0);
 });
});

