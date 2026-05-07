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
  FaRocket,
  FaIndustry,
  FaLeaf,
  FaCheckCircle,
  FaTimesCircle,
} from "react-icons/fa";

import { toast } from "sonner";

import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";

interface AsteroidResult {
  name: string;

  profitable: number;

  diameter: number;
  velocity: number;
  miss_distance: number;

  hazardous: boolean;
  magnitude: number;

  metal_type: string;

  estimated_value: number;
  mining_cost: number;
  estimated_profit: number;

  roi: number;

  difficulty: number;
  success_rate: number;
  ai_score: number;

  travel_days: number;

  orbit_class: string;

  extraction_days: number;

  fuel_required: number;

  carbon_emission: number;

  recommendation: string;

  nasa_jpl_url: string;

  image?: string;
}

const images = [asteroid1, asteroid2, asteroid3, asteroid4];

const formatMoney = (num: number) => {
  if (!num || num <= 0) return "N/A";

  if (num >= 1_000_000_000_000) {
    return `$${(num / 1_000_000_000_000).toFixed(2)}T`;
  }

  if (num >= 1_000_000_000) {
    return `$${(num / 1_000_000_000).toFixed(2)}B`;
  }

  if (num >= 1_000_000) {
    return `$${(num / 1_000_000).toFixed(2)}M`;
  }

  return `$${num.toLocaleString()}`;
};

