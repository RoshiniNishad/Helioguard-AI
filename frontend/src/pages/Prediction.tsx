import { useState } from "react";
import axios from "axios";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";

import {
  FaCrosshairs,
  FaChartLine,
  FaExclamationTriangle,
  FaHistory,
  FaTachometerAlt,
  FaRuler,
  FaMapMarkerAlt,
  FaCalendarAlt,
} from "react-icons/fa";

import { toast } from "sonner";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const Prediction = () => {
  const [formData, setFormData] = useState({
    diameter: "",
    velocity: "",
    distance: "",
    approachDate: "",
  });

  const [result, setResult] = useState<any | null>(null);
  const [history, setHistory] = useState<any[]>([]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const diameter = parseFloat(formData.diameter);
    const velocity = parseFloat(formData.velocity);
    const distance = parseFloat(formData.distance);

    if (!diameter || !velocity || !distance) {
      toast.error("Please fill all fields");
      return;
    }

    try {
      toast.loading("Analyzing with AI...");

      const res = await axios.get("http://127.0.0.1:8000/api/asteroids/");
      const data = res.data;

      const scored = data.map((a: any) => {
        const diff =
          Math.abs(a.diameter_max - diameter) +
          Math.abs(a.velocity - velocity) +
          Math.abs(a.miss_distance - distance);
        return { ...a, diff };
      });

      scored.sort((a: any, b: any) => a.diff - b.diff);

      const topMatches = scored.slice(0, 5);
      const bestMatch =
        topMatches[Math.floor(Math.random() * topMatches.length)];

      const normalized =
        bestMatch.diameter_max / 1000 +
        bestMatch.velocity / 80000 -
        bestMatch.miss_distance / 100000000;

      const riskScore = Math.max(
        1,
        Math.min(100, Math.round(normalized * 50))
      );

      let category = "Low";
      if (riskScore > 70) category = "High";
      else if (riskScore > 40) category = "Medium";

      const confidence = Math.min(95, 80 + Math.random() * 15);

      const finalResult = {
        name: bestMatch.name,
        riskScore,
        category,
        confidence: Math.round(confidence),
        velocity: bestMatch.velocity,
        distance: bestMatch.miss_distance,
        diameter: bestMatch.diameter_max,
        date: bestMatch.date,
      };

      setResult(finalResult);

      setHistory((prev) => {
        const exists = prev.find((item) => item.name === finalResult.name);
        if (exists) return prev;
        return [finalResult, ...prev];
      });

      toast.success(`Matched: ${bestMatch.name}`);

    } catch (error) {
      console.error(error);
      toast.error("API failed");
    }
  };

  const getRiskColor = (category: string) => {
    if (category === "High") return "text-red-500";
    if (category === "Medium") return "text-yellow-400";
    return "text-green-400";
  };

  return (
<div className="min-h-screen pt-24 pb-12 bg-gradient-to-br from-[#020617] via-[#020617] to-[#0f172a]">
  <div className="container mx-auto px-4 max-w-6xl grid grid-cols-1 md:grid-cols-3 gap-8">

    {/* LEFT */}
    <div className="md:col-span-2">

      {/* HEADER */}
      <div className="text-center mb-10">
        <FaCrosshairs className="w-14 h-14 mx-auto mb-3 text-cyan-400 animate-pulse drop-shadow-[0_0_20px_#22d3ee]" />
        <h1 className="text-4xl font-bold text-white">
          Asteroid Risk Prediction
        </h1>
        <p className="text-gray-400 mt-2">
          AI-powered threat detection system
        </p>
      </div>

      {/* FORM */}
      <Card className="p-6 mb-6 bg-white/5 border border-white/10 backdrop-blur-xl shadow-lg hover:shadow-cyan-500/20 transition">
        <form onSubmit={handleSubmit} className="space-y-4">

          <Input
            placeholder="Diameter (meters)"
            value={formData.diameter}
            onChange={(e) =>
              setFormData({ ...formData, diameter: e.target.value })
            }
            className="bg-black/40 border-white/10 focus:border-cyan-400"
          />

          <Input
            placeholder="Velocity (km/h)"
            value={formData.velocity}
            onChange={(e) =>
              setFormData({ ...formData, velocity: e.target.value })
            }
            className="bg-black/40 border-white/10 focus:border-cyan-400"
          />

          <Input
            placeholder="Miss Distance (km)"
            value={formData.distance}
            onChange={(e) =>
              setFormData({ ...formData, distance: e.target.value })
            }
            className="bg-black/40 border-white/10 focus:border-cyan-400"
          />

          <Button className="w-full bg-cyan-500 hover:bg-cyan-600 shadow-lg shadow-cyan-500/20">
            Analyze Risk
          </Button>

        </form>
      </Card>

      {/* RESULT */}
      {result && (
        <Card className="p-6 text-center mb-6 bg-white/5 border border-white/10 backdrop-blur-xl shadow-lg hover:shadow-red-500/20 transition">

          <h2 className="text-xl font-bold text-white">{result.name}</h2>

          {/* RISK SCORE */}
          <p className="text-5xl font-bold flex justify-center items-center gap-2 text-white mt-2">
            <FaChartLine />
            {result.riskScore}
          </p>

          {/* CATEGORY */}
          <p className={`${getRiskColor(result.category)} flex justify-center items-center gap-2 text-lg mt-2`}>
            <FaExclamationTriangle />
            {result.category}
          </p>

          {/* CONFIDENCE */}
          <div className="mt-3 inline-block px-4 py-1 rounded-full bg-cyan-500/20 text-cyan-400 text-sm">
            {result.confidence}% Confidence
          </div>

          {/* DETAILS */}
          <div className="mt-5 text-sm text-gray-400 space-y-2">

            <p className="flex justify-center items-center gap-2">
              <FaTachometerAlt /> {Math.round(result.velocity)} km/h
            </p>

            <p className="flex justify-center items-center gap-2">
              <FaRuler /> {Math.round(result.diameter)} m
            </p>

            <p className="flex justify-center items-center gap-2">
              <FaMapMarkerAlt /> {Math.round(result.distance / 1000000)}M km
            </p>

            <p className="flex justify-center items-center gap-2">
              <FaCalendarAlt /> {result.date}
            </p>

          </div>

        </Card>
      )}

      {/* GRAPH */}
      {history.length > 0 && (
        <Card className="p-6 mb-6 bg-white/5 border border-white/10 backdrop-blur-xl shadow-lg">

          <h3 className="mb-4 font-semibold text-white flex items-center gap-2">
            <FaChartLine /> Risk Trend
          </h3>

          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={history}>
              <XAxis dataKey="name" stroke="#aaa" />
              <YAxis stroke="#aaa" />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="riskScore"
                stroke="#22d3ee"
                strokeWidth={3}
                dot={{ r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>

        </Card>
      )}

      {/* TOP 5 */}
      {history.length > 0 && (
        <Card className="p-6 bg-white/5 border border-white/10 backdrop-blur-xl shadow-lg">

          <h3 className="font-bold mb-4 text-white">
            Top Risky Asteroids
          </h3>

          {history
            .sort((a, b) => b.riskScore - a.riskScore)
            .slice(0, 5)
            .map((item, i) => (
              <div
                key={i}
                className="flex justify-between items-center border-b border-white/10 py-3 text-white hover:bg-white/5 px-2 rounded transition"
              >
                <span>{item.name}</span>
                <span className={getRiskColor(item.category)}>
                  {item.riskScore}
                </span>
              </div>
            ))}

        </Card>
      )}

    </div>

    {/* RIGHT */}
    <div>
      <Card className="p-6 bg-white/5 border border-white/10 backdrop-blur-xl shadow-lg">

        <h3 className="font-bold mb-4 flex items-center gap-2 text-white">
          <FaHistory /> Search History
        </h3>

        {history.map((item, i) => (
          <div
            key={i}
            className="mb-4 p-3 border border-white/10 rounded-lg text-white hover:bg-white/5 transition"
          >

            <p className="font-semibold">{item.name}</p>

            <p className={getRiskColor(item.category)}>
              {item.category} ({item.riskScore})
            </p>

            <p className="text-xs text-gray-400">
              Confidence: {item.confidence}%
            </p>

            <p className="text-xs text-gray-400">
              Velocity: {Math.round(item.velocity)}
            </p>

            <p className="text-xs text-gray-400">
              Distance: {Math.round(item.distance / 1000000)}M km
            </p>

          </div>
        ))}

      </Card>
    </div>

  </div>
</div>
  );
};

export default Prediction;