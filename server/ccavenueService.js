const ccavneue = require("node-ccavenue");

const ccav = new ccavneue.Configure({
  merchant_id: process.env.MERCHANT_ID,
  working_key: process.env.WORKING_KEY,
});

const encrypt = (order) => {
  return ccav.getEncryptedOrder(order);
};

const decrypt = (encodedData) => {
  const decyptedData = ccav.redirectResponseToJson(encodedData);

  return {
    data: decyptedData,
    responceCode: decyptedData.order_status,
  };
};

module.exports = {
  encrypt,
  decrypt,
};
