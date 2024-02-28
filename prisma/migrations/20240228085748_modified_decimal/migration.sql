/*
  Warnings:

  - You are about to alter the column `netAmount` on the `orders` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `Decimal(10,2)`.
  - You are about to alter the column `price` on the `products` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `Decimal(10,2)`.

*/
-- AlterTable
ALTER TABLE `orders` MODIFY `netAmount` DECIMAL(10, 2) NOT NULL;

-- AlterTable
ALTER TABLE `products` MODIFY `price` DECIMAL(10, 2) NOT NULL;
