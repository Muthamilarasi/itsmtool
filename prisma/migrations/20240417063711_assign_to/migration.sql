/*
  Warnings:

  - A unique constraint covering the columns `[assigneeId]` on the table `Ticket` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `assigneeId` to the `Ticket` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Ticket` ADD COLUMN `assigneeId` INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `Ticket_assigneeId_key` ON `Ticket`(`assigneeId`);

-- AddForeignKey
ALTER TABLE `Ticket` ADD CONSTRAINT `Ticket_assigneeId_fkey` FOREIGN KEY (`assigneeId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
