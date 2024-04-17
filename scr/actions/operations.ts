import { PrismaClient } from "@prisma/client";
import { Output } from "../types";

const prisma = new PrismaClient();

export const getAllTickets = async () => {
  const getAllTickets = await prisma.ticket.findMany();
  return getAllTickets;
};

export const getTickets = async (id: number) => {
  const getTicket = await prisma.ticket.findUnique({
    where: { id: Number(id) }
  });
  return getTicket;
};

export const deleteTicket = async (id: number) => {
  const deleteTicket = await prisma.ticket.delete({
    where: { id: Number(id) }
  });
  return deleteTicket;
};

export const CreateTicket = async reqObject => {
  const createTicket = await prisma.ticket.create({
    data: {
      ...reqObject
    }
  });
  return Output.parse(createTicket);
};

export const UpdateTicket = async (reqObject, id: number) => {
  const updateTicket = await prisma.ticket.update({
    where: { id: Number(id) },
    data: {
      ...reqObject
    }
  });
  return updateTicket;
};
export const CreateUser = async reqObject => {
  const createUser = await prisma.user.create({
    data: {
      ...reqObject
    }
  });
  return createUser;
};
export const GetUser = async (id: number) => {
  const getUser = await prisma.user.findUnique({
    where: { id: Number(id) }
  });
  return getUser;
};

export const AssignTicketToUser = async (req_id: string, id: number) => {
  const updateUser = await prisma.ticket.update({
    where: { id: Number(id) },
    data: {
      userId: Number(req_id)
    }
  });
  return updateUser;
};
