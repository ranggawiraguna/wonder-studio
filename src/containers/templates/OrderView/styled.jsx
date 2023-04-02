import { Box, styled } from '@mui/material';

export default styled(Box)(({ theme }) => ({
  //Normal Breakpoint =====================================================================================
  display: 'grid',
  gridTemplateRows: 'auto',

  '& > div': {
    '& > div:nth-of-type(1)': {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      gap: 10,
      marginBottom: 20,
      '& > button': {
        padding: '4px 15px',
        backgroundColor: '#FF583C',
        fontWeight: 'bold'
      }
    },
    '&:nth-of-type(2)': {
      '& > div:last-of-type': {
        '& > div': {
          display: 'grid',
          gridTemplateColumns: 'auto auto 1fr',
          gridTemplateRows: 'auto',
          '& > p': {
            alignSelf: 'flex-start',
            textAlign: 'center',
            color: 'black',
            textShadow: '-0.1px -0.1px 0 #00000, 0.1px -0.1px 0 #00000, -0.1px 0.1px 0 #00000, 0.1px 0.1px 0 #00000',
            lineHeight: 1.25,
            paddingBottom: 20
          },
          '& > span': {
            alignSelf: 'strecth',
            padding: '8px 10px 0 20px',
            position: 'relative',
            '& > img': {
              position: 'relative',
              zIndex: 2,
              width: 15,
              height: 15,
              borderRadius: 1000
            },
            '& > div': {
              position: 'absolute',
              zIndex: 1,
              left: 25,
              right: 15,
              backgroundColor: '#C4C4C4'
            }
          },
          '& > div': {
            alignSelf: 'flex-start',
            paddingTop: '7px',
            paddingBottom: 20,

            '& > p:first-of-type': {
              color: 'black',
              textShadow: '-0.1px -0.1px 0 #00000, 0.1px -0.1px 0 #00000, -0.1px 0.1px 0 #00000, 0.1px 0.1px 0 #00000'
            },
            '& > p:nth-of-type(3)': {
              marginTop: 8,
              marginBottom: 5
            },
            '& > button': {
              fontSize: 14,
              padding: '3px 15px',
              textShadow: '-0.1px -0.1px 0 #ffffff, 0.1px -0.1px 0 #ffffff, -0.1px 0.1px 0 #ffffff, 0.1px 0.1px 0 #ffffff',
              '&.active': {
                backgroundColor: '#FF583C'
              },
              '&.inactive': {
                backgroundColor: '#ec9586'
              }
            }
          }
        }
      }
    },
    '&:nth-of-type(3)': {
      '& > h3': {
        marginBottom: 10
      },
      '& > div': {
        display: 'grid',
        gridTemplateColumns: 'auto auto',
        gridTemplateRows: 'auto',
        alignItems: 'center',
        gap: 4,
        '& > h5': {
          textAlign: 'start',
          '&:last-of-type': {
            fontWeight: 'bold',
            color: '#444444',
            fontSize: 15,
            marginTop: 5.5
          }
        },
        '& > p': {
          textAlign: 'end',
          '&:last-of-type': {
            color: '#FF583C',
            fontWeight: 'bold',
            fontSize: 16,
            marginTop: 5
          }
        }
      }
    }
  },

  //=======================================================================================================

  //Mobile+ Breakpoint =====================================================================================
  [theme.breakpoints.down('lg')]: {
    gridTemplateAreas: `
      "A"
      "B"
      "C"
    `,
    gridTemplateColumns: '100%',
    gap: 50,
    '& > div': {
      '&:nth-of-type(2)': {
        '& > div:last-of-type': {
          '& > div': {
            paddingLeft: 20,
            paddingRight: 20
          }
        }
      }
    }
  },
  //=======================================================================================================

  //Laptop+ Breakpoint =====================================================================================
  [theme.breakpoints.up('lg')]: {
    gridTemplateAreas: `
      "A B"
      "C B"
    `,
    gridTemplateColumns: 'auto 480px',
    paddingRight: 20,
    columnGap: 50,
    rowGap: 30,
    '& > div': {
      '&:nth-of-type(2)': {
        '& > div:last-of-type': {
          backgroundColor: 'white',
          minHeight: 'calc(100vh - 181px)',
          borderRadius: 15,
          boxShadow: '0 0 10px 1px rgba(0,0,0,0.1)',
          '& > div': {
            padding: 30
          }
        }
      }
    }
  }
  //=======================================================================================================
}));
