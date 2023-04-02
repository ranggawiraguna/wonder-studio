import { Box, Button, CardMedia, Typography } from '@mui/material';
import IconMarkClose from 'assets/images/icon/MarkClose.svg';
import Component from './styled';

const layerVariants = {
  open: { opacity: 1, y: '0' },
  closed: { opacity: 0, y: '-100%' }
};

export default function LayerOverlayDetail({ isOpen, onClose, colors, label, description, ...props }) {
  return (
    <Component {...props} animate={isOpen ? 'open' : 'closed'} variants={layerVariants}>
      <Box>
        <Typography variant="h3" component="h3">
          Keterangan
        </Typography>
        <Button onClick={onClose}>
          <CardMedia component="img" src={IconMarkClose} />
        </Button>
      </Box>
      <Box>
        {(() => {
          return label.map((text, index) => {
            return (
              <Box key={index}>
                <Box gridArea="A" sx={{ backgroundColor: colors[index] }} />
                <Box gridArea="B">
                  <Typography variants="h4" component="h4">
                    {text}
                  </Typography>
                </Box>
                {description ? (
                  <Box gridArea="C">
                    <Typography variants="p" component="p">
                      {description[index]}
                    </Typography>
                  </Box>
                ) : (
                  <></>
                )}
              </Box>
            );
          });
        })()}
      </Box>
    </Component>
  );
}
