import { sql } from 'drizzle-orm';
import {
  index,
  jsonb,
  pgTable,
  timestamp,
  varchar,
  text,
  integer,
  decimal,
  boolean,
  pgEnum,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Session storage table (required for Replit Auth)
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// Enums
export const userRoleEnum = pgEnum('user_role', ['student', 'admin']);
export const contentTypeEnum = pgEnum('content_type', ['book', 'video', 'course']);
export const difficultyEnum = pgEnum('difficulty', ['beginner', 'intermediate', 'advanced']);
export const quizStatusEnum = pgEnum('quiz_status', ['draft', 'published']);

// User storage table (required for Replit Auth)
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  role: userRoleEnum("role").notNull().default('student'),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Content table for books, videos, and other materials
export const content = pgTable("content", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: varchar("title").notNull(),
  description: text("description"),
  author: varchar("author"),
  subject: varchar("subject"),
  type: contentTypeEnum("type").notNull(),
  difficulty: difficultyEnum("difficulty").default('beginner'),
  filePath: varchar("file_path"), // For uploaded files
  fileSize: integer("file_size"), // In bytes
  fileName: varchar("file_name"),
  fileType: varchar("file_type"), // PDF, EPUB, MP4, etc.
  youtubeUrl: varchar("youtube_url"), // For YouTube videos
  thumbnailUrl: varchar("thumbnail_url"),
  tags: text("tags").array(), // Array of tags
  downloadable: boolean("downloadable").default(true),
  featured: boolean("featured").default(false),
  duration: integer("duration"), // In minutes for videos
  uploadedBy: varchar("uploaded_by").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Courses - collections of content
export const courses = pgTable("courses", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: varchar("title").notNull(),
  description: text("description"),
  instructor: varchar("instructor"),
  thumbnailUrl: varchar("thumbnail_url"),
  difficulty: difficultyEnum("difficulty").default('beginner'),
  estimatedHours: integer("estimated_hours"),
  createdBy: varchar("created_by").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Course content mapping
export const courseContent = pgTable("course_content", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  courseId: varchar("course_id").references(() => courses.id, { onDelete: 'cascade' }),
  contentId: varchar("content_id").references(() => content.id, { onDelete: 'cascade' }),
  order: integer("order").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

// User enrollments in courses
export const enrollments = pgTable("enrollments", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id, { onDelete: 'cascade' }),
  courseId: varchar("course_id").references(() => courses.id, { onDelete: 'cascade' }),
  enrolledAt: timestamp("enrolled_at").defaultNow(),
  completedAt: timestamp("completed_at"),
  progress: decimal("progress", { precision: 5, scale: 2 }).default('0'),
});

// User progress tracking for individual content
export const progress = pgTable("progress", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id, { onDelete: 'cascade' }),
  contentId: varchar("content_id").references(() => content.id, { onDelete: 'cascade' }),
  completed: boolean("completed").default(false),
  progress: decimal("progress", { precision: 5, scale: 2 }).default('0'),
  timeSpent: integer("time_spent").default(0), // In minutes
  lastAccessed: timestamp("last_accessed").defaultNow(),
  completedAt: timestamp("completed_at"),
});

