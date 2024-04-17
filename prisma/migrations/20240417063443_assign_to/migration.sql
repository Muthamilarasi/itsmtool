/*
  Warnings:

  - You are about to drop the column `assigneeId` on the `Ticket` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `Ticket` DROP FOREIGN KEY `Ticket_assigneeId_fkey`;

-- AlterTable
ALTER TABLE `Ticket` DROP COLUMN `assigneeId`;
