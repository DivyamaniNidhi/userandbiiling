const z = require("zod");

const strongPassword = z
  .string()
  .min(8, { message: "Password must be at least 8 characters long" })
  .max(50, { message: "Password cannot be longer than 50 characters" })
  .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/, {
    message:
      "Password must include at least one lowercase letter, one uppercase letter, one number, and one special character (@$!%*?&)",
  });

const validatedUserSchema = z.object({
  name: z.string().min(1).max(50),
  companyName: z.string().min(1).max(50),
  phone: z
    .string()
    .refine(
      (value) => /^[+]{1}(?:[0-9\-\(\)\/\.]\s?){6,15}[0-9]{1}$/.test(value),
      {
        message: "Phone number must be a valid format",
      }
    ),
  designation: z.string().min(1).max(50),
  personalEmail: z.string().email(),
  companyEmail: z.string().email(),
  password: strongPassword,
  rePassword: z.string().min(8),
});

module.exports = validatedUserSchema;
