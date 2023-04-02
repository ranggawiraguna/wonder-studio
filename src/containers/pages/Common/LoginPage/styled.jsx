import { Box, styled } from '@mui/material';
import backgroundStartedFirst from 'assets/images/background/PageStaredFirst.svg';

export default styled(Box)(({ theme }) => ({
  //Normal Breakpoint =======================================================================================================================================================================
  backgroundColor: 'white',
  width: '100%',
  height: '100%',
  overflow: 'auto',
  msOverflowStyle: 'none',
  scrollbarWidth: 'none',

  '&::-webkit-scrollbar': {
    display: 'none'
  },
  '& *': {
    margin: 0,
    fontFamily: 'Folks'
  },

  '& .box-content': {
    backgroundImage: `url(${backgroundStartedFirst})`,
    backgroundRepeat: 'no-repeat',
    width: '100%',
    backgroundSize: 'cover',
    backgroundPositionY: 'bottom',
    backgroundPositionX: 'center',
    display: 'flex',
    flexDirection: 'column'
  },
  '& .content-section': {
    display: 'flex',
    flex: '1',

    '& > div:first-of-type': {
      display: 'flex',
      flexDirection: 'column',

      '& h2': {
        color: 'black',
        textAlign: 'center',
        marginBottom: 15
      },
      '& p': {
        textAlign: 'center'
      },
      '& > div:last-child': {
        textAlign: 'center',
        flex: '1',
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'center',
        color: 'rgba(0, 0, 0, 0.5)'
      },
      '& img': {
        minWidth: 'auto',
        minheight: 'auto',
        width: 'auto',
        height: 'auto'
      }
    }
  },
  '& .login-form': {
    display: 'flex',
    flexDirection: 'column',
    fontFamily: 'Folks',

    '& > .forgot-password': {
      alignSelf: 'flex-end'
    },

    '& > button:last-child': {
      alignSelf: 'center',
      fontWeight: 'bold',
      borderRadius: 1000,
      letterSpacing: 'normal',
      textTransform: 'none'
    },
    '& .input': {
      '& *': {
        backgroundColor: 'transparent'
      }
    }
  },
  //=========================================================================================================================================================================================

  //Mobile Breakpoint =======================================================================================================================================================================
  [theme.breakpoints.only('xs')]: {
    '& .box-content': {
      height: 'fit-content',
      minHeight: 'calc(100vh - 10vw)',
      paddingBottom: '5vw'
    },

    '& .content-section': {
      display: 'block',

      '& > div:last-child': {
        '& > img': {
          display: 'none'
        }
      },

      '& > div:first-of-type': {
        padding: '7.5vw 7.5vw 0',
        gap: '1vw',

        '& > h2': {
          fontSize: '7vw'
        },

        '& > p': {
          fontSize: '4vw'
        },

        '& > img': {
          margin: '4vw 0',
          width: '80%',
          alignSelf: 'center'
        },

        '& > div:last-child': {
          marginTop: '12vw',
          fontSize: '3.2vw'
        }
      }
    },

    '& .login-form': {
      gap: '2vw',
      '& > .forgot-password': {
        fontSize: '3.2vw'
      },
      '& > button:last-child': {
        fontSize: '4vw',
        marginTop: '3vw',
        padding: '1vw 10vw'
      }
    }
  },
  //=========================================================================================================================================================================================

  //Tablet Breakpoint =======================================================================================================================================================================
  [theme.breakpoints.only('sm')]: {
    '& .box-content': {
      height: 'fit-content',
      minHeight: 'calc(100vh - 5vw)',
      paddingBottom: '5vw'
    },

    '& .content-section': {
      display: 'block',

      '& > div:last-child': {
        '& > img': {
          display: 'none'
        }
      },

      '& > div:first-of-type': {
        padding: '7.5vw 15vw 0',
        gap: '1vw',

        '& > h2': {
          fontSize: '5vw'
        },

        '& > p': {
          fontSize: '3vw'
        },

        '& > img': {
          margin: '4vw 0',
          width: '80%',
          alignSelf: 'center'
        },

        '& > div:last-child': {
          marginTop: '30vw',
          fontSize: '2.5vw'
        }
      }
    },

    '& .login-form': {
      gap: '2vw',
      '& > .forgot-password': {
        fontSize: '2vw'
      },
      '& > button:last-child': {
        fontSize: '2.25vw',
        marginTop: '2vw',
        padding: '0.8vw 8vw'
      }
    }
  },
  //=========================================================================================================================================================================================

  //Laptop+ Breakpoint ======================================================================================================================================================================
  [theme.breakpoints.up('md')]: {
    borderTopLeftRadius: '1.1vw',
    borderTopRightRadius: '1.1vw',
    outline: 'white solid 0.5vw',

    '& .box-content': {
      height: 'calc(100vh - 5vw)'
    },

    '& .content-section': {
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '0 5vW 0 3vw',
      gap: '10vw',
      flex: '1',

      '& > div:last-child': {
        '& > img': {
          height: '35vw',
          marginTop: '-0.5vw'
        }
      },

      '& > div:first-of-type': {
        marginTop: '-3vw',
        backgroundColor: 'rgba(255, 255, 255, 0.5)',
        outline: 'rgba(224, 224, 224, 0.3) solid 0.5vw',
        border: '0.5vw solid rgba(224, 224, 224, 0.6)',
        borderRadius: '1vw',
        padding: '2vw 2vw',
        height: '80%',
        flex: '1',
        gap: '0.5vw',

        '& > img': {
          display: 'none'
        },

        '& > h2': {
          fontSize: '2vw'
        },

        '& > p': {
          fontSize: '1vw'
        },

        '& > div:last-child': {
          fontSize: '0.9vw'
        }
      }
    },

    '& .login-form': {
      padding: '1.5vw 0',
      gap: '0.75vw',
      '& > .forgot-password': {
        fontSize: '0.9vw'
      },

      '& > button:last-child': {
        marginTop: '1vw',
        fontSize: '1vw',
        padding: '0.3vw 3vw'
      }
    }
  }
  //=========================================================================================================================================================================================
}));
