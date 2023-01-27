import React from 'react';
import { render, screen, cleanup } from '@testing-library/react';
import ModelSelect from './ModelSelect';
 
afterEach(() => cleanup());
 
describe('<ModelSelect/>', () => {
 it('ModelSelect mounts without failing', () => {
   render(<ModelSelect />);
   expect(screen.getAllByTestId("test-for-ModelSelect").length).toBeGreaterThan(0);
 });
});

