import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/useAuth";
import { Link } from "wouter";
import {
  BookOpen,
  Video,
  Users,
  BarChart3,
  Plus,
  Upload,
  FileText,
  Star,
  TrendingUp,
  Clock,
  Award,
} from "lucide-react";

export default function AdminDashboard() {
  const { user } = useAuth();

  const { data: adminStats } = useQuery({
    queryKey: ["/api/admin/stats"],
  });

  const { data: recentContent } = useQuery({
    queryKey: ["/api/content"],
  });

  const stats = [
    {
      title: "Total Students",
      value: adminStats?.totalStudents || 0,
      change: "+15%",
      icon: Users,
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
    {
      title: "Total Content",
      value: adminStats?.totalContent || 0,
      change: "+8",
      icon: FileText,
      color: "text-secondary",
      bgColor: "bg-secondary/10",
    },
    {
      title: "Total Quizzes",
      value: adminStats?.totalQuizzes || 0,
      change: "+3",
      icon: Award,
      color: "text-accent",
      bgColor: "bg-accent/10",
    },
    {
      title: "Avg. Rating",
      value: Number(adminStats?.averageRating || 0).toFixed(1),
      change: "+0.2",
      icon: Star,
      color: "text-success",
      bgColor: "bg-success/10",
    },
  ];

  const quickActions = [
    {
      title: "Upload Content",
      description: "Add new books, videos, or materials",
      icon: Upload,
      href: "/upload",
      color: "bg-primary",
    },
    {
      title: "Create Quiz",
      description: "Design new quizzes and assessments",
      icon: Award,
      href: "/create-quiz",
      color: "bg-secondary",
    },
    {
      title: "Build Course",
      description: "Create structured learning paths",
      icon: BookOpen,
      href: "/create-course",
      color: "bg-accent",
    },
  ];

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
              <span className="text-xl font-bold text-foreground">EduHub Admin</span>
            </div>

            <nav className="hidden md:flex items-center space-x-8">
              <Link href="/dashboard" className="nav-link active text-sm font-medium text-foreground">
                Dashboard
              </Link>
              <Link href="/upload" className="nav-link text-sm font-medium text-muted-foreground hover:text-foreground">
                Upload
              </Link>
              <Link href="/create-quiz" className="nav-link text-sm font-medium text-muted-foreground hover:text-foreground">
                Quizzes
              </Link>
              <a href="#" className="nav-link text-sm font-medium text-muted-foreground hover:text-foreground">
                Analytics
              </a>
            </nav>

            <div className="flex items-center space-x-4">
              <Link href="/upload">
                <Button size="sm">
                  <Plus className="mr-2 h-4 w-4" />
                  Add Content
                </Button>
              </Link>
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center text-accent-foreground font-semibold text-sm">
                  {user?.firstName?.[0] || user?.email?.[0] || "A"}
                </div>
                <div className="hidden lg:block text-sm">
                  <p className="font-medium text-foreground">{user?.firstName || "Admin"}</p>
                  <p className="text-xs text-muted-foreground">Administrator</p>
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
        <div className="bg-gradient-to-r from-secondary to-primary rounded-xl p-8 text-white mb-8">
          <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
          <p className="text-blue-100">Manage courses, content, and monitor student progress</p>
        </div>

        {/* Stats Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <Card key={index}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-12 h-12 ${stat.bgColor} rounded-lg flex items-center justify-center`}>
                    <stat.icon className={`h-6 w-6 ${stat.color}`} />
                  </div>
                </div>
                <h3 className="text-sm font-medium text-muted-foreground mb-1">{stat.title}</h3>
                <p className="text-3xl font-bold text-foreground">{stat.value}</p>
                <p className="text-xs text-success mt-2">{stat.change} this month</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Quick Actions */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-foreground mb-4">Quick Actions</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {quickActions.map((action, index) => (
              <Link key={index} href={action.href}>
                <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                  <CardContent className="p-6 text-center">
                    <div className={`w-16 h-16 ${action.color} rounded-xl flex items-center justify-center mx-auto mb-4`}>
                      <action.icon className="h-8 w-8 text-white" />
                    </div>
                    <CardTitle className="mb-2">{action.title}</CardTitle>
                    <CardDescription>{action.description}</CardDescription>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </section>

        {/* Recent Activity */}
        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          {/* Recent Uploads */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Recent Uploads</CardTitle>
                <Button variant="ghost" size="sm">View All</Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {recentContent?.slice(0, 5).map((content: any) => (
                <div key={content.id} className="flex items-center space-x-4 p-3 hover:bg-muted rounded-lg transition">
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                    {content.type === "video" ? (
                      <Video className="h-5 w-5 text-primary" />
                    ) : (
                      <BookOpen className="h-5 w-5 text-primary" />
                    )}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium">{content.title}</h4>
                    <p className="text-sm text-muted-foreground">
                      {new Date(content.createdAt).toLocaleDateString()} • {content.type}
                    </p>
                  </div>
                  <Badge variant="outline">Published</Badge>
                </div>
              )) || (
                <div className="text-center py-8 text-muted-foreground">
                  <Upload className="h-12 w-12 mx-auto mb-3 opacity-50" />
                  <p className="text-sm">No content uploaded yet</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle>Student Activity</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-success/10 rounded-full flex items-center justify-center flex-shrink-0">
                  <Award className="h-5 w-5 text-success" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-foreground">Quiz Completed</p>
                  <p className="text-sm text-muted-foreground">Sarah J. scored 92% on JavaScript Quiz</p>
                  <p className="text-xs text-muted-foreground mt-1">2 hours ago</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                  <BookOpen className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-foreground">New Enrollment</p>
                  <p className="text-sm text-muted-foreground">Michael B. enrolled in React Course</p>
                  <p className="text-xs text-muted-foreground mt-1">5 hours ago</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-secondary/10 rounded-full flex items-center justify-center flex-shrink-0">
                  <Star className="h-5 w-5 text-secondary" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-foreground">Content Reviewed</p>
                  <p className="text-sm text-muted-foreground">Emma W. rated "Clean Code" 5 stars</p>
                  <p className="text-xs text-muted-foreground mt-1">1 day ago</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Content Overview */}
        <Card>
          <CardHeader>
            <CardTitle>Content Library Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-4 gap-6">
              <div className="text-center">
                <BookOpen className="h-12 w-12 text-primary mx-auto mb-2" />
                <p className="text-2xl font-bold text-foreground">
                  {recentContent?.filter((c: any) => c.type === "book").length || 0}
                </p>
                <p className="text-sm text-muted-foreground">Books</p>
              </div>
              <div className="text-center">
                <Video className="h-12 w-12 text-secondary mx-auto mb-2" />
                <p className="text-2xl font-bold text-foreground">
                  {recentContent?.filter((c: any) => c.type === "video").length || 0}
                </p>
                <p className="text-sm text-muted-foreground">Videos</p>
              </div>
              <div className="text-center">
                <Award className="h-12 w-12 text-accent mx-auto mb-2" />
                <p className="text-2xl font-bold text-foreground">{adminStats?.totalQuizzes || 0}</p>
                <p className="text-sm text-muted-foreground">Quizzes</p>
              </div>
              <div className="text-center">
                <BarChart3 className="h-12 w-12 text-success mx-auto mb-2" />
                <p className="text-2xl font-bold text-foreground">
                  {recentContent?.filter((c: any) => c.type === "course").length || 0}
                </p>
                <p className="text-sm text-muted-foreground">Courses</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
