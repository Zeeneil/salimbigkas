import React, { useState, useEffect } from 'react';
import { doGetDescriptiveAnalytics } from '../../api/functions';
import {BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend, LineChart, Line} from 'recharts';
import DashboardCard from '../Card/DashboardCard';
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

const AdminAnalyticsTab = ({ Tab }: { Tab: () => string }) => {

  const [analytics, setAnalytics] = useState<any>(null);

  useEffect(() => {
    if (Tab() === "analytics") {
      const fetchAnalytics = async () => {
        const response = await doGetDescriptiveAnalytics() as any;
        if (response?.data) {
          setAnalytics(response.data);
        }
      };
      fetchAnalytics();
    }
  }, [Tab]);

  // Prepare data for charts
  const lessonsCompletedData = analytics
    ? Object.entries(analytics.lessonsCompletedPerStudent).map(([uid, count]) => ({
        uid,
        count: Number(count),
      }))
    : [];

  const dailyActiveData = analytics
    ? Object.entries(analytics.dailyActive).map(([date, count]) => ({
        date,
        count: Number(count),
      }))
    : [];

  const avgTimeSpentData = analytics
    ? Object.entries(analytics.avgTimeSpentPerLesson).map(([lessonId, avg]) => ({
        lessonId,
        avg: Number(avg),
      }))
    : [];

  const handleDownloadPDF = async () => {
    const dashboard = document.getElementById("analytics-dashboard");
    if (!dashboard) return;
    const canvas = await html2canvas(dashboard, { scale: 2 });
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF({
      orientation: "landscape",
      unit: "px",
      format: [canvas.width, canvas.height],
    });
    pdf.addImage(imgData, "PNG", 0, 0, canvas.width, canvas.height);
    pdf.save("analytics-report.pdf");
  };

  return (
      <>
        {Tab() === "analytics" && (
            <div id='analytics-dashboard' className="p-8 space-y-8 bg-gradient-to-br from-gray-50 to-white min-h-[80vh] rounded-xl shadow-lg">
              <div className="flex items-center justify-between">
                <h1 className="text-3xl font-extrabold tracking-tight text-gray-900">
                  Analytics Dashboard
                </h1>
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                  Updated {analytics ? "now" : "..."}
                </span>
                <button
                  type="button"
                  onClick={handleDownloadPDF}
                  className="ml-4 px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition"
                  title="Download PDF"
                >
                  Download PDF
                </button>
              </div>
              {analytics ? (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                    <DashboardCard
                      title="Total Students"
                      value={Object.keys(analytics?.lessonsCompletedPerStudent).length}
                      subtitle="+X% from last month"
                    />
                    <DashboardCard
                      title="Average Quiz Score"
                      value={analytics.avgQuizScore.toFixed(2)}
                      subtitle="All quizzes"
                    />
                    <DashboardCard
                      title="Active Days"
                      value={Object.keys(analytics.dailyActive).length}
                      subtitle="Days with activity"
                    />
                  </div>
                  <div className="pt-2">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-md flex flex-col">
                        <h3 className="font-semibold mb-4 text-gray-700 dark:text-gray-200">
                          Lessons Completed per Student
                        </h3>
                        <ResponsiveContainer width="100%" height={220}>
                          <BarChart data={lessonsCompletedData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="uid" tick={{ fontSize: 12 }} />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="count" fill="#6366f1" name="Lessons Completed" radius={[8, 8, 0, 0]} />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                      <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-md flex flex-col">
                        <h3 className="font-semibold mb-4 text-gray-700 dark:text-gray-200">
                          Daily Active Users
                        </h3>
                        <ResponsiveContainer width="100%" height={220}>
                          <LineChart data={dailyActiveData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Line type="monotone" dataKey="count" stroke="#10b981" strokeWidth={3} dot={{ r: 4 }} name="Active Users" />
                          </LineChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                    <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-md mt-8">
                      <h3 className="font-semibold mb-4 text-gray-700 dark:text-gray-200">
                        Average Time Spent per Lesson
                      </h3>
                      <ResponsiveContainer width="100%" height={220}>
                        <BarChart data={avgTimeSpentData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="lessonId" tick={{ fontSize: 12 }} />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="avg" fill="#f59e42" name="Avg Time (s)" radius={[8, 8, 0, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex items-center justify-center h-64">
                  <svg className="animate-spin h-8 w-8 text-blue-500 mr-3" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                  </svg>
                  <span className="text-lg text-gray-600 dark:text-gray-300">Loading analytics...</span>
                </div>
              )}
            </div>
        )}
      </>
  );
}

export default AdminAnalyticsTab;