import { Button } from "@/components/ui/button";
import { ArrowRight, Target, TrendingUp, AlertCircle, Shield } from "lucide-react";
import { Link } from "react-router-dom";
import heroImage from "@/assets/hero-space.jpg";
import logo from "@/assets/helioguard-logo.png";

const Home = () => {
  const features = [
    {
      icon: Target,
      title: "Real-time Asteroid Impact Prediction",
      description: "Advanced AI algorithms track and predict asteroid trajectories with unprecedented accuracy.",
      color: "text-secondary",
      glow: "neon-glow-cyan",
    },
    {
      icon: TrendingUp,
      title: "Mining Profit Estimator",
      description: "Analyze space mining feasibility and ROI for asteroid resources worth trillions.",
      color: "text-primary",
      glow: "neon-glow-purple",
    },
    {
      icon: AlertCircle,
      title: "Threat Alert System",
      description: "Instant notifications for high-risk asteroids approaching Earth's orbit.",
      color: "text-accent",
      glow: "neon-glow-purple",
    },
    {
      icon: Shield,
      title: "Space Analytics Dashboard",
      description: "Comprehensive data visualization for asteroid tracking and risk assessment.",
      color: "text-secondary",
      glow: "neon-glow-cyan",
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
        {/* Background Image */}
        <div
          className="absolute inset-0 z-0"
          style={{
            backgroundImage: `url(${heroImage})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            filter: "brightness(0.3)",
          }}
        />
        
        {/* Content */}
        <div className="container mx-auto px-4 z-10 text-center">
          <div className="animate-fade-in">
            <img src={logo} alt="HelioGuard AI" className="w-32 h-32 mx-auto mb-6 animate-pulse-glow" />
            <h1 className="text-5xl md:text-7xl font-bold mb-6">
              <span className="gradient-text">HelioGuard AI</span>
            </h1>
            <h2 className="text-3xl md:text-5xl font-bold mb-6">
              Defending Earth with Intelligence
            </h2>
            <p className="text-xl md:text-2xl text-foreground/80 mb-8 max-w-3xl mx-auto">
              Asteroid Risk Prediction + Space Mining Feasibility powered by AI
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/prediction">
                <Button size="lg" className="neon-glow-purple text-lg px-8 py-6">
                  Start Analysis <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              <Link to="/dashboard">
                <Button size="lg" variant="outline" className="border-secondary text-secondary neon-glow-cyan text-lg px-8 py-6">
                  View Dashboard
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Floating Elements */}
        <div className="absolute bottom-10 left-10 w-20 h-20 rounded-full bg-primary/20 blur-xl animate-float" />
        <div className="absolute top-20 right-20 w-32 h-32 rounded-full bg-secondary/20 blur-xl animate-float" style={{ animationDelay: "1s" }} />
      </section>

      {/* Features Section */}
      <section className="py-20 relative">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-4">
            <span className="gradient-text">Powerful Features</span>
          </h2>
          <p className="text-center text-muted-foreground mb-16 text-lg">
            Advanced AI technology for space defense and resource analysis
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <div
                key={index}
                className="glass-card p-6 rounded-2xl hover:scale-105 transition-all duration-300 hover:border-primary/50 group"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className={`w-16 h-16 rounded-xl bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center mb-4 ${feature.glow} group-hover:scale-110 transition-transform`}>
                  <feature.icon className={`w-8 h-8 ${feature.color}`} />
                </div>
                <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 relative">
        <div className="container mx-auto px-4">
          <div className="glass-card p-12 rounded-3xl text-center neon-glow-purple">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Ready to Protect Earth?
            </h2>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Join the mission to monitor and analyze asteroid threats with cutting-edge AI technology.
            </p>
            <Link to="/prediction">
              <Button size="lg" className="text-lg px-10 py-6">
                Get Started Now <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
