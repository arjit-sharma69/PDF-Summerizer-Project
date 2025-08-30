import React from 'react';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import ContentCopyOutlinedIcon from '@mui/icons-material/ContentCopyOutlined';
import Tooltip from '@mui/material/Tooltip';

export default function SummaryCard({ summary, highlights }) {
  const [copied, setCopied] = React.useState(false);
  const copyAll = async () => {
    try {
      await navigator.clipboard.writeText(summary);
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
    } catch {}
  };

  return (
    <Paper variant="outlined" sx={{ p: 2, position: 'relative', minHeight: 160 }}>
      <Box sx={{ position: 'absolute', top: 8, right: 8 }}>
        <Tooltip title={copied ? 'Copied!' : 'Copy summary'}>
          <IconButton size="small" onClick={copyAll} aria-label="copy summary">
            <ContentCopyOutlinedIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      </Box>

      <Typography variant="subtitle2" gutterBottom>Summary</Typography>
      <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>{summary || '—'}</Typography>

      {highlights?.length > 0 && (
        <Box sx={{ mt: 2 }}>
          <Typography variant="subtitle2" gutterBottom>Key Points</Typography>
          <ul style={{ marginTop: 4 }}>
            {highlights.map((h, i) => (
              <li key={i}><Typography variant="body2">{h}</Typography></li>
            ))}
          </ul>
        </Box>
      )}
    </Paper>
  );
}
