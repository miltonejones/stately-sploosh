import React, { useState } from 'react';
import { Button, TextField, Stack} from '@mui/material';
import { 
  saveVideo,
} from "../../../connector";

export default function VideoForm() {
  const [video, setVideo] = useState({
    title: '',
    src: '',
    image: '',
    URL: '',
    width: 640, 
    height: 360
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Extract domain from URL
    const domain = new URL(video.url).hostname;
    video.domain = domain;

    await saveVideo(video);
  }

  return (
    <form onSubmit={handleSubmit}>
        <Stack spacing={2} sx={{m: 2, width: 400}}>
      <TextField 
        size="small"
        label="Title"
        value={video.title}
        onChange={(e) => setVideo({...video, title: e.target.value})}
      />

      <TextField
        size="small"
        label="Source URL"
        value={video.src}
        onChange={(e) => setVideo({...video, src: e.target.value})}  
      />

      <TextField
        size="small"
        label="Preview Image URL"
        value={video.image}
        onChange={(e) => setVideo({...video, image: e.target.value})}
      />

      <TextField
        size="small"
        label="Video URL"
        value={video.url}
        onChange={(e) => setVideo({...video, url: e.target.value})}
      />

      <Button type="submit" variant="contained">
        Save Video
      </Button></Stack>
    </form>
  );
}