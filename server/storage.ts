import {
  users,
  content,
  courses,
  courseContent,
  enrollments,
  progress,
  notes,
  quizzes,
  quizQuestions,
  quizAttempts,
  reviews,
  studySessions,
  type User,
  type NewUser,
  type Content,
  type NewContent,
  type Course,
  type NewCourse,
  type Enrollment,
  type NewEnrollment,
  type Progress,
  type NewProgress,
  type Note,
  type NewNote,
  type Quiz,
  type NewQuiz,
  type QuizQuestion,
  type NewQuizQuestion,
  type QuizAttempt,
  type NewQuizAttempt,
  type Review,
  type NewReview,
  type StudySession,
  type NewStudySession,
} from "@shared/schema-sqlite";

// Type aliases for compatibility
type UpsertUser = NewUser;
type InsertContent = NewContent;
type InsertCourse = NewCourse;
type InsertEnrollment = NewEnrollment;
type InsertProgress = NewProgress;
type InsertNote = NewNote;
type InsertQuiz = NewQuiz;
type InsertQuizQuestion = NewQuizQuestion;
type InsertQuizAttempt = NewQuizAttempt;
type InsertReview = NewReview;
type InsertStudySession = NewStudySession;
import { db } from "./db";
import { eq, desc, and, sql, ilike, inArray } from "drizzle-orm";
import { randomUUID } from "crypto";

// Utility function to generate IDs for SQLite
function generateId(): string {
  return randomUUID();
}

// Utility function to get current timestamp for SQLite
function getCurrentTimestamp(): number {
  return Math.floor(Date.now() / 1000);
}

export interface IStorage {
  // User operations (required for Replit Auth)
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;

  // Content operations
  createContent(contentData: InsertContent): Promise<Content>;
  getContent(id: string): Promise<Content | undefined>;
  getAllContent(filters?: { type?: string; subject?: string; search?: string }): Promise<Content[]>;
  updateContent(id: string, updates: Partial<InsertContent>): Promise<Content>;
  deleteContent(id: string): Promise<void>;
  getFeaturedContent(): Promise<Content[]>;

  // Course operations
  createCourse(courseData: InsertCourse): Promise<Course>;
  getCourse(id: string): Promise<Course | undefined>;
  getAllCourses(): Promise<Course[]>;
  addContentToCourse(courseId: string, contentId: string, order: number): Promise<void>;
  getCourseContent(courseId: string): Promise<Content[]>;
  updateCourse(id: string, updates: Partial<InsertCourse>): Promise<Course>;
  deleteCourse(id: string): Promise<void>;

  // Enrollment operations
  enrollUser(userId: string, courseId: string): Promise<Enrollment>;
  getUserEnrollments(userId: string): Promise<(Enrollment & { course: Course })[]>;
  updateEnrollmentProgress(userId: string, courseId: string, progress: number): Promise<void>;

  // Progress tracking
  updateProgress(userId: string, contentId: string, progressData: Partial<InsertProgress>): Promise<Progress>;
  getUserProgress(userId: string, contentId?: string): Promise<Progress[]>;
  getUserCourseProgress(userId: string, courseId: string): Promise<number>;

  // Notes operations
  createNote(noteData: InsertNote): Promise<Note>;
  getUserNotes(userId: string, contentId?: string): Promise<Note[]>;
  updateNote(id: string, updates: Partial<InsertNote>): Promise<Note>;
  deleteNote(id: string): Promise<void>;

  // Quiz operations
  createQuiz(quizData: InsertQuiz): Promise<Quiz>;
  addQuizQuestion(questionData: InsertQuizQuestion): Promise<QuizQuestion>;
  getQuiz(id: string): Promise<(Quiz & { questions: QuizQuestion[] }) | undefined>;
  getAllQuizzes(contentId?: string, courseId?: string): Promise<Quiz[]>;
  getUserQuizzes(userId: string): Promise<Quiz[]>;
  startQuizAttempt(userId: string, quizId: string): Promise<QuizAttempt>;
  submitQuizAttempt(attemptId: string, answers: any, score: number, percentage: number): Promise<QuizAttempt>;
  getUserQuizAttempts(userId: string, quizId?: string): Promise<QuizAttempt[]>;
  updateQuiz(id: string, updates: Partial<InsertQuiz>): Promise<Quiz>;
  deleteQuiz(id: string): Promise<void>;

