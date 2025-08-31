import React from 'react';
import Container from '@mui/material/Container';
import Stack from '@mui/material/Stack';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import LinearProgress from '@mui/material/LinearProgress';
import Alert from '@mui/material/Alert';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import { ThemeProvider, CssBaseline } from '@mui/material';

import { buildTheme } from './theme';
import TopBar from './components/TopBar';
import DropZone from './components/DropZone';
import SummaryCard from './components/SummaryCard';
import { extractFile, summarizeText } from './api';

export default function App() {
  const [mode, setMode] = React.useState(localStorage.getItem('mode') || 'light');
  const theme = React.useMemo(() => buildTheme(mode), [mode]);
  const toggleMode = () => setMode(m => { const nm = m === 'light' ? 'dark' : 'light'; localStorage.setItem('mode', nm); return nm; });

  const [file, setFile] = React.useState(null);
  const [length, setLength] = React.useState('short'); // 'short' | 'medium' | 'long'

  const [busy, setBusy] = React.useState(false);
  const [error, setError] = React.useState('');
  const [summary, setSummary] = React.useState('');
  const [highlights, setHighlights] = React.useState([]);

  const handleSummarize = async () => {
    setError('');
    if (!file) { setError('Please choose a PDF or image first.'); return; }
    setBusy(true);
    try {
      const { text } = await extractFile(file);
      const { summary, highlights } = await summarizeText(text, length);
      setSummary(summary);
      setHighlights(highlights);
    } catch (e) {
      setError(e?.response?.data?.error || e.message || 'Something went wrong.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <TopBar mode={mode} toggleMode={toggleMode} />

      <Container maxWidth="md" sx={{ py: 4 }}>
        <Stack spacing={3}>
          <Typography variant="h4" align="center" fontWeight={700}>PDF Summarizer</Typography>
          <Typography variant="p" align="center" fontWeight={200}>Deployed on Free Version. Please wait for a few minutes to generate the Summary</Typography>
          
          <DropZone onFile={setFile} />
          {file && (
            <Paper variant="outlined" sx={{ p: 2 }}>
              <Typography variant="body2">Selected: <b>{file.name}</b> ({Math.round(file.size/1024)} KB)</Typography>
            </Paper>
          )}

          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems="center" justifyContent="space-between">
            <Stack direction="row" spacing={1} alignItems="center">
              <Typography variant="body2" sx={{ mr: 1 }}>Summary length</Typography>
              <ToggleButtonGroup
                exclusive
                color="primary"
                size="small"
                value={length}
                onChange={(_, v) => v && setLength(v)}
                aria-label="summary length"
              >
                <ToggleButton value="short" aria-label="short">SHORT</ToggleButton>
                <ToggleButton value="medium" aria-label="medium">MEDIUM</ToggleButton>
                <ToggleButton value="long" aria-label="long">LONG</ToggleButton>
              </ToggleButtonGroup>
            </Stack>

            <Button onClick={handleSummarize} variant="contained" size="large" disabled={busy}>
              Summarize
            </Button>
          </Stack>

          {busy && <LinearProgress />}
          {error && <Alert severity="error">{error}</Alert>}

          <SummaryCard summary={summary} highlights={highlights} />
        </Stack>
      </Container>
    </ThemeProvider>
  );
}
