import { AnimatePresence } from 'framer-motion';
import { Outlet } from 'react-router-dom';
import Component from './styled';

export default function StartedContainer() {
  return (
    <Component>
      <AnimatePresence>
        <Outlet />
      </AnimatePresence>
    </Component>
  );
}
