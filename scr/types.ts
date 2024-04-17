import * as z from "zod";

export const ticketCT = z.object({
  subject: z.string({
    invalid_type_error: "Name must be a string"
  }),
  userId: z.number({
    invalid_type_error: "Must be a number"
  }),
  description: z.string({
    invalid_type_error: "Description must be a string"
  }),
  status: z.enum(["Open", "Pending", "InProgress", "Resolve", "Cancel"])
});

export const outputTicket = z.object({
  id: z.number(),
  createdAt: z.date(),
  updatedAt: z.date()
});
export const Output = z.intersection(ticketCT, outputTicket);
type Ticket = z.infer<typeof Output>;

export const userCT = z.object({
  email: z.string().email(),
  phone: z.number({
    invalid_type_error: "Phone must be a number"
  }),
  name: z.string({
    invalid_type_error: "Name must be a string"
  })
});
