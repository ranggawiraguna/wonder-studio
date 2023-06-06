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
  waitingPayment: 'waitingPayment',
  paymentConfirmed: 'paymentConfirmed',
  prepareDesain: 'prepareDesain',
  printingProcess: 'printingProcess',
  orderProcess: 'orderProcess',
  orderFinished: 'orderFinished',
  orderCanceled: 'orderCanceled',
};

const orderProcessDetail = {
  [orderProcess.orderCreate]: {
    title: 'Pesanan telah dibuat',
    description: 'Pesanan Anda telah dibuat, menunggu konfirmasi selanjutnya'
  },
  [orderProcess.waitingPayment]: {
    title: 'Menunggu pembayaran pesanan',
    description: 'Silahkan lakukan pembayaran sesuai jumlah yang tertera ke no rekening yang tersedia untuk dapat melanjutkan pesanan Anda'
  },
  [orderProcess.paymentConfirmed]: {
    title: 'Pembayaran telah di konfirmasi',
    description: 'Pembayaran telah dikonfirmasi, dimohon menunggu pesanan Anda untuk dikirim setelah diproses oleh penjual'
  },
  [orderProcess.prepareDesain]: {
    title: 'Pesanan Anda sedang dalam tahap desain',
    description: 'Penjual sedang mempersiapkan desain untuk pesanan Anda, mohon tunggu sampai desain selesai dibuat'
  },
  [orderProcess.printingProcess]: {
    title: 'Pesanan Anda sedang dalam proses pencetakan',
    description: 'Paket Anda sudah dikirim oleh penjual, dimohon untuk melakukan konfirmasi ketika pesanan Anda telah sampai tujuan'
  },
  [orderProcess.orderProcess]: {
    title: 'Paket sedang dalam perjalanan',
    description: 'Paket Anda sudah dikirim oleh penjual, dimohon untuk melakukan konfirmasi ketika pesanan Anda telah sampai tujuan'
  },
  [orderProcess.orderFinished]: {
    title: 'Pesanan telah sampai',
    description: 'Paket Anda sudah sampai tujuan, silahkan untuk memberikan penilaian terhadap produk yang telah Anda dapatkan'
  },
  [orderProcess.orderCanceled]: {
    title: 'Pesanan dibatalkan',
    description: 'Pesanan Anda telah dibatalkan, silhakan hubungi admin untuk keterangan lebih lanjut'
  },
};

const defaultProductImage =
  'https://firebasestorage.googleapis.com/v0/b/wonder-studio.appspot.com/o/product-images%2F-.png?alt=media&token=3a73e6c7-87c0-4546-8c77-cd03858e832f';

export {
  tableDisplayType,
  orderType,
  timeline,
  timelineValues,
  reverseTimelineValue,
  orderProcess,
  orderProcessDetail,
  defaultProductImage,
};
