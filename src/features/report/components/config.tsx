import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import MoneyIcon from '@mui/icons-material/Money';
import SyncAltIcon from '@mui/icons-material/SyncAlt';
import WindowIcon from '@mui/icons-material/Window';
import TimelineIcon from '@mui/icons-material/Timeline';
// I. Bán hàng
const totalSalesRevenue: any = [
  {
    title: 'Phí ship',
    dataIndex: 'totalShippingFee',
    fontSize: 'small',
  },
  {
    title: 'Phí ship đơn COD',
    dataIndex: 'totalCodShippingFee',
    fontSize: 'small',
  },
  {
    title: 'Phí đường đi',
    dataIndex: 'totalDistanceFee',
    fontSize: 'small',
  },
  {
    title: 'Phí đường đi đơn COD',
    dataIndex: 'totalCodDistanceFee',
    fontSize: 'small',
  },
  {
    title: 'Phụ phí',
    dataIndex: 'totalSurCharge',
    fontSize: 'small',
  },
  {
    title: 'Phụ phí đơn COD',
    dataIndex: 'totalCodSurCharge',
    fontSize: 'small',
  },
  {
    title: 'Tổng thu hộ (1)',
    dataIndex: 'totalAmount',
    highlight: true,
  },
  {
    title: 'Tổng tiền ship (2)',
    dataIndex: 'totalFee',
  },
  {
    title: 'Tiền cần hoàn lại (1)-(2)',
    dataIndex: 'refundAmount',
    highlight: true,
  },
];
const totalSalesInvoice: any = [
  {
    title: 'Số đơn hàng thành công (1)',
    dataIndex: 'totalOrderDelivered',
  },
  {
    title: 'Số đơn hàng mới (2)',
    dataIndex: 'totalOrderNew',
  },
  {
    title: 'Số đơn có tài xế nhận (3)',
    dataIndex: 'totalOrderAssigend',
  },
  {
    title: 'Số đơn đã lấy hàng (4)',
    dataIndex: 'totalOrderPickedUp',
  },
  {
    title: 'Số đơn hàng giao thất bại (5)',
    dataIndex: 'totalOrderCancel',
  },
  {
    title: 'Tổng số đơn hàng (1)+(2)+(3)+(4)+(5)',
    dataIndex: 'totalOrder',
    highlight: true,
  },
];

// II. Nạp thẻ
const TotalRevenueCardRecharge: any = [
  {
    title: <AttachMoneyIcon />,
    dataIndex: 'totalRevenueOrderCard',
  },
];
const totalBillOfCard: any = [
  {
    title: <SyncAltIcon />,
    dataIndex: 'totalOrderCard',
  },
];

// III. Thành phần doanh thu
const totalRevenue: any = [
  {
    title: <AttachMoneyIcon />,
    dataIndex: 'totalRevenue',
  },
];
const totalBill: any = [
  {
    title: <WindowIcon />,
    dataIndex: 'totalOrder',
  },
];
const averageBill: any = [
  {
    title: <WindowIcon />,
    dataIndex: 'avgRevenueOrder',
  },
];
const averageProduct: any = [
  {
    title: <WindowIcon />,
    dataIndex: 'avgProductOrder',
  },
];

const atStore: any = [
  {
    title: 'Doanh thu',
    unit: 'VNĐ',
    dataIndex: 'totalRevenueAtStore',
    highlight: true,
  },
  {
    title: 'Tổng hóa đơn',
    unit: 'Hóa đơn',
    dataIndex: 'totalOrderAtStore',
  },
  {
    title: 'TB hóa đơn',
    unit: 'VNĐ/Hóa đơn',
    dataIndex: '',
    highlight: true,
  },
  {
    title: 'TB sản phẩm',
    unit: 'SP/Hóa đơn',
    dataIndex: 'avgProductOrderAtStore',
  },
];
const takeAway: any = [
  {
    title: 'Doanh thu',
    unit: 'VNĐ',
    dataIndex: 'totalRevenueTakeAway',
    highlight: true,
  },
  {
    title: 'Tổng hóa đơn',
    unit: 'Hóa đơn',
    dataIndex: 'totalOrderTakeAway',
  },
  {
    title: 'TB hóa đơn',
    unit: 'VNĐ/Hóa đơn',
    dataIndex: '',
    highlight: true,
  },
  {
    title: 'TB sản phẩm',
    unit: 'SP/Hóa đơn',
    dataIndex: 'avgProductOrderTakeAway',
  },
];
const delivery: any = [
  {
    title: 'Doanh thu',
    unit: 'VNĐ',
    dataIndex: 'totalRevenueDelivery',
    highlight: true,
  },
  {
    title: 'Tổng hóa đơn',
    unit: 'Hóa đơn',
    dataIndex: 'totalOrderDelivery',
  },
  {
    title: 'TB hóa đơn',
    unit: 'VNĐ/Hóa đơn',
    dataIndex: '',
    highlight: true,
  },
  {
    title: 'TB sản phẩm',
    unit: 'SP/Hóa đơn',
    dataIndex: 'avgProductOrderDelivery',
  },
];
const cancel: any = [
  {
    title: 'Tổng giá trị',
    unit: 'VNĐ',
    dataIndex: 'totalRevenuePrecancel',
    highlight: true,
  },
  {
    title: 'Tổng hóa đơn',
    unit: 'Hóa đơn',
    dataIndex: 'totalOrderPreCancel',
  },
  {
    title: 'Hủy trước chế biến',
    unit: 'VNĐ/Hóa đơn',
    dataIndex: '',
    highlight: true,
  },
  {
    title: 'Hủy sau chế biến',
    unit: 'SP/Hóa đơn',
    dataIndex: 'totalOrderAfterCancel',
  },
];