  // Review operations
  createReview(reviewData: InsertReview): Promise<Review>;
  getContentReviews(contentId: string): Promise<(Review & { user: Pick<User, 'firstName' | 'lastName'> })[]>;
  getCourseReviews(courseId: string): Promise<(Review & { user: Pick<User, 'firstName' | 'lastName'> })[]>;
  getUserReview(userId: string, contentId?: string, courseId?: string): Promise<Review | undefined>;
  updateReview(id: string, updates: Partial<InsertReview>): Promise<Review>;
  deleteReview(id: string): Promise<void>;

  // Study planner operations
  createStudySession(sessionData: InsertStudySession): Promise<StudySession>;
  getUserStudySessions(userId: string, fromDate?: Date, toDate?: Date): Promise<StudySession[]>;
  updateStudySession(id: string, updates: Partial<InsertStudySession>): Promise<StudySession>;
  deleteStudySession(id: string): Promise<void>;

  // Analytics and dashboard
  getUserStats(userId: string): Promise<{
    totalEnrollments: number;
    completedCourses: number;
    totalStudyTime: number;
    averageQuizScore: number;
    notesCount: number;
  }>;
  getAdminStats(): Promise<{
    totalStudents: number;
    totalContent: number;
    totalCourses: number;
    totalQuizzes: number;
  }>;

  // Search functionality
  searchContent(query: string, filters?: { type?: string; subject?: string }): Promise<Content[]>;
}

export class DatabaseStorage implements IStorage {
  // User operations (required for Replit Auth)
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    // For SQLite, we need to handle upsert manually
    const existingUser = await this.getUser(userData.id!);
    
