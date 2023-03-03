import React from 'react';
import { render, screen, cleanup } from '@testing-library/react';
import Librarian from './Librarian';
 
afterEach(() => cleanup());
 
describe('<Librarian/>', () => {
 it('Librarian mounts without failing', () => {
   render(<Librarian />);
   expect(screen.getAllByTestId("test-for-Librarian").length).toBeGreaterThan(0);
 });
});

