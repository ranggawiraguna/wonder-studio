import Component from './styled';
import { Typography } from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';

export default function SidebarItem(props) {
  const navigate = useNavigate();
  const location = useLocation();

  const Icon = props.icon;

  return (
    <Component
      className={(props.link === location.pathname ? 'active' : '') + (props.collapse ? ' collapse' : '')}
      onClick={() => navigate(props.link)}
    >
      <Icon />
      <Typography variant="p" component="p">
        {props.text}
      </Typography>
    </Component>
  );
}
