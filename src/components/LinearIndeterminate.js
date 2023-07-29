import * as React from 'react';
import Box from '@mui/material/Box';
import LinearProgress from '@mui/material/LinearProgress';

export default function LinearIndeterminate() {
  return (
    <Box sx={{ zIndex:999999,width: '100%' }}>
      <LinearProgress />
    </Box>
  );
}