/*
  Warnings:

  - You are about to drop the column `description` on the `Post` table. All the data in the column will be lost.
  - You are about to drop the `Comment` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `CommentLike` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `PostImage` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `PostLike` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `imageId` to the `Post` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `Comment` DROP FOREIGN KEY `Comment_postId_fkey`;

-- DropForeignKey
ALTER TABLE `Comment` DROP FOREIGN KEY `Comment_userId_fkey`;

-- DropForeignKey
ALTER TABLE `CommentLike` DROP FOREIGN KEY `CommentLike_commentId_fkey`;

-- DropForeignKey
ALTER TABLE `CommentLike` DROP FOREIGN KEY `CommentLike_userId_fkey`;

-- DropForeignKey
ALTER TABLE `PostImage` DROP FOREIGN KEY `PostImage_postId_fkey`;

-- DropForeignKey
ALTER TABLE `PostLike` DROP FOREIGN KEY `PostLike_postId_fkey`;

-- DropForeignKey
ALTER TABLE `PostLike` DROP FOREIGN KEY `PostLike_userId_fkey`;

-- AlterTable
ALTER TABLE `Post` DROP COLUMN `description`,
    ADD COLUMN `imageId` VARCHAR(191) NOT NULL;

-- DropTable
DROP TABLE `Comment`;

-- DropTable
DROP TABLE `CommentLike`;

-- DropTable
DROP TABLE `PostImage`;

-- DropTable
DROP TABLE `PostLike`;
