import {
  IconDashboard,
  IconReport,
  IconTags,
  IconUsers,
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
          id: 'report',
          title: 'Laporan',
          type: 'collapse',
          icon: IconReport,

          children: [
            {
              id: 'transaction',
              title: 'Transaksi',
              type: 'item',
              url: '/store/transaction'
            },
            {
              id: 'order-finished',
              title: 'Pemesanan',
              type: 'item',
              url: '/store/order-finished'
            },
            {
              id: 'revenue',
              title: 'Pendapatan',
              type: 'item',
              url: '/store/revenue'
            },
            {
              id: 'popular-product',
              title: 'Produk Terlaris',
              type: 'item',
              url: '/store/popular-product'
            },
          ]
        },
        {
          id: 'authentication',
          title: 'Authentikasi',
          type: 'item',
          url: '/admin/authentication',
          icon: IconAccessible
        },
        {
          id: 'daftar-pelanggan',
          title: 'Pelanggan',
          type: 'item',
          url: '/admin/daftar-pelanggan',
          icon: IconUsers
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
