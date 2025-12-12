import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const queries = [
      // 1. Create tables
      `CREATE TABLE IF NOT EXISTS "user_progress" (
        "id" UUID NOT NULL DEFAULT gen_random_uuid(),
        "user_id" UUID NOT NULL,
        "program_id" UUID NOT NULL,
        "total_videos" INTEGER DEFAULT 0,
        "watched_videos" INTEGER DEFAULT 0,
        "percent_complete" DECIMAL(5, 2) DEFAULT 0,
        "updated_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT "user_progress_pkey" PRIMARY KEY ("id")
      );`,

      `CREATE TABLE IF NOT EXISTS "watch_history" (
        "id" UUID NOT NULL DEFAULT gen_random_uuid(),
        "user_id" UUID NOT NULL,
        "video_id" UUID NOT NULL,
        "last_timestamp" INTEGER DEFAULT 0,
        "times_watched" INTEGER DEFAULT 0,
        "is_completed" BOOLEAN DEFAULT false,
        "updated_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT "watch_history_pkey" PRIMARY KEY ("id")
      );`,

      `CREATE TABLE IF NOT EXISTS "admin_logs" (
        "id" UUID NOT NULL DEFAULT gen_random_uuid(),
        "admin_id" UUID NOT NULL,
        "action" TEXT NOT NULL,
        "entity" TEXT NOT NULL,
        "entity_id" UUID,
        "logged_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT "admin_logs_pkey" PRIMARY KEY ("id")
      );`,

      // 2. Create Indexes
      `CREATE UNIQUE INDEX IF NOT EXISTS "user_progress_user_id_program_id_key" ON "user_progress"("user_id", "program_id");`,
      `CREATE UNIQUE INDEX IF NOT EXISTS "watch_history_user_id_video_id_key" ON "watch_history"("user_id", "video_id");`,

      // 3. Foreign Keys (using DO blocks to safely ignore if exist)
      `DO $$ BEGIN
        ALTER TABLE "user_progress" ADD CONSTRAINT "user_progress_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
      EXCEPTION
        WHEN duplicate_object THEN null;
      END $$;`,

      `DO $$ BEGIN
        ALTER TABLE "user_progress" ADD CONSTRAINT "user_progress_program_id_fkey" FOREIGN KEY ("program_id") REFERENCES "programs"("id") ON DELETE CASCADE ON UPDATE CASCADE;
      EXCEPTION
        WHEN duplicate_object THEN null;
      END $$;`,

      `DO $$ BEGIN
        ALTER TABLE "watch_history" ADD CONSTRAINT "watch_history_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
      EXCEPTION
        WHEN duplicate_object THEN null;
      END $$;`,

      `DO $$ BEGIN
        ALTER TABLE "watch_history" ADD CONSTRAINT "watch_history_video_id_fkey" FOREIGN KEY ("video_id") REFERENCES "videos"("id") ON DELETE CASCADE ON UPDATE CASCADE;
      EXCEPTION
        WHEN duplicate_object THEN null;
      END $$;`
    ];

    for (const query of queries) {
      await prisma.$executeRawUnsafe(query);
    }

    return NextResponse.json({ success: true, message: "Tables and constraints created successfully" });
  } catch (error) {
    const fs = require('fs');
    const path = require('path');
    try {
      fs.writeFileSync(path.join(process.cwd(), 'fix-db-error.log'), String(error) + '\n' + JSON.stringify(error, null, 2));
    } catch (e) {
      console.error("Failed to write log", e);
    }
    console.error("DB Fix Error:", error);
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 });
  }
}
