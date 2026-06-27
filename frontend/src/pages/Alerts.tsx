import { useEffect, useState } from "react";
import axios from "axios";

import { Card } from "@/components/ui/card";

import {
  AlertCircle,
  CheckCircle,
  AlertTriangle,
  Clock,
  DollarSign,
  Radar,
} from "lucide-react";

const Alerts = () => {
  const [asteroids, setAsteroids] = useState<any[]>([]);
  const [mining, setMining] = useState<any[]>([]);
  const [visibleIndex, setVisibleIndex] = useState(0);

  const fetchData = async () => {
    try {
      const [astroRes, miningRes] = await Promise.all([
        axios.get("http://13.60.215.126/api/asteroids/"),
        axios.get("http://13.60.215.126/api/mining/"),
      ]);

      setAsteroids(astroRes.data);
      setMining(miningRes.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 15000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const loop = setInterval(() => {
      setVisibleIndex((prev) => prev + 1);
    }, 4000);
    return () => clearInterval(loop);
  }, []);

  const asteroidAlerts = asteroids
    .map((a) => ({
      title: a.name,
      description: `Velocity: ${Math.round(a.velocity)} km/h`,
      distance: `${Math.round(a.miss_distance / 1000000)}M km`,
      date: a.date,
      severity:
        a.risk === 1
          ? "danger"
          : a.miss_distance < 20000000
          ? "caution"
          : "safe",
    }))
    .slice(visibleIndex, visibleIndex + 5);

  const miningAlerts = mining
    .map((m) => ({
      title: m.name,
      description: m.profitable
        ? "High mining potential detected"
        : "Low resource value",
      distance: `${Math.round(m.miss_distance / 1000000)}M km`,
      severity: m.profitable ? "safe" : "caution",
    }))
    .slice(visibleIndex, visibleIndex + 5);

  const getConfig = (severity: string) => {
    if (severity === "danger") {
      return {
        icon: AlertCircle,
        color: "text-red-400",
        glow: "shadow-red-500/30",
      };
    }
    if (severity === "caution") {
      return {
        icon: AlertTriangle,
        color: "text-yellow-400",
        glow: "shadow-yellow-500/30",
      };
    }
    return {
      icon: CheckCircle,
      color: "text-green-400",
      glow: "shadow-green-500/30",
    };
  };

  return (
    <div className="min-h-screen pt-24 pb-12 bg-gradient-to-br from-black via-gray-900 to-black">
      <div className="container mx-auto px-4 max-w-7xl">

        {/* 🔥 HEADER */}
        <div className="mb-12 text-center">
          <Radar className="w-16 h-16 mx-auto text-cyan-400 animate-pulse" />
          <h1 className="text-5xl font-bold text-white mt-4">
            AI Alert System
          </h1>
          <p className="text-gray-400 mt-2">
            Real-time asteroid threats & mining intelligence
          </p>
        </div>

        {/* 🔥 GRID */}
        <div className="grid md:grid-cols-2 gap-10">

          {/* LEFT */}
          <div>
            <h2 className="text-2xl font-bold text-red-400 mb-6 flex items-center gap-2">
              <AlertCircle /> Asteroid Threat Monitor
            </h2>

            {asteroidAlerts.map((alert, i) => {
              const cfg = getConfig(alert.severity);
              const Icon = cfg.icon;

              return (
                <Card
                  key={i}
                  className={`p-6 mb-5 bg-white/5 backdrop-blur-xl border border-white/10
                  hover:scale-[1.03] hover:shadow-xl ${cfg.glow} transition-all duration-300`}
                >
                  <div className="flex gap-4">

                    <div className="w-12 h-12 flex items-center justify-center rounded-xl bg-white/10">
                      <Icon className={`w-6 h-6 ${cfg.color}`} />
                    </div>

                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-white">
                        {alert.title}
                      </h3>

                      <p className="text-gray-400 text-sm mt-1">
                        {alert.description}
                      </p>

                      <div className="flex justify-between mt-3 text-xs text-gray-500">
                        <span>{alert.distance}</span>
                        <span>{alert.date}</span>
                      </div>
                    </div>

                  </div>
                </Card>
              );
            })}
          </div>

          {/* RIGHT */}
          <div>
            <h2 className="text-2xl font-bold text-green-400 mb-6 flex items-center gap-2">
              <DollarSign /> Mining Intelligence
            </h2>

            {miningAlerts.map((alert, i) => {
              const cfg = getConfig(alert.severity);
              const Icon = cfg.icon;

              return (
                <Card
                  key={i}
                  className={`p-6 mb-5 bg-white/5 backdrop-blur-xl border border-white/10
                  hover:scale-[1.03] hover:shadow-xl ${cfg.glow} transition-all duration-300`}
                >
                  <div className="flex gap-4">

                    <div className="w-12 h-12 flex items-center justify-center rounded-xl bg-white/10">
                      <Icon className={`w-6 h-6 ${cfg.color}`} />
                    </div>

                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-white">
                        {alert.title}
                      </h3>

                      <p className="text-gray-400 text-sm mt-1">
                        {alert.description}
                      </p>

                      <div className="mt-3 text-xs text-gray-500">
                        {alert.distance}
                      </div>
                    </div>

                  </div>
                </Card>
              );
            })}
          </div>

        </div>

      </div>
    </div>
  );
};

export default Alerts;