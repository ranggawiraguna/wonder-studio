import { Button, styled } from '@mui/material';

export default styled(Button)(({ theme }) => ({
  color: '#404040',
  fill: '#404040',
  background: 'transparent',
  display: 'flex',
  justifyContent: 'flex-start',
  alignItems: 'center',
  textTransform: 'none',
  transition: 'all 0.25s',
  gap: 15,
  padding: '8px 0 8px 25px',
  marginBottom: 10,

  '&:hover': {
    background: 'rgba(0,0,0,0.05)',
    color: 'black',
    fill: 'black'
  },

  '&.active': {
    background: 'linear-gradient(90deg, #7BD4EA 0%, #2F7FF9 100%);',
    color: 'white',
    fill: 'white'
  },

  '&.collapse': {
    padding: '8px 10px 8px 70px'
  },

  '& > p': {
    transform: 'translateY(1px)',
    fontSize: 18,
    whiteSpace: 'nowrap'
  },

  '& > svg': {
    width: 25
  },

  [theme.breakpoints.only('xs')]: {
    borderTopRightRadius: 0,
    borderBottomRightRadius: 0,
    width: '100%'
  },
  [theme.breakpoints.up('tablet')]: {
    borderTopRightRadius: 1000,
    borderBottomRightRadius: 1000,
    width: 'calc(100% - 20px)'
  }
}));
