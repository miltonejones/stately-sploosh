import React from 'react';
import { render, screen, cleanup } from '@testing-library/react';
import FloatingMenu from './FloatingMenu';
 
afterEach(() => cleanup());
 
describe('<FloatingMenu/>', () => {
 it('FloatingMenu mounts without failing', () => {
   render(<FloatingMenu />);
   expect(screen.getAllByTestId("test-for-FloatingMenu").length).toBeGreaterThan(0);
 });
});

