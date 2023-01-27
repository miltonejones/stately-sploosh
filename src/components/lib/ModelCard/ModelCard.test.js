import React from 'react';
import { render, screen, cleanup } from '@testing-library/react';
import ModelCard from './ModelCard';
 
afterEach(() => cleanup());
 
describe('<ModelCard/>', () => {
 it('ModelCard mounts without failing', () => {
   render(<ModelCard />);
   expect(screen.getAllByTestId("test-for-ModelCard").length).toBeGreaterThan(0);
 });
});

