-- DropForeignKey
ALTER TABLE `Ticket` DROP FOREIGN KEY `Ticket_assigneeId_fkey`;

-- AlterTable
ALTER TABLE `Ticket` MODIFY `assigneeId` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `Ticket` ADD CONSTRAINT `Ticket_assigneeId_fkey` FOREIGN KEY (`assigneeId`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
