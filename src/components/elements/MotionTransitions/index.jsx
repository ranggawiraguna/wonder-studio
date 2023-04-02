import { motion } from 'framer-motion';

const propsName = {
  initial: 'initial',
  animate: 'animate'
};
const variants = {
  fade: {
    initial: { opacity: 0 },
    animate: { opacity: 1 }
  },
  fadeZoom: {
    initial: { opacity: 0, scale: 0 },
    animate: { opacity: 1, scale: 1 }
  },
  fadeZoomRotate: {
    initial: { opacity: 0, scale: 0, rotate: -720 },
    animate: { opacity: 1, scale: 1, rotate: 0 }
  }
};

const BoxTransition = (props) => (
  <motion.div {...props} variants={variants[props.variant]} {...propsName} transition={{ duration: props.duration, delay: props.delay }}>
    {props.children}
  </motion.div>
);

BoxTransition.defaultProps = {
  duration: 1,
  delay: 0,
  variant: 'fade'
};

export { BoxTransition };
