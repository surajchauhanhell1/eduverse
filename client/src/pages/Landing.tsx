import { Button } from "@/components/ui/button";

export default function LandingPage() {
  const handleLogin = () => {
    window.location.href = "/api/login";
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="border-b border-border bg-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <span className="text-xl font-bold text-foreground">EduLearn</span>
            </div>
            <div className="flex items-center space-x-4">
              <Button onClick={handleLogin} variant="outline">
                Sign In
              </Button>
              <Button onClick={handleLogin}>
                Get Started
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden bg-gradient-to-br from-primary to-secondary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center text-white">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
              Transform Your Learning Journey
            </h1>
            <p className="text-xl mb-8 text-blue-100 max-w-3xl mx-auto">
              Access thousands of courses, track your progress, and achieve your educational goals with our comprehensive learning platform.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button onClick={handleLogin} size="lg" className="bg-white text-primary hover:bg-white/90">
                Start Learning Free
              </Button>
              <Button onClick={handleLogin} size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                Sign In
              </Button>
            </div>
            <div className="mt-10 flex items-center justify-center gap-8">
              <div className="text-center">
                <div className="text-3xl font-bold">50K+</div>
                <div className="text-white/80">Students</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold">1,200+</div>
                <div className="text-white/80">Courses</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold">95%</div>
                <div className="text-white/80">Satisfaction</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 text-foreground">Everything You Need to Excel</h2>
            <p className="text-xl text-muted-foreground">Powerful features designed for modern learners</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-card p-8 rounded-xl shadow-sm border border-border hover:shadow-lg transition">
              <div className="bg-primary/10 w-16 h-16 rounded-lg flex items-center justify-center mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-3 text-foreground">Rich Content Library</h3>
              <p className="text-muted-foreground">Access books, videos, and interactive quizzes across multiple subjects and disciplines.</p>
            </div>
            <div className="bg-card p-8 rounded-xl shadow-sm border border-border hover:shadow-lg transition">
              <div className="bg-accent/10 w-16 h-16 rounded-lg flex items-center justify-center mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-3 text-foreground">Progress Tracking</h3>
              <p className="text-muted-foreground">Monitor your learning journey with detailed progress analytics and completion tracking.</p>
            </div>
            <div className="bg-card p-8 rounded-xl shadow-sm border border-border hover:shadow-lg transition">
              <div className="bg-secondary/10 w-16 h-16 rounded-lg flex items-center justify-center mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-3 text-foreground">Smart Notes System</h3>
              <p className="text-muted-foreground">Create, organize, and sync your notes across all your devices seamlessly.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold mb-6">Ready to Start Your Learning Journey?</h2>
          <p className="text-xl mb-8 opacity-90">Join thousands of students already transforming their education with EduLearn.</p>
          <Button onClick={handleLogin} size="lg" className="bg-white text-primary hover:bg-white/90">
            Create Free Account
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-card border-t border-border py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
                <span className="text-xl font-bold">EduLearn</span>
              </div>
              <p className="text-muted-foreground">Empowering learners worldwide with quality education.</p>
            </div>
            <div>
              <h4 className="font-bold mb-4">Platform</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li><a href="#" className="hover:text-primary transition">Courses</a></li>
                <li><a href="#" className="hover:text-primary transition">For Students</a></li>
                <li><a href="#" className="hover:text-primary transition">For Educators</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Resources</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li><a href="#" className="hover:text-primary transition">Help Center</a></li>
                <li><a href="#" className="hover:text-primary transition">Documentation</a></li>
                <li><a href="#" className="hover:text-primary transition">API</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Company</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li><a href="#" className="hover:text-primary transition">About</a></li>
                <li><a href="#" className="hover:text-primary transition">Blog</a></li>
                <li><a href="#" className="hover:text-primary transition">Careers</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-border pt-8 text-center text-muted-foreground">
            <p>&copy; 2024 EduLearn. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
