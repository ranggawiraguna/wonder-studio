import { Typography } from '@mui/material';
import NavGroup from './NavGroup';
import adminSidebar from 'config/menu/AdminSidebar';
import customerSidebar from 'config/menu/CustomerSidebar';
import { useLocation } from 'react-router';

export default function MenuList() {
  const location = useLocation();
  const menuItem = (() => {
    if (location.pathname.includes('admin')) {
      return adminSidebar;
    } else if (location.pathname.includes('customer')) {
      return customerSidebar;
    }
  })();

  return menuItem.items.map((item, index) => {
    switch (item.type) {
      case 'group':
        return <NavGroup key={item.id} isLastIndex={index === menuItem.items.length - 1} item={item} />;

      default:
        return (
          <Typography key={item.id} variant="h6" color="error" align="center">
            Menu Items Error
          </Typography>
        );
    }
  });
}
