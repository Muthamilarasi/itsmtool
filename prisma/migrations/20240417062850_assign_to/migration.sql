/*
  Warnings:

  - A unique constraint covering the columns `[assigneeId]` on the table `Ticket` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `Ticket_assigneeId_key` ON `Ticket`(`assigneeId`);
