const BillRepository = require('../persistency/BillRepository.js');
const billNaming = require('../constant/BillNaming.js');
const getBillById = async (id) => {
  const data = await BillRepository.getBillById(id);
  return dataToDTO(data);
};
const getAllBills = async () => {
  const data = await BillRepository.getAllBills();
  return data.map((bill) => dataToDTO(bill));
}
const dataToDTO = (data) => {
  return {
    userId: data[billNaming.ID],
    address: data[billNaming.ADDRESS],
    fullName: data[billNaming.FULL_NAME],
    orderDate: data[billNaming.ORDER_DATE],
    paymentMethod: data[billNaming.PAYMENT_METHOD],
    phone: data[billNaming.PHONE],
    totalAmount: data[billNaming.TOTAL_AMOUNT],
    orderStatus: data[billNaming.ORDER_STATUS],
  };
}
module.exports = { getBillById, getAllBills };