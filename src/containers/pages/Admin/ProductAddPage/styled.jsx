import { Box, styled } from '@mui/material';

export default styled(Box)(({ theme }) => ({
  //Normal Breakpoint =====================================================================================
  paddingBottom: 20,

  '& .MuiOutlinedInput-root, & .MuiOutlinedInput-root > input, & .MuiOutlinedInput-root > textarea, & .MuiSelect-select, & .MuiSelect-select > input':
    {
      background: 'transparent',
      backgroundColor: 'transparent'
    },

  '& > div:first-of-type': {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '30px',

    '& > button': {
      alignSelf: 'flex-end',
      fontWeight: 'bold'
    }
  },
  '& > div:last-of-type': {
    display: 'flex',
    '& > div:nth-of-type(1)': {
      display: 'flex',
      flexDirection: 'column',
      gap: '20px',
      '& h4': {
        color: '#666666',
        marginLeft: '2px'
      },
      '& > div:nth-of-type(1)': {
        display: 'flex',
        gap: '20px',
        '& > div': {
          display: 'grid',
          gridTemplateAreas: `
            "A A"
            "B C"
          `,
          gridTemplateColumns: 'repeat(1fr)',
          gridTemplateRows: 'auto',
          rowGap: 7,
          columnGap: 10,

          '& > div:first-of-type': {
            backgroundColor: 'lightgrey',
            minWidth: '120px',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            borderRadius: '5px'
          },
          '& > div:not(:first-of-type)': {
            '& > button, & > label > span': {
              minHeight: 0,
              width: '100%',
              fontWeight: 'bold',
              padding: '2px 0',
              fontSize: 11
            }
          },
          '& > div:nth-of-type(2)': {
            '& > label > span': {
              backgroundColor: '#FF583C'
            }
          },
          '& > div:nth-of-type(3)': {
            '& button': {
              backgroundColor: '#B00020'
            }
          }
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
    '& > div:nth-of-type(2)': {
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      '& > div:nth-of-type(5)': {
        '& > div': {
          '& > div:not(:last-of-type)': {
            '& > div': {
              width: '25px',
            },
          },
        }
      },
      '& > .value-list':{
        '& > div:nth-of-type(1)': {
          '& > div': {
            '& > div:not(:last-of-type)': {
              '& > div': {
                width: '25px'
              },
            },
          }
        },
        '& > div:nth-of-type(2), & > div:nth-of-type(3)': {
          '& > div': {
            '& > div:not(:last-of-type)': {
              '& > div': {
                padding: '0 15px'
              },
            },
          }
        },
        '& > div:nth-of-type(1), & > div:nth-of-type(2), & > div:nth-of-type(3)': {
          '& > h4': {
            color: '#666666',
            marginLeft: '2px',
            marginBottom: '10px'
          },
          '& > div': {
            display: 'flex',
            flexWrap: 'wrap',
            width: '100%',
            gap: '10px',
            marginBottom: '20px',
            '& > div': {
              backgroundColor: '#CAD9E3',
              borderRadius: 1000,
              display: 'flex',
              gap: '2px',
              marginBottom: '10px',
              alignItems: 'center',
              '&:not(:last-of-type)': {
                padding: '4px',
                '& > div': {
                  borderRadius: 1000,
                  height: '25px',
                },
                '& > button': {
                  padding: 0,
                  width: '18px',
                  height: '18px',
                  minWidth: 0,
                  minheight: 0,
                  borderRadius: 1000
                }
              },
              '&:last-of-type': {
                padding: '4px',
                '& > button': {
                  padding: 0,
                  width: '25px',
                  height: '25px',
                  minWidth: 0,
                  borderRadius: 1000,
                  minheight: 0
                }
              }
            }
          }
        }
      }
    }
  },

  //=======================================================================================================

  //Mobile+ Breakpoint =====================================================================================
  [theme.breakpoints.down('md')]: {
    '& > div:last-of-type': {
      flexDirection: 'column',
      gap: 30,

      '& > div:nth-of-type(1)': {
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
        '& > div:nth-of-type(1)': {
          flexDirection: 'column'
        }
      }
    }
  }
  //=======================================================================================================
}));