// Notes system
export const notes = pgTable("notes", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id, { onDelete: 'cascade' }),
  contentId: varchar("content_id").references(() => content.id, { onDelete: 'cascade' }),
  title: varchar("title").notNull(),
  content: text("content"),
  tags: text("tags").array(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Quizzes
export const quizzes = pgTable("quizzes", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: varchar("title").notNull(),
  description: text("description"),
  contentId: varchar("content_id").references(() => content.id),
  courseId: varchar("course_id").references(() => courses.id),
  difficulty: difficultyEnum("difficulty").default('beginner'),
  timeLimit: integer("time_limit"), // In minutes
  passingScore: integer("passing_score").default(70), // Percentage
  status: quizStatusEnum("status").default('draft'),
  createdBy: varchar("created_by").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Quiz questions
export const quizQuestions = pgTable("quiz_questions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  quizId: varchar("quiz_id").references(() => quizzes.id, { onDelete: 'cascade' }),
  question: text("question").notNull(),
  options: jsonb("options").notNull(), // Array of options
  correctAnswer: integer("correct_answer").notNull(), // Index of correct option
  points: integer("points").default(1),
  order: integer("order").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

// Quiz attempts
export const quizAttempts = pgTable("quiz_attempts", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id, { onDelete: 'cascade' }),
  quizId: varchar("quiz_id").references(() => quizzes.id, { onDelete: 'cascade' }),
  score: decimal("score", { precision: 5, scale: 2 }),
  maxScore: integer("max_score"),
  percentage: decimal("percentage", { precision: 5, scale: 2 }),
  answers: jsonb("answers"), // User's answers
  timeSpent: integer("time_spent"), // In seconds
  startedAt: timestamp("started_at").defaultNow(),
  completedAt: timestamp("completed_at"),
});

// Ratings and reviews
export const reviews = pgTable("reviews", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id, { onDelete: 'cascade' }),
  contentId: varchar("content_id").references(() => content.id, { onDelete: 'cascade' }),
  courseId: varchar("course_id").references(() => courses.id, { onDelete: 'cascade' }),
  rating: integer("rating").notNull(), // 1-5 stars
  review: text("review"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Study planner sessions
export const studySessions = pgTable("study_sessions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id, { onDelete: 'cascade' }),
  title: varchar("title").notNull(),
  description: text("description"),
  contentId: varchar("content_id").references(() => content.id),
  courseId: varchar("course_id").references(() => courses.id),
  scheduledAt: timestamp("scheduled_at").notNull(),
  duration: integer("duration"), // In minutes
  completed: boolean("completed").default(false),
  completedAt: timestamp("completed_at"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  content: many(content),
  courses: many(courses),
  enrollments: many(enrollments),
  progress: many(progress),
  notes: many(notes),
  quizzes: many(quizzes),
  quizAttempts: many(quizAttempts),
  reviews: many(reviews),
  studySessions: many(studySessions),
}));

export const contentRelations = relations(content, ({ one, many }) => ({
  uploadedBy: one(users, {
    fields: [content.uploadedBy],
    references: [users.id],
  }),
  courseContent: many(courseContent),
  progress: many(progress),
  notes: many(notes),
  quizzes: many(quizzes),
  reviews: many(reviews),
  studySessions: many(studySessions),
}));

export const coursesRelations = relations(courses, ({ one, many }) => ({
  createdBy: one(users, {
    fields: [courses.createdBy],
    references: [users.id],
  }),
  courseContent: many(courseContent),
  enrollments: many(enrollments),
  quizzes: many(quizzes),
  reviews: many(reviews),
  studySessions: many(studySessions),
}));

export const courseContentRelations = relations(courseContent, ({ one }) => ({
  course: one(courses, {
    fields: [courseContent.courseId],
    references: [courses.id],
  }),
  content: one(content, {
    fields: [courseContent.contentId],
    references: [content.id],
  }),
}));

export const enrollmentsRelations = relations(enrollments, ({ one }) => ({
  user: one(users, {
    fields: [enrollments.userId],
    references: [users.id],
  }),
  course: one(courses, {
    fields: [enrollments.courseId],
    references: [courses.id],
  }),
}));

export const progressRelations = relations(progress, ({ one }) => ({
  user: one(users, {
    fields: [progress.userId],
    references: [users.id],
  }),
  content: one(content, {
    fields: [progress.contentId],
    references: [content.id],
  }),
}));

export const notesRelations = relations(notes, ({ one }) => ({
  user: one(users, {
    fields: [notes.userId],
    references: [users.id],
  }),
  content: one(content, {
    fields: [notes.contentId],
    references: [content.id],
  }),
}));

export const quizzesRelations = relations(quizzes, ({ one, many }) => ({
  content: one(content, {
    fields: [quizzes.contentId],
    references: [content.id],
  }),
  course: one(courses, {
    fields: [quizzes.courseId],
    references: [courses.id],
  }),
  createdBy: one(users, {
    fields: [quizzes.createdBy],
    references: [users.id],
  }),
  questions: many(quizQuestions),
  attempts: many(quizAttempts),
}));

export const quizQuestionsRelations = relations(quizQuestions, ({ one }) => ({
  quiz: one(quizzes, {
    fields: [quizQuestions.quizId],
    references: [quizzes.id],
  }),
}));

export const quizAttemptsRelations = relations(quizAttempts, ({ one }) => ({
  user: one(users, {
    fields: [quizAttempts.userId],
    references: [users.id],
  }),
  quiz: one(quizzes, {
    fields: [quizAttempts.quizId],
    references: [quizzes.id],
  }),
}));

export const reviewsRelations = relations(reviews, ({ one }) => ({
  user: one(users, {
    fields: [reviews.userId],
    references: [users.id],
  }),
  content: one(content, {
    fields: [reviews.contentId],
    references: [content.id],
  }),
  course: one(courses, {
    fields: [reviews.courseId],
    references: [courses.id],
  }),
}));

export const studySessionsRelations = relations(studySessions, ({ one }) => ({
  user: one(users, {
    fields: [studySessions.userId],
    references: [users.id],
  }),
  content: one(content, {
    fields: [studySessions.contentId],
    references: [content.id],
  }),
  course: one(courses, {
    fields: [studySessions.courseId],
    references: [courses.id],
  }),
}));

// Insert schemas
export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertContentSchema = createInsertSchema(content).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertCourseSchema = createInsertSchema(courses).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertEnrollmentSchema = createInsertSchema(enrollments).omit({
  id: true,
  enrolledAt: true,
});

export const insertProgressSchema = createInsertSchema(progress).omit({
  id: true,
  lastAccessed: true,
});

export const insertNoteSchema = createInsertSchema(notes).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertQuizSchema = createInsertSchema(quizzes).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertQuizQuestionSchema = createInsertSchema(quizQuestions).omit({
  id: true,
  createdAt: true,
});

export const insertQuizAttemptSchema = createInsertSchema(quizAttempts).omit({
  id: true,
  startedAt: true,
});

export const insertReviewSchema = createInsertSchema(reviews).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertStudySessionSchema = createInsertSchema(studySessions).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

// Types
export type UpsertUser = typeof users.$inferInsert;
export type User = typeof users.$inferSelect;
export type InsertContent = z.infer<typeof insertContentSchema>;
export type Content = typeof content.$inferSelect;
export type InsertCourse = z.infer<typeof insertCourseSchema>;
export type Course = typeof courses.$inferSelect;
export type InsertEnrollment = z.infer<typeof insertEnrollmentSchema>;
export type Enrollment = typeof enrollments.$inferSelect;
export type InsertProgress = z.infer<typeof insertProgressSchema>;
export type Progress = typeof progress.$inferSelect;
export type InsertNote = z.infer<typeof insertNoteSchema>;
export type Note = typeof notes.$inferSelect;
export type InsertQuiz = z.infer<typeof insertQuizSchema>;
export type Quiz = typeof quizzes.$inferSelect;
export type InsertQuizQuestion = z.infer<typeof insertQuizQuestionSchema>;
export type QuizQuestion = typeof quizQuestions.$inferSelect;
export type InsertQuizAttempt = z.infer<typeof insertQuizAttemptSchema>;
export type QuizAttempt = typeof quizAttempts.$inferSelect;
export type InsertReview = z.infer<typeof insertReviewSchema>;
export type Review = typeof reviews.$inferSelect;
export type InsertStudySession = z.infer<typeof insertStudySessionSchema>;
export type StudySession = typeof studySessions.$inferSelect;