// IV. Thanh Toán & Thu Ngân
const totalPayment: any = [
  {
    title: <MoneyIcon />,
    dataIndex: 'totalPayment',
  },
  {
    title: 'Tiền mặt [bán hàng] (1)',
    dataIndex: 'totalPaymentForSales',
    highlight: true,
  },
  {
    title: 'Tiền mặt [nạp thẻ] (2)',
    dataIndex: 'totalPaymentCard',
  },
  {
    title: 'Thẻ thành viên (3)',
    dataIndex: 'totalPaymentBuyCard',
    highlight: true,
  },
  {
    title: 'Ví điện tử (4)',
    dataIndex: 'null',
  },
  {
    title: 'Momo:',
    dataIndex: 'totalPaymentE_Wallet_Momo',
    fontSize: 'small',
  },
  {
    title: 'Grab Pay',
    dataIndex: 'totalPaymentE_Wallet_GrabPay',
    fontSize: 'small',
  },
  {
    title: 'Grab Food',
    dataIndex: 'totalPaymentE_Wallet_GrabFood',
    fontSize: 'small',
  },
  {
    title: 'VN Pay',
    dataIndex: 'totalPaymentE_Wallet_VNPay',
    fontSize: 'small',
  },
  {
    title: 'Baemin',
    dataIndex: 'totalPaymentE_Wallet_Baemin',
    fontSize: 'small',
  },
  {
    title: 'Shopee pay',
    dataIndex: 'totalPaymentE_Wallet_Shopeepay',
    fontSize: 'small',
  },
  {
    title: 'Zalo pay',
    dataIndex: 'totalPaymentE_Wallet_ZaloPay',
    fontSize: 'small',
  },
  {
    title: <AttachMoneyIcon />,
    dataIndex: 'totalPaymentE_Wallet',
  },
  {
    title: 'Ngân hàng (5)',
    dataIndex: 'totalPaymentBank',
    highlight: true,
  },
  {
    title: 'Thanh toán khác (6)',
    dataIndex: 'totalPaymentOther',
  },
];
const totalAmountPayment: any = [
  {
    title: <SyncAltIcon />,
    dataIndex: 'totalTransactionPayment',
  },
  {
    title: 'Tiền mặt [bán hàng] (1)',
    dataIndex: 'totalTransactionPaymentForSales',
    highlight: true,
  },
  {
    title: 'Tiền mặt [nạp thẻ] (2)',
    dataIndex: 'totalTransactionPaymentCard',
  },
  {
    title: 'Thẻ thành viên (3)',
    dataIndex: 'totalTransactionPaymentBuyCard',
    highlight: true,
  },
  {
    title: 'Ví điện tử (4)',
    dataIndex: 'null',
  },
  {
    title: 'Momo:',
    dataIndex: 'totalTransactionPaymentE_Wallet_Momo',
    fontSize: 'small',
  },
  {
    title: 'Grab Pay',
    dataIndex: 'totalTransactionPaymentE_Wallet_GrabPay',
    fontSize: 'small',
  },
  {
    title: 'Grab Food',
    dataIndex: 'totalTransactionPaymentE_Wallet_GrabFood',
    fontSize: 'small',
  },
  {
    title: 'VN Pay',
    dataIndex: 'totalTransactionPaymentE_Wallet_VNPay',
    fontSize: 'small',
  },
  {
    title: 'Baemin',
    dataIndex: 'totalTransactionPaymentE_Wallet_Baemin',
    fontSize: 'small',
  },
  {
    title: 'Shopee pay',
    dataIndex: 'totalTransactionPaymentE_Wallet_Shopeepay',
    fontSize: 'small',
  },
  {
    title: 'Zalo pay',
    dataIndex: 'totalTransactionPaymentE_Wallet_ZaloPay',
    fontSize: 'small',
  },
  {
    title: <TimelineIcon />,
    dataIndex: 'totalPaymentE_Wallet',
  },
  {
    title: 'Ngân hàng (5)',
    dataIndex: 'totalPaymentBank',
    highlight: true,
  },
  {
    title: 'Thanh toán khác (6)',
    dataIndex: 'totalPaymentOther',
  },
];

const config = {
  totalSalesRevenue,
  totalSalesInvoice,
  TotalRevenueCardRecharge,
  totalBillOfCard,
  totalRevenue,
  totalBill,
  averageBill,
  averageProduct,
  atStore,
  takeAway,
  delivery,
  cancel,
  totalPayment,
  totalAmountPayment,
};

export default config;
