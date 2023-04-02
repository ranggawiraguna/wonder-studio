import { styled } from '@mui/material';
import { motion } from 'framer-motion';

export default styled(motion.div)(({ theme }) => ({
  overflow: 'auto',
  position: 'absolute',
  zIndex: 100,
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  backgroundColor: 'white',
  padding: '20px 15px',
  '& > div': {
    '&:nth-of-type(1)': {
      position: 'relative',
      '& > h3': {
        textAlign: 'center'
      },
      '& > button': {
        position: 'absolute',
        right: 0,
        top: 0,
        borderRadius: 25,
        width: 25,
        height: 25,
        padding: 0,
        minWidth: 0,
        minHeight: 0
      }
    },
    '&:nth-of-type(2)': {
      marginTop: 20,
      paddingLeft: 5,
      paddingRight: 5,
      display: 'flex',
      flexDirection: 'column',
      gap: 15,

      '& > div': {
        display: 'grid',
        gridTemplateAreas: `
          "A B"
          ". C"
        `,
        gridTemplateColumns: 'auto 1f',
        gridTemplateRows: 'auto',
        alignItems: 'center',
        justifyContent: 'flex-start',

        '& > div:nth-of-type(1)': {
          width: 15,
          height: 15,
          borderRadius: 2,
          outline: '1px solid lightgrey'
        },

        '& > div:nth-of-type(2)': {
          paddingLeft: 10,
          '& > h4': {
            fontWeight: 'bold',
            color: 'black',
            textAlign: 'start'
          }
        },
        '& > div:nth-of-type(3)': {
          paddingLeft: 10,
          '& > p': {
            color: 'black',
            textAlign: 'start'
          }
        }
      }
    }
  }
}));
