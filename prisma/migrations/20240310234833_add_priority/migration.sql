-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_descent_time_daily_has_class" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "classId" TEXT NOT NULL,
    "descentTimeDailyId" TEXT NOT NULL,
    "hour" INTEGER NOT NULL,
    "minute" INTEGER NOT NULL,
    "priority" INTEGER NOT NULL DEFAULT 1,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "descent_time_daily_has_class_classId_fkey" FOREIGN KEY ("classId") REFERENCES "classes" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "descent_time_daily_has_class_descentTimeDailyId_fkey" FOREIGN KEY ("descentTimeDailyId") REFERENCES "descent_time_daily" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_descent_time_daily_has_class" ("classId", "createdAt", "descentTimeDailyId", "hour", "id", "minute", "updatedAt") SELECT "classId", "createdAt", "descentTimeDailyId", "hour", "id", "minute", "updatedAt" FROM "descent_time_daily_has_class";
DROP TABLE "descent_time_daily_has_class";
ALTER TABLE "new_descent_time_daily_has_class" RENAME TO "descent_time_daily_has_class";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
