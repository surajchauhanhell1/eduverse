import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Navbar } from "@/components/layout/navbar";
import { Sidebar } from "@/components/layout/sidebar";
import { CourseCard } from "@/components/course-card";
import { BookCard } from "@/components/book-card";
import { VideoCard } from "@/components/video-card";
import { NoteCard } from "@/components/note-card";
import { QuizCard } from "@/components/quiz-card";

export default function StudentDashboard() {
  const { user } = useAuth();

  const { data: userStats } = useQuery({
    queryKey: ["/api/stats/user"],
  });

  const { data: enrollments } = useQuery({
    queryKey: ["/api/enrollments"],
  });

  const { data: featuredContent } = useQuery({
    queryKey: ["/api/content/featured"],
  });

  const { data: recentNotes } = useQuery({
    queryKey: ["/api/notes"],
  });

  const { data: availableQuizzes } = useQuery({
    queryKey: ["/api/quizzes"],
  });

  const { data: studySessions } = useQuery({
    queryKey: ["/api/study-sessions"],
  });

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="flex">
        <Sidebar userRole="student" />
        <main className="flex-1 lg:ml-64 p-6">
          {/* Welcome Section */}
          <section className="mb-8">
            <div className="bg-gradient-to-r from-primary to-secondary rounded-xl p-8 text-white relative overflow-hidden">
              <div className="relative z-10">
                <h1 className="text-3xl font-bold mb-2">
                  Welcome back, {user?.firstName || 'Student'}! 👋
                </h1>
                <p className="text-blue-100 text-lg mb-4">
                  Continue your learning journey. You're making great progress!
                </p>
                <div className="flex flex-wrap gap-4 mt-6">
                  <div className="bg-white/20 backdrop-blur-sm rounded-lg px-4 py-3">
                    <p className="text-xs text-blue-100">Courses Enrolled</p>
                    <p className="text-2xl font-bold">{enrollments?.length || 0}</p>
                  </div>
                  <div className="bg-white/20 backdrop-blur-sm rounded-lg px-4 py-3">
                    <p className="text-xs text-blue-100">Study Time</p>
                    <p className="text-2xl font-bold">{userStats?.totalStudyTime || 0}h</p>
                  </div>
                  <div className="bg-white/20 backdrop-blur-sm rounded-lg px-4 py-3">
                    <p className="text-xs text-blue-100">Notes Created</p>
                    <p className="text-2xl font-bold">{userStats?.notesCount || 0}</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Quick Actions */}
          <section className="mb-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Button variant="outline" className="h-20 flex flex-col gap-2" asChild>
                <a href="/library">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  Browse Library
                </a>
              </Button>
              <Button variant="outline" className="h-20 flex flex-col gap-2" asChild>
                <a href="/notes">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  My Notes
                </a>
              </Button>
              <Button variant="outline" className="h-20 flex flex-col gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Take Quiz
              </Button>
              <Button variant="outline" className="h-20 flex flex-col gap-2" asChild>
                <a href="/planner">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  Study Planner
                </a>
              </Button>
            </div>
          </section>

          {/* Continue Learning */}
          <section className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold text-foreground">Continue Learning</h2>
              <Button variant="ghost" asChild>
                <a href="/library">View All →</a>
              </Button>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {enrollments?.slice(0, 3).map((enrollment: any) => (
                <CourseCard
                  key={enrollment.id}
                  course={enrollment.course}
                  progress={parseFloat(enrollment.progress)}
                />
              ))}
            </div>
          </section>

          {/* Featured Content */}
          <section className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold text-foreground">Featured Content</h2>
              <Button variant="ghost" asChild>
                <a href="/library">Explore All →</a>
              </Button>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredContent?.slice(0, 6).map((content: any) => {
                if (content.type === 'book') {
                  return <BookCard key={content.id} book={content} />;
                } else if (content.type === 'video') {
                  return <VideoCard key={content.id} video={content} />;
                }
                return null;
              })}
            </div>
          </section>

          {/* Recent Activity & Upcoming */}
          <div className="grid lg:grid-cols-2 gap-6 mb-8">
            {/* Recent Notes */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold text-foreground">Recent Notes</h2>
                <Button variant="ghost" asChild>
                  <a href="/notes">View All →</a>
                </Button>
              </div>
              <div className="space-y-4">
                {recentNotes?.slice(0, 3).map((note: any) => (
                  <NoteCard key={note.id} note={note} compact />
                ))}
              </div>
            </div>

            {/* Today's Schedule */}
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-4">Today's Schedule</h2>
              <Card className="p-5">
                <div className="space-y-3">
                  {studySessions?.slice(0, 3).map((session: any) => (
                    <div key={session.id} className="flex gap-3 items-start p-3 bg-primary/5 border-l-4 border-primary rounded-r-lg">
                      <div className="text-xs font-semibold text-primary min-w-[60px]">
                        {new Date(session.scheduledAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-sm text-foreground">{session.title}</p>
                        <p className="text-xs text-muted-foreground">{session.duration} minutes</p>
                      </div>
                    </div>
                  ))}
                </div>
                <Button variant="outline" className="w-full mt-4" asChild>
                  <a href="/planner">View Full Calendar</a>
                </Button>
              </Card>
            </div>
          </div>

          {/* Available Quizzes */}
          <section className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold text-foreground">Available Quizzes</h2>
              <Button variant="ghost">View All →</Button>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {availableQuizzes?.slice(0, 3).map((quiz: any) => (
                <QuizCard key={quiz.id} quiz={quiz} />
              ))}
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
