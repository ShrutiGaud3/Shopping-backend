const generateOrderId = () => {
  const randomDigits = Math.floor(10000 + Math.random() * 90000);
  return `VEL-${randomDigits}`;
};

module.exports = generateOrderId;
