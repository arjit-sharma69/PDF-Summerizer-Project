import { createTheme } from '@mui/material/styles';

export function buildTheme(mode = 'light') {
  return createTheme({
    palette: { mode },
    shape: { borderRadius: 14 },
    components: {
      MuiPaper: { styleOverrides: { root: { borderRadius: 18 } } },
      MuiButton: { styleOverrides: { root: { textTransform: 'none', fontWeight: 600 } } }
    }
  });
}
