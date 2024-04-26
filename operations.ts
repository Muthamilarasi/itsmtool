import { PrismaClient } from "@prisma/client";
import { Output, TicketCT } from "../types";
import * as R from "ramda";
import { Result } from "@badrap/result";
import { ValidationError, NotFoundError, CustomError } from "./custom-errors";
import { GetUserAndAssignee } from "./utils";

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
  let getTicket = await prisma.ticket.findUnique({
    where: { id: Number(id) }
  });
  if (!getTicket) {
    return Result.err(
      CustomError("TICKET_ID_DOES_NOT_EXIST", `Ticket does not exist: ${id}`)
    );
  }
  const assigneeId = reqObject.assigneeId
    ? await GetUserAndAssignee(reqObject.assigneeId, "assigneeId")
    : {};
  const userId = reqObject.userId
    ? await GetUserAndAssignee(reqObject.userId, "userId")
    : {};

  if (assigneeId instanceof Error) {
    return Result.err(assigneeId);
  }
  if (userId instanceof Error) {
    return Result.err(userId);
  }
  const updateTicket = await prisma.ticket.update({
    where: { id: Number(id) },
    data: {
      ...R.omit(["assigneeId", "userId"], reqObject),
      ...assigneeId,
      ...userId
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