    if (existingUser) {
      // Update existing user
      const [user] = await db
        .update(users)
        .set({
          ...userData,
          updatedAt: getCurrentTimestamp(),
        })
        .where(eq(users.id, userData.id!))
        .returning();
      return user;
    } else {
      // Insert new user
      const userToInsert = {
        ...userData,
        id: userData.id || generateId(),
        createdAt: getCurrentTimestamp(),
        updatedAt: getCurrentTimestamp(),
      };
      
      const [user] = await db
        .insert(users)
        .values(userToInsert)
        .returning();
      return user;
    }
  }

  // Content operations
  async createContent(contentData: InsertContent): Promise<Content> {
    const [newContent] = await db.insert(content).values(contentData).returning();
    return newContent;
  }

  async getContent(id: string): Promise<Content | undefined> {
    const [contentItem] = await db.select().from(content).where(eq(content.id, id));
    return contentItem;
  }

  async getAllContent(filters?: { type?: string; subject?: string; search?: string }): Promise<Content[]> {
    let query = db.select().from(content);
    
    const conditions = [];
    if (filters?.type) {
      conditions.push(eq(content.type, filters.type as any));
    }
    if (filters?.subject) {
      conditions.push(eq(content.subject, filters.subject));
    }
    if (filters?.search) {
      conditions.push(
        sql`${content.title} ILIKE ${'%' + filters.search + '%'} OR ${content.description} ILIKE ${'%' + filters.search + '%'} OR ${content.author} ILIKE ${'%' + filters.search + '%'}`
      );
    }

    if (conditions.length > 0) {
      query = query.where(and(...conditions));
    }

    return await query.orderBy(desc(content.createdAt));
  }

  async updateContent(id: string, updates: Partial<InsertContent>): Promise<Content> {
    const [updated] = await db
      .update(content)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(content.id, id))
      .returning();
    return updated;
  }

  async deleteContent(id: string): Promise<void> {
    await db.delete(content).where(eq(content.id, id));
  }

  async getFeaturedContent(): Promise<Content[]> {
    return await db
      .select()
      .from(content)
      .where(eq(content.featured, true))
      .orderBy(desc(content.createdAt))
      .limit(10);
  }

  // Course operations
  async createCourse(courseData: InsertCourse): Promise<Course> {
    const [newCourse] = await db.insert(courses).values(courseData).returning();
    return newCourse;
  }

  async getCourse(id: string): Promise<Course | undefined> {
    const [course] = await db.select().from(courses).where(eq(courses.id, id));
    return course;
  }

  async getAllCourses(): Promise<Course[]> {
    return await db.select().from(courses).orderBy(desc(courses.createdAt));
  }

  async addContentToCourse(courseId: string, contentId: string, order: number): Promise<void> {
    await db.insert(courseContent).values({
      courseId,
      contentId,
      order,
    });
  }

  async getCourseContent(courseId: string): Promise<Content[]> {
    const result = await db
      .select({ content })
      .from(courseContent)
      .innerJoin(content, eq(courseContent.contentId, content.id))
      .where(eq(courseContent.courseId, courseId))
      .orderBy(courseContent.order);

    return result.map(r => r.content);
  }

  async updateCourse(id: string, updates: Partial<InsertCourse>): Promise<Course> {
    const [updated] = await db
      .update(courses)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(courses.id, id))
      .returning();
    return updated;
  }

  async deleteCourse(id: string): Promise<void> {
    await db.delete(courses).where(eq(courses.id, id));
  }

  // Enrollment operations
  async enrollUser(userId: string, courseId: string): Promise<Enrollment> {
    const [enrollment] = await db.insert(enrollments).values({
      userId,
      courseId,
    }).returning();
    return enrollment;
  }

  async getUserEnrollments(userId: string): Promise<(Enrollment & { course: Course })[]> {
    const result = await db
      .select()
      .from(enrollments)
      .innerJoin(courses, eq(enrollments.courseId, courses.id))
      .where(eq(enrollments.userId, userId))
      .orderBy(desc(enrollments.enrolledAt));

    return result.map(r => ({
      ...r.enrollments,
      course: r.courses,
    }));
  }

  async updateEnrollmentProgress(userId: string, courseId: string, progressValue: number): Promise<void> {
    await db
      .update(enrollments)
      .set({ 
        progress: progressValue.toString(),
        ...(progressValue >= 100 ? { completedAt: new Date() } : {})
      })
      .where(and(eq(enrollments.userId, userId), eq(enrollments.courseId, courseId)));
  }

  // Progress tracking
  async updateProgress(userId: string, contentId: string, progressData: Partial<InsertProgress>): Promise<Progress> {
    const [existingProgress] = await db
      .select()
      .from(progress)
      .where(and(eq(progress.userId, userId), eq(progress.contentId, contentId)));

    if (existingProgress) {
      const [updated] = await db
        .update(progress)
        .set({ 
          ...progressData,
          lastAccessed: new Date(),
          ...(progressData.completed ? { completedAt: new Date() } : {})
        })
        .where(eq(progress.id, existingProgress.id))
        .returning();
      return updated;
    } else {
      const [newProgress] = await db
        .insert(progress)
        .values({
          userId,
          contentId,
          ...progressData,
          ...(progressData.completed ? { completedAt: new Date() } : {})
        })
        .returning();
      return newProgress;
    }
  }

  async getUserProgress(userId: string, contentId?: string): Promise<Progress[]> {
    let query = db.select().from(progress).where(eq(progress.userId, userId));
    
    if (contentId) {
      query = query.where(and(eq(progress.userId, userId), eq(progress.contentId, contentId)));
    }

    return await query.orderBy(desc(progress.lastAccessed));
  }

  async getUserCourseProgress(userId: string, courseId: string): Promise<number> {
    const courseContentItems = await this.getCourseContent(courseId);
    if (courseContentItems.length === 0) return 0;

    const progressItems = await db
      .select()
      .from(progress)
      .where(
        and(
          eq(progress.userId, userId),
          inArray(progress.contentId, courseContentItems.map(c => c.id))
        )
      );

    const totalProgress = progressItems.reduce((sum, p) => sum + parseFloat(p.progress || '0'), 0);
    return totalProgress / courseContentItems.length;
  }

  // Notes operations
  async createNote(noteData: InsertNote): Promise<Note> {
    const [note] = await db.insert(notes).values(noteData).returning();
    return note;
  }

  async getUserNotes(userId: string, contentId?: string): Promise<Note[]> {
    let query = db.select().from(notes).where(eq(notes.userId, userId));
    
    if (contentId) {
      query = query.where(and(eq(notes.userId, userId), eq(notes.contentId, contentId)));
    }

    return await query.orderBy(desc(notes.updatedAt));
  }

  async updateNote(id: string, updates: Partial<InsertNote>): Promise<Note> {
    const [updated] = await db
      .update(notes)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(notes.id, id))
      .returning();
    return updated;
  }

  async deleteNote(id: string): Promise<void> {
    await db.delete(notes).where(eq(notes.id, id));
  }

  // Quiz operations
  async createQuiz(quizData: InsertQuiz): Promise<Quiz> {
    const [quiz] = await db.insert(quizzes).values(quizData).returning();
    return quiz;
  }

  async addQuizQuestion(questionData: InsertQuizQuestion): Promise<QuizQuestion> {
    const [question] = await db.insert(quizQuestions).values(questionData).returning();
    return question;
  }

  async getQuiz(id: string): Promise<(Quiz & { questions: QuizQuestion[] }) | undefined> {
    const [quiz] = await db.select().from(quizzes).where(eq(quizzes.id, id));
    if (!quiz) return undefined;

    const questions = await db
      .select()
      .from(quizQuestions)
      .where(eq(quizQuestions.quizId, id))
      .orderBy(quizQuestions.order);

    return { ...quiz, questions };
  }

  async getAllQuizzes(contentId?: string, courseId?: string): Promise<Quiz[]> {
    let query = db.select().from(quizzes);
    
    const conditions = [];
    if (contentId) {
      conditions.push(eq(quizzes.contentId, contentId));
    }
    if (courseId) {
      conditions.push(eq(quizzes.courseId, courseId));
    }

    if (conditions.length > 0) {
      query = query.where(and(...conditions));
    }

    return await query.orderBy(desc(quizzes.createdAt));
  }

  async getUserQuizzes(userId: string): Promise<Quiz[]> {
    // Get quizzes for content the user has access to through enrollments
    const userEnrollments = await this.getUserEnrollments(userId);
    const courseIds = userEnrollments.map(e => e.courseId);

    if (courseIds.length === 0) return [];

    return await db
      .select()
      .from(quizzes)
      .where(inArray(quizzes.courseId, courseIds))
      .orderBy(desc(quizzes.createdAt));
  }

  async startQuizAttempt(userId: string, quizId: string): Promise<QuizAttempt> {
    const [attempt] = await db.insert(quizAttempts).values({
      userId,
      quizId,
    }).returning();
    return attempt;
  }

  async submitQuizAttempt(attemptId: string, answers: any, score: number, percentage: number): Promise<QuizAttempt> {
    const [updated] = await db
      .update(quizAttempts)
      .set({
        answers,
        score: score.toString(),
        percentage: percentage.toString(),
        completedAt: new Date(),
      })
      .where(eq(quizAttempts.id, attemptId))
      .returning();
    return updated;
  }

  async getUserQuizAttempts(userId: string, quizId?: string): Promise<QuizAttempt[]> {
    let query = db.select().from(quizAttempts).where(eq(quizAttempts.userId, userId));
    
    if (quizId) {
      query = query.where(and(eq(quizAttempts.userId, userId), eq(quizAttempts.quizId, quizId)));
    }

    return await query.orderBy(desc(quizAttempts.startedAt));
  }

  async updateQuiz(id: string, updates: Partial<InsertQuiz>): Promise<Quiz> {
    const [updated] = await db
      .update(quizzes)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(quizzes.id, id))
      .returning();
    return updated;
  }

  async deleteQuiz(id: string): Promise<void> {
    await db.delete(quizzes).where(eq(quizzes.id, id));
  }

  // Review operations
  async createReview(reviewData: InsertReview): Promise<Review> {
    const [review] = await db.insert(reviews).values(reviewData).returning();
    return review;
  }

  async getContentReviews(contentId: string): Promise<(Review & { user: Pick<User, 'firstName' | 'lastName'> })[]> {
    const result = await db
      .select({
        review: reviews,
        user: {
          firstName: users.firstName,
          lastName: users.lastName,
        },
      })
      .from(reviews)
      .innerJoin(users, eq(reviews.userId, users.id))
      .where(eq(reviews.contentId, contentId))
      .orderBy(desc(reviews.createdAt));

    return result.map(r => ({ ...r.review, user: r.user }));
  }

  async getCourseReviews(courseId: string): Promise<(Review & { user: Pick<User, 'firstName' | 'lastName'> })[]> {
    const result = await db
      .select({
        review: reviews,
        user: {
          firstName: users.firstName,
          lastName: users.lastName,
        },
      })
      .from(reviews)
      .innerJoin(users, eq(reviews.userId, users.id))
      .where(eq(reviews.courseId, courseId))
      .orderBy(desc(reviews.createdAt));

    return result.map(r => ({ ...r.review, user: r.user }));
  }

  async getUserReview(userId: string, contentId?: string, courseId?: string): Promise<Review | undefined> {
    let query = db.select().from(reviews).where(eq(reviews.userId, userId));
    
    if (contentId) {
      query = query.where(and(eq(reviews.userId, userId), eq(reviews.contentId, contentId)));
    }
    if (courseId) {
      query = query.where(and(eq(reviews.userId, userId), eq(reviews.courseId, courseId)));
    }

    const [review] = await query;
    return review;
  }

  async updateReview(id: string, updates: Partial<InsertReview>): Promise<Review> {
    const [updated] = await db
      .update(reviews)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(reviews.id, id))
      .returning();
    return updated;
  }

  async deleteReview(id: string): Promise<void> {
    await db.delete(reviews).where(eq(reviews.id, id));
  }

  // Study planner operations
  async createStudySession(sessionData: InsertStudySession): Promise<StudySession> {
    const [session] = await db.insert(studySessions).values(sessionData).returning();
    return session;
  }

  async getUserStudySessions(userId: string, fromDate?: Date, toDate?: Date): Promise<StudySession[]> {
    let query = db.select().from(studySessions).where(eq(studySessions.userId, userId));
    
    const conditions = [eq(studySessions.userId, userId)];
    if (fromDate) {
      conditions.push(sql`${studySessions.scheduledAt} >= ${fromDate}`);
    }
    if (toDate) {
      conditions.push(sql`${studySessions.scheduledAt} <= ${toDate}`);
    }

    query = query.where(and(...conditions));

    return await query.orderBy(studySessions.scheduledAt);
  }

  async updateStudySession(id: string, updates: Partial<InsertStudySession>): Promise<StudySession> {
    const [updated] = await db
      .update(studySessions)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(studySessions.id, id))
      .returning();
    return updated;
  }

  async deleteStudySession(id: string): Promise<void> {
    await db.delete(studySessions).where(eq(studySessions.id, id));
  }

  // Analytics and dashboard
  async getUserStats(userId: string): Promise<{
    totalEnrollments: number;
    completedCourses: number;
    totalStudyTime: number;
    averageQuizScore: number;
    notesCount: number;
  }> {
    const [enrollmentCount] = await db
      .select({ count: sql<number>`count(*)` })
      .from(enrollments)
      .where(eq(enrollments.userId, userId));

    const [completedCount] = await db
      .select({ count: sql<number>`count(*)` })
      .from(enrollments)
      .where(and(eq(enrollments.userId, userId), sql`${enrollments.completedAt} IS NOT NULL`));

    const [studyTimeResult] = await db
      .select({ total: sql<number>`COALESCE(sum(${progress.timeSpent}), 0)` })
      .from(progress)
      .where(eq(progress.userId, userId));

    const [quizScoreResult] = await db
      .select({ avg: sql<number>`COALESCE(avg(${quizAttempts.percentage}), 0)` })
      .from(quizAttempts)
      .where(and(eq(quizAttempts.userId, userId), sql`${quizAttempts.completedAt} IS NOT NULL`));

    const [notesCountResult] = await db
      .select({ count: sql<number>`count(*)` })
      .from(notes)
      .where(eq(notes.userId, userId));

    return {
      totalEnrollments: enrollmentCount.count,
      completedCourses: completedCount.count,
      totalStudyTime: studyTimeResult.total,
      averageQuizScore: quizScoreResult.avg,
      notesCount: notesCountResult.count,
    };
  }

  async getAdminStats(): Promise<{
    totalStudents: number;
    totalContent: number;
    totalCourses: number;
    totalQuizzes: number;
  }> {
    const [studentCount] = await db
      .select({ count: sql<number>`count(*)` })
      .from(users)
      .where(eq(users.role, 'student'));

    const [contentCount] = await db
      .select({ count: sql<number>`count(*)` })
      .from(content);

    const [courseCount] = await db
      .select({ count: sql<number>`count(*)` })
      .from(courses);

    const [quizCount] = await db
      .select({ count: sql<number>`count(*)` })
      .from(quizzes);

    return {
      totalStudents: studentCount.count,
      totalContent: contentCount.count,
      totalCourses: courseCount.count,
      totalQuizzes: quizCount.count,
    };
  }

  // Search functionality
  async searchContent(query: string, filters?: { type?: string; subject?: string }): Promise<Content[]> {
    let dbQuery = db
      .select()
      .from(content)
      .where(
        sql`${content.title} ILIKE ${'%' + query + '%'} OR ${content.description} ILIKE ${'%' + query + '%'} OR ${content.author} ILIKE ${'%' + query + '%'} OR array_to_string(${content.tags}, ' ') ILIKE ${'%' + query + '%'}`
      );

    const conditions = [
      sql`${content.title} ILIKE ${'%' + query + '%'} OR ${content.description} ILIKE ${'%' + query + '%'} OR ${content.author} ILIKE ${'%' + query + '%'} OR array_to_string(${content.tags}, ' ') ILIKE ${'%' + query + '%'}`
    ];

    if (filters?.type) {
      conditions.push(eq(content.type, filters.type as any));
    }
    if (filters?.subject) {
      conditions.push(eq(content.subject, filters.subject));
    }

    dbQuery = dbQuery.where(and(...conditions));

    return await dbQuery.orderBy(desc(content.createdAt));
  }
}

export const storage = new DatabaseStorage();
