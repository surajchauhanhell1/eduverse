import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./replitAuth";
import multer from "multer";
import path from "path";
import fs from "fs/promises";
import { insertContentSchema, insertCourseSchema, insertNoteSchema, insertQuizSchema, insertQuizQuestionSchema, insertReviewSchema, insertStudySessionSchema } from "@shared/schema";

// Configure multer for file uploads
const upload = multer({
  dest: 'uploads/',
  limits: {
    fileSize: 500 * 1024 * 1024, // 500MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = [
      'application/pdf',
      'application/epub+zip',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'video/mp4',
      'image/jpeg',
      'image/png',
      'image/gif'
    ];
    
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type'));
    }
  }
});

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth middleware
  await setupAuth(app);

  // Auth routes
  app.get('/api/auth/user', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Content routes
  app.get('/api/content', async (req, res) => {
    try {
      const { type, subject, search } = req.query;
      const content = await storage.getAllContent({
        type: type as string,
        subject: subject as string,
        search: search as string,
      });
      res.json(content);
    } catch (error) {
      console.error("Error fetching content:", error);
      res.status(500).json({ message: "Failed to fetch content" });
    }
  });

  app.get('/api/content/featured', async (req, res) => {
    try {
      const featured = await storage.getFeaturedContent();
      res.json(featured);
    } catch (error) {
      console.error("Error fetching featured content:", error);
      res.status(500).json({ message: "Failed to fetch featured content" });
    }
  });

  app.get('/api/content/:id', async (req, res) => {
    try {
      const content = await storage.getContent(req.params.id);
      if (!content) {
        return res.status(404).json({ message: "Content not found" });
      }
      res.json(content);
    } catch (error) {
      console.error("Error fetching content:", error);
      res.status(500).json({ message: "Failed to fetch content" });
    }
  });

  app.post('/api/content', isAuthenticated, upload.single('file'), async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      
      if (!user || user.role !== 'admin') {
        return res.status(403).json({ message: "Admin access required" });
      }

      const contentData = insertContentSchema.parse({
        ...req.body,
        uploadedBy: userId,
        tags: req.body.tags ? req.body.tags.split(',').map((tag: string) => tag.trim()) : [],
      });

      if (req.file) {
        // Move file to permanent location
        const filename = `${Date.now()}-${req.file.originalname}`;
        const filepath = path.join('uploads', filename);
        await fs.rename(req.file.path, filepath);
        
        contentData.filePath = filepath;
        contentData.fileName = req.file.originalname;
        contentData.fileSize = req.file.size;
        contentData.fileType = req.file.mimetype;
      }

      const content = await storage.createContent(contentData);
      res.status(201).json(content);
    } catch (error) {
      console.error("Error creating content:", error);
      res.status(500).json({ message: "Failed to create content" });
    }
  });

  app.put('/api/content/:id', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      
      if (!user || user.role !== 'admin') {
        return res.status(403).json({ message: "Admin access required" });
      }

      const updates = {
        ...req.body,
        tags: req.body.tags ? req.body.tags.split(',').map((tag: string) => tag.trim()) : undefined,
      };

      const content = await storage.updateContent(req.params.id, updates);
      res.json(content);
    } catch (error) {
      console.error("Error updating content:", error);
      res.status(500).json({ message: "Failed to update content" });
    }
  });

  app.delete('/api/content/:id', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      
      if (!user || user.role !== 'admin') {
        return res.status(403).json({ message: "Admin access required" });
      }

      await storage.deleteContent(req.params.id);
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting content:", error);
      res.status(500).json({ message: "Failed to delete content" });
    }
  });

  // Search route
  app.get('/api/search', async (req, res) => {
    try {
      const { q, type, subject } = req.query;
      if (!q) {
        return res.status(400).json({ message: "Search query is required" });
      }

      const results = await storage.searchContent(q as string, {
        type: type as string,
        subject: subject as string,
      });
      res.json(results);
    } catch (error) {
      console.error("Error searching content:", error);
      res.status(500).json({ message: "Failed to search content" });
    }
  });

  // Course routes
  app.get('/api/courses', async (req, res) => {
    try {
      const courses = await storage.getAllCourses();
      res.json(courses);
    } catch (error) {
      console.error("Error fetching courses:", error);
      res.status(500).json({ message: "Failed to fetch courses" });
    }
  });

  app.get('/api/courses/:id', async (req, res) => {
    try {
      const course = await storage.getCourse(req.params.id);
      if (!course) {
        return res.status(404).json({ message: "Course not found" });
      }
      
      const content = await storage.getCourseContent(req.params.id);
      res.json({ ...course, content });
    } catch (error) {
      console.error("Error fetching course:", error);
      res.status(500).json({ message: "Failed to fetch course" });
    }
  });

  app.post('/api/courses', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      
      if (!user || user.role !== 'admin') {
        return res.status(403).json({ message: "Admin access required" });
      }

      const courseData = insertCourseSchema.parse({
        ...req.body,
        createdBy: userId,
      });

      const course = await storage.createCourse(courseData);
      res.status(201).json(course);
    } catch (error) {
      console.error("Error creating course:", error);
      res.status(500).json({ message: "Failed to create course" });
    }
  });

  app.post('/api/courses/:courseId/content/:contentId', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      
      if (!user || user.role !== 'admin') {
        return res.status(403).json({ message: "Admin access required" });
      }

      const { order } = req.body;
      await storage.addContentToCourse(req.params.courseId, req.params.contentId, order || 0);
      res.status(201).json({ message: "Content added to course" });
    } catch (error) {
      console.error("Error adding content to course:", error);
      res.status(500).json({ message: "Failed to add content to course" });
    }
  });

  // Enrollment routes
  app.post('/api/enrollments', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { courseId } = req.body;

      const enrollment = await storage.enrollUser(userId, courseId);
      res.status(201).json(enrollment);
    } catch (error) {
      console.error("Error enrolling user:", error);
      res.status(500).json({ message: "Failed to enroll user" });
    }
  });

  app.get('/api/enrollments', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const enrollments = await storage.getUserEnrollments(userId);
      res.json(enrollments);
    } catch (error) {
      console.error("Error fetching enrollments:", error);
      res.status(500).json({ message: "Failed to fetch enrollments" });
    }
  });

  // Progress routes
  app.post('/api/progress', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { contentId, progress: progressValue, timeSpent, completed } = req.body;

      const progress = await storage.updateProgress(userId, contentId, {
        progress: progressValue?.toString(),
        timeSpent,
        completed,
      });

      res.json(progress);
    } catch (error) {
      console.error("Error updating progress:", error);
      res.status(500).json({ message: "Failed to update progress" });
    }
  });

  app.get('/api/progress', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { contentId } = req.query;
      
      const progress = await storage.getUserProgress(userId, contentId as string);
      res.json(progress);
    } catch (error) {
      console.error("Error fetching progress:", error);
      res.status(500).json({ message: "Failed to fetch progress" });
    }
  });

  // Notes routes
  app.get('/api/notes', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { contentId } = req.query;
      
      const notes = await storage.getUserNotes(userId, contentId as string);
      res.json(notes);
    } catch (error) {
      console.error("Error fetching notes:", error);
      res.status(500).json({ message: "Failed to fetch notes" });
    }
  });

  app.post('/api/notes', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const noteData = insertNoteSchema.parse({
        ...req.body,
        userId,
        tags: req.body.tags ? req.body.tags.split(',').map((tag: string) => tag.trim()) : [],
      });

      const note = await storage.createNote(noteData);
      res.status(201).json(note);
    } catch (error) {
      console.error("Error creating note:", error);
      res.status(500).json({ message: "Failed to create note" });
    }
  });

  app.put('/api/notes/:id', isAuthenticated, async (req: any, res) => {
    try {
      const updates = {
        ...req.body,
        tags: req.body.tags ? req.body.tags.split(',').map((tag: string) => tag.trim()) : undefined,
      };

      const note = await storage.updateNote(req.params.id, updates);
      res.json(note);
    } catch (error) {
      console.error("Error updating note:", error);
      res.status(500).json({ message: "Failed to update note" });
    }
  });

  app.delete('/api/notes/:id', isAuthenticated, async (req: any, res) => {
    try {
      await storage.deleteNote(req.params.id);
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting note:", error);
      res.status(500).json({ message: "Failed to delete note" });
    }
  });

  // Quiz routes
  app.get('/api/quizzes', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { contentId, courseId } = req.query;
      
      const quizzes = await storage.getAllQuizzes(contentId as string, courseId as string);
      res.json(quizzes);
    } catch (error) {
      console.error("Error fetching quizzes:", error);
      res.status(500).json({ message: "Failed to fetch quizzes" });
    }
  });

  app.get('/api/quizzes/:id', isAuthenticated, async (req: any, res) => {
    try {
      const quiz = await storage.getQuiz(req.params.id);
      if (!quiz) {
        return res.status(404).json({ message: "Quiz not found" });
      }
      res.json(quiz);
    } catch (error) {
      console.error("Error fetching quiz:", error);
      res.status(500).json({ message: "Failed to fetch quiz" });
    }
  });

  app.post('/api/quizzes', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      
      if (!user || user.role !== 'admin') {
        return res.status(403).json({ message: "Admin access required" });
      }

      const { questions, ...quizData } = req.body;
      const quiz = await storage.createQuiz({
        ...quizData,
        createdBy: userId,
      });

      // Add questions
      if (questions && Array.isArray(questions)) {
        for (let i = 0; i < questions.length; i++) {
          await storage.addQuizQuestion({
            quizId: quiz.id,
            question: questions[i].question,
            options: questions[i].options,
            correctAnswer: questions[i].correctAnswer,
            points: questions[i].points || 1,
            order: i + 1,
          });
        }
      }

      res.status(201).json(quiz);
    } catch (error) {
      console.error("Error creating quiz:", error);
      res.status(500).json({ message: "Failed to create quiz" });
    }
  });

  app.post('/api/quizzes/:id/start', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const attempt = await storage.startQuizAttempt(userId, req.params.id);
      res.status(201).json(attempt);
    } catch (error) {
      console.error("Error starting quiz attempt:", error);
      res.status(500).json({ message: "Failed to start quiz attempt" });
    }
  });

  app.post('/api/quiz-attempts/:id/submit', isAuthenticated, async (req: any, res) => {
    try {
      const { answers, score, percentage } = req.body;
      const attempt = await storage.submitQuizAttempt(req.params.id, answers, score, percentage);
      res.json(attempt);
    } catch (error) {
      console.error("Error submitting quiz attempt:", error);
      res.status(500).json({ message: "Failed to submit quiz attempt" });
    }
  });

  app.get('/api/quiz-attempts', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { quizId } = req.query;
      
      const attempts = await storage.getUserQuizAttempts(userId, quizId as string);
      res.json(attempts);
    } catch (error) {
      console.error("Error fetching quiz attempts:", error);
      res.status(500).json({ message: "Failed to fetch quiz attempts" });
    }
  });

  // Review routes
  app.get('/api/content/:id/reviews', async (req, res) => {
    try {
      const reviews = await storage.getContentReviews(req.params.id);
      res.json(reviews);
    } catch (error) {
      console.error("Error fetching content reviews:", error);
      res.status(500).json({ message: "Failed to fetch reviews" });
    }
  });

  app.get('/api/courses/:id/reviews', async (req, res) => {
    try {
      const reviews = await storage.getCourseReviews(req.params.id);
      res.json(reviews);
    } catch (error) {
      console.error("Error fetching course reviews:", error);
      res.status(500).json({ message: "Failed to fetch reviews" });
    }
  });

  app.post('/api/reviews', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const reviewData = insertReviewSchema.parse({
        ...req.body,
        userId,
      });

      const review = await storage.createReview(reviewData);
      res.status(201).json(review);
    } catch (error) {
      console.error("Error creating review:", error);
      res.status(500).json({ message: "Failed to create review" });
    }
  });

  app.put('/api/reviews/:id', isAuthenticated, async (req: any, res) => {
    try {
      const review = await storage.updateReview(req.params.id, req.body);
      res.json(review);
    } catch (error) {
      console.error("Error updating review:", error);
      res.status(500).json({ message: "Failed to update review" });
    }
  });

  // Study planner routes
  app.get('/api/study-sessions', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { from, to } = req.query;
      
      const sessions = await storage.getUserStudySessions(
        userId,
        from ? new Date(from as string) : undefined,
        to ? new Date(to as string) : undefined
      );
      res.json(sessions);
    } catch (error) {
      console.error("Error fetching study sessions:", error);
      res.status(500).json({ message: "Failed to fetch study sessions" });
    }
  });

  app.post('/api/study-sessions', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const sessionData = insertStudySessionSchema.parse({
        ...req.body,
        userId,
      });

      const session = await storage.createStudySession(sessionData);
      res.status(201).json(session);
    } catch (error) {
      console.error("Error creating study session:", error);
      res.status(500).json({ message: "Failed to create study session" });
    }
  });

  app.put('/api/study-sessions/:id', isAuthenticated, async (req: any, res) => {
    try {
      const session = await storage.updateStudySession(req.params.id, req.body);
      res.json(session);
    } catch (error) {
      console.error("Error updating study session:", error);
      res.status(500).json({ message: "Failed to update study session" });
    }
  });

  app.delete('/api/study-sessions/:id', isAuthenticated, async (req: any, res) => {
    try {
      await storage.deleteStudySession(req.params.id);
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting study session:", error);
      res.status(500).json({ message: "Failed to delete study session" });
    }
  });

  // Analytics routes
  app.get('/api/stats/user', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const stats = await storage.getUserStats(userId);
      res.json(stats);
    } catch (error) {
      console.error("Error fetching user stats:", error);
      res.status(500).json({ message: "Failed to fetch user stats" });
    }
  });

  app.get('/api/stats/admin', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      
      if (!user || user.role !== 'admin') {
        return res.status(403).json({ message: "Admin access required" });
      }

      const stats = await storage.getAdminStats();
      res.json(stats);
    } catch (error) {
      console.error("Error fetching admin stats:", error);
      res.status(500).json({ message: "Failed to fetch admin stats" });
    }
  });

  // File download route
  app.get('/api/download/:contentId', isAuthenticated, async (req: any, res) => {
    try {
      const content = await storage.getContent(req.params.contentId);
      if (!content || !content.filePath) {
        return res.status(404).json({ message: "File not found" });
      }

      if (!content.downloadable) {
        return res.status(403).json({ message: "Download not allowed for this content" });
      }

      const filePath = path.resolve(content.filePath);
      res.download(filePath, content.fileName || 'download');
    } catch (error) {
      console.error("Error downloading file:", error);
      res.status(500).json({ message: "Failed to download file" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
