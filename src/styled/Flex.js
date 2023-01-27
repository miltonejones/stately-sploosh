
import React from 'react';
import { styled, Box } from '@mui/material';

const Flex = styled(Box)(({ theme, between, spacing }) => ({
  gap: theme.spacing(spacing),
  cursor: 'pointer',
  display: 'flex',
  alignItems: between ? 'space-between' : 'center'
}))

export default Flex;
