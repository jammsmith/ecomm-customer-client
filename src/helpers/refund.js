import { convertStripeAmountToPrice } from './price.js';

export const getTotalPreviousRefunds = (refunds) => {
  const amounts = refunds.map(refund => parseFloat(refund.amount));
  return amounts.reduce((a, b) => a + b);
};

export const verifyRefundAmount = (requestedAmount, orderTotal, previousRefunds) => {
  const refundAmount = parseFloat(requestedAmount);
  const totalOrderAmount = convertStripeAmountToPrice(orderTotal);

  if (
    (!previousRefunds && (refundAmount > totalOrderAmount)) ||
    (previousRefunds && (refundAmount > (totalOrderAmount - previousRefunds)))
  ) {
    return false;
  } else {
    return true;
  }
};

export const checkIsFullRefund = (refundAmount, orderTotal, refundedAmount) => {
  const refundNum = parseFloat(refundAmount);
  const refundedNum = refundedAmount ? parseFloat(refundedAmount) : null;
  const orderTotalNum = parseFloat(orderTotal);

  return refundedNum
    ? refundNum === (orderTotalNum - refundedNum)
    : refundNum === orderTotalNum;
};
