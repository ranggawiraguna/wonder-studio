import { Box, styled } from '@mui/material';

export default styled(Box)(({ theme }) => ({
  //Normal Breakpoint =====================================================================================
  display: 'grid',
  alignItems: 'stretch',
  gap: 10,
  gridTemplateRows: 'auto',

  '& > div': {
    '& > *': {
      width: '100%',
      height: '100%'
    },

    '& .container-layer': {
      overflow: 'hidden',
      position: 'relative'
    },

    '&:not(:first-of-type)': {
      '& > .dashboard-item': {
        boxShadow: '1px 2px 10px 0 rgba(0,0,0,0.15)'
      }
    },
    '&:nth-of-type(1)': {
      position: 'relative',
      '& .dashboard-item': {
        '& > img': {
          position: 'relative',
          zIndex: 1
        },
        '& > div': {
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          display: 'flex',
          flexDirection: 'column',

          '&:first-of-type': {
            zIndex: 0,
            '& > div:last-child': {
              background: 'linear-gradient(91.94deg, #ADF5E8 0%, #42D3F3 100%)',
              boxShadow: '1px 2px 10px 0 rgba(0,0,0,0.15)'
            }
          },
          '&:last-child': {
            zIndex: 2,
            '& > div:last-child': {
              display: 'flex',
              flexDirection: 'column',
              '& > div:nth-of-type(1)': {
                flex: 88,
                width: '50%',
                display: 'flex',
                flexDirection: 'column',
                '& > p': {
                  fontWeight: 'bold',
                  whiteSpace: 'nowrap',
                  color: 'black',
                  '&:first-of-type ': {
                    flex: 34,
                    marginBottom: 'auto'
                  },

                  '&:last-child': {
                    flex: 44,
                    marginTop: 'auto'
                  }
                }
              },
              '& > div:nth-of-type(2)': {
                flex: 10
              },
              '& > p': {
                flex: 47,
                width: '65%',
                whiteSpace: 'nowrap',
                lineHeight: 1.2
              }
            }
          },

          '& > div:first-of-type': {
            flex: 62
          },
          '& > div:last-child': {
            flex: 190
          }
        }
      }
    },
    '&:nth-of-type(2)': {
      '& > .dashboard-item': {
        backgroundColor: '#359AFF'
      }
    },
    '&:nth-of-type(3)': {
      '& > .dashboard-item': {
        backgroundColor: '#7C4E96'
      }
    },
    '&:nth-of-type(2), &:nth-of-type(3)': {
      '& > .dashboard-item': {
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',

        '& > div': {
          width: '100%',
          '&:nth-of-type(1), &:nth-of-type(3)': {
            display: 'flex',
            '& > div': {
              width: 'calc(100% - 50px)',
              display: 'flex',
              '& > p': {
                color: 'white',
                lineHeight: 1.2
              }
            }
          },
          '&:nth-of-type(1)': {
            '& > div:nth-of-type(1)': {
              '& > p': {
                position: 'relative',
                top: -5,
                fontWeight: 'bold'
              }
            },
            '& > div:nth-of-type(2)': {
              position: 'relative',
              right: 0,
              width: 'fit-content',
              height: 'fit-content',
              '& > button': {
                borderBottomLeftRadius: 1000,
                backgroundColor: 'transparent',
                padding: 0,
                minWidth: 0,
                minHeight: 0,
                height: 'fit-content',
                width: 'fit-content'
              },
              '& > div': {
                position: 'absolute',
                width: 'max-content',
                height: 'fit-content',
                backgroundColor: 'white',
                zIndex: 1,

                padding: '5px 0',
                borderRadius: 5,
                right: 10,
                top: 10,
                '& > button': {
                  borderRadius: 0,
                  color: 'rgba(0,0,0,0.75)',
                  minWidth: 0,
                  minHeight: 0,
                  padding: '5px 15px'
                }
              }
            }
          },
          '&:nth-of-type(2)': {
            flex: 1,
            '& > p': {
              width: 'fit-content',
              maxWidth: '80%',
              height: '75%',
              display: 'flex',
              justifyContent: 'center',
              margin: '0 auto',
              fontWeight: 'bold',
              color: 'white'
            }
          },
          '&:nth-of-type(3)': {
            '& > div': {
              justifyContent: 'flex-end',
              '& > p': {
                position: 'relative',
                bottom: 0,
                textAlign: 'end'
              }
            },
            '& > img': {
              alignSelf: 'flex-end'
            }
          }
        }
      }
    },
    '&:nth-of-type(4), &:nth-of-type(8)': {
      '& > .dashboard-item': {
        backgroundColor: 'white',
        display: 'grid',
        gridTemplateAreas: `
          "A B C"
          "D D D"
        `,
        gridTemplateColumns: '1fr auto auto',
        gridTemplateRows: 'auto 1fr',
        paddingTop: 20,
        overflow: 'hidden',
        '& > div': {
          '&:nth-of-type(1)': {
            alignSelf: 'center',
            '& > h2': {
              transform: 'translateY(1px)',
              paddingLeft: 30
            }
          },
          '&:nth-of-type(2)': {
            alignSelf: 'center',
            paddingRight: 10,
            '& > button': {
              minHeight: 0,
              minWidth: 0,
              fontSize: 14,
              padding: '5px 20px'
            }
          },
          '&:nth-of-type(3)': {
            alignSelf: 'center',
            paddingRight: 25
          },
          '&:nth-of-type(4)': {
            alignSelf: 'stretch',
            overflow: 'auto',
            position: 'relative',
            '& > div:nth-of-type(1)': {
              padding: '20px 20px 0'
            }
          }
        }
      }
    },
    '&:nth-of-type(5), &:nth-of-type(6)': {
      '& > .dashboard-item': {
        display: 'grid',
        gridTemplateAreas: `
          "A A A A D"
          "B C C C D"
          "E E F G G"
        `,
        gridTemplateColumns: 'auto auto auto 1fr auto',
        gridTemplateRows: 'auto',
        backgroundColor: '#25344B',
        padding: 10,
        '& > div': {
          '&:nth-of-type(1)': {
            paddingLeft: 10,
            paddingTop: 10,
            '& > h2': {
              color: 'white'
            }
          },
          '&:nth-of-type(2)': {
            alignSelf: 'flex-start',
            paddingLeft: 10,
            paddingTop: 1,
            '& > img': {
              transform: 'translateY(-5px)',
              width: 15,
              height: 15
            }
          },
          '&:nth-of-type(3)': {
            alignSelf: 'flex-start',
            paddingLeft: 10,
            '& > p': {
              transform: 'translateY(-5px)',
              color: 'rgba(255,255,255,0.6)'
            }
          },
          '&:nth-of-type(4)': {
            paddingLeft: 10,
            '& > img': {
              width: 100,
              height: 100
            }
          },
          '&:nth-of-type(5)': {
            paddingLeft: 5,
            '& > img': {
              width: 60,
              height: 60
            }
          },
          '&:nth-of-type(6)': {
            paddingLeft: 10,
            alignSelf: 'center',
            '& > h3': {
              color: 'white',
              fontSize: 28
            }
          },
          '&:nth-of-type(7)': {
            paddingLeft: 10,
            alignSelf: 'center',
            '& > h4': {
              transform: 'translateY(3px)',
              color: 'rgba(255,255,255,0.6)',
              fontSize: 20
            }
          }
        }
      }
    },
    '&:nth-of-type(7)': {
      '& > .dashboard-item': {
        backgroundColor: '#25344B',
        display: 'grid',
        gridTemplateAreas: `
          "A B"
          "C C"
          "D D"
        `,
        gridTemplateColumns: '1fr auto',
        gridTemplateRows: 'auto 1fr auto',
        alignItems: 'center',
        padding: 20,
        '& > div': {
          '&:nth-of-type(1)': {
            '& > h2': {
              color: 'white',
              transform: 'translateY(1px)'
            }
          },
          '&:nth-of-type(2)': {
            '& > div': {
              position: 'relative',
              right: 0,
              width: 'fit-content',
              height: 'fit-content',
              '& > button': {
                backgroundColor: 'rgba(255,255,255,0.5)',
                boxShadow: '0 0 3px 2px rgba(255,255,255,0.25)',
                borderRadius: 1000,
                padding: 0,
                minHeight: 0,
                minWidth: 0,
                width: 30,
                height: 30,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                '& > img': {
                  minHeight: 0,
                  minWidth: 0,
                  height: 18,
                  width: 'auto'
                }
              },
              '& > div': {
                position: 'absolute',
                width: 'max-content',
                height: 'fit-content',
                backgroundColor: 'white',
                zIndex: 1,

                padding: '5px 0',
                borderRadius: 5,
                right: 0,
                top: 0,
                '& > button': {
                  borderRadius: 0,
                  color: 'rgba(0,0,0,0.75)',
                  minWidth: 0,
                  minHeight: 0,
                  padding: '5px 15px'
                }
              }
            }
          },
          '&:nth-of-type(3)': {
            display: 'flex',
            justifyContent: 'center',
            paddingBottom: 10,
            alignItems: 'center'
          },
          '&:nth-of-type(4)': {
            display: 'flex',
            justifyContent: 'center',
            '& > button': {
              backgroundColor: 'rgba(255,255,255,0.5)',
              boxShadow: '0 0 3px 2px rgba(255,255,255,0.25)'
            }
          }
        }
      }
    }
  },

  //=======================================================================================================

  //Mobile Breakpoint =====================================================================================
  [theme.breakpoints.down('md')]: {
    gridTemplateColumns: 'repeat(2,1fr)',
    gridTemplateAreas: ` 
      "A A"
      "B C"
      "D D"
      "E E"
      "F F"
      "H H"
      "G G"
    `
  },
  [theme.breakpoints.only('xs')]: {
    '& > div': {
      '&:nth-of-type(1)': {
        '& .dashboard-item': {
          '& > div': {
            '&:last-child': {
              '& > div:last-child': {
                padding: '2.5vw 2.5vw 1.5vw'
              }
            },
            '& > div:last-child': {
              borderRadius: '3vw'
            }
          }
        }
      },
      '&:nth-of-type(2), &:nth-of-type(3)': {
        '& > .dashboard-item': {
          '& > div': {
            '&:nth-of-type(1)': {
              '& > div:nth-of-type(1)': {
                height: 80,
                padding: '20px 0',
                '& > p': {
                  left: 20
                }
              },
              '& > div:nth-of-type(2)': {
                '& > button': {
                  '& > img': {
                    width: 50,
                    height: 50
                  }
                }
              }
            },
            '&:nth-of-type(2)': {
              '& > p': {
                padding: '15px 0',
                borderBottom: '1px solid white'
              }
            },
            '&:nth-of-type(3)': {
              '& > div': {
                height: 70,
                padding: '20px 15px 15px 0'
              },
              '& > img': {
                width: 60,
                height: 60
              }
            }
          }
        }
      },
      '&:not(:first-of-type)': {
        '& > .dashboard-item': {
          borderRadius: '3vw'
        }
      }
    },
    '& > div:first-of-type': {
      display: 'none'
    }
  },
  [theme.breakpoints.only('sm')]: {
    '& > div': {
      '&:nth-of-type(1)': {
        '& .dashboard-item': {
          '& > div': {
            '&:last-child': {
              '& > div:last-child': {
                padding: '2.5vw 2.5vw 1.5vw'
              }
            },
            '& > div:last-child': {
              borderRadius: '1.5vw'
            }
          }
        }
      },
      '&:nth-of-type(2), &:nth-of-type(3)': {
        '& > .dashboard-item': {
          '& > div': {
            '&:nth-of-type(1)': {
              '& > div:nth-of-type(1)': {
                height: 80,
                padding: '20px 0',
                '& > p': {
                  left: 20
                }
              },
              '& > div:nth-of-type(2)': {
                '& > button': {
                  '& > img': {
                    width: 50,
                    height: 50
                  }
                }
              }
            },
            '&:nth-of-type(2)': {
              '& > p': {
                padding: '15px 0',
                borderBottom: '1px solid white'
              }
            },
            '&:nth-of-type(3)': {
              '& > div': {
                height: 70,
                padding: '20px 15px 15px 0'
              },
              '& > img': {
                width: 60,
                height: 60
              }
            }
          }
        }
      },
      '&:not(:first-of-type)': {
        '& > .dashboard-item': {
          borderRadius: '1.5vw'
        }
      }
    }
  },
  //=======================================================================================================

  //Tablet Breakpoint =====================================================================================
  [theme.breakpoints.only('md')]: {
    gridTemplateColumns: 'repeat(4,1fr)',
    gridTemplateAreas: ` 
      "A A A A"
      "D D D D"
      "B G E E"
      "C G F F"
      "H H H H"
    `,
    '& > div': {
      '&:nth-of-type(1)': {
        '& .dashboard-item': {
          '& > div': {
            '&:last-child': {
              '& > div:last-child': {
                padding: '2.7vw 2.5vw 1.7vw'
              }
            },

            '& > div:last-child': {
              borderRadius: '1vw'
            }
          }
        }
      },
      '&:nth-of-type(2), &:nth-of-type(3)': {
        '& > .dashboard-item': {
          '& > div': {
            '&:nth-of-type(1)': {
              '& > div:nth-of-type(1)': {
                height: 80,
                padding: '20px 0',
                '& > p': {
                  left: 20
                }
              },
              '& > div:nth-of-type(2)': {
                '& button': {
                  '& > img': {
                    width: 60,
                    height: 60
                  }
                }
              }
            },
            '&:nth-of-type(2)': {
              '& > p': {
                padding: '15px 0',
                borderBottom: '1px solid white'
              }
            },
            '&:nth-of-type(3)': {
              '& > div': {
                height: 70,
                padding: '20px 15px 15px 0'
              },
              '& > img': {
                width: 75,
                height: 75
              }
            }
          }
        }
      },
      '&:not(:first-of-type)': {
        '& > .dashboard-item': {
          borderRadius: '1vw'
        }
      }
    }
  },
  //=======================================================================================================

  //Laptop+ Breakpoint =====================================================================================
  [theme.breakpoints.up('lg')]: {
    gridTemplateColumns: 'repeat(64,1fr)',
    gridTemplateAreas: ` 
      "A A A A A A A A A A A A A A A A A A A A A A A A A A A A A A A A A A A A A A A A A A A A A A B B B B B B B B B C C C C C C C C C"
      "D D D D D D D D D D D D D D D D D D D D D D D D D D D D D D D D D D D D D D D D D D D D D D E E E E E E E E E E E E E E E E E E"
      "D D D D D D D D D D D D D D D D D D D D D D D D D D D D D D D D D D D D D D D D D D D D D D F F F F F F F F F F F F F F F F F F"
      "G G G G G G G G G G G G G G G G G G H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H"
    `,

    '& > div': {
      '&:nth-of-type(1)': {
        '& .dashboard-item': {
          '& > div': {
            '&:last-child': {
              '& > div:last-child': {
                padding: '32px 25px 15px'
              }
            },

            '& > div:last-child': {
              borderRadius: '0.6vw'
            }
          }
        }
      },
      '&:nth-of-type(2), &:nth-of-type(3)': {
        '& > .dashboard-item': {
          '& > div': {
            '&:nth-of-type(1)': {
              '& > div:nth-of-type(1)': {
                height: 80,
                padding: '1.25vw 0',
                '& > p': {
                  left: 20
                }
              },
              '& > div:nth-of-type(2)': {
                '& > button': {
                  '& > img': {
                    width: 50,
                    height: 50
                  }
                }
              }
            },
            '&:nth-of-type(2)': {
              '& > p': {
                padding: '10px 0',
                borderBottom: '1px solid white'
              }
            },
            '&:nth-of-type(3)': {
              '& > div': {
                height: 70,
                padding: '20px 15px 15px 0'
              },
              '& > img': {
                width: 60,
                height: 60
              }
            }
          }
        }
      },
      '&:not(:first-of-type)': {
        '& > .dashboard-item': {
          borderRadius: '0.6vw'
        }
      }
    }
  }
  //=======================================================================================================
}));
