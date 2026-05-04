import { useState } from "react";
import axios from "axios";

import asteroid1 from "@/assets/asteroid1.webp";
import asteroid2 from "@/assets/asteroid2.webp";
import asteroid3 from "@/assets/asteroid3.webp";
import asteroid4 from "@/assets/asteroid4.webp";

import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import {
  FaGem,
  FaChartLine,
  FaHistory,
  FaDollarSign,
  FaRuler,
  FaTachometerAlt,
  FaMapMarkerAlt,
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

const images = [asteroid1, asteroid2, asteroid3, asteroid4];

const Mining = () => {
  const [form, setForm] = useState({
    diameter: "",
    velocity: "",
    distance: "",
  });

  const [result, setResult] = useState<any>(null);
  const [history, setHistory] = useState<any[]>([]);
  const [top5, setTop5] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [imgIndex, setImgIndex] = useState(0);

  // 🔥 BETTER ROI (no 100 stuck)
  const calculateROI = (a: any) => {
    const value = a.diameter * 500000 + a.velocity * 100;

    const cost = a.diameter * 300000 + a.miss_distance * 0.02;

    const profit = value - cost;

    const roi = Math.round((profit / (cost + 1)) * 100);

    return {
      ...a,
      value,
      cost,
      profit,
      roi,
    };
  };

  const handleSearch = async (e: any) => {
    e.preventDefault();

    const d = parseFloat(form.diameter);
    const v = parseFloat(form.velocity);
    const m = parseFloat(form.distance);

    if (!d || !v || !m) {
      toast.error("Fill all fields");
      return;
    }

    try {
      setLoading(true);
      toast.loading("Analyzing with AI...");

      const res = await axios.get("http://127.0.0.1:8000/api/mining/");
      const data = res.data;

      const scored = data.map((a: any) => {
        const diff =
          Math.abs(a.diameter - d) +
          Math.abs(a.velocity - v) +
          Math.abs(a.miss_distance - m);
        return { ...a, diff };
      });

      scored.sort((a: any, b: any) => a.diff - b.diff);

      const best = calculateROI(scored[0]);

      // 🔥 IMAGE CHANGE EACH SEARCH
      const newIndex = (imgIndex + 1) % images.length;
      setImgIndex(newIndex);

      const final = {
        ...best,
        image: images[newIndex],
      };

      setResult(final);

      // 🔥 HISTORY ADD WITH FULL DETAILS
      setHistory((prev) => {
        const updated = [final, ...prev.filter((x) => x.name !== final.name)];
        return updated;
      });

      // 🔥 TOP 5 BASED ON HISTORY (NOT API)
      setTop5((prev) => {
        const updated = [final, ...prev.filter((x) => x.name !== final.name)];

        // 🔥 SORT BY ROI (HIGH → LOW)
        return updated.sort((a, b) => b.roi - a.roi).slice(0, 5);
      });

      toast.dismiss();
      toast.success(`Matched: ${best.name}`);
    } catch {
      toast.error("API Failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-12 bg-gradient-to-br from-[#020617] via-[#020617] to-[#0f172a]">
      <div className="container mx-auto px-4 max-w-6xl grid md:grid-cols-3 gap-8">
        {/* LEFT */}
        <div className="md:col-span-2">
          {/* HEADER */}
          <div className="text-center mb-10">
            <FaGem className="w-14 h-14 mx-auto mb-3 text-purple-400 animate-pulse drop-shadow-[0_0_20px_#a855f7]" />
            <h1 className="text-4xl font-bold text-white">
              Asteroid Mining AI
            </h1>
            <p className="text-gray-400 mt-2">
              AI-powered profitability analysis engine
            </p>
          </div>

          {/* FORM */}
          <Card className="p-6 mb-6 bg-white/5 border border-white/10 backdrop-blur-xl shadow-xl hover:shadow-purple-500/20 transition">
            <form onSubmit={handleSearch} className="space-y-4">
              <Input
                placeholder="Diameter (meters)"
                value={form.diameter}
                onChange={(e) => setForm({ ...form, diameter: e.target.value })}
                className="bg-black/40 border-white/10 focus:border-purple-400"
              />

              <Input
                placeholder="Velocity (km/h)"
                value={form.velocity}
                onChange={(e) => setForm({ ...form, velocity: e.target.value })}
                className="bg-black/40 border-white/10 focus:border-purple-400"
              />

              <Input
                placeholder="Distance (km)"
                value={form.distance}
                onChange={(e) => setForm({ ...form, distance: e.target.value })}
                className="bg-black/40 border-white/10 focus:border-purple-400"
              />

              <Button className="w-full bg-purple-600 hover:bg-purple-700 shadow-lg shadow-purple-500/20">
                {loading ? "Analyzing..." : "Analyze Mining"}
              </Button>
            </form>
          </Card>

          {/* RESULT */}
          {result && (
            <Card className="p-6 mb-6 bg-white/5 border border-white/10 backdrop-blur-xl shadow-xl hover:shadow-green-500/20 transition">
              <h2 className="text-xl text-center text-white mb-4">
                {result.name}
              </h2>

              <div className="grid md:grid-cols-2 gap-6">
                {/* IMAGE */}
                <div className="relative group">
                  <img
                    src={result.image}
                    className="w-full h-60 object-cover rounded-xl transition-all duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-t from-black/60 to-transparent" />
                </div>

                {/* INFO */}
                <div className="space-y-3 text-white">
                  <p className="flex items-center gap-2">
                    <FaRuler /> {Math.round(result.diameter)} m
                  </p>

                  <p className="flex items-center gap-2">
                    <FaTachometerAlt /> {Math.round(result.velocity)} km/h
                  </p>

                  <p className="flex items-center gap-2">
                    <FaMapMarkerAlt />
                    {Math.round(result.miss_distance / 1000000)}M km
                  </p>

                  <p className="text-green-400 font-bold text-lg">
                    <FaDollarSign /> ${(result.value / 1e12).toFixed(2)}T
                  </p>

                  <div className="inline-block px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-sm">
                    ROI: {result.roi}%
                  </div>

                  <p className="text-sm text-gray-400">
                    Profit: ${(result.profit / 1e12).toFixed(2)}T
                  </p>
                </div>
              </div>
            </Card>
          )}

          {/* 🔥 CHART */}
          {history.length > 1 && (
            <Card className="p-6 mb-6 bg-white/5 border border-white/10 backdrop-blur-xl shadow-lg">
              <h3 className="text-white mb-4 font-semibold">
                ROI Trend (Search History)
              </h3>

              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={history}>
                  <XAxis dataKey="name" stroke="#aaa" />
                  <YAxis stroke="#aaa" />
                  <Tooltip />
                  <Line
                    dataKey="roi"
                    stroke="#a855f7"
                    strokeWidth={3}
                    dot={{ r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </Card>
          )}

          {/* 🔥 TOP 5 */}
          {top5.length > 0 && (
            <Card className="p-6 bg-white/5 border border-white/10 backdrop-blur-xl shadow-lg">
              <h3 className="text-white mb-4 font-semibold">
                Top 5 Profitable Asteroids
              </h3>

              {top5.map((a, i) => (
                <div
                  key={i}
                  className="flex justify-between items-center text-white py-3 border-b border-white/10 hover:bg-white/5 px-2 rounded transition">
                  <span>{a.name}</span>
                  <span className="text-green-400 font-semibold">{a.roi}%</span>
                </div>
              ))}
            </Card>
          )}
        </div>

        {/* RIGHT */}
        <div>
          <Card className="p-6 bg-white/5 border border-white/10 backdrop-blur-xl shadow-lg">
            <h3 className="text-white mb-4 flex gap-2 font-semibold">
              <FaHistory /> Search History
            </h3>

            {history.map((h, i) => (
              <div
                key={i}
                className="mb-4 text-white border-b border-white/10 pb-3 hover:bg-white/5 px-2 rounded transition">
                <p className="font-semibold">{h.name}</p>

                <p className="text-green-400 text-sm">ROI: {h.roi}%</p>

                <p className="text-xs text-gray-400">
                  {Math.round(h.diameter)} m | {Math.round(h.velocity)} km/h
                </p>

                <p className="text-xs text-gray-400">
                  ${(h.profit / 1e12).toFixed(2)}T profit
                </p>
              </div>
            ))}
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Mining;
