const tableDisplayType = {
  row: 'row',
  card: 'card'
};

const orderType = {
  order: 'order',
  preOrder: 'preOrder',
  customization: 'customization'
};

const timeline = [
  {
    value: 'tahun',
    label: 'Tahun'
  },
  {
    value: 'bulan',
    label: 'Bulan'
  },
  {
    value: 'hari',
    label: 'Hari'
  }
];

const timelineValues = (() => {
  const weekly = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Minggu'];

  const current = new Date();
  const year = current.getFullYear();
  const day = current.getDay() - 1;

  return {
    [timeline[0].value]: [year, year - 1, year - 2, year - 3, year - 4, year - 5, year - 6, year - 7, year - 8, year - 9],
    [timeline[1].value]: [
      'Januari',
      'Februari',
      'Maret',
      'April',
      'Mei',
      'Juni',
      'Juli',
      'Agustus',
      'September',
      'Oktober',
      'November',
      'Desember'
    ],
    [timeline[2].value]: weekly.map((e, i) => {
      const result = (day - i) % 7;
      return weekly[result < 0 ? result + 7 : result];
    })
  };
})();

const reverseTimelineValue = (value, timeline) => {
  const temp = [...value];
  if (timeline === 'tahun' || timeline === 'hari') temp.reverse();
  return temp;
};

const orderProcess = {
  orderCreate: 'orderCreate',
  waitingProductionCheck: 'waitingProductionCheck',
  productionCheckConfirmed: 'productionCheckConfirmed',
  productionCheckCanceled: 'productionCheckCanceled',
  waitingPayment: 'waitingPayment',
  paymentConfirmed: 'paymentConfirmed',
  waitingWarehouseDelivery: 'waitingWarehouseDelivery',
  waitingProductionProcess: 'waitingProductionProcess',
  shippedFromWarehouse: 'shippedFromWarehouse',
  prepareOrder: 'prepareOrder',
  orderProcess: 'orderProcess',
  orderFinished: 'orderFinished'
};

const orderProcessDetail = {
  [orderProcess.orderCreate]: {
    title: 'Pesanan telah dibuat',
    description: 'Pesanan Anda telah dibuat, menunggu konfirmasi selanjutnya'
  },
  [orderProcess.waitingProductionCheck]: {
    title: 'Pesanan sedang diperiksa bagian produksi',
    description: 'Pesanan Anda sedang dilakukan pengecekan untuk dapat diproduksi, mohon tunggu sampai proses pengecekan selesai'
  },
  [orderProcess.productionCheckCanceled]: {
    title: 'Produksi pesanan tidak dapat dilakukan',
    description: 'Pesanan Anda tidak dapat dilanjutkan karena pihak konveksi belum dapat memproduksi pesanan yang Anda buat'
  },
  [orderProcess.productionCheckConfirmed]: {
    title: 'Produksi pesanan telah dikonfirmasi',
    description: 'Pesanan Anda telah terkonfirmasi siap untuk di produksi, silahkan lakukan intruksi selanjutnya untuk melanjutkan pesanan'
  },
  [orderProcess.waitingPayment]: {
    title: 'Menunggu pembayaran pesanan',
    description: 'Silahkan lakukan pembayaran sesuai jumlah yang tertera ke no rekening yang tersedia untuk dapat melanjutkan pesanan Anda'
  },
  [orderProcess.paymentConfirmed]: {
    title: 'Pembayaran telah di konfirmasi',
    description: 'Pembayaran telah dikonfirmasi, dimohon menunggu pesanan Anda untuk dikirim setelah diproses oleh penjual'
  },
  [orderProcess.waitingWarehouseDelivery]: {
    title: 'Menunggu pengiriman produk dari gudang',
    description: 'Produk yang Anda pesan sedang menunggu pengiriman dari gudang untuk di proses'
  },
  [orderProcess.waitingProductionProcess]: {
    title: 'Menunggu proses produksi pesanan',
    description: 'Produk yang Anda pesan sedang dalam tahap produksi, mohon tunggu sampai proses produksi selesai'
  },
  [orderProcess.shippedFromWarehouse]: {
    title: 'Produk sedang dikirim dari gudang',
    description: 'Produk yang Anda pesan sedang dalam perjalanan dari gudang ke toko'
  },
  [orderProcess.prepareOrder]: {
    title: 'Pesanan Anda sedang di persiapkan',
    description: 'Penjual sedang mempersiapkan pesanan Anda, mohon tunggu sampai pesanan anda sudah tersedia untuk dikirim'
  },
  [orderProcess.orderProcess]: {
    title: 'Paket sedang dalam perjalanan',
    description: 'Paket Anda sudah dikirim oleh penjual, dimohon untuk melakukan konfirmasi ketika pesanan Anda telah sampai tujuan'
  },
  [orderProcess.orderFinished]: {
    title: 'Pesanan telah sampai',
    description: 'Paket Anda sudah sampai tujuan, silahkan untuk memberikan penilaian terhadap produk yang telah Anda dapatkan'
  }
};

const productCategory = {
  modern: 'modern',
  classic: 'classic',
  motive: 'motive'
};

const defaultProductImage =
  'https://firebasestorage.googleapis.com/v0/b/lfashion-ecommerce.appspot.com/o/item-photos%2F-.png?alt=media&token=42f2fc3a-63a6-453e-bec6-aed113b97441';

const sizeAvailable = ['XL', 'L', 'M', 'S'];

export {
  tableDisplayType,
  orderType,
  timeline,
  timelineValues,
  reverseTimelineValue,
  orderProcess,
  orderProcessDetail,
  productCategory,
  defaultProductImage,
  sizeAvailable
};
