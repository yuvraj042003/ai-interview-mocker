import { pgTable, text, serial, varchar } from "drizzle-orm/pg-core";

export const MockInterview = pgTable('mockInterview', {
  id: serial('id').primaryKey(),
  jsonMockResp: text('jsonMockResp').notNull(),
  jobPosition: varchar('jobPosition', 255).notNull(), // Specify length for varchar
  jobDesc: varchar('jobDesc', 255).notNull(),
  jobExperience: varchar('jobExperience', 255).notNull(),
  createdBy: varchar('createdBy', 255).notNull(),
  createdAt: varchar('createdAt'),
  mockId: varchar('mockId').notNull(),
});

export const UserAnswer = pgTable('userAnswer', {
  id: serial('id').primaryKey(),
  mockIdRef: varchar('mockId').notNull(),
  question: varchar('question', 255).notNull(),
  correctAns: text('correctAns').notNull(),
  userAns: text('userAns').notNull(),
  feedback: text('feedback').notNull(),
  rating: varchar('rating', 255).notNull(),
  userEmail: varchar('userEmail'),
  createdAt: varchar('createdAt'),
});
