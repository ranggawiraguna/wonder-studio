import {
  IconDashboard,
  IconTags,
  IconAccessible,
  IconShoppingCart
} from '@tabler/icons';

const adminSidebar = {
  items: [
    {
      id: 'main-menu',
      title: 'Daftar Menu',
      type: 'group',
      children: [
        {
          id: 'dashboard',
          title: 'Dashboard',
          type: 'item',
          url: '/admin/dashboard',
          icon: IconDashboard
        },
        {
          id: 'authentication',
          title: 'Autentikasi',
          type: 'item',
          url: '/admin/authentication',
          icon: IconAccessible
        },
        {
          id: 'product',
          title: 'Produk',
          type: 'item',
          url: '/admin/product',
          icon: IconTags
        },
        {
          id: 'order',
          title: 'Pesanan',
          type: 'item',
          url: '/admin/order',
          icon: IconShoppingCart
        },
      ]
    },
    
  ]
};

export default adminSidebar;
