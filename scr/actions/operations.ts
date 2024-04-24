import { PrismaClient } from "@prisma/client";
import { Output } from "../types";
import * as R from "ramda";
import { Result } from "@badrap/result";
import { ValidationError, NotFoundError } from "./custom-errors";

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
  let sendInput = {};
  if (reqObject.assigneeId && reqObject.assigneeId) {
    let getAssignee = await prisma.user.findUnique({
      where: { email: reqObject.assigneeId }
    });
    if (!getAssignee) {
      return Result.err(
        new ValidationError(`Assignee not found: ${reqObject.assigneeId}`)
      );
    } else {
      sendInput["assigneeId"] = getAssignee.id;
    }
  }
  if (reqObject.userId && reqObject.userId) {
    let getUser = await prisma.user.findUnique({
      where: { email: reqObject.userId }
    });
    if (!getUser) {
      return Result.err(
        new ValidationError(`User not found: ${reqObject.userId}`)
      );
    } else {
      sendInput["userId"] = getUser.id;
    }
  }
  const createTicket = await prisma.ticket.create({
    data: {
      ...sendInput,
      ...R.omit(["assigneeId", "userId"], reqObject)
    }
  });
  return Result.ok(Output.parse(createTicket));
};

export const UpdateTicket = async (reqObject, id: number) => {
  let sendInput = {};
  if (reqObject.assigneeId) {
    let getAssignee = await prisma.user.findUnique({
      where: { email: reqObject.assigneeId }
    });
    if (!getAssignee) {
      return Result.err(
        new ValidationError(`Assignee does not exist: ${reqObject.assigneeId}`)
      );
    } else {
      sendInput["assigneeId"] = getAssignee.id;
    }
  }
  if (reqObject.userId) {
    let getUser = await prisma.user.findUnique({
      where: { email: reqObject.userId }
    });
    if (!getUser) {
      return Result.err(
        new ValidationError(`User does not exist: ${reqObject.userId}`)
      );
    } else {
      sendInput["userId"] = getUser.id;
    }
  }
  let getTicket = await prisma.ticket.findUnique({
    where: { id: Number(id) }
  });

  if (!getTicket) {
    return Result.err(new NotFoundError(`Ticket does not exist: ${id}`));
  }
  // console.log("getTicket::", getTicket);
  // console.log("sendInput", sendInput);

  const updateTicket = await prisma.ticket.update({
    where: { id: Number(id) },
    data: {
      ...R.omit(["assigneeId", "userId"], reqObject),
      ...sendInput
    }
  });
  return Result.ok(Output.parse(updateTicket));
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
