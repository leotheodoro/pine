-- DropIndex
DROP INDEX "journal_entries_user_id_date_key";

-- CreateIndex
CREATE INDEX "journal_entries_user_id_date_idx" ON "journal_entries"("user_id", "date");
