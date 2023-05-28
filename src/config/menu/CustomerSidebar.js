import { IconPaperBag, IconDashboard, IconShoppingCart, IconStar, IconHistory } from '@tabler/icons';

const customerSidebar = {
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
          url: '/customer/product',
          icon: IconDashboard
        },
        {
          id: 'order',
          title: 'Pesanan Saya',
          type: 'item',
          url: '/customer/order',
          icon: IconPaperBag
        },
        {
          id: 'cart',
          title: 'Keranjang',
          type: 'item',
          url: '/customer/cart',
          icon: IconShoppingCart
        },
        {
          id: 'favorite',
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