const Mining = () => {
  const [form, setForm] = useState({
    diameter: "",
    velocity: "",
    distance: "",
  });

  const [result, setResult] = useState<AsteroidResult | null>(null);

  const [history, setHistory] = useState<AsteroidResult[]>([]);

  const [loading, setLoading] = useState(false);

  const [imgIndex, setImgIndex] = useState(0);

  const handleSearch = async (e: React.FormEvent<HTMLFormElement>) => {
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

      toast.loading("Analyzing asteroid...");

      const res = await axios.get("http://127.0.0.1:8000/api/mining/");

      const data: AsteroidResult[] = res.data;

      const scored = data
        .map((a) => ({
          ...a,

          diff:
            Math.abs(a.diameter - d) +
            Math.abs(a.velocity - v) +
            Math.abs(a.miss_distance - m),
        }))
        .sort((a, b) => a.diff - b.diff);

      const best = scored[0];

      const nextIndex = (imgIndex + 1) % images.length;

      setImgIndex(nextIndex);

      const finalData = {
        ...best,
        image: best.image || images[nextIndex],
      };

      setResult(finalData);

      setHistory((prev) => [
        finalData,
        ...prev.filter((x) => x.name !== finalData.name),
      ]);

      toast.dismiss();

      toast.success(`Matched: ${best.name}`);
    } catch (error) {
      console.error(error);

      toast.error("API Error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#020617] via-[#0f172a] to-[#111827] pt-24 pb-12">
      <div className="container mx-auto px-4 max-w-7xl grid lg:grid-cols-3 gap-8">
        {/* LEFT */}

        <div className="lg:col-span-2">
          {/* HEADER */}

          <div className="text-center mb-10">
            <FaGem className="w-14 h-14 mx-auto mb-4 text-purple-400 animate-pulse" />

            <h1 className="text-4xl font-bold text-white">Mining Profitability Prediction</h1>

            <p className="text-gray-400 mt-2">
              Asteroid Mining Intelligence Dashboard
            </p>
          </div>

          {/* FORM */}

          <Card className="p-6 mb-6 bg-white/5 border border-white/10 backdrop-blur-xl">
            <form onSubmit={handleSearch} className="space-y-4">
              <Input
                placeholder="Diameter (meters)"
                value={form.diameter}
                onChange={(e) =>
                  setForm({
                    ...form,
                    diameter: e.target.value,
                  })
                }
                className="bg-black/40 border-white/10"
              />

              <Input
                placeholder="Velocity (km/h)"
                value={form.velocity}
                onChange={(e) =>
                  setForm({
                    ...form,
                    velocity: e.target.value,
                  })
                }
                className="bg-black/40 border-white/10"
              />

              <Input
                placeholder="Distance (km)"
                value={form.distance}
                onChange={(e) =>
                  setForm({
                    ...form,
                    distance: e.target.value,
                  })
                }
                className="bg-black/40 border-white/10"
              />

              <Button className="w-full bg-purple-600 hover:bg-purple-700">
                {loading ? "Analyzing..." : "Analyze Asteroid"}
              </Button>
            </form>
          </Card>

          {/* RESULT */}

          {result && (
            <Card className="p-6 bg-white/5 border border-white/10 backdrop-blur-xl">
              <div className="grid md:grid-cols-2 gap-6">
                {/* IMAGE */}

                <div className="relative">
                  <img
                    src={result.image}
                    alt={result.name}
                    className="w-full h-80 object-cover rounded-xl"
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent rounded-xl" />
                </div>

                {/* INFO */}

                <div>
                  <div className="flex justify-between items-center mb-4">
                    <div>
                      <h2 className="text-2xl font-bold text-white">
                        {result.name}
                      </h2>

                      <p className="text-sm text-gray-400 mt-1">
                        {result.orbit_class}
                      </p>
                    </div>

                    <div
                      className={`px-4 py-2 rounded-full text-sm font-semibold ${
                        result.hazardous
                          ? "bg-red-500/20 text-red-400"
                          : "bg-green-500/20 text-green-400"
                      }`}>
                      {result.hazardous ? "Hazardous" : "Safe"}
                    </div>
                  </div>

                  {/* PROFITABLE */}

                  <div
                    className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold mb-5 ${
                      result.profitable === 1
                        ? "bg-green-500/20 text-green-400"
                        : "bg-red-500/20 text-red-400"
                    }`}>
                    {result.profitable === 1 ? (
                      <>
                        <FaCheckCircle />
                        Profitable
                      </>
                    ) : (
                      <>
                        <FaTimesCircle />
                        Not Profitable
                      </>
                    )}
                  </div>

                  {/* DETAILS */}

                  <div className="space-y-3 text-white">
                    <p className="flex items-center gap-2">
                      <FaRuler />
                      Diameter: {Math.round(result.diameter)}m
                    </p>

                    <p className="flex items-center gap-2">
                      <FaTachometerAlt />
                      Velocity: {Math.round(result.velocity).toLocaleString()}
                      km/h
                    </p>

                    <p className="flex items-center gap-2">
                      <FaMapMarkerAlt />
                      Distance: {Math.round(result.miss_distance / 1000000)}M km
                    </p>

                    <p className="flex items-center gap-2 text-yellow-400 font-semibold">
                      <FaDollarSign />
                      Estimated Value: {formatMoney(result.estimated_value)}
                    </p>

                    <p className="flex items-center gap-2 text-green-400 font-semibold">
                      <FaChartLine />
                      Estimated Profit: {formatMoney(result.estimated_profit)}
                    </p>

                    <p className="flex items-center gap-2">
                      ROI: {result.roi}%
                    </p>

                    <p className="flex items-center gap-2">
                      Metal Type: {result.metal_type}
                    </p>

                    <p className="flex items-center gap-2">
                      AI Score: {result.ai_score}
                      /100
                    </p>

                    <p className="flex items-center gap-2">
                      Success Rate: {result.success_rate}%
                    </p>

                    <p className="flex items-center gap-2">
                      Difficulty: {result.difficulty}
                      /100
                    </p>

                    <p className="flex items-center gap-2">
                      <FaRocket />
                      Travel Days: {result.travel_days}
                    </p>

                    <p className="flex items-center gap-2">
                      <FaIndustry />
                      Extraction Days: {result.extraction_days}
                    </p>

                    <p className="flex items-center gap-2">
                      Fuel Required: {result.fuel_required.toLocaleString()} L
                    </p>

                    <p className="flex items-center gap-2">
                      <FaLeaf />
                      Carbon Emission: {result.carbon_emission.toLocaleString()}
                    </p>

                    <div className="pt-2">
                      <span className="text-sm text-gray-400">
                        Recommendation
                      </span>

                      <div className="mt-1 inline-block bg-purple-500/20 text-purple-300 px-4 py-2 rounded-lg font-semibold">
                        {result.recommendation}
                      </div>
                    </div>
                  </div>

                  {/* NASA */}

                  <a
                    href={result.nasa_jpl_url}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-block mt-6 bg-blue-600 hover:bg-blue-700 transition px-5 py-3 rounded-lg text-sm font-medium">
                    View NASA JPL Reference
                  </a>
                </div>
              </div>
            </Card>
          )}

          {/* CHART */}

          {history.length > 1 && (
            <Card className="p-6 mt-6 bg-white/5 border border-white/10 backdrop-blur-xl">
              <h3 className="text-white mb-4 font-semibold">ROI Trend</h3>

              <ResponsiveContainer width="100%" height={260}>
                <LineChart data={[...history].reverse()}>
                  <XAxis dataKey="name" stroke="#aaa" />

                  <YAxis stroke="#aaa" />

                  <Tooltip />

                  <Line
                    type="monotone"
                    dataKey="roi"
                    stroke="#a855f7"
                    strokeWidth={3}
                  />
                </LineChart>
              </ResponsiveContainer>
            </Card>
          )}
          {/* ================= EXTRA ANALYTICS SECTION ================= */}

          {history.length > 1 && (
            <div className="grid lg:grid-cols-2 gap-6 mt-6">
              {/* ROI GRAPH */}

              <Card className="p-6 bg-white/5 border border-white/10 backdrop-blur-xl">
                <div className="flex items-center gap-2 mb-5">
                  <FaChartLine className="text-purple-400" />

                  <h3 className="text-white font-semibold text-lg">
                    ROI Performance Trend
                  </h3>
                </div>

                <ResponsiveContainer width="100%" height={280}>
                  <LineChart data={[...history].reverse()}>
                    <XAxis
                      dataKey="name"
                      stroke="#9CA3AF"
                      tick={{ fill: "#9CA3AF", fontSize: 11 }}
                    />

                    <YAxis
                      stroke="#9CA3AF"
                      tick={{ fill: "#9CA3AF", fontSize: 11 }}
                    />

                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#111827",
                        border: "1px solid #374151",
                        borderRadius: "12px",
                        color: "white",
                      }}
                    />

                    <Line
                      type="monotone"
                      dataKey="roi"
                      stroke="#a855f7"
                      strokeWidth={4}
                      dot={{
                        r: 5,
                        fill: "#a855f7",
                      }}
                      activeDot={{
                        r: 7,
                      }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </Card>

              {/* AI SCORE GRAPH */}

              <Card className="p-6 bg-white/5 border border-white/10 backdrop-blur-xl">
                <div className="flex items-center gap-2 mb-5">
                  <FaRocket className="text-cyan-400" />

                  <h3 className="text-white font-semibold text-lg">
                    AI Score Comparison
                  </h3>
                </div>

                <ResponsiveContainer width="100%" height={280}>
                  <LineChart data={[...history].reverse()}>
                    <XAxis
                      dataKey="name"
                      stroke="#9CA3AF"
                      tick={{ fill: "#9CA3AF", fontSize: 11 }}
                    />

                    <YAxis
                      stroke="#9CA3AF"
                      tick={{ fill: "#9CA3AF", fontSize: 11 }}
                    />

                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#111827",
                        border: "1px solid #374151",
                        borderRadius: "12px",
                        color: "white",
                      }}
                    />

                    <Line
                      type="monotone"
                      dataKey="ai_score"
                      stroke="#06b6d4"
                      strokeWidth={4}
                      dot={{
                        r: 5,
                        fill: "#06b6d4",
                      }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </Card>
            </div>
          )}

          {/* ================= SEARCH COMPARISON TABS ================= */}

          {history.length > 1 && (
            <Card className="p-6 mt-6 bg-white/5 border border-white/10 backdrop-blur-xl">
              <div className="flex items-center gap-2 mb-6">
                <FaHistory className="text-yellow-400" />

                <h3 className="text-white font-semibold text-lg">
                  Previous Search Comparison
                </h3>
              </div>

              <div className="space-y-4">
                {history.map((item, index) => {
                  const prev = history[index + 1];

                  return (
                    <div
                      key={index}
                      className="bg-black/30 border border-white/10 rounded-2xl p-5">
                      {/* TOP */}

                      <div className="flex flex-wrap justify-between gap-3 mb-4">
                        <div>
                          <h4 className="text-white font-semibold text-lg">
                            {item.name}
                          </h4>

                          <p className="text-gray-400 text-sm">
                            {item.orbit_class}
                          </p>
                        </div>

                        <div
                          className={`px-4 py-2 rounded-full text-sm font-semibold ${
                            item.profitable === 1
                              ? "bg-green-500/20 text-green-400"
                              : "bg-red-500/20 text-red-400"
                          }`}>
                          {item.profitable === 1
                            ? "Profitable"
                            : "Not Profitable"}
                        </div>
                      </div>

                      {/* STATS */}

                      <div className="grid md:grid-cols-4 gap-4">
                        <div className="bg-white/5 rounded-xl p-4">
                          <p className="text-gray-400 text-xs">ROI</p>

                          <h3 className="text-green-400 font-bold text-xl mt-1">
                            {item.roi}%
                          </h3>

                          {prev && (
                            <p
                              className={`text-xs mt-1 ${
                                item.roi > prev.roi
                                  ? "text-green-400"
                                  : "text-red-400"
                              }`}>
                              {item.roi > prev.roi
                                ? `+${(item.roi - prev.roi).toFixed(1)}%`
                                : `${(item.roi - prev.roi).toFixed(1)}%`}
                            </p>
                          )}
                        </div>

                        <div className="bg-white/5 rounded-xl p-4">
                          <p className="text-gray-400 text-xs">AI SCORE</p>

                          <h3 className="text-cyan-400 font-bold text-xl mt-1">
                            {item.ai_score}
                          </h3>

                          {prev && (
                            <p
                              className={`text-xs mt-1 ${
                                item.ai_score > prev.ai_score
                                  ? "text-green-400"
                                  : "text-red-400"
                              }`}>
                              {item.ai_score > prev.ai_score
                                ? `+${item.ai_score - prev.ai_score}`
                                : `${item.ai_score - prev.ai_score}`}
                            </p>
                          )}
                        </div>

                        <div className="bg-white/5 rounded-xl p-4">
                          <p className="text-gray-400 text-xs">PROFIT</p>

                          <h3 className="text-yellow-400 font-bold text-lg mt-1">
                            {formatMoney(item.estimated_profit)}
                          </h3>
                        </div>

                        <div className="bg-white/5 rounded-xl p-4">
                          <p className="text-gray-400 text-xs">SUCCESS</p>

                          <h3 className="text-purple-400 font-bold text-xl mt-1">
                            {item.success_rate}%
                          </h3>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card>
          )}

          {/* ================= TOP ASTEROIDS ================= */}

          {history.length > 2 && (
            <Card className="p-6 mt-6 bg-white/5 border border-white/10 backdrop-blur-xl">
              <div className="flex items-center gap-2 mb-6">
                <FaGem className="text-pink-400" />

                <h3 className="text-white font-semibold text-lg">
                  Top Profitable Asteroids
                </h3>
              </div>

              <div className="space-y-4">
                {[...history]
                  .sort((a, b) => b.roi - a.roi)
                  .slice(0, 5)
                  .map((a, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between bg-black/30 border border-white/10 rounded-xl px-5 py-4">
                      <div>
                        <h4 className="text-white font-semibold">
                          #{i + 1} {a.name}
                        </h4>

                        <p className="text-xs text-gray-400 mt-1">
                          {a.metal_type} • {a.orbit_class}
                        </p>
                      </div>

                      <div className="text-right">
                        <p className="text-green-400 font-bold text-lg">
                          {a.roi}%
                        </p>

                        <p className="text-xs text-gray-400">ROI</p>
                      </div>
                    </div>
                  ))}
              </div>
            </Card>
          )}
        </div>

        {/* RIGHT */}

        <div>
          <Card className="p-6 bg-white/5 border border-white/10 backdrop-blur-xl">
            <h3 className="text-white mb-4 flex items-center gap-2 font-semibold">
              <FaHistory />
              Search History
            </h3>

            {history.length === 0 && (
              <p className="text-gray-400 text-sm">No searches yet</p>
            )}

            {history.map((h, i) => (
              <div key={i} className="mb-4 border-b border-white/10 pb-3">
                <div className="flex justify-between">
                  <span className="font-semibold text-white">{h.name}</span>

                  <span className="text-green-400">{h.roi}%</span>
                </div>

                <p className="text-xs text-gray-400 mt-1">
                  {Math.round(h.diameter)}m{" • "}
                  {Math.round(h.velocity).toLocaleString()}
                  km/h
                </p>

                <p className="text-xs text-green-400 mt-1">
                  {formatMoney(h.estimated_profit)}
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
