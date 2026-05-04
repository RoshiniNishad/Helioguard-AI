import { useEffect, useState } from "react";
import axios from "axios";

import {
  Activity,
  AlertTriangle,
  CheckCircle,
  DollarSign,
  Target,
} from "lucide-react";

import { Card } from "@/components/ui/card";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
  CartesianGrid,
} from "recharts";

const Dashboard = () => {
  const [asteroids, setAsteroids] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState("");

  const fetchData = async () => {
    try {
      const res = await axios.get("http://127.0.0.1:8000/api/asteroids/");
      setAsteroids(res.data);
      setLastUpdated(new Date().toLocaleTimeString());
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 10000);
    return () => clearInterval(interval);
  }, []);

  const total = asteroids.length;
  const highRisk = asteroids.filter((a) => a.risk === 1).length;
  const safe = asteroids.filter((a) => a.risk === 0).length;

  const miningValue = (
    asteroids.reduce((acc, a) => acc + a.diameter_max * 1000000, 0) /
    1e12
  ).toFixed(2);

  const getRiskLabel = (risk: number) => (risk === 1 ? "High" : "Low");

  const getRiskColor = (risk: string) => {
    return risk === "High"
      ? "bg-red-500/20 text-red-400 border-red-500/40"
      : "bg-green-500/20 text-green-400 border-green-500/40";
  };

  // 🔥 CHART DATA
  const chartData = asteroids.map((a) => ({
    name: a.date || a.name.slice(0, 6),
    velocity: Math.round(a.velocity / 1000),
    distance: Math.round(a.miss_distance / 1000000),
    risk: a.risk === 1 ? 90 : 30,
  }));

  const stats = [
    {
      icon: Target,
      label: "Total Asteroids",
      value: total,
      color: "text-cyan-400",
    },
    {
      icon: AlertTriangle,
      label: "High Risk",
      value: highRisk,
      color: "text-red-400",
    },
    {
      icon: CheckCircle,
      label: "Safe",
      value: safe,
      color: "text-green-400",
    },
    {
      icon: DollarSign,
      label: "Mining Value",
      value: `$${miningValue}T`,
      color: "text-purple-400",
    },
  ];

  return (
    <div className="min-h-screen pt-24 pb-12">
      <div className="container mx-auto px-4">

        {/* HEADER */}
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-bold">Analytics Dashboard</h1>
            <p className="text-muted-foreground">
              Real-time asteroid tracking system
            </p>
          </div>

          <p className="text-sm text-muted-foreground">
            Last Updated: {lastUpdated}
          </p>
        </div>

        {/* STATS */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {stats.map((stat, i) => (
            <Card key={i} className="p-6 hover:scale-105 transition">
              <div className="flex items-center gap-4">
                <stat.icon className={`w-6 h-6 ${stat.color}`} />
                <div>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                  <p className="text-2xl font-bold">{stat.value}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* 🔥 CHART */}
        <Card className="p-6 mb-10">
          <div className="flex items-center gap-2 mb-4">
            <Activity className="w-5 h-5 text-cyan-400" />
            <h2 className="text-xl font-bold">Asteroid Metrics Overview</h2>
          </div>

          <ResponsiveContainer width="100%" height={320}>
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="colorRisk" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ef4444" stopOpacity={0.7} />
                  <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                </linearGradient>
              </defs>

              <CartesianGrid strokeDasharray="3 3" />

              {/* 🔥 DARK X AXIS */}
              <XAxis
                dataKey="name"
                stroke="#000000"
                tick={{ fill: "#000000", fontSize: 12 }}
              />

              <YAxis />

              <Tooltip />

              <Area
                type="monotone"
                dataKey="risk"
                stroke="#ef4444"
                fillOpacity={1}
                fill="url(#colorRisk)"
              />

              <Line type="monotone" dataKey="velocity" stroke="#06b6d4" />
              <Line type="monotone" dataKey="distance" stroke="#22c55e" />
            </AreaChart>
          </ResponsiveContainer>
        </Card>

        {/* TABLE */}
        <Card className="p-6">
          <h2 className="text-xl font-bold mb-4">Live Asteroid Feed</h2>

          {loading ? (
            <p>Loading...</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">

                <thead>
                  <tr className="border-b">
                    <th className="py-3 text-left">Name</th>
                    <th>Risk</th>
                    <th>Distance</th>
                    <th>Diameter</th>
                    <th>Velocity</th>
                  </tr>
                </thead>

                <tbody>
                  {/* 🔥 FULL DATA (NO SLICE) */}
                  {asteroids.map((a, i) => {
                    const riskLabel = getRiskLabel(a.risk);

                    return (
                      <tr key={i} className="border-b hover:bg-white/5">
                        <td className="py-3">{a.name}</td>

                        <td>
                          <span
                            className={`px-3 py-1 text-xs rounded border ${getRiskColor(
                              riskLabel
                            )}`}
                          >
                            {riskLabel}
                          </span>
                        </td>

                        <td>{Math.round(a.miss_distance / 1000)} km</td>
                        <td>{Math.round(a.diameter_max)} m</td>
                        <td>{Math.round(a.velocity)} km/h</td>
                      </tr>
                    );
                  })}
                </tbody>

              </table>
            </div>
          )}
        </Card>

      </div>
    </div>
  );
};

export default Dashboard;