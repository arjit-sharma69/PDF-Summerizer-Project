import React from 'react';
import { useDropzone } from 'react-dropzone';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import CloudUploadOutlinedIcon from '@mui/icons-material/CloudUploadOutlined';
import Typography from '@mui/material/Typography';

export default function DropZone({ onFile }) {
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    multiple: false,
    accept: { 'application/pdf': ['.pdf'], 'image/*': ['.png', '.jpg', '.jpeg', '.webp'] },
    onDrop: (files) => files[0] && onFile(files[0])
  });

  return (
    <Paper variant="outlined" {...getRootProps()} sx={{ p: 6, textAlign: 'center', borderStyle: 'dashed', cursor: 'pointer' }}>
      <input {...getInputProps()} />
      <Stack alignItems="center" spacing={1}>
        <CloudUploadOutlinedIcon sx={{ fontSize: 48 }} />
        <Typography variant="subtitle1">
          {isDragActive ? 'Drop the file here…' : 'Choose file or drag & drop here'}
        </Typography>
        <Typography variant="caption" color="text.secondary">PDF or Image (PNG/JPG)</Typography>
      </Stack>
    </Paper>
  );
}
