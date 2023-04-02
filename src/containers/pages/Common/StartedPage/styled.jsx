import { Box, styled } from '@mui/material';
import backgroundStartedFirst from 'assets/images/background/PageStaredFirst.svg';
import backgroundStartedLast from 'assets/images/background/PageStaredLast.svg';

export default styled(Box)(({ theme }) => ({
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
    fontFamily: 'Folks'
  },

  '& .content': {
    width: ' 100%',
    backgroundColor: 'white'
  },
  '& .section-one': {
    backgroundImage: `url(${backgroundStartedFirst})`,
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'cover',
    backgroundPositionY: 'bottom',
    backgroundPositionX: 'center',
    '& > .box-content': {
      '& > div:nth-of-type(1)': {
        '& > p': {
          lineHeight: 1.1
        }
      }
    },
    '& > div:last-child': {
      '& > button': {
        fontWeight: 'bold',
        textTransform: 'none',
        letterSpacing: 'normal',
        padding: 0,
        margin: 0,
        borderRadius: 1000,
        fontFamily: 'Folks'
      }
    }
  },
  '& .box-content': {
    display: 'flex',
    alignSelf: 'flex-start',

    '& img': {
      minWidth: 'auto',
      minheight: 'auto',
      width: 'auto',
      height: 'auto',
      alignSelf: 'flex-end'
    }
  },
  '& .map-desc': {
    display: 'flex',
    alignItems: 'center',
    marginBottom: 0,

    '& > p': {
      fontFamily: 'Folks',
      lineHeight: 1.5
    }
  },
  '& .section-two': {
    '& > div': {
      display: 'flex',
      flexDirection: 'column',
      alignItems:'center',
      '& > h1': {
        textDecoration: 'underline',
        textAlign: 'center',
        fontFamily: 'Folks'
      }
    }
  },
  '& .section-three': {
    backgroundImage: `url(${backgroundStartedLast})`,
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'cover',
    backgroundPositionY: 'top',
    backgroundPositionX: 'center',
    fontFamily: 'Folks',
    '& > div': {
      display: 'flex',
      flexDirection: 'column',
      alignItems:'center',
      '& > h1': {
        textDecoration: 'underline',
        textAlign: 'center',
        fontFamily: 'Folks'
      }
    }
  },

  
  '& .content.section-four': {
    backgroundColor: '#D7E9FF',
    height: 'auto',
    textAlign: 'center',
    '& > div': {
      '& > p': {
        fontWeight: 'normal'
      }
    }
  },

  [theme.breakpoints.only('xs')]: {
    '& .content': {
      height: 'auto'
    },
    '& .section-one': {
      textAlign: 'center',
      '& > div:last-child': {
        '& > button': {
          margin: '0 auto',
          padding: '1.2vw 6vw',
          fontSize: '2.5vw'
        }
      }
    },
    '& .box-content': {
      padding: '0 8vw',
      marginTop: '2vw',
      flexDirection: 'column-reverse',
      marginBottom: '4vw',
      gap: '3vw',
      '& > div:last-child': {
        alignSelf: 'center',
        justifySelf: 'center',
        '& > img': {
          height: '70vw'
        }
      },
      '& > div:first-of-type': {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        '& > h1': {
          fontSize: '8vw',
          marginBottom: '4vw'
        },
        '& > p': {
          fontSize: '4vw',
          textAlign: 'center'
        }
      }
    },
    '& .map-desc': {
      marginTop: '6vw',
      gap: '2vw',
      width: '100%',
      '& > p': {
        fontSize: '3vw',
        textAlign: 'start'
      },
      '& > img': {
        height: '7vw'
      }
    },
    '& .section-two': {
      padding: '15vw 10vw 5vw'
    },
    '& .section-three': {
      padding: '10vw 5vw 10vw'
    },
    '& .content.section-four': {
      padding: '10vw 5vw',
    }
  },

  [theme.breakpoints.only('sm')]: {
    '& .content': {
      height: 'auto'
    },
    '& .section-one': {
      textAlign: 'center',
      '& > div:last-child': {
        '& > button': {
          margin: '0 auto',
          padding: '1vw 5vw',
          fontSize: '2vw'
        }
      }
    },
    '& .box-content': {
      padding: '0 8vw',
      marginTop: '3vw',
      flexDirection: 'column-reverse',
      marginBottom: '3vw',
      gap: '3vw',
      '& > div:last-child': {
        alignSelf: 'center',
        justifySelf: 'center',
        '& > img': {
          height: '50vw'
        }
      },
      '& > div:first-of-type': {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        '& > h1': {
          fontSize: '6vw',
          marginBottom: '3vw'
        },
        '& > p': {
          fontSize: '3vw',
          textAlign: 'center'
        }
      }
    },
    '& .map-desc': {
      marginTop: '6vw',
      gap: '2vw',
      width: '100%',
      '& > p': {
        fontSize: '2vw',
        textAlign: 'start'
      },
      '& > img': {
        height: '6vw'
      }
    },
    '& .section-two': {
      padding: '15vw 10vw 5vw'
    },
    '& .section-three': {
      padding: '10vw'
    }
  },

  [theme.breakpoints.up('md')]: {
    borderTopLeftRadius: '1.1vw',
    borderTopRightRadius: '1.1vw',
    outline: 'white solid 0.5vw',
    '& .content': {
      height: ' calc(100vh - 5vw)'
    },
    '& .section-one': {
      '& > div:last-child': {
        '& > button': {
          marginTop: '-1vw',
          marginLeft: '7vw',
          padding: '0.3vw 1.8vw',
          fontSize: '0.9vw'
        }
      }
    },
    '& .box-content': {
      padding: '0 9vw 0 3vw',
      justifyContent: 'space-between',
      marginTop: '3vw',
      gap: '10vw',
      '& > div:last-child': {
        '& > img': {
          height: '22vw'
        }
      },
      '& > div:first-of-type': {
        '& > h1': {
          fontSize: '3.2vw',
          marginBottom: '1vw',
          textAlign: 'start'
        },
        '& > p': {
          fontSize: '1.7vw',
          textAlign: 'start'
        }
      }
    },
    '& .map-desc': {
      marginTop: '2vw',
      gap: '1vw',
      width: '65%',
      '& > p': {
        fontSize: '1vw',
        textAlign: 'start'
      },
      '& > img': {
        height: '3.5vw'
      }
    },
    '& .section-two': {
      padding: '1vw 5vw',
      '& > div': {
        height: '100%',
      }
    },
    '& .section-three': {
      padding: '8vw 1vw 3vw'
    },
    '& .content.section-four': {
      padding: '3vw 5vw',
    }
  }
}));
