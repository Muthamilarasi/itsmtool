import express, { Response, Request } from "express";
import * as z from "zod";
import * as R from "ramda";
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
    // console.log("err::", err);
    if (err instanceof z.ZodError) {
      res.status(400).json({
        message: "Bad Request",
        error: err.issues.map(e => ({
          errorCode: e.path,
          errorMessage: e.message
        }))
      });
    } else {
      console.log("errR::::", err);
      res.status(500).json({
        message: "Something went to wrong!",
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
    const validatedInput = ticketCT.parse(req.body);
    const ticket = await UpdateTicket(validatedInput, req.params.id);
    if (ticket.isErr == true) {
      console.log("error:::::", ticket.error);
      if (ticket.error instanceof Error) {
        if (R.includes(`${req.params.id}`, ticket.error["message"])) {
          return res.status(404).json({
            message: `No record with given id ${req.params.id}`,
            error: [
              {
                errorCode: [ticket.error["code"]],
                errorMessage: ticket.error["message"]
              }
            ]
          });
        } else if (
          R.includes(`${req.body.assigneeId}`, ticket.error["message"])
        ) {
          return res.status(400).json({
            message: "Bad Request",
            error: [
              {
                errorCode: [ticket.error["code"]],
                errorMessage: ticket.error["message"]
              }
            ]
          });
        } else if (R.includes(`${req.body.userId}`, ticket.error["message"])) {
          return res.status(400).json({
            message: "Bad Request",
            error: [
              {
                errorCode: [ticket.error["code"]],
                errorMessage: ticket.error["message"]
              }
            ]
          });
        }
        throw ticket.error;
      }
      throw ticket.error;
    }
    if (ticket.isOk == true) {
      res
        .status(200)
        .json({ message: "Ticket Updated Successfully", ticket: ticket.value });
    }
  } catch (err) {
    if (err instanceof z.ZodError) {
      res.status(400).json({
        message: "Bad Request",
        error: err.issues.map(e => ({
          errorCode: e.path,
          errorMessage: e.message
        }))
      });
    } else {
      res.status(500).json({
        message: "Something went to wrong!",
        error: [
          {
            errorCode: ["Unhandled Error"],
            errorMessage: "Something went to wrong!"
          }
        ]
      });
    }
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
    if (err instanceof z.ZodError) {
      res.status(400).json({
        message: "Bad Request",
        error: err.issues.map(e => ({
          errorCode: e.code,
          errorMessage: e.message
        }))
      });
    } else if (R.includes("User_email_key", err.meta.target)) {
      res.status(400).json({
        message: "User Already Created!",
        error: err
      });
    } else {
      res.status(500).json({ message: "Something went to wrong!", erorr: err });
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
