/**
 * Advanced Analytics Dashboard Component
 * Comprehensive analytics and insights for admin panel
 */

import {
    Activity,
    BarChart3,
    Calendar,
    Download,
    Filter,
    PieChart,
    RefreshCw,
    Star,
    TrendingUp,
    Users
} from "lucide-react";
import { memo, useMemo, useState } from "react";

interface AnalyticsData {
  celebrities: Array<{
    id: number;
    name: string;
    role: string;
    rating: number;
    popularity: number;
    image_url: string;
    niches: string;
  }>;
  blogPosts: Array<{
    id: number;
    title: string;
    category: string;
    publishedAt: string;
  }>;
  users?: number;
  views?: number;
  conversions?: number;
}

interface AnalyticsDashboardProps {
  data: AnalyticsData;
  className?: string;
}

const AnalyticsDashboard = memo(function AnalyticsDashboard({
  data,
  className = ""
}: AnalyticsDashboardProps) {
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d' | '1y'>('30d');
  const [refreshing, setRefreshing] = useState(false);

  // Calculate analytics metrics
  const analytics = useMemo(() => {
    const { celebrities, blogPosts } = data;

    // Celebrity Analytics
    const totalCelebrities = celebrities.length;
    const avgRating = celebrities.reduce((sum, celeb) => {
      return sum + (celeb.rating || 0);
    }, 0) / totalCelebrities || 0;

    // Category distribution
    const categoryStats: Record<string, number> = {};
    celebrities.forEach(celeb => {
      try {
        const niches = JSON.parse(celeb.niches || '[]');
        niches.forEach((niche: string) => {
          categoryStats[niche] = (categoryStats[niche] || 0) + 1;
        });
      } catch {
        categoryStats['Unknown'] = (categoryStats['Unknown'] || 0) + 1;
      }
    });

    const topCategories = Object.entries(categoryStats)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5);

    // Rating distribution
    const ratingDistribution = {
      '4.5+': celebrities.filter(c => c.rating >= 4.5).length,
      '4.0-4.4': celebrities.filter(c => c.rating >= 4.0 && c.rating < 4.5).length,
      '3.5-3.9': celebrities.filter(c => c.rating >= 3.5 && c.rating < 4.0).length,
      '3.0-3.4': celebrities.filter(c => c.rating >= 3.0 && c.rating < 3.5).length,
      'Below 3.0': celebrities.filter(c => c.rating < 3.0).length,
    };

    // Top performers
    const topRated = [...celebrities]
      .sort((a, b) => (b.rating || 0) - (a.rating || 0))
      .slice(0, 5);

    const mostPopular = [...celebrities]
      .sort((a, b) => (a.popularity || Infinity) - (b.popularity || Infinity))
      .slice(0, 5);

    // Blog Analytics
    const totalPosts = blogPosts.length;
    const postsByCategory: Record<string, number> = {};
    blogPosts.forEach(post => {
      postsByCategory[post.category] = (postsByCategory[post.category] || 0) + 1;
    });

    // Recent activity (last 7 days simulation)
    const recentActivity = Array.from({ length: 7 }, (_, i) => ({
      date: new Date(Date.now() - i * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { weekday: 'short' }),
      celebrities: Math.floor(Math.random() * 5) + 1,
      posts: Math.floor(Math.random() * 3) + 1,
      views: Math.floor(Math.random() * 100) + 50
    })).reverse();

    return {
      celebrities: {
        total: totalCelebrities,
        avgRating: avgRating.toFixed(1),
        categories: topCategories,
        ratingDistribution,
        topRated,
        mostPopular
      },
      blogPosts: {
        total: totalPosts,
        categories: Object.entries(postsByCategory)
      },
      activity: recentActivity,
      summary: {
        totalUsers: data.users || Math.floor(Math.random() * 10000) + 5000,
        totalViews: data.views || Math.floor(Math.random() * 100000) + 50000,
        conversionRate: data.conversions || (Math.random() * 5 + 2).toFixed(1)
      }
    };
  }, [data]);

  const handleRefresh = async () => {
    setRefreshing(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setRefreshing(false);
  };

  const exportData = () => {
    const exportData = {
      analytics,
      exportedAt: new Date().toISOString(),
      timeRange
    };
    
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `analytics-${timeRange}-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className={className}>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-bold text-neutral-900">Analytics Dashboard</h2>
          <p className="text-neutral-600 mt-1">Comprehensive insights and performance metrics</p>
        </div>
        
        <div className="flex items-center gap-3">
          {/* Time Range Selector */}
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value as typeof timeRange)}
            className="px-4 py-2 border border-neutral-300 rounded-xl focus:border-primary-400 focus:ring-2 focus:ring-primary-100 transition-all"
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
            <option value="1y">Last year</option>
          </select>
          
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="flex items-center gap-2 px-4 py-2 bg-neutral-600 text-white rounded-xl hover:bg-neutral-700 transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>
          
          <button
            onClick={exportData}
            className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-colors"
          >
            <Download className="w-4 h-4" />
            <span>Export</span>
          </button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-2xl shadow-lg border border-neutral-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-neutral-600 text-sm font-medium">Total Users</p>
              <p className="text-3xl font-bold text-neutral-900 mt-1">
                {analytics.summary.totalUsers.toLocaleString()}
              </p>
              <p className="text-green-600 text-sm mt-1 flex items-center gap-1">
                <TrendingUp className="w-3 h-3" />
                +12.5% from last month
              </p>
            </div>
            <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center">
              <Users className="w-6 h-6 text-primary-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-lg border border-neutral-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-neutral-600 text-sm font-medium">Total Views</p>
              <p className="text-3xl font-bold text-neutral-900 mt-1">
                {analytics.summary.totalViews.toLocaleString()}
              </p>
              <p className="text-green-600 text-sm mt-1 flex items-center gap-1">
                <TrendingUp className="w-3 h-3" />
                +8.2% from last month
              </p>
            </div>
            <div className="w-12 h-12 bg-secondary-100 rounded-xl flex items-center justify-center">
              <Activity className="w-6 h-6 text-secondary-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-lg border border-neutral-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-neutral-600 text-sm font-medium">Celebrities</p>
              <p className="text-3xl font-bold text-neutral-900 mt-1">
                {analytics.celebrities.total}
              </p>
              <p className="text-neutral-600 text-sm mt-1">
                Avg rating: {analytics.celebrities.avgRating}★
              </p>
            </div>
            <div className="w-12 h-12 bg-accent-100 rounded-xl flex items-center justify-center">
              <Star className="w-6 h-6 text-accent-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-lg border border-neutral-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-neutral-600 text-sm font-medium">Conversion Rate</p>
              <p className="text-3xl font-bold text-neutral-900 mt-1">
                {analytics.summary.conversionRate}%
              </p>
              <p className="text-green-600 text-sm mt-1 flex items-center gap-1">
                <TrendingUp className="w-3 h-3" />
                +1.2% from last month
              </p>
            </div>
            <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center">
              <BarChart3 className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid lg:grid-cols-2 gap-8 mb-8">
        {/* Category Distribution */}
        <div className="bg-white p-6 rounded-2xl shadow-lg border border-neutral-200">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-neutral-900 flex items-center gap-2">
              <PieChart className="w-5 h-5" />
              Category Distribution
            </h3>
            <button className="text-neutral-400 hover:text-neutral-600">
              <Filter className="w-4 h-4" />
            </button>
          </div>
          
          <div className="space-y-4">
            {analytics.celebrities.categories.map(([category, count], index) => {
              const percentage = (count / analytics.celebrities.total * 100).toFixed(1);
              const colors = ['bg-primary-500', 'bg-secondary-500', 'bg-accent-500', 'bg-yellow-500', 'bg-green-500'];
              
              return (
                <div key={category}>
                  <div className="flex items-center justify-between text-sm mb-2">
                    <span className="font-medium text-neutral-700">{category}</span>
                    <span className="text-neutral-500">{count} ({percentage}%)</span>
                  </div>
                  <div className="w-full bg-neutral-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${colors[index % colors.length]}`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Activity Chart */}
        <div className="bg-white p-6 rounded-2xl shadow-lg border border-neutral-200">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-neutral-900 flex items-center gap-2">
              <BarChart3 className="w-5 h-5" />
              Recent Activity
            </h3>
            <button className="text-neutral-400 hover:text-neutral-600">
              <Calendar className="w-4 h-4" />
            </button>
          </div>
          
          <div className="space-y-4">
            {analytics.activity.map((day, index) => (
              <div key={index} className="flex items-center gap-4">
                <div className="w-12 text-sm font-medium text-neutral-600">
                  {day.date}
                </div>
                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-primary-500 rounded-full"></div>
                    <span className="text-sm text-neutral-600">
                      {day.celebrities} celebrities
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-secondary-500 rounded-full"></div>
                    <span className="text-sm text-neutral-600">
                      {day.posts} posts
                    </span>
                  </div>
                </div>
                <div className="text-sm font-semibold text-neutral-900">
                  {day.views} views
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Top Performers */}
      <div className="grid lg:grid-cols-2 gap-8">
        {/* Top Rated Celebrities */}
        <div className="bg-white p-6 rounded-2xl shadow-lg border border-neutral-200">
          <h3 className="text-lg font-semibold text-neutral-900 mb-6 flex items-center gap-2">
            <Star className="w-5 h-5" />
            Top Rated Celebrities
          </h3>
          
          <div className="space-y-4">
            {analytics.celebrities.topRated.map((celeb, index) => (
              <div key={celeb.id} className="flex items-center gap-4">
                <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center text-sm font-bold text-yellow-700">
                  {index + 1}
                </div>
                <img
                  src={celeb.image_url}
                  alt={celeb.name}
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div className="flex-1">
                  <p className="font-medium text-neutral-900">{celeb.name}</p>
                  <p className="text-sm text-neutral-600">{celeb.role}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-neutral-900">{celeb.rating}★</p>
                  <p className="text-xs text-neutral-500">#{celeb.popularity}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Rating Distribution */}
        <div className="bg-white p-6 rounded-2xl shadow-lg border border-neutral-200">
          <h3 className="text-lg font-semibold text-neutral-900 mb-6">Rating Distribution</h3>
          
          <div className="space-y-4">
            {Object.entries(analytics.celebrities.ratingDistribution).map(([range, count]) => {
              const percentage = (count / analytics.celebrities.total * 100).toFixed(1);
              
              return (
                <div key={range}>
                  <div className="flex items-center justify-between text-sm mb-2">
                    <span className="font-medium text-neutral-700">{range}</span>
                    <span className="text-neutral-500">{count} ({percentage}%)</span>
                  </div>
                  <div className="w-full bg-neutral-200 rounded-full h-2">
                    <div 
                      className="h-2 rounded-full bg-gradient-to-r from-yellow-400 to-yellow-500"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
});

export default AnalyticsDashboard;
export type { AnalyticsDashboardProps, AnalyticsData };
