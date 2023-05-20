import { Box, styled } from '@mui/material';

export default styled(Box)(({ theme }) => ({
  //Normal Breakpoint =====================================================================================
  '& > div': {
    '& > div': {
      '& > .table-chart': {
        '& > div:last-child': {
          '& > div': {
            display: 'flex',
            flexDirection: 'column',
            '& > div': {
              display: 'flex',
              alignItems: 'flex-start',
              '& > div': {
                borderRadius: 3,
                outline: '1px solid rgba(0,0,0,0.3)'
              },
              '& > h5': {
                flex: 1
              }
            }
          }
        }
      },
      '& > .table-container': {
        '& > table': {
          '& > tbody': {
            '& > tr': {
              '& > td': {
                '&:last-child': {
                  '& button': {
                    padding: '5px 15px',
                    minWidth: 0,
                    minHeight: 0,
                    borderRadius: 5,
                    backgroundColor: '#FF583C',
                    textShadow: '-0.1px -0.1px 0 #FFFFFF, 0.1px -0.1px 0 #FFFFFF, -0.1px 0.1px 0 #FFFFFF, 0.1px 0.1px 0 #FFFFFF'
                  }
                }
              }
            }
          }
        }
      }
    }
  },
  //=======================================================================================================

  //Mobile Breakpoint =====================================================================================
  [theme.breakpoints.only('xs')]: {
    '& > div': {
      '& > div': {
        '& > .table-title': {
          fontSize: 24,
          textAlign: 'center'
        }
      },
      '& > .table-chart': {
        '& > div:first-of-type': {
          '& > div': {
            width: 250,
            height: 250
          }
        },

        '& > div:last-child': {
          '& > div': {
            gap: 8,
            '& > h4': {
              fontSize: 15,
              marginBottom: 10
            },
            '& > div': {
              gap: 10,
              '& > div': {
                width: 16,
                height: 16
              },
              '& > h5': {
                fontSize: 14
              }
            }
          }
        }
      }
    }
  },
  //=======================================================================================================

  //Tablet Breakpoint =====================================================================================
  [theme.breakpoints.between('sm', 'lg')]: {
    '& > div': {
      '& > div': {
        '& .table-chart': {
          '& > div:first-of-type': {
            '& > div': {
              width: 200,
              height: 200
            }
          },

          '& > div:last-child': {
            '& > div': {
              gap: 7,
              '& > h4': {
                fontSize: 17,
                marginBottom: 12
              },
              '& > div': {
                gap: 10,
                '& > div': {
                  width: 17,
                  height: 17
                },
                '& > h5': {
                  fontSize: 15
                }
              }
            }
          }
        }
      }
    }
  },
  //=======================================================================================================

  //Laptop+ Breakpoint =====================================================================================
  [theme.breakpoints.up('lg')]: {
    '& > div': {
      '& > div': {
        '& .table-chart': {
          '& > div:first-of-type': {
            '& > div': {
              width: 200,
              height: 200
            }
          },

          '& > div:last-child': {
            '& > div': {
              gap: 8,
              '& > h4': {
                fontSize: 18,
                marginBottom: 15
              },
              '& > div': {
                gap: 12,
                '& > div': {
                  width: 18,
                  height: 18
                },
                '& > h5': {
                  fontSize: 16
                }
              }
            }
          }
        }
      }
    }
  }
  //=======================================================================================================
}));
