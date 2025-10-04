import React from "react";
import { motion } from "framer-motion";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  BarChart,
  Bar,
  ResponsiveContainer,
  Legend,
  AreaChart,
  Area,
  RadialBarChart,
  RadialBar
} from "recharts";

// --- mock data ---
const kpis = [
  { label: "# Departments", value: 12 },
  { label: "Pts Today", value: 80 },
  { label: "Admits", value: 102 },
  { label: "Discharges", value: 76 },
];

const trendSelfPay = [
  { t: "08:00", v: 12 },
  { t: "10:00", v: 18 },
  { t: "12:00", v: 25 },
  { t: "14:00", v: 22 },
  { t: "16:00", v: 30 },
  { t: "18:00", v: 26 },
];
const trendRural = trendSelfPay.map((d, i) => ({ t: d.t, v: d.v + 8 - (i % 3) }));
const trendMedical = trendSelfPay.map((d, i) => ({ t: d.t, v: d.v + 14 - (i % 4) }));

const ranking = [
  { disease: "Gastritis", out: 726, prop: 31 },
  { disease: "Apoplexy", out: 600, prop: 27 },
  { disease: "Malaria", out: 625, prop: 29 },
  { disease: "Gout", out: 860, prop: 35 },
];

const evalData = [
  { name: "Japan", hospital: 88, doctor: 82 },
  { name: "India", hospital: 64, doctor: 58 },
  { name: "USA", hospital: 91, doctor: 89 },
  { name: "Germany", hospital: 86, doctor: 84 },
  { name: "Russia", hospital: 70, doctor: 67 },
];

const mechanism = [
  { name: "Village Hosp.", uv: 28 },
  { name: "Village Clinic", uv: 18 },
  { name: "Community Ctr", uv: 31 },
  { name: "Tertiary", uv: 30 },
  { name: "Secondary", uv: 32 },
  { name: "Primary", uv: 52 },
];

const rehab = [
  { name: "Treatment", val: 203 },
  { name: "Rehabilitation", val: 159 },
  { name: "Hospitalization", val: 148 },
];

// --- tiny UI helpers ---
const Card = ({ children, className = "" }) => (
  <div className={`rounded-2xl bg-slate-900/60 border border-cyan-400/20 shadow-lg shadow-cyan-500/10 ${className}`}>{children}</div>
);

const SectionTitle = ({ children }) => (
  <div className="text-sm tracking-wider text-cyan-300/90 uppercase font-semibold pt-3 pb-2 px-4">{children}</div>
);

// Neon grid backdrop
const GridBg = () => (
  <div className="pointer-events-none absolute inset-0 overflow-hidden">
    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(14,165,233,0.15),transparent_60%)]" />
    <svg className="absolute inset-0 h-full w-full opacity-20" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
          <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="0.5" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#grid)" className="text-cyan-500" />
    </svg>
  </div>
);

// Stylized human body outline (SVG)
const HumanFigure = () => (
  <svg viewBox="0 0 300 600" className="w-full max-w-[360px] mx-auto">
    <defs>
      <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
        <feDropShadow dx="0" dy="0" stdDeviation="6" floodColor="#22d3ee" floodOpacity="0.7" />
      </filter>
      <linearGradient id="neon" x1="0" x2="0" y1="0" y2="1">
        <stop offset="0%" stopColor="#22d3ee" />
        <stop offset="100%" stopColor="#34d399" />
      </linearGradient>
    </defs>
    {/* torso */}
    <path d="M150 90c25 0 45 20 45 45v40c0 10 8 22 18 26l3 1v12c-20 8-34 28-34 50v170h-64V264c0-22-14-42-34-50v-12l3-1c10-4 18-16 18-26v-40c0-25 20-45 45-45Z" fill="none" stroke="url(#neon)" strokeWidth="3" filter="url(#glow)" />
    {/* head */}
    <circle cx="150" cy="60" r="28" fill="none" stroke="url(#neon)" strokeWidth="3" filter="url(#glow)" />
    {/* arms */}
    <path d="M55 210h70M175 210h70" stroke="url(#neon)" strokeWidth="3" strokeLinecap="round" filter="url(#glow)" />
    {/* legs */}
    <path d="M150 396v160M118 556h-18M182 556h18" stroke="url(#neon)" strokeWidth="3" strokeLinecap="round" filter="url(#glow)" />
    {/* pelvis ring */}
    <ellipse cx="150" cy="340" rx="38" ry="26" fill="none" stroke="url(#neon)" strokeWidth="3" filter="url(#glow)" />
  </svg>
);

