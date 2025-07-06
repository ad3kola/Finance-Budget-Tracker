import { z } from "zod";

export const transactionSchema = z.object({
  amount: z.coerce.number().positive("Amount is required and must be positive"),
  category: z.string().min(1, "Category is required"),
  date: z.date({
    required_error: "Date is required",
    invalid_type_error: "Invalid date",
  }),
  description: z.string().min(1, "Description is required"),
  type: z.enum(["income", "expense"], {
    required_error: "Type is required",
  }),
});