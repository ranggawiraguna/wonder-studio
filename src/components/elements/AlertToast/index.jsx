import { Alert } from '@mui/material';
import Component from './styled';
import Fade from '@mui/material/Fade';
import Slide from '@mui/material/Slide';
import Grow from '@mui/material/Grow';

function SlideUpTransition(props) {
  return <Slide {...props} direction="up" />;
}

function SlideDownTransition(props) {
  return <Slide {...props} direction="up" />;
}

function GrowTransition(props) {
  return <Grow {...props} />;
}

function getTransition(transitionName) {
  switch (transitionName) {
    case 'fade':
      return Fade;

    case 'slideUp':
      return SlideUpTransition;

    case 'slideDown':
      return SlideDownTransition;

    case 'grow':
      return GrowTransition;

    default:
      return Fade;
  }
}

export default function AlertToast(props) {
  const { description, setDescription } = props;

  const handleClose = (event, reason) => {
    setDescription({
      ...description,
      isOpen: false
    });
  };

  const transitionComponent = getTransition(description.transitionName);

  return (
    <Component
      anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      autoHideDuration={3000}
      open={description.isOpen}
      onClose={handleClose}
      TransitionComponent={transitionComponent}
      key={transitionComponent.name}
    >
      <Alert severity={description.type} onClose={handleClose}>
        {description.text}
      </Alert>
    </Component>
  );
}
