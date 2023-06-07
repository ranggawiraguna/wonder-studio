import { IconDashboard } from '@tabler/icons';

const guestSidebar = {
  items: [
    {
      id: 'main-menu',
      title: 'Daftar Menu',
      type: 'group',
      children: [
        {
          id: 'product',
          title: 'Beranda',
          type: 'item',
          url: '/guest/product',
          icon: IconDashboard
        },
      ]
    },
  ]
};

export default guestSidebar;
