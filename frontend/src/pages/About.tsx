import { Card } from "@/components/ui/card";
import { Shield, Target, Rocket, Users } from "lucide-react";

const About = () => {
  const values = [
    {
      icon: Shield,
      title: "Planetary Defense",
      description:
        "Our primary mission is to protect Earth from asteroid threats through advanced AI prediction systems.",
    },
    {
      icon: Target,
      title: "Precision Analysis",
      description:
        "We leverage cutting-edge machine learning to deliver accurate asteroid trajectory predictions.",
    },
    {
      icon: Rocket,
      title: "Space Innovation",
      description:
        "Pioneering the future of space mining feasibility analysis and resource extraction planning.",
    },
    {
      icon: Users,
      title: "Global Collaboration",
      description:
        "Working with space agencies worldwide to create a safer future for humanity.",
    },
  ];

  return (
    <div className="min-h-screen pt-24 pb-12 bg-gradient-to-br from-[#020617] to-[#0f172a]">
      <div className="container mx-auto px-4 max-w-5xl">

        {/* HEADER */}
        <div className="mb-12 text-center">
          <Shield className="w-16 h-16 mx-auto mb-4 text-cyan-400 animate-pulse" />

          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-white">
            About HelioGuard AI
          </h1>

          <p className="text-gray-400 text-lg">
            B.Tech Final Year Major Project
          </p>

          {/* 🔥 NASA BADGE */}
          <div className="mt-4 flex justify-center">
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/e/e5/NASA_logo.svg"
              alt="NASA"
              className="h-12 opacity-80 hover:opacity-100 transition"
            />
          </div>
        </div>

        {/* MISSION */}
        <Card className="glass-card p-8 md:p-12 mb-12">
          <h2 className="text-3xl font-bold mb-6 text-center text-white">
            Our Mission
          </h2>

          <p className="text-lg text-gray-400 text-center max-w-3xl mx-auto leading-relaxed">
            HelioGuard AI is designed as an intelligent system that integrates
            machine learning with real-time NASA asteroid data. Our goal is to
            build a robust platform capable of predicting asteroid threats and
            evaluating mining opportunities, helping future systems used by
            organizations like NASA and ISRO.
          </p>
        </Card>

        {/* WHY IMPORTANT */}
        <Card className="glass-card p-8 md:p-12 mb-12">
          <h2 className="text-3xl font-bold mb-6 text-white">
            Why Asteroid Prediction Matters
          </h2>

          <div className="space-y-4 text-gray-400">
            <p className="text-lg leading-relaxed">
              Thousands of near-Earth asteroids are tracked by NASA every year.
              While most are harmless, some pose potential threats that could
              impact Earth's environment and human life.
            </p>

            <p className="text-lg leading-relaxed">
              Events like the Chelyabinsk meteor (2013) showed how dangerous even
              small asteroids can be. Early prediction systems can help prevent
              such incidents.
            </p>

            <p className="text-lg leading-relaxed">
              Apart from threats, asteroids also contain valuable resources like
              metals and water ice, making them a key part of future space
              exploration and economy.
            </p>
          </div>
        </Card>

        {/* CORE VALUES */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold mb-8 text-center text-white">
            Our Core Values
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            {values.map((value) => (
              <Card
                key={value.title}
                className="glass-card p-6 hover:scale-105 transition-all duration-300"
              >
                <value.icon className="w-12 h-12 mb-4 text-cyan-400" />

                <h3 className="text-xl font-semibold mb-3 text-white">
                  {value.title}
                </h3>

                <p className="text-gray-400">{value.description}</p>
              </Card>
            ))}

          </div>
        </div>

        {/* VISION */}
        <Card className="glass-card p-8 md:p-12 text-center">
          <h2 className="text-3xl font-bold mb-6 text-white">
            Our Vision
          </h2>

          <p className="text-lg text-gray-400 max-w-3xl mx-auto leading-relaxed">
            We aim to develop a scalable AI-based system that can assist space
            agencies in real-time asteroid monitoring, risk analysis, and mining
            feasibility evaluation, contributing to both planetary safety and
            future space exploration.
          </p>
        </Card>

      </div>
    </div>
  );
};

export default About;