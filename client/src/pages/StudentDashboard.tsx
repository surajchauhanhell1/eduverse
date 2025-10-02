import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/hooks/useAuth";
import { Link } from "wouter";
import {
  BookOpen,
  Video,
  Brain,
  Calendar,
  Clock,
  Star,
  Download,
  Play,
  ChevronRight,
  TrendingUp,
  Award,
  Target,
} from "lucide-react";

export default function StudentDashboard() {
  const { user } = useAuth();

  const { data: enrollments } = useQuery({
    queryKey: ["/api/enrollments"],
  });

  const { data: userProgress } = useQuery({
    queryKey: ["/api/user/progress"],
  });

  const { data: studySessions } = useQuery({
    queryKey: ["/api/study-sessions", { date: new Date().toISOString().split('T')[0] }],
  });

  const { data: recentContent } = useQuery({
    queryKey: ["/api/content", { featured: true }],
  });

  const { data: recentNotes } = useQuery({
    queryKey: ["/api/notes"],
  });

  const continueItems = enrollments?.slice(0, 3) || [];
  const todaySessions = studySessions?.slice(0, 3) || [];
  const featuredContent = recentContent?.slice(0, 3) || [];
  const userNotes = recentNotes?.slice(0, 3) || [];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full bg-card border-b border-border shadow-sm">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
                <BookOpen className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-bold text-foreground">EduHub</span>
            </div>

            <nav className="hidden md:flex items-center space-x-8">
              <Link href="/dashboard" className="nav-link active text-sm font-medium text-foreground">
                Dashboard
              </Link>
              <Link href="/library" className="nav-link text-sm font-medium text-muted-foreground hover:text-foreground">
                Library
              </Link>
              <Link href="/notes" className="nav-link text-sm font-medium text-muted-foreground hover:text-foreground">
                My Notes
              </Link>
              <Link href="/progress" className="nav-link text-sm font-medium text-muted-foreground hover:text-foreground">
                Progress
              </Link>
              <Link href="/planner" className="nav-link text-sm font-medium text-muted-foreground hover:text-foreground">
                Study Planner
              </Link>
            </nav>

            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-semibold text-sm">
                  {user?.firstName?.[0] || user?.email?.[0] || "U"}
                </div>
                <div className="hidden lg:block text-sm">
                  <p className="font-medium text-foreground">{user?.firstName || "Student"}</p>
                  <p className="text-xs text-muted-foreground">Student</p>
                </div>
              </div>
              <Button variant="ghost" size="sm" onClick={() => window.location.href = "/api/logout"}>
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 lg:px-8 py-8">
        {/* Welcome Section */}
        <section className="mb-8">
          <div className="bg-gradient-to-r from-primary to-secondary rounded-xl p-8 text-white relative overflow-hidden">
            <div className="relative z-10">
              <h1 className="text-3xl font-bold mb-2">Welcome back, {user?.firstName || "Student"}! 👋</h1>
              <p className="text-blue-100 text-lg mb-4">Continue your learning journey. You're making great progress!</p>
              <div className="flex flex-wrap gap-4 mt-6">
                <div className="bg-white/20 backdrop-blur-sm rounded-lg px-4 py-3">
                  <p className="text-xs text-blue-100">Courses in Progress</p>
                  <p className="text-2xl font-bold">{userProgress?.totalEnrollments || 0}</p>
                </div>
                <div className="bg-white/20 backdrop-blur-sm rounded-lg px-4 py-3">
                  <p className="text-xs text-blue-100">Completed</p>
                  <p className="text-2xl font-bold">{userProgress?.completedCourses || 0}</p>
                </div>
                <div className="bg-white/20 backdrop-blur-sm rounded-lg px-4 py-3">
                  <p className="text-xs text-blue-100">Study Time (hrs)</p>
                  <p className="text-2xl font-bold">{Math.round((userProgress?.totalStudyTime || 0) / 60)}</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Quick Actions */}
        <section className="mb-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Link href="/library">
              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardContent className="p-4 text-center">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-3 mx-auto">
                    <BookOpen className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-semibold text-foreground mb-1">Browse Library</h3>
                  <p className="text-xs text-muted-foreground">Explore courses & books</p>
                </CardContent>
              </Card>
            </Link>

            <Link href="/notes">
              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardContent className="p-4 text-center">
                  <div className="w-12 h-12 bg-secondary/10 rounded-lg flex items-center justify-center mb-3 mx-auto">
                    <Brain className="h-6 w-6 text-secondary" />
                  </div>
                  <h3 className="font-semibold text-foreground mb-1">My Notes</h3>
                  <p className="text-xs text-muted-foreground">Review your notes</p>
                </CardContent>
              </Card>
            </Link>

            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardContent className="p-4 text-center">
                <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mb-3 mx-auto">
                  <Award className="h-6 w-6 text-accent" />
                </div>
                <h3 className="font-semibold text-foreground mb-1">Take Quiz</h3>
                <p className="text-xs text-muted-foreground">Test your knowledge</p>
              </CardContent>
            </Card>

            <Link href="/planner">
              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardContent className="p-4 text-center">
                  <div className="w-12 h-12 bg-success/10 rounded-lg flex items-center justify-center mb-3 mx-auto">
                    <Calendar className="h-6 w-6 text-success" />
                  </div>
                  <h3 className="font-semibold text-foreground mb-1">Study Planner</h3>
                  <p className="text-xs text-muted-foreground">Plan your schedule</p>
                </CardContent>
              </Card>
            </Link>
          </div>
        </section>

        {/* Continue Learning */}
        <section className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-foreground">Continue Learning</h2>
            <Link href="/library">
              <Button variant="ghost" size="sm">
                View All <ChevronRight className="ml-1 h-4 w-4" />
              </Button>
            </Link>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {continueItems.map((enrollment: any) => (
              <Card key={enrollment.id} className="overflow-hidden card-hover cursor-pointer">
                <div className="aspect-video bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                  <Play className="h-12 w-12 text-primary" />
                </div>
                <CardContent className="p-5">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="secondary">{enrollment.content?.type || "Course"}</Badge>
                    <span className="text-xs text-muted-foreground">
                      {Math.round(Number(enrollment.progress) || 0)}% Complete
                    </span>
                  </div>
                  <h3 className="font-semibold text-lg text-foreground mb-2">
                    {enrollment.content?.title || "Course Title"}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    {enrollment.content?.instructor || "Instructor"}
                  </p>

                  <div className="mb-4">
                    <Progress value={Number(enrollment.progress) || 0} className="h-2" />
                  </div>

                  <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
                    <span className="flex items-center gap-1">
                      <BookOpen className="h-4 w-4" />
                      {enrollment.content?.duration || 0} min
                    </span>
                    <div className="flex items-center gap-1 text-amber-500">
                      <Star className="h-4 w-4" />
                      <span>{enrollment.content?.rating || "4.5"}</span>
                    </div>
                  </div>

                  <Link href={`/content/${enrollment.content?.id}`}>
                    <Button className="w-full">Continue Learning</Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-3 gap-6 mb-8">
          {/* Recent Books */}
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold text-foreground">Featured Content</h2>
              <Link href="/library">
                <Button variant="ghost" size="sm">
                  Browse All <ChevronRight className="ml-1 h-4 w-4" />
                </Button>
              </Link>
            </div>

            <div className="space-y-4">
              {featuredContent.map((content: any) => (
                <Card key={content.id} className="card-hover">
                  <CardContent className="p-4 flex gap-4">
                    <div className="w-20 h-28 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-lg flex items-center justify-center flex-shrink-0">
                      {content.type === "video" ? (
                        <Video className="h-8 w-8 text-primary" />
                      ) : (
                        <BookOpen className="h-8 w-8 text-primary" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <h3 className="font-semibold text-foreground mb-1">{content.title}</h3>
                          <p className="text-sm text-muted-foreground">{content.author || content.instructor}</p>
                        </div>
                        <div className="flex items-center gap-1 text-amber-500">
                          <Star className="h-4 w-4" />
                          <span className="text-sm font-medium">{content.rating || "4.5"}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 text-xs text-muted-foreground mb-3">
                        <Badge variant="outline">{content.type}</Badge>
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {content.duration || "30"} min
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Link href={`/content/${content.id}`}>
                          <Button size="sm">
                            {content.type === "video" ? "Watch" : "Read"}
                          </Button>
                        </Link>
                        <Button size="sm" variant="outline">
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Today's Schedule */}
          <div>
            <h2 className="text-2xl font-bold text-foreground mb-4">Today's Schedule</h2>
            <Card>
              <CardContent className="p-5">
                <div className="text-center flex-1 mb-4">
                  <p className="text-sm text-muted-foreground">Today</p>
                  <p className="text-2xl font-bold text-foreground">
                    {new Date().getDate()}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {new Date().toLocaleDateString("en-US", { month: "short" })}
                  </p>
                </div>

                <div className="space-y-3">
                  {todaySessions.length > 0 ? (
                    todaySessions.map((session: any) => (
                      <div key={session.id} className="flex gap-3 items-start p-3 bg-primary/5 border-l-4 border-primary rounded-r-lg">
                        <div className="text-xs font-semibold text-primary min-w-[60px]">
                          {new Date(session.scheduledAt).toLocaleTimeString("en-US", {
                            hour: "numeric",
                            minute: "2-digit",
                          })}
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-sm text-foreground">{session.title}</p>
                          <p className="text-xs text-muted-foreground">{session.duration} minutes</p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      <Calendar className="h-12 w-12 mx-auto mb-3 opacity-50" />
                      <p className="text-sm">No sessions scheduled for today</p>
                    </div>
                  )}
                </div>

                <Link href="/planner">
                  <Button variant="outline" className="w-full mt-4">
                    View Full Calendar
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Weekly Progress */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="text-lg">This Week</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex items-center justify-between text-sm mb-2">
                    <span className="text-muted-foreground">Study Time</span>
                    <span className="font-semibold text-foreground">
                      {Math.round((userProgress?.totalStudyTime || 0) / 60)}h
                    </span>
                  </div>
                  <Progress value={74} className="h-2" />
                  <p className="text-xs text-muted-foreground mt-1">Goal: 25 hours</p>
                </div>

                <div>
                  <div className="flex items-center justify-between text-sm mb-2">
                    <span className="text-muted-foreground">Quiz Score Avg</span>
                    <span className="font-semibold text-foreground">
                      {Math.round(userProgress?.averageQuizScore || 0)}%
                    </span>
                  </div>
                  <Progress value={userProgress?.averageQuizScore || 0} className="h-2" />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Recent Notes */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-foreground">Recent Notes</h2>
            <div className="flex gap-2">
              <Link href="/notes">
                <Button size="sm">
                  New Note
                </Button>
              </Link>
              <Link href="/notes">
                <Button variant="outline" size="sm">
                  View All
                </Button>
              </Link>
            </div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {userNotes.map((note: any) => (
              <Card key={note.id} className="card-hover cursor-pointer border-l-4 border-l-primary">
                <CardContent className="p-5">
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="font-semibold text-foreground">{note.title}</h3>
                    <Button variant="ghost" size="sm">
                      <Brain className="h-4 w-4" />
                    </Button>
                  </div>
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
                    {note.content}
                  </p>
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Target className="h-3 w-3" />
                      {note.content?.title || "General"}
                    </span>
                    <span>{new Date(note.updatedAt).toLocaleDateString()}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
