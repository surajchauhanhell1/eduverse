import { sql } from 'drizzle-orm';
import {
  index,
  text,
  sqliteTable,
  integer,
  real,
} from "drizzle-orm/sqlite-core";
import { relations } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Session storage table (required for auth)
export const sessions = sqliteTable(
  "sessions",
  {
    sid: text("sid").primaryKey(),
    sess: text("sess").notNull(), // JSON as text in SQLite
    expire: integer("expire").notNull(), // Unix timestamp
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// User storage table
export const users = sqliteTable("users", {
  id: text("id").primaryKey(),
  email: text("email").unique(),
  firstName: text("first_name"),
  lastName: text("last_name"),
  profileImageUrl: text("profile_image_url"),
  role: text("role").notNull().default('student'), // 'student' | 'admin'
  createdAt: integer("created_at").default(sql`(unixepoch())`),
  updatedAt: integer("updated_at").default(sql`(unixepoch())`),
});

// Content table for books, videos, and other materials
export const content = sqliteTable("content", {
  id: text("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description"),
  type: text("type").notNull(), // 'book' | 'video' | 'course'
  subject: text("subject").notNull(),
  difficulty: text("difficulty").notNull().default('beginner'), // 'beginner' | 'intermediate' | 'advanced'
  tags: text("tags"), // JSON array as text
  filePath: text("file_path"),
  fileName: text("file_name"),
  fileSize: integer("file_size"),
  fileType: text("file_type"),
  downloadable: integer("downloadable").default(1), // boolean as integer
  featured: integer("featured").default(0), // boolean as integer
  rating: real("rating").default(0),
  ratingCount: integer("rating_count").default(0),
  uploadedBy: text("uploaded_by").notNull(),
  createdAt: integer("created_at").default(sql`(unixepoch())`),
  updatedAt: integer("updated_at").default(sql`(unixepoch())`),
});

// Courses table
export const courses = sqliteTable("courses", {
  id: text("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description"),
  subject: text("subject").notNull(),
  difficulty: text("difficulty").notNull().default('beginner'),
  estimatedHours: integer("estimated_hours"),
  featured: integer("featured").default(0),
  rating: real("rating").default(0),
  ratingCount: integer("rating_count").default(0),
  createdBy: text("created_by").notNull(),
  createdAt: integer("created_at").default(sql`(unixepoch())`),
  updatedAt: integer("updated_at").default(sql`(unixepoch())`),
});

// Course content mapping
export const courseContent = sqliteTable("course_content", {
  id: text("id").primaryKey(),
  courseId: text("course_id").notNull(),
  contentId: text("content_id").notNull(),
  order: integer("order").notNull().default(0),
  createdAt: integer("created_at").default(sql`(unixepoch())`),
});

// User enrollments
export const enrollments = sqliteTable("enrollments", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull(),
  courseId: text("course_id").notNull(),
  enrolledAt: integer("enrolled_at").default(sql`(unixepoch())`),
  completedAt: integer("completed_at"),
  progress: real("progress").default(0),
});

// User progress tracking
export const progress = sqliteTable("progress", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull(),
  contentId: text("content_id").notNull(),
  progress: text("progress").default('0'), // percentage as string
  timeSpent: integer("time_spent").default(0), // in minutes
  completed: integer("completed").default(0), // boolean as integer
  lastAccessed: integer("last_accessed").default(sql`(unixepoch())`),
  createdAt: integer("created_at").default(sql`(unixepoch())`),
  updatedAt: integer("updated_at").default(sql`(unixepoch())`),
});

// User notes
export const notes = sqliteTable("notes", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull(),
  contentId: text("content_id"),
  courseId: text("course_id"),
  title: text("title").notNull(),
  content: text("content").notNull(),
  tags: text("tags"), // JSON array as text
  createdAt: integer("created_at").default(sql`(unixepoch())`),
  updatedAt: integer("updated_at").default(sql`(unixepoch())`),
});

// Quizzes
export const quizzes = sqliteTable("quizzes", {
  id: text("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description"),
  contentId: text("content_id"),
  courseId: text("course_id"),
  timeLimit: integer("time_limit"), // in minutes
  passingScore: integer("passing_score").default(70),
  status: text("status").notNull().default('draft'), // 'draft' | 'published'
  createdBy: text("created_by").notNull(),
  createdAt: integer("created_at").default(sql`(unixepoch())`),
  updatedAt: integer("updated_at").default(sql`(unixepoch())`),
});

