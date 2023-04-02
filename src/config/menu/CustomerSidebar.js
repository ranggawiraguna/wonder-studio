import { IconPaperBag, IconDashboard, IconShoppingCart, IconStar, IconHistory } from '@tabler/icons';

const customerSidebar = {
  items: [
    {
      id: 'main-menu',
      title: 'Daftar Menu',
      type: 'group',
      children: [
        {
          id: 'dashboard',
          title: 'Beranda',
          type: 'item',
          url: '/customer/dashboard',
          icon: IconDashboard
        },
        {
          id: 'my-order',
          title: 'Pesanan Saya',
          type: 'item',
          url: '/customer/order',
          icon: IconPaperBag
        },
        {
          id: 'my-cart',
          title: 'Keranjang',
          type: 'item',
          url: '/customer/cart',
          icon: IconShoppingCart
        },
        {
          id: 'my-favorite',
          title: 'Favorit Saya',
          type: 'item',
          url: '/customer/favorite',
          icon: IconStar
        },
        {
          id: 'history-order',
          title: 'Riwayat Belanja',
          type: 'item',
          url: '/customer/history',
          icon: IconHistory
        },
      ]
    },
  ]
};

export default customerSidebar;
