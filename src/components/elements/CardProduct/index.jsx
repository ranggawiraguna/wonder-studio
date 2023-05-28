import * as React from 'react';
import Card from '@mui/material/Card';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import FavoriteIcon from '@mui/icons-material/Favorite';
import { faker } from '@faker-js/faker';
import { moneyFormatter, stringCapitalize } from 'utils/other/Services';
import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Box, Button } from '@mui/material';

export default function ProductCard({ favorite, ...props }) {
  const [isFavorite, setIsFavorite] = useState(favorite);
  const navigate = useNavigate();

  return (
    <Card {...props} sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Box>
        <CardMedia component="img" height="200" image={faker.image.image(null, null, true)} />
      </Box>
      <CardContent sx={{ paddingBottom: 0, marginBottom: 0, flex: 1 }}>
        <Typography variant="h3" sx={{ marginBottom: 1 }}>
          {stringCapitalize(faker.lorem.words(2))}
        </Typography>
        <Typography variant="h4">{moneyFormatter(Math.floor(Math.random() * 100) * 1000 + 100000)}</Typography>
      </CardContent>
      <CardActions disableSpacing sx={{ display: 'flex', gap: 2 }}>
        <IconButton
          onClick={(_) => {
            setIsFavorite(!isFavorite);
          }}
          sx={{ backgroundColor: 'rgba(0,0,0,0.05)' }}
        >
          <FavoriteIcon style={{ fill: isFavorite ? 'red' : 'grey', transform: 'translateY(1px)' }} />
        </IconButton>
        <Button
          onClick={() => {
            navigate(`/customer/product/${crypto.randomUUID()}`);
          }}
          variant="contained"
          sx={{ flex: 1 }}
        >
          Lihat Detail
        </Button>
      </CardActions>
    </Card>
  );
}