export default function App() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 relative">
      <GridBg />
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between rounded-2xl border border-cyan-400/20 bg-slate-900/60 px-5 py-4 shadow-lg shadow-cyan-500/10"
        >
          <div>
            <h1 className="text-xl md:text-2xl font-bold tracking-wide text-cyan-300">Intelligent Medical Visualization</h1>
            <p className="text-xs text-slate-400">Live telemetry · Synthetic data for demo</p>
          </div>
          <div className="flex gap-3">
            {kpis.map((k) => (
              <div key={k.label} className="text-center">
                <div className="text-2xl font-bold text-emerald-300">{k.value}</div>
                <div className="text-[10px] uppercase tracking-wider text-slate-400">{k.label}</div>
              </div>
            ))}
          </div>
        </motion.div>

        <div className="grid grid-cols-12 gap-4 mt-4">
          {/* Left column */}
          <div className="col-span-12 lg:col-span-4 space-y-4">
            <Card>
              <SectionTitle>Statistics</SectionTitle>
              <div className="px-4 pb-4 grid grid-cols-3 gap-4 text-slate-300">
                <div className="col-span-3 text-xs text-slate-400">Rural · Self-pay · Medical</div>
                <div className="col-span-3 space-y-3">
                  <div className="h-24">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={trendRural} margin={{ left: 0, right: 0, top: 10, bottom: 0 }}>
                        <defs>
                          <linearGradient id="c1" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#22d3ee" stopOpacity={0.6} />
                            <stop offset="95%" stopColor="#22d3ee" stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid vertical={false} strokeOpacity={0.1} />
                        <XAxis dataKey="t" tick={{ fontSize: 10 }} tickLine={false} axisLine={false} />
                        <YAxis hide />
                        <Tooltip contentStyle={{ background: "#0b1220", border: "1px solid #164e63" }} />
                        <Area type="monotone" dataKey="v" stroke="#22d3ee" fill="url(#c1)" strokeWidth={2} />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="h-24">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={trendSelfPay} margin={{ left: 0, right: 0, top: 10, bottom: 0 }}>
                        <defs>
                          <linearGradient id="c2" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#34d399" stopOpacity={0.6} />
                            <stop offset="95%" stopColor="#34d399" stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid vertical={false} strokeOpacity={0.1} />
                        <XAxis dataKey="t" tick={{ fontSize: 10 }} tickLine={false} axisLine={false} />
                        <YAxis hide />
                        <Tooltip contentStyle={{ background: "#0b1220", border: "1px solid #164e63" }} />
                        <Area type="monotone" dataKey="v" stroke="#34d399" fill="url(#c2)" strokeWidth={2} />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="h-24">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={trendMedical} margin={{ left: 0, right: 0, top: 10, bottom: 0 }}>
                        <defs>
                          <linearGradient id="c3" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#818cf8" stopOpacity={0.6} />
                            <stop offset="95%" stopColor="#818cf8" stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid vertical={false} strokeOpacity={0.1} />
                        <XAxis dataKey="t" tick={{ fontSize: 10 }} tickLine={false} axisLine={false} />
                        <YAxis hide />
                        <Tooltip contentStyle={{ background: "#0b1220", border: "1px solid #312e81" }} />
                        <Area type="monotone" dataKey="v" stroke="#818cf8" fill="url(#c3)" strokeWidth={2} />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>
                <div className="col-span-3 mt-4">
                  <SectionTitle>Ranking</SectionTitle>
                  <div className="px-4 pb-4">
                    <table className="w-full text-xs">
                      <thead className="text-slate-400">
                        <tr>
                          <th className="text-left font-normal">Disease</th>
                          <th className="text-right font-normal">Outpatient</th>
                          <th className="text-right font-normal">Prop</th>
                        </tr>
                      </thead>
                      <tbody>
                        {ranking.map((r) => (
                          <tr key={r.disease} className="border-t border-white/5">
                            <td className="py-1.5">{r.disease}</td>
                            <td className="py-1.5 text-right">{r.out}</td>
                            <td className="py-1.5 text-right">{r.prop}%</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Center column */}
          <div className="col-span-12 lg:col-span-4">
            <Card className="relative flex items-center justify-center h-full min-h-[540px]">
              <div className="absolute -top-2 left-1/2 -translate-x-1/2 text-xs text-cyan-300/80">Human Model · v1.0</div>
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-48 h-3 rounded-full bg-cyan-300/10 blur-sm" />
              <HumanFigure />
            </Card>
          </div>

          {/* Right column */}
          <div className="col-span-12 lg:col-span-4 space-y-4">
            <Card>
              <SectionTitle>Mechanism</SectionTitle>
              <div className="px-4 pb-4">
                <div className="h-36">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={mechanism} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
                      <CartesianGrid strokeOpacity={0.1} vertical={false} />
                      <XAxis dataKey="name" tick={{ fontSize: 10 }} tickLine={false} axisLine={false} />
                      <YAxis width={26} tick={{ fontSize: 10 }} axisLine={false} tickLine={false} />
                      <Tooltip contentStyle={{ background: "#0b1220", border: "1px solid #164e63" }} />
                      <Bar dataKey="uv" radius={[6, 6, 0, 0]} fill="#22d3ee" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </Card>

            <Card>
              <SectionTitle>Care Pipeline</SectionTitle>
              <div className="px-4 pb-4 grid grid-cols-3 gap-4 text-xs">
                {rehab.map((r) => (
                  <div key={r.name} className="col-span-1">
                    <div className="text-slate-400 mb-2">{r.name}</div>
                    <div className="h-28">
                      <ResponsiveContainer width="100%" height="100%">
                        <RadialBarChart innerRadius="70%" outerRadius="100%" data={[{ name: r.name, uv: r.val }]} startAngle={180} endAngle={0}>
                          <RadialBar dataKey="uv" cornerRadius={10} fill="#34d399" />
                          <Tooltip contentStyle={{ background: "#0b1220", border: "1px solid #065f46" }} />
                        </RadialBarChart>
                      </ResponsiveContainer>
                    </div>
                    <div className="mt-2 text-center text-emerald-300 font-semibold">{r.val}</div>
                  </div>
                ))}
              </div>
            </Card>

            <Card>
              <SectionTitle>Global Evaluation</SectionTitle>
              <div className="px-4 pb-4 h-44">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={evalData} margin={{ top: 8, right: 16, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeOpacity={0.1} vertical={false} />
                    <XAxis dataKey="name" tick={{ fontSize: 10 }} tickLine={false} axisLine={false} />
                    <YAxis width={28} tick={{ fontSize: 10 }} axisLine={false} tickLine={false} />
                    <Tooltip contentStyle={{ background: "#0b1220", border: "1px solid #164e63" }} />
                    <Legend wrapperStyle={{ fontSize: 10 }} />
                    <Bar dataKey="hospital" stackId="a" fill="#22d3ee" radius={[6,6,0,0]} />
                    <Bar dataKey="doctor" stackId="a" fill="#34d399" radius={[6,6,0,0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Card>
          </div>
        </div>

        {/* bottom strip */}
        <div className="grid grid-cols-12 gap-4 mt-4">
          <div className="col-span-12">
            <Card className="p-4">
              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <div className="text-xs text-slate-400 mb-2">Admissions vs Discharges</div>
                  <div className="h-36">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={trendMedical}>
                        <CartesianGrid strokeOpacity={0.1} />
                        <XAxis dataKey="t" tick={{ fontSize: 10 }} tickLine={false} axisLine={false} />
                        <YAxis width={26} tick={{ fontSize: 10 }} axisLine={false} tickLine={false} />
                        <Tooltip contentStyle={{ background: "#0b1220", border: "1px solid #312e81" }} />
                        <Line type="monotone" dataKey="v" stroke="#22d3ee" strokeWidth={2} dot={false} />
                        <Line type="monotone" dataKey="v" stroke="#34d399" strokeWidth={2} dot={false} strokeDasharray="4 4" />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>
                <div>
                  <div className="text-xs text-slate-400 mb-2">Queue Length</div>
                  <div className="h-36">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={trendSelfPay}>
                        <defs>
                          <linearGradient id="q1" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#22d3ee" stopOpacity={0.5} />
                            <stop offset="95%" stopColor="#22d3ee" stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeOpacity={0.08} />
                        <XAxis dataKey="t" tick={{ fontSize: 10 }} tickLine={false} axisLine={false} />
                        <YAxis width={26} tick={{ fontSize: 10 }} axisLine={false} tickLine={false} />
                        <Tooltip contentStyle={{ background: "#0b1220", border: "1px solid #164e63" }} />
                        <Area type="monotone" dataKey="v" stroke="#22d3ee" fill="url(#q1)" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>
                <div>
                  <div className="text-xs text-slate-400 mb-2">Utilization</div>
                  <div className="h-36">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={evalData}>
                        <CartesianGrid strokeOpacity={0.08} vertical={false} />
                        <XAxis dataKey="name" tick={{ fontSize: 10 }} tickLine={false} axisLine={false} />
                        <YAxis width={26} tick={{ fontSize: 10 }} axisLine={false} tickLine={false} />
                        <Tooltip contentStyle={{ background: "#0b1220", border: "1px solid #164e63" }} />
                        <Bar dataKey="hospital" fill="#34d399" radius={[6,6,0,0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
