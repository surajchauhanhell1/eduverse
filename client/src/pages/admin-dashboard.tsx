import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/layout/navbar";
import { Sidebar } from "@/components/layout/sidebar";

export default function AdminDashboard() {
  const { user } = useAuth();

  const { data: adminStats } = useQuery({
    queryKey: ["/api/stats/admin"],
  });

  const { data: recentContent } = useQuery({
    queryKey: ["/api/content"],
  });

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="flex">
        <Sidebar userRole="admin" />
        <main className="flex-1 lg:ml-64 p-6">
          {/* Welcome Section */}
          <section className="mb-8">
            <div className="bg-gradient-to-r from-secondary to-primary rounded-xl p-8 text-white">
              <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
              <p className="text-blue-100">Manage courses, content, and monitor student progress</p>
            </div>
          </section>

          {/* Stats Overview */}
          <section className="mb-8">
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="p-6 bg-gradient-to-br from-primary to-primary/80 text-white">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                </div>
                <h3 className="text-sm font-medium opacity-90 mb-1">Total Students</h3>
                <p className="text-3xl font-bold">{adminStats?.totalStudents || 0}</p>
              </Card>

              <Card className="p-6 bg-gradient-to-br from-secondary to-secondary/80 text-white">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                  </div>
                </div>
                <h3 className="text-sm font-medium opacity-90 mb-1">Total Content</h3>
                <p className="text-3xl font-bold">{adminStats?.totalContent || 0}</p>
              </Card>

              <Card className="p-6 bg-gradient-to-br from-accent to-accent/80 text-white">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                    </svg>
                  </div>
                </div>
                <h3 className="text-sm font-medium opacity-90 mb-1">Total Courses</h3>
                <p className="text-3xl font-bold">{adminStats?.totalCourses || 0}</p>
              </Card>

              <Card className="p-6 bg-gradient-to-br from-success to-success/80 text-white">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>
                <h3 className="text-sm font-medium opacity-90 mb-1">Total Quizzes</h3>
                <p className="text-3xl font-bold">{adminStats?.totalQuizzes || 0}</p>
              </Card>
            </div>
          </section>

          {/* Quick Actions */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-foreground mb-4">Quick Actions</h2>
            <div className="grid md:grid-cols-3 gap-6">
              <Button asChild className="h-24 flex flex-col gap-2">
                <a href="/upload">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                  Upload Content
                </a>
              </Button>

              <Button variant="outline" className="h-24 flex flex-col gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Create Quiz
              </Button>

              <Button variant="outline" className="h-24 flex flex-col gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
                Build Course
              </Button>
            </div>
          </section>

          {/* Recent Content */}
          <section className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold text-foreground">Recent Content</h2>
              <Button variant="ghost">View All →</Button>
            </div>
            <Card>
              <div className="p-6">
                <div className="space-y-4">
                  {recentContent?.slice(0, 5).map((content: any) => (
                    <div key={content.id} className="flex items-center gap-4 p-4 hover:bg-muted/50 rounded-lg transition-colors">
                      <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                        {content.type === 'book' ? (
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                          </svg>
                        ) : (
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                          </svg>
                        )}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold">{content.title}</h3>
                        <p className="text-sm text-muted-foreground">
                          {content.author} • {new Date(content.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline">Edit</Button>
                        <Button size="sm" variant="outline">Delete</Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          </section>
        </main>
      </div>
    </div>
  );
}
