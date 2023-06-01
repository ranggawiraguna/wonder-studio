import * as React from 'react';
import Card from '@mui/material/Card';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import FavoriteIcon from '@mui/icons-material/Favorite';
import { moneyFormatter, stringCapitalize } from 'utils/other/Services';
import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Box, Button } from '@mui/material';
import { defaultProductImage } from 'utils/other/EnvironmentValues';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from 'config/firebase';
import { useSelector } from 'react-redux';

export default function ProductCard({ favorites = [], product = {}, ...props }) {
  const accountReducer = useSelector((state) => state.accountReducer);

  const [isFavorite, setIsFavorite] = useState(favorites.includes(product.id));
  const navigate = useNavigate();

  return (
    <Card {...props} sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Box>
        <CardMedia component="img" height="200" image={product.images[0] ?? defaultProductImage} />
      </Box>
      <CardContent sx={{ paddingBottom: 0, marginBottom: 0, flex: 1 }}>
        <Typography variant="h3" sx={{ marginBottom: 1 }}>
          {stringCapitalize(product.name)}
        </Typography>
        <Typography variant="h4">
          {product.price != null
            ? moneyFormatter(product.price)
            : product.prices != null
            ? product.prices.length > 1
              ? `${moneyFormatter(Math.min(...product.prices))}  s/d  ${moneyFormatter(Math.max(...product.prices))}}`
              : product.prices.length > 0
              ? moneyFormatter(product.prices[0])
              : 'Rp. -'
            : 'Rp. -'}
        </Typography>
      </CardContent>
      <CardActions disableSpacing sx={{ display: 'flex', gap: 2 }}>
        <IconButton
          onClick={(_) => {
            updateDoc(doc(db, 'customers', accountReducer.id), {
              favorites: isFavorite ? favorites.filter((_) => _ !== product.id) : [...favorites, product.id]
            });
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
