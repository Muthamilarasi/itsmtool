import * as z from "zod";

const stringOrNumber = z
  .string()
  .email()
  .nullish()
  .or(z.number({ invalid_type_error: "Provide must be a string" }).nullish());

export const ticketCT = z.object({
  subject: z.string({
    invalid_type_error: "Name must be a string"
  }),
  userId: z.optional(stringOrNumber),
  assigneeId: z.optional(stringOrNumber),

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
export type TicketCT = z.infer<typeof Output>;
export const userCT = z.object({
  email: z.string().email(),
  phone: z.number({
    invalid_type_error: "Phone must be a number"
  }),
  name: z.string({
    invalid_type_error: "Name must be a string"
  })
});
export const outputUser = z.object({
  id: z.number(),
  createdAt: z.date(),
  updatedAt: z.date()
});

export const UserOutput = z.intersection(userCT, outputUser);

export type User = z.infer<typeof UserOutput>;

export type Ticket = {
  subject: string;
  userId: any;
  assigneeId: number;
  description: string;
  status: string;
  id: number;
  createdAt: string;
  updatedAt: string;
};
