import { Fragment } from 'react';
import { Box } from '@mui/material';
import Chart from 'react-apexcharts';

export default function ChartSingle({ id, type, label, data, stroke, largeSize, color, colors }) {
  return (
    <Fragment>
      <Box sx={{ minHeight: 'calc(100% - 10px)' }}>
        <Chart
          options={
            type === 'pie'
              ? {
                  chart: {
                    id: id
                  },
                  dataLabels: {
                    enabled: false
                  },
                  legend: {
                    show: false
                  },
                  labels: label,
                  colors: colors
                }
              : {
                  chart: {
                    id: id
                  },
                  yaxis: {
                    labels: {
                      formatter: (val) => parseInt(val)
                    }
                  },
                  xaxis: { categories: label },
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
                  colors: [color],
                  stroke: stroke
                    ? {
                        curve: stroke
                      }
                    : {}
                }
          }
          series={type === 'pie' ? data : [{ name: 'Jumlah', data: data }]}
          type={type}
          height={type === 'pie' ? (largeSize ? '225' : '200') : '250'}
        />
      </Box>
      {type === 'pie' ? <></> : <Box sx={{ height: '10px' }} />}
    </Fragment>
  );
}
