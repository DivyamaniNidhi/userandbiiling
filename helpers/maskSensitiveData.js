const maskSensitiveData = (billingAddress) => {
  const maskedAddress = { ...billingAddress };

  if (maskedAddress.cardNumber) {
    maskedAddress.cardNumber = maskedAddress.cardNumber
      .slice(-4)
      .padStart(maskedAddress.cardNumber.length, "*");
  }

  if (
    maskedAddress.netBankingDetails &&
    maskedAddress.netBankingDetails.accountNumber
  ) {
    maskedAddress.netBankingDetails.accountNumber =
      maskedAddress.netBankingDetails.accountNumber
        .slice(-4)
        .padStart(maskedAddress.netBankingDetails.accountNumber.length, "*");
  }

  return maskedAddress;
};

module.exports = maskSensitiveData;
