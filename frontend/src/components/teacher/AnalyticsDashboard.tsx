import { useEffect, useState } from "react";
import { getAllReportsApi } from "../../api/testApi";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, TrendingUp, Users, Award, AlertCircle } from "lucide-react";

const COLORS = ["#8b5cf6", "#10b981", "#f43f5e", "#f59e0b"];

export default function AnalyticsDashboard() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<any>({
    totalTests: 0,
    avgScore: 0,
    passRate: 0,
    topicPerformance: [],
    activityData: [],
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await getAllReportsApi();
      const tests = res.data.tests || [];
      processData(tests);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const processData = (tests: any[]) => {
    if (tests.length === 0) return;

    // 1. Basic Stats
    const totalTests = tests.length;
    const totalScore = tests.reduce((acc, t) => acc + (t.score || 0), 0);
    // Assuming max score is usually total MCQs, avoiding div by zero. 
    // We'll normalize to percentage for average.
    let sumPercentages = 0;
    
    // 2. Topic Performance
    const topicMap: any = {};
    
    // 3. Activity (by date)
    const dateMap: any = {};

    let passedCount = 0;

    tests.forEach((t) => {
      const total = t.mcqs?.length || 1; 
      const pct = (t.score / total) * 100;
      sumPercentages += pct;

      if (pct >= 50) passedCount++;

      // Topic
      const topicName = t.topic?.name || "Unknown";
      if (!topicMap[topicName]) topicMap[topicName] = { name: topicName, score: 0, count: 0 };
      topicMap[topicName].score += pct;
      topicMap[topicName].count += 1;

      // Date
      const date = new Date(t.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" });
      if (!dateMap[date]) dateMap[date] = 0;
      dateMap[date] += 1;
    });

    const avgScore = totalTests ? (sumPercentages / totalTests).toFixed(1) : 0;
    const passRate = totalTests ? ((passedCount / totalTests) * 100).toFixed(1) : 0;

    // Format Topic Data
    const topicPerformance = Object.values(topicMap).map((t: any) => ({
      name: t.name,
      avg: Math.round(t.score / t.count),
    }));

    // Format Activity Data (sort by date if possible, here simple)
    const activityData = Object.keys(dateMap).map((date) => ({
      date,
      tests: dateMap[date],
    })).slice(-7); // last 7 days roughly

    setStats({
      totalTests,
      avgScore,
      passRate,
      topicPerformance,
      activityData,
    });
  };

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="animate-spin text-primary" size={32} />
      </div>
    );
  }

  if (stats.totalTests === 0) {
    return (
      <div className="text-center p-12 bg-muted/10 rounded-xl border border-dashed">
        <p className="text-muted-foreground">Not enough data to generic analytics yet.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="shadow-sm border-border/50 bg-white/60 dark:bg-black/20 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Tests</CardTitle>
            <Users className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalTests}</div>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-border/50 bg-white/60 dark:bg-black/20 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Average Score</CardTitle>
            <Award className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.avgScore}%</div>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-border/50 bg-white/60 dark:bg-black/20 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Pass Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.passRate}%</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Bar Chart - Topic Performance */}
        <Card className="shadow-sm border-border/50">
          <CardHeader>
            <CardTitle className="text-lg font-heading">Performance by Topic</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.topicPerformance}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                <XAxis dataKey="name" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip 
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                    cursor={{ fill: 'rgba(0,0,0,0.05)' }}
                />
                <Bar dataKey="avg" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Line Chart - Activity */}
        <Card className="shadow-sm border-border/50">
          <CardHeader>
            <CardTitle className="text-lg font-heading">Recent Activity</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={stats.activityData}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                <XAxis dataKey="date" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis fontSize={12} tickLine={false} axisLine={false} allowDecimals={false} />
                <Tooltip 
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                />
                <Line type="monotone" dataKey="tests" stroke="#10b981" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
