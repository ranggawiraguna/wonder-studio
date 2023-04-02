import { Box, styled } from '@mui/material';

export default styled(Box)(({ theme }) => ({
  //Normal Breakpoint =====================================================================================
  '& .detail-info': {
    '& .group-field': {
      '& > div': {
        backgroundColor: 'white',
        border: '3px solid lightgray'
      },
      '& h4': {
        color: 'gray'
      }
    },
    '& > div:last-child': {
      '& > button': {
        fontWeight: 'bold'
      }
    }
  },
  //=======================================================================================================

  //Mobile Breakpoint =====================================================================================
  [theme.breakpoints.only('xs')]: {
    '& .detail-info': {
      padding: '50px 10px 30px',
      '& .group-field': {
        '& h4': {
          marginLeft: 5,
          marginBottom: 5,
          fontSize: 14
        },
        '& > div': {
          '& p': {
            fontSize: 16
          },
          padding: '10px 15px',
          borderRadius: 6
        }
      },
      '& > div:last-child': {
        '& > button': {
          fontSize: 14,
          width: 140,
          borderRadius: 6
        }
      }
    }
  },
  //=======================================================================================================

  //Tablet+ Breakpoint =====================================================================================
  [theme.breakpoints.up('sm')]: {
    '& .detail-info': {
      padding: '50px 20px',
      '& .group-field': {
        '& h4': {
          marginLeft: 10,
          marginBottom: 5
        },
        '& > div': {
          '& p': {
            fontSize: 18
          },
          padding: '15px 20px',
          borderRadius: 8
        }
      },
      '& > div:last-child': {
        '& > button': {
          fontSize: 16,
          width: 160,
          borderRadius: 8
        }
      }
    }
  }
  //=======================================================================================================
}));
