import { Box, Typography } from '@mui/material';
import Component from './styled';
import { stringCapitalize } from 'utils/other/Services';

export default function FieldGroupView({ title, data, withFrame, type, ...props }) {
  return (
    <Component {...props}>
      <Typography variant="h4" component="h4">
        {title}
      </Typography>
      <Box
        sx={
          withFrame
            ? {
                backgroundColor: 'white',
                border: '3px solid rgba(136,136,136,0.25)',
                padding: '10px',
                borderRadius: '6px',
                minHeight: '40px',
                ...(() => (type ? { display: 'flex', gap: '5px' } : {}))()
              }
            : { marginTop: '5px', marginLeft: '2px' }
        }
      >
        {(() => {
          return data && type ? (
            data.map((e, index) => {
              return type === 'color' ? (
                <Box
                  key={index}
                  sx={{ width: '20px', height: '20px', borderRadius: 1000, outline: '1px solid rgba(0,0,0,0.2)', backgroundColor: e }}
                />
              ) : (
                <Typography
                  key={index}
                  sx={{
                    height: '20px',
                    borderRadius: 1,
                    fontWeight: 'bold',
                    padding: '0 10px',
                    fontSize: 12,
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    outline: '1px solid rgba(0,0,0,0.2)',
                    backgroundColor: 'rgba(204,204,204,0.5)'
                  }}
                >
                  {stringCapitalize(e)}
                </Typography>
              );
            })
          ) : (
            <Typography variant="h5" component="h5">
              {data}
            </Typography>
          );
        })()}
      </Box>
    </Component>
  );
}
