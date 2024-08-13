// eslint-disable-next-line no-unused-vars
import * as React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';


// eslint-disable-next-line react/prop-types
export default function Prayers({prayerName, time}) {
  return (
    <Card sx={{ maxWidth: 345 }} marginTop={2}>
      <CardMedia
        sx={{ height: 140 }}
        image='https://wepik.com/api/image/ai/9a07baa7-b49b-4f6b-99fb-2d2b908800c2'
        title="الصلاة"
      />
      <CardContent>
        <Typography gutterBottom variant="h5" component="div">
          {prayerName}
        </Typography>
        <Typography variant="h2" color="text.secondary">
          {time}
        </Typography>
      </CardContent>
    </Card>
  );
}
