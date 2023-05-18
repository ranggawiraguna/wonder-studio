import { Box, styled } from '@mui/material';

export default styled(Box)(({ theme }) => ({
  //Normal Breakpoint =====================================================================================
  paddingBottom: 20,

  '& > div:first-of-type': {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px',
    '& > div': {
      display: 'flex',
      gap: '10px',
      '& > button': {
        minWidth: 0,
        minHeight: 0,
        padding: '5px 15px',
        fontSize: 14,
        fontWeight: 'bold',
        '&:nth-of-type(1)': {
          backgroundColor: '#FF583C'
        },
        '&:nth-of-type(2)': {
          backgroundColor: '#B00020'
        }
      }
    }
  },
  '& > div:last-of-type': {
    display: 'flex',
    '& > div:nth-of-type(2)': {
      display: 'flex',
      flexDirection: 'column',
      gap: '20px',
      '& h4': {
        color: '#666666',
        marginLeft: '2px'
      },
      '& > div:nth-of-type(1)': {
        display: 'flex',
        gap: '10px',
        '& > div': {
          cursor: 'pointer',
          backgroundColor: 'lightgrey',
          width: '120px',
          height: '120px',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          borderRadius: '5px'
        }
      },
      '& > div:nth-of-type(2)': {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        '& > h4': {
          marginBottom: '5px'
        }
      }
    },
    '& > div:nth-of-type(3)': {
      flex: 1,
     
    }
  },

  //=======================================================================================================

  //Mobile+ Breakpoint =====================================================================================
  [theme.breakpoints.down('md')]: {
    '& > div:last-of-type': {
      flexDirection: 'column',
      gap: 30,

      '& > div:nth-of-type(1)': {
        display: 'block',
        flex: 1
      },
      '& > div:nth-of-type(2)': {
        gap: '5px',
        '& > div:nth-of-type(1)': {
          flexDirection: 'row',
          flexWrap: 'wrap',
          justifyContent: 'center',
          backgroundColor: 'white',
          border: '3px solid rgba(136,136,136,0.25)',
          padding: '10px',
          borderRadius: '6px'
        },
        '& > div:nth-of-type(2)': {
          marginTop: '30px',
          display: 'flex',
          alignItems: 'flex-start',
          textAlign: 'start',
          '& > div:nth-of-type(1)': {
            width: '100%',
            backgroundColor: 'white',
            border: '3px solid rgba(136,136,136,0.25)',
            padding: '10px',
            borderRadius: '6px'
          }
        }
      },
      '& > div:nth-of-type(3)': {
        '& > div:nth-of-type(1)': {
          display: 'none'
        }
      }
    }
  },
  //=======================================================================================================

  //Laptop+ Breakpoint =====================================================================================
  [theme.breakpoints.up('md')]: {
    '& > div:last-of-type': {
      flexDirection: 'row',
      gap: 50,

      '& > div:nth-of-type(1)': {
        display: 'none'
      },
      '& > div:nth-of-type(2)': {
        '& > div:nth-of-type(1)': {
          flexDirection: 'column'
        }
      },
      '& > div:nth-of-type(3)': {
        '& > div:nth-of-type(1)': {
          display: 'block',
          marginBottom: '30px',
          flex: 1
        },
        '& > div:nth-of-type(8)': {
          display: 'flex',
          gap: '30px',
          '& > div': {
            flex: 1
          }
        }
      }
    }
  }
  //=======================================================================================================
}));
