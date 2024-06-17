const { z } = require("zod");

const billingAddressSchema = z
  .object({
    firstName: z.string().min(1),
    lastName: z.string().min(1),
    address: z.string().min(1),
    city: z.string().min(1),
    state: z.string().min(1),
    pincode: z.number().int().positive(),
    phone: z
      .string()
      .refine(
        (value) => /^[+]{1}(?:[0-9\-\(\)\/\.]\s?){6,15}[0-9]{1}$/.test(value),
        {
          message: "Phone number must be a valid format",
        }
      ),
    paymentMethod: z.enum(["Credit Card", "Debit Card", "UPI", "Net Banking"], {
      message: "Invalid payment method",
    }),
    cardNumber: z.string().optional(),
    expirationMonth: z.number().int().positive().min(1).max(12).optional(),
    expirationYear: z.number().int().positive().optional(),
    netBankingDetails: z
      .object({
        bankName: z.string(),
        accountNumber: z.string(),
        ifscCode: z.string(),
      })
      .optional(),
    upiDetails: z
      .object({
        upiID: z
          .string()
          .refine(
            (value) =>
              /^[a-zA-Z0-9.-]{2,256}@[a-zA-Z][a-zA-Z]{2,64}$/.test(value),
            {
              message: "Enter valid UPI ID",
            }
          ),
      })
      .optional(),
  })
  .refine(
    (data) => {
      // For Credit Card and Debit Card: cardNumber, expirationMonth, and expirationYear are mandatory
      if (["Credit Card", "Debit Card"].includes(data.paymentMethod)) {
        return data.cardNumber && data.expirationMonth && data.expirationYear;
      }
      return true;
    },
    {
      message:
        "Card number, expiration month, and expiration year are required for Credit Card and Debit Card payments",
      path: ["cardNumber", "expirationMonth", "expirationYear"],
    }
  )
  .refine(
    (data) => {
      // For Net Banking: bankName, accountNumber, and ifscCode are mandatory
      if (data.paymentMethod === "Net Banking") {
        return (
          data.netBankingDetails?.bankName &&
          data.netBankingDetails?.accountNumber &&
          data.netBankingDetails?.ifscCode
        );
      }
      return true;
    },
    {
      message:
        "Bank name, account number, and IFSC code are required for Net Banking payments",
      path: ["netBankingDetails"],
    }
  )
  .refine(
    (data) => {
      // For UPI: upiID is mandatory
      if (data.paymentMethod === "UPI") {
        return data.upiDetails?.upiID;
      }
      return true;
    },
    {
      message: "UPI ID is required for UPI payments",
      path: ["upiDetails"],
    }
  );

module.exports = billingAddressSchema;
