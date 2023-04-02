import { Grid, InputBase, styled } from '@mui/material';
import { tableDisplayType } from 'utils/other/EnvironmentValues';

const styledComp = (type) => {
  return styled(Grid)(({ theme }) => ({
    //Normal Breakpoint =====================================================================================
    width: '100%',
    display: 'grid',
    alignItems: 'center',
    gap: 20,
    gridTemplateRows: 'auto',
    gridTemplateColumns: '1fr auto',

    '& > div': {
      '& > .table-title': {
        paddingTop: '3px'
      },

      '& > .table-action': {
        fontWeight: 'bold',
        textTransform: 'none',
        letterSpacing: 'normal',
        padding: '5px 15px 3px',
        minHeight: 0,
        minWidth: 0
      },

      '& > .table-chart': {
        display: 'grid',
        alignItems: 'center',
        justifyContent: 'center',
        justifyItems: 'center',
        gridTemplateRows: 'auto',
        margin: '10px 0',
        '& > div:first-of-type': {
          height: 'fit-content',
          width: 'fit-content'
        },
        '& > div:last-child': {
          backgroundColor: 'white',
          width: '100%',
          boxShadow: '0 0 10px 0px rgba(0,0,0,0.2)',
          borderRadius: 10,
          padding: 20
        }
      },

      '& > .table-container': {
        position: 'relative',
        borderRadius: type === tableDisplayType.card ? 5 : 10,

        '& > table': {
          whiteSpace: 'nowrap',
          width: '100%',
          position: 'relative',
          zIndex: 1,

          '& > thead:first-of-type': {
            position: 'absolute',
            zIndex: 0,
            top: 0,
            left: type === tableDisplayType.card ? -25 : 0,
            right: type === tableDisplayType.card ? -25 : 0,
            height: 56,
            backgroundColor: '#404040',
            borderTopLeftRadius: type === tableDisplayType.row ? 5 : 10,
            borderBottomLeftRadius: type === tableDisplayType.row ? 0 : 10,
            borderTopRightRadius: type === tableDisplayType.row ? 5 : 10,
            borderBottomRightRadius: type === tableDisplayType.row ? 0 : 10
          },

          '& > thead:not(:first-of-type)': {
            position: 'relative',
            left: 0,
            right: 0,
            zIndex: 1,
            border: 0,
            '& th': {
              color: 'white',
              fontWeight: 'bold',
              '&:first-of-type': {
                borderLeft: type === tableDisplayType.card ? 'transparent solid 50px' : 0,
                textIndent: type === tableDisplayType.card ? '-25px' : 0
              },
              '&:last-child': {
                borderRight: type === tableDisplayType.card ? 'transparent solid 50px' : 0,
                textIndent: type === tableDisplayType.card ? '25px' : 0
              }
            }
          },

          '& > tbody': {
            '& .card': {
              boxShadow: '0 0 8px 4px rgba(0,0,0,0.15)',
              borderRadius: 5
            }
          },

          '& > tr:last-child td, & > tr:last-child th, & > tr.card > td': {
            border: 0
          }
        }
      }
    },

    //=======================================================================================================
    //Mobile Breakpoint =====================================================================================
    [theme.breakpoints.only('xs')]: {
      '& > div': {
        '& > .table-title': {
          fontSize: 18
        },
        '& > .table-action': {
          fontSize: 14
        },
        '& > .table-chart': {
          gridTemplateAreas: `
            "Chart"
            "Description"
          `,
          gridTemplateColumns: 'repeat(1fr)',
          gap: 20,
          marginBottom: 30,
          justifyContent: 'stretch',

          '& > div:first-of-type': {
            padding: 20
          }
        }
      }
    },
    //=======================================================================================================
    //Tablet Breakpoint =====================================================================================
    [theme.breakpoints.between('sm', 'lg')]: {
      '& > div': {
        '& > .table-chart': {
          gridTemplateAreas: `
            "Chart Description"
          `,
          gridTemplateColumns: 'auto 1fr',
          '& > div:first-of-type': {
            padding: '20px 50px 20px 10px'
          }
        }
      }
    },
    //=======================================================================================================
    //Laptop+ Breakpoint =====================================================================================
    [theme.breakpoints.up('lg')]: {
      '& > div': {
        '& > .table-chart': {
          gridTemplateAreas: `
            "Chart Description"
          `,
          gridTemplateColumns: 'auto 1fr',
          '& > div:first-of-type': {
            padding: '20px 50px 20px 10px'
          }
        }
      }
    }
    //=======================================================================================================
  }));
};

const SelectInput = styled(InputBase)(() => ({
  marginRight: '5px',
  paddingRight: '3px',
  '& .MuiInputBase-input': {
    transform: 'translateX(6px)',
    backgroundColor: 'white',
    fontSize: 14,
    outline: '2px solid #ced4da',
    border: '2px solid white',
    borderRadius: 4,
    padding: '5px 15px 5px 10px',
    '&:focus': {
      border: '2px solid white',
      borderRadius: 4
    }
  }
}));

export { styledComp, SelectInput };
