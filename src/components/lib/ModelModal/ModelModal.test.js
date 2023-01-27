import React from 'react';
import { render, screen, cleanup } from '@testing-library/react';
import ModelModal from './ModelModal';
 
afterEach(() => cleanup());
 
describe('<ModelModal/>', () => {
 it('ModelModal mounts without failing', () => {
   render(<ModelModal />);
   expect(screen.getAllByTestId("test-for-ModelModal").length).toBeGreaterThan(0);
 });
});

