/*
  Warnings:

  - You are about to drop the column `day` on the `descent_time_daily` table. All the data in the column will be lost.
  - You are about to drop the column `month` on the `descent_time_daily` table. All the data in the column will be lost.
  - You are about to drop the column `year` on the `descent_time_daily` table. All the data in the column will be lost.
  - Added the required column `date` to the `descent_time_daily` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_descent_time_daily" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "date" DATETIME NOT NULL
);
INSERT INTO "new_descent_time_daily" ("id") SELECT "id" FROM "descent_time_daily";
DROP TABLE "descent_time_daily";
ALTER TABLE "new_descent_time_daily" RENAME TO "descent_time_daily";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
