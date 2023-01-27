import React from 'react';
import { render, screen, cleanup } from '@testing-library/react';
import PhotoModal from './PhotoModal';
 
afterEach(() => cleanup());
 
describe('<PhotoModal/>', () => {
 it('PhotoModal mounts without failing', () => {
   render(<PhotoModal />);
   expect(screen.getAllByTestId("test-for-PhotoModal").length).toBeGreaterThan(0);
 });
});

