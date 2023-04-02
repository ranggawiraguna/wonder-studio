import { Fragment } from 'react';
import { Box, Typography } from '@mui/material';
import Chart from 'react-apexcharts';

export default function ChartMultiple({ id, label, datas, notes, colors }) {
  return (
    <Fragment>
      <Box sx={{ minHeight: 'calc(100% - 50px)' }}>
        <Chart
          options={{
            chart: {
              id: id
            },
            markers: {
              size: 6,
              strokeColors: '#B7B7B7',
              strokeWidth: 2
            },
            dataLabels: {
              enabled: false
            },
            legend: {
              show: false
            },
            xaxis: { categories: label },
            colors: colors
          }}
          series={datas}
          type="line"
          height="250"
        />
      </Box>
      <Box
        sx={{
          position: 'sticky',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'flex-start',
          gap: { xs: '20px', sm: '30px' },
          paddingTop: '10px',
          height: '50px',
          left: 0,
          right: 0,
          bottom: 0
        }}
      >
        {notes.map((note, index) => {
          return (
            <Box key={index} sx={{ display: 'flex', gap: { xs: '8px', sm: '10px' }, alignItems: 'center' }}>
              <Box
                sx={{
                  backgroundColor: colors[index],
                  height: { xs: '12px', sm: '15px' },
                  width: { xs: '12px', sm: '15px' },
                  borderRadius: { xs: '2px', sm: '3px' },
                  boxShadow: { xs: '0 0 1px 1px rgba(0,0,0,0.15)', sm: '0 0 2px 2px rgba(0,0,0,0.15)' }
                }}
              />
              <Typography variant="p" component="p" sx={{ fontWeight: 'bold', transform: 'translateY(1px)', fontSize: { xs: '12px' } }}>
                {note}
              </Typography>
            </Box>
          );
        })}
      </Box>
    </Fragment>
  );
}
