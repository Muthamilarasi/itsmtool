import { PrismaClient } from "@prisma/client";
import { CustomError } from "./custom-errors";

const prisma = new PrismaClient();

export const GetUserAndAssignee = async (user: string, key: string) => {
  let userData = await prisma.user.findUnique({
    where: { email: user }
  });
  if (!userData) {
    return CustomError("USER_DEOS_NOT_EXIST", `User does not exist: ${user}`);
  } else {
    return { [key]: userData.id };
  }
};

export const GetTicket = async (id: number) => {
  let getTicket = await prisma.ticket.findUnique({
    where: { id: Number(id) }
  });
  if (!getTicket) {
    return CustomError(
      "TICKET_ID_DOES_NOT_EXIST",
      `Ticket does not exist: ${id}`
    );
  }
};
