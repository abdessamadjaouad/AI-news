import { Link } from 'react-router-dom';
import { Brain, Zap, Shield, Globe, TrendingUp, Clock, ArrowRight, Sparkles, Users, Star } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="animate-fade-in">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-900/20 via-gray-950 to-accent-900/20" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary-500/10 rounded-full blur-3xl animate-pulse-slow" />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-32 lg:py-40">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-gray-800/50 rounded-full border border-gray-700/50 mb-8">
              <Sparkles className="w-4 h-4 text-accent-400" />
              <span className="text-sm text-gray-300">Your AI News Hub</span>
            </div>
            
            <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold tracking-tight mb-6">
              <span className="text-white">Stay Ahead with</span>
              <br />
              <span className="bg-gradient-to-r from-primary-400 via-accent-400 to-primary-400 bg-clip-text text-transparent animate-gradient bg-[length:200%_auto]">
                AI Intelligence
              </span>
            </h1>
            
            <p className="text-lg sm:text-xl text-gray-400 max-w-2xl mx-auto mb-10">
              Curated artificial intelligence news delivered daily. From breakthroughs to industry shifts, 
              never miss what matters in the world of AI.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/register" className="btn-primary text-lg px-8 py-4">
                Start Reading Free
                <ArrowRight className="ml-2 w-5 h-5 inline" />
              </Link>
              <Link to="/login" className="btn-secondary text-lg px-8 py-4">
                Sign In
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="border-y border-gray-800/50 bg-gray-900/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { icon: Users, value: '10K+', label: 'Active Readers' },
              { icon: Globe, value: '50+', label: 'News Sources' },
              { icon: Clock, value: '24/7', label: 'Real-time Updates' },
              { icon: Star, value: '4.9', label: 'User Rating' },
            ].map((stat, i) => (
              <div key={i} className="text-center">
                <stat.icon className="w-6 h-6 text-primary-400 mx-auto mb-2" />
                <div className="text-2xl sm:text-3xl font-bold text-white">{stat.value}</div>
                <div className="text-sm text-gray-500">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 sm:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Everything You Need to Stay Informed
            </h2>
            <p className="text-gray-400 max-w-xl mx-auto">
              Our platform brings together the best AI news from around the web in one beautiful, easy-to-use interface.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Zap,
                title: 'Lightning Fast Updates',
                description: 'Get the latest AI news as it happens. Our system aggregates stories from top sources in real-time.',
                color: 'from-yellow-500 to-orange-500',
              },
              {
                icon: Shield,
                title: 'Curated Quality Content',
                description: 'No noise, just signal. We filter through thousands of articles to bring you only the most relevant AI news.',
                color: 'from-green-500 to-emerald-500',
              },
              {
                icon: TrendingUp,
                title: 'Trending Topics',
                description: 'Discover what the AI community is talking about. See trending topics and hot discussions at a glance.',
                color: 'from-primary-500 to-accent-500',
              },
            ].map((feature, i) => (
              <div
                key={i}
                className="card p-8 group hover:-translate-y-1 transition-all duration-300"
              >
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-6 group-hover:shadow-lg transition-shadow`}>
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">{feature.title}</h3>
                <p className="text-gray-400 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative rounded-2xl overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-primary-600 to-accent-600" />
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDM0djZoLTZWMzRoNnptMC0zMHY2aC02VjRoNnptMCAxMHY2aC02VjE0aDZ6bTAgMTB2NmgtNlYyNGg2em0tMjAgMjB2NmgtNnYtNmgyMHptMC0zMHY2aC02VjE0aDIwem0wIDEwdjZoLTZWMjRoMjB6bTAgMTB2NmgtNlYzNGgyMHoiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-20" />
            
            <div className="relative px-8 py-16 sm:px-16 sm:py-20 text-center">
              <Brain className="w-12 h-12 text-white/80 mx-auto mb-6" />
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
                Ready to Get Started?
              </h2>
              <p className="text-white/80 text-lg mb-8 max-w-xl mx-auto">
                Join thousands of AI enthusiasts who start their day with our curated news feed. 
                Create your free account in seconds.
              </p>
              <Link
                to="/register"
                className="inline-flex items-center px-8 py-4 bg-white text-gray-900 font-semibold rounded-lg hover:bg-gray-100 transition-colors shadow-xl"
              >
                Create Free Account
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-800/50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Brain className="w-5 h-5 text-primary-400" />
              <span className="text-gray-400">AI News Portal</span>
            </div>
            <p className="text-sm text-gray-500">
              Built with FastAPI & React. Stay curious, stay informed.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