// Quiz questions
export const quizQuestions = sqliteTable("quiz_questions", {
  id: text("id").primaryKey(),
  quizId: text("quiz_id").notNull(),
  question: text("question").notNull(),
  options: text("options").notNull(), // JSON array as text
  correctAnswer: text("correct_answer").notNull(),
  points: integer("points").default(1),
  order: integer("order").notNull(),
  createdAt: integer("created_at").default(sql`(unixepoch())`),
});

// Quiz attempts
export const quizAttempts = sqliteTable("quiz_attempts", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull(),
  quizId: text("quiz_id").notNull(),
  answers: text("answers"), // JSON object as text
  score: integer("score"),
  percentage: real("percentage"),
  startedAt: integer("started_at").default(sql`(unixepoch())`),
  completedAt: integer("completed_at"),
  createdAt: integer("created_at").default(sql`(unixepoch())`),
});

// Reviews
export const reviews = sqliteTable("reviews", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull(),
  contentId: text("content_id"),
  courseId: text("course_id"),
  rating: integer("rating").notNull(),
  comment: text("comment"),
  createdAt: integer("created_at").default(sql`(unixepoch())`),
  updatedAt: integer("updated_at").default(sql`(unixepoch())`),
});

// Study sessions (for planner)
export const studySessions = sqliteTable("study_sessions", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull(),
  title: text("title").notNull(),
  description: text("description"),
  contentId: text("content_id"),
  courseId: text("course_id"),
  scheduledFor: integer("scheduled_for").notNull(),
  duration: integer("duration").notNull(), // in minutes
  completed: integer("completed").default(0),
  completedAt: integer("completed_at"),
  createdAt: integer("created_at").default(sql`(unixepoch())`),
  updatedAt: integer("updated_at").default(sql`(unixepoch())`),
});

// Relations (same as PostgreSQL version but for SQLite tables)
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
  notes: many(notes),
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
  course: one(courses, {
    fields: [notes.courseId],
    references: [courses.id],
  }),
}));

export const quizzesRelations = relations(quizzes, ({ one, many }) => ({
  createdBy: one(users, {
    fields: [quizzes.createdBy],
    references: [users.id],
  }),
  content: one(content, {
    fields: [quizzes.contentId],
    references: [content.id],
  }),
  course: one(courses, {
    fields: [quizzes.courseId],
    references: [courses.id],
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

// Zod schemas for validation
export const insertUserSchema = createInsertSchema(users);
export const insertContentSchema = createInsertSchema(content);
export const insertCourseSchema = createInsertSchema(courses);
export const insertCourseContentSchema = createInsertSchema(courseContent);
export const insertEnrollmentSchema = createInsertSchema(enrollments);
export const insertProgressSchema = createInsertSchema(progress);
export const insertNoteSchema = createInsertSchema(notes);
export const insertQuizSchema = createInsertSchema(quizzes);
export const insertQuizQuestionSchema = createInsertSchema(quizQuestions);
export const insertQuizAttemptSchema = createInsertSchema(quizAttempts);
export const insertReviewSchema = createInsertSchema(reviews);
export const insertStudySessionSchema = createInsertSchema(studySessions);

// Export types
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type Content = typeof content.$inferSelect;
export type NewContent = typeof content.$inferInsert;
export type Course = typeof courses.$inferSelect;
export type NewCourse = typeof courses.$inferInsert;
export type CourseContent = typeof courseContent.$inferSelect;
export type NewCourseContent = typeof courseContent.$inferInsert;
export type Enrollment = typeof enrollments.$inferSelect;
export type NewEnrollment = typeof enrollments.$inferInsert;
export type Progress = typeof progress.$inferSelect;
export type NewProgress = typeof progress.$inferInsert;
export type Note = typeof notes.$inferSelect;
export type NewNote = typeof notes.$inferInsert;
export type Quiz = typeof quizzes.$inferSelect;
export type NewQuiz = typeof quizzes.$inferInsert;
export type QuizQuestion = typeof quizQuestions.$inferSelect;
export type NewQuizQuestion = typeof quizQuestions.$inferInsert;
export type QuizAttempt = typeof quizAttempts.$inferSelect;
export type NewQuizAttempt = typeof quizAttempts.$inferInsert;
export type Review = typeof reviews.$inferSelect;
export type NewReview = typeof reviews.$inferInsert;
export type StudySession = typeof studySessions.$inferSelect;
export type NewStudySession = typeof studySessions.$inferInsert;
