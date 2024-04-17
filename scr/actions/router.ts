import express, { Response, Request } from "express";
import * as z from "zod";
import {
  getAllTickets,
  getTickets,
  deleteTicket,
  CreateTicket,
  UpdateTicket,
  CreateUser,
  AssignTicketToUser,
  GetUser
} from "./operations";
import { ticketCT, userCT } from "../types";

export const ticketRouter = express.Router();

ticketRouter.get("/start", async (req: Request, res: Response) => {
  res.send("actions route start");
});

ticketRouter.get("/", async (req: Request, res: Response) => {
  try {
    const getAlltickets = await getAllTickets();
    res
      .status(200)
      .json({ message: "Get tickets Successfully.", tickets: getAlltickets });
  } catch (err) {
    console.log("err::", err);
  }
});

ticketRouter.get("/api/tickets/:id", async (req: Request, res: Response) => {
  try {
    const ticket = await getTickets(req.params.id);
    if (!ticket) {
      res.status(404).json(`No record with given id ${req.params.id}`);
    }
    res
      .status(200)
      .json({ message: "Get ticket detail Successfully.", ticket });
  } catch (err) {
    console.log("err", err);
  }
});

ticketRouter.delete("/api/tickets/:id", async (req: Request, res: Response) => {
  try {
    await deleteTicket(req.params.id);
    res.send("Deleted Successfully.");
  } catch (err) {
    res.status(404).json({
      message: `No record with given id ${req.params.id}`,
      erorr: err
    });
    console.log("err", err.meta);
  }
});

ticketRouter.post("/api/tickets", async (req: Request, res: Response) => {
  try {
    const validatedInput = ticketCT.parse(req.body);
    const ticket = await CreateTicket(validatedInput);
    res
      .status(200)
      .json({ message: "Ticket Created Successfully", ticket: ticket });
  } catch (err) {
    console.log("err::", err);
    if (err instanceof z.ZodError) {
      res.status(400).json({
        message: "Bad Request",
        error: err.issues.map(e => ({
          errorCode: e.code,
          errorMessage: e.message
        }))
      });
    }
  }
});

ticketRouter.put("/api/tickets/:id", async (req: Request, res: Response) => {
  try {
    const ticket = await UpdateTicket(req.body, req.params.id);
    res
      .status(200)
      .json({ message: "Ticket Updated Successfully", ticket: ticket });
  } catch (err) {
    res.status(404).json({
      message: `No record with given id ${req.params.id}`,
      error: err
    });
    console.log("err::", err);
  }
});

ticketRouter.post("/api/users", async (req: Request, res: Response) => {
  try {
    const validatedInput = userCT.parse(req.body);
    const user = await CreateUser(validatedInput);
    res.status(200).json({
      message: "User Created Successfully",
      user
    });
  } catch (err) {
    res.status(400).json({ message: "User Already Created", erorr: err });
    console.log("err::", err);
    if (err instanceof z.ZodError) {
      res.status(400).json({
        message: "Bad Request",
        error: err.issues.map(e => ({
          errorCode: e.code,
          errorMessage: e.message
        }))
      });
    }
  }
});
ticketRouter.get("/api/users/:id", async (req: Request, res: Response) => {
  try {
    const user = await GetUser(req.params.id);
    if (!user) {
      res.status(404).json(`No record with given id ${req.params.id}`);
    }
    res.status(200).json({ message: "Get user detail Successfully.", user });
  } catch (err) {
    console.log("err", err);
  }
});
ticketRouter.put(
  "/api/assigntoticket/:id",
  async (req: Request, res: Response) => {
    try {
      const ticket = await AssignTicketToUser(req.body.userId, req.params.id);
      res.status(200).json({
        message: "Assign To Ticket User Successfully",
        ticket: ticket
      });
    } catch (err) {
      res.status(404).json({
        message: `No record with given id ${req.params.id}`,
        error: err
      });

      console.log("err::", err);
    }
    // const user = await AssignTicketToUser(req.body.RequesterId,req.params.id);
    // res.send(res, user);
  }
);