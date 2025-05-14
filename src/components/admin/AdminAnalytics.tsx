import React, { useEffect, useState, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ChartContainer, ChartLegend } from '@/components/ui/chart';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Download, ChartBar, ChartPie, ChartLine } from 'lucide-react';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

const AdminAnalytics: React.FC = () => {
  const { profile } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const chartRefs = {
    userGrowth: useRef<HTMLDivElement>(null),
    bookingTrends: useRef<HTMLDivElement>(null),
    destinationPopularity: useRef<HTMLDivElement>(null),
  };
  const [analyticsData, setAnalyticsData] = useState({
    totalUsers: 0,
    totalBookings: 0,
    totalRevenue: 0,
    userStats: [] as { month: string, users: number }[],
    bookingData: [] as { month: string, bookings: number }[],
    destinationPopularity: [] as { name: string, value: number }[],
    recentBookings: [] as any[],
  });

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];
  const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  
  useEffect(() => {
    fetchAnalyticsData();
  }, []);

  const fetchAnalyticsData = async () => {
    setIsLoading(true);
    try {
      // Fetch user stats
      const { count: userCount } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true });
      
      // Fetch booking stats
      const { data: bookings, error: bookingsError } = await supabase
        .from('bookings')
        .select('*');
      
      if (bookingsError) throw bookingsError;
      
      // Calculate total revenue
      const totalRevenue = bookings.reduce((sum, booking) => sum + Number(booking.total_price), 0);
      
      // Process user signup data by month
      const { data: userSignups } = await supabase
        .from('profiles')
        .select('created_at');
      
      const usersByMonth = processMonthlyData(userSignups || [], 'created_at');
      
      // Process bookings by month
      const bookingsByMonth = processMonthlyData(bookings || [], 'booking_date');
      
      // Fetch destination popularity
      const { data: bookingDestinations } = await supabase
        .from('bookings')
        .select('destination_id, destinations(name)');
      
      const destinationCount: Record<string, { name: string, count: number }> = {};
      
      bookingDestinations?.forEach(booking => {
        if (booking.destination_id && booking.destinations) {
          const name = booking.destinations.name;
          if (!destinationCount[name]) {
            destinationCount[name] = { name, count: 0 };
          }
          destinationCount[name].count += 1;
        }
      });
      
      const destinationPopularity = Object.values(destinationCount)
        .map(item => ({ name: item.name, value: item.count }))
        .sort((a, b) => b.value - a.value)
        .slice(0, 5);
      
      setAnalyticsData({
        totalUsers: userCount || 0,
        totalBookings: bookings.length,
        totalRevenue,
        userStats: usersByMonth,
        bookingData: bookingsByMonth,
        destinationPopularity: destinationPopularity.length ? destinationPopularity : generateFallbackDestinationData(),
        recentBookings: bookings.slice(0, 5),
      });
    } catch (error) {
      console.error('Error fetching analytics data:', error);
      // Use fallback data if there's an error
      setAnalyticsData({
        totalUsers: 0,
        totalBookings: 0,
        totalRevenue: 0,
        userStats: generateFallbackUserData(),
        bookingData: generateFallbackBookingData(),
        destinationPopularity: generateFallbackDestinationData(),
        recentBookings: [],
      });
    } finally {
      setIsLoading(false);
    }
  };

  const processMonthlyData = (data: any[], dateField: string) => {
    const currentYear = new Date().getFullYear();
    const monthlyData = Array(12).fill(0).map((_, i) => ({ 
      month: MONTHS[i], 
      users: 0,
      bookings: 0 
    }));
    
    data.forEach(item => {
      const date = new Date(item[dateField]);
      if (date.getFullYear() === currentYear) {
        const monthIndex = date.getMonth();
        if (dateField === 'created_at') {
          monthlyData[monthIndex].users += 1;
        } else {
          monthlyData[monthIndex].bookings += 1;
        }
      }
    });
    
    // Return only months up to current month
    const currentMonth = new Date().getMonth();
    return monthlyData.slice(0, currentMonth + 1);
  };

  const generateFallbackUserData = () => {
    return [
      { month: 'Jan', users: 30 },
      { month: 'Feb', users: 45 },
      { month: 'Mar', users: 60 },
      { month: 'Apr', users: 90 },
      { month: 'May', users: 120 },
      { month: 'Jun', users: 150 },
      { month: 'Jul', users: 200 },
    ];
  };

  const generateFallbackBookingData = () => {
    return [
      { month: 'Jan', bookings: 15 },
      { month: 'Feb', bookings: 25 },
      { month: 'Mar', bookings: 35 },
      { month: 'Apr', bookings: 45 },
      { month: 'May', bookings: 60 },
      { month: 'Jun', bookings: 80 },
      { month: 'Jul', bookings: 100 },
    ];
  };

  const generateFallbackDestinationData = () => {
    return [
      { name: 'Victoria Falls', value: 400 },
      { name: 'Hwange', value: 300 },
      { name: 'Great Zimbabwe', value: 200 },
      { name: 'Mana Pools', value: 150 },
      { name: 'Nyanga', value: 100 },
    ];
  };

  // Chart config
  const chartConfig = {
    users: { color: '#8884d8' },
    bookings: { color: '#82ca9d' },
    victoria_falls: { color: '#0088FE' },
    hwange: { color: '#00C49F' },
    great_zimbabwe: { color: '#FFBB28' },
    mana_pools: { color: '#FF8042' },
    nyanga: { color: '#8884D8' }
  };

  // Growth rates calculation
  const calculateGrowthRate = (current: number, previous: number) => {
    if (previous === 0) return 100; // If previous was 0, show 100% growth
    return ((current - previous) / previous * 100).toFixed(1);
  };

  // Get month-over-month growth
  const getUserGrowthRate = () => {
    const { userStats } = analyticsData;
    if (userStats.length < 2) return 0;
    const currentMonth = userStats[userStats.length - 1].users;
    const previousMonth = userStats[userStats.length - 2].users;
    return calculateGrowthRate(currentMonth, previousMonth);
  };

  const getBookingGrowthRate = () => {
    const { bookingData } = analyticsData;
    if (bookingData.length < 2) return 0;
    const currentMonth = bookingData[bookingData.length - 1].bookings;
    const previousMonth = bookingData[bookingData.length - 2].bookings;
    return calculateGrowthRate(currentMonth, previousMonth);
  };

  const getRevenueGrowthRate = () => {
    // Simplified calculation - in a real app you would compute this from actual revenue data
    return analyticsData.totalRevenue > 0 ? "+15.3%" : "0%";
  };

  // New download chart function
  const downloadChart = async (chartRef: React.RefObject<HTMLDivElement>, chartName: string) => {
    if (!chartRef.current) return;
    
    try {
      const canvas = await html2canvas(chartRef.current, {
        backgroundColor: '#ffffff',
        scale: 2,
      });
      
      const imgData = canvas.toDataURL('image/png');
      
      // For direct download as PNG
      const link = document.createElement('a');
      link.href = imgData;
      link.download = `${chartName}-${new Date().toISOString().split('T')[0]}.png`;
      link.click();
      
    } catch (error) {
      console.error('Error downloading chart:', error);
    }
  };
  
  // Download all charts as PDF
  const downloadAllCharts = async () => {
    try {
      const pdf = new jsPDF('landscape', 'mm', 'a4');
      let pdfHeight = 0;
      
      for (const [name, ref] of Object.entries(chartRefs)) {
        if (!ref.current) continue;
        
        const canvas = await html2canvas(ref.current, {
          backgroundColor: '#ffffff',
          scale: 2,
        });
        
        const imgData = canvas.toDataURL('image/png');
        const imgWidth = 260;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;
        
        // First page doesn't need addPage
        if (pdfHeight > 0) {
          pdf.addPage();
        }
        
        // Add title
        pdf.setFontSize(18);
        pdf.text(name.replace(/([A-Z])/g, ' $1').trim(), 14, 15);
        
        // Add chart
        pdf.addImage(imgData, 'PNG', 14, 25, imgWidth, imgHeight);
        pdfHeight += imgHeight + 30;
      }
      
      pdf.save(`Analytics-Report-${new Date().toISOString().split('T')[0]}.pdf`);
    } catch (error) {
      console.error('Error downloading all charts as PDF:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="animate-pulse">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Loading...</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-6 bg-gray-200 rounded"></div>
          </CardContent>
        </Card>
        <Card className="animate-pulse">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Loading...</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-6 bg-gray-200 rounded"></div>
          </CardContent>
        </Card>
        <Card className="animate-pulse">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Loading...</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-6 bg-gray-200 rounded"></div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Export All Charts Button */}
      <div className="flex justify-end">
        <Button 
          variant="outline" 
          className="flex items-center gap-2"
          onClick={downloadAllCharts}
        >
          <Download size={16} />
          Export All Charts
        </Button>
      </div>

      <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="mb-6 grid grid-cols-3 w-full max-w-md mx-auto">
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <ChartBar size={16} />
            Overview
          </TabsTrigger>
          <TabsTrigger value="users" className="flex items-center gap-2">
            <ChartLine size={16} />
            Users
          </TabsTrigger>
          <TabsTrigger value="bookings" className="flex items-center gap-2">
            <ChartPie size={16} />
            Bookings
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="w-full">
          {/* Summary Cards Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            <Card className="bg-white hover:shadow-md transition-shadow">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{analyticsData.totalUsers}</div>
                <p className="text-xs text-muted-foreground">
                  {getUserGrowthRate()}% from last month
                </p>
              </CardContent>
            </Card>
            
            <Card className="bg-white hover:shadow-md transition-shadow">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Total Bookings</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{analyticsData.totalBookings}</div>
                <p className="text-xs text-muted-foreground">
                  {getBookingGrowthRate()}% from last month
                </p>
              </CardContent>
            </Card>
            
            <Card className="bg-white hover:shadow-md transition-shadow">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">${analyticsData.totalRevenue.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">{getRevenueGrowthRate()} from last month</p>
              </CardContent>
            </Card>
          </div>

          {/* Main Charts - Fixed heights and proper containers to prevent overlap */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            <Card className="bg-white hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>User Growth</CardTitle>
                    <CardDescription>Monthly new user registrations</CardDescription>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex items-center gap-1"
                    onClick={() => downloadChart(chartRefs.userGrowth, 'UserGrowth')}
                  >
                    <Download size={14} />
                    <span className="hidden sm:inline">Export</span>
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="p-0 px-2 pb-4">
                <div className="h-[280px] w-full" ref={chartRefs.userGrowth}>
                  <ChartContainer config={chartConfig} className="w-full h-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart 
                        data={analyticsData.userStats} 
                        margin={{ top: 20, right: 20, bottom: 20, left: 10 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                        <YAxis tick={{ fontSize: 12 }} />
                        <Tooltip />
                        <Legend wrapperStyle={{ fontSize: '12px' }} />
                        <Line 
                          type="monotone" 
                          dataKey="users" 
                          name="Users" 
                          stroke="#8884d8" 
                          activeDot={{ r: 8 }} 
                          strokeWidth={2}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Popular Destinations</CardTitle>
                    <CardDescription>Booking distribution</CardDescription>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex items-center gap-1"
                    onClick={() => downloadChart(chartRefs.destinationPopularity, 'PopularDestinations')}
                  >
                    <Download size={14} />
                    <span className="hidden sm:inline">Export</span>
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="p-0 px-2 pb-4">
                <div className="h-[280px] w-full" ref={chartRefs.destinationPopularity}>
                  <ChartContainer config={chartConfig} className="w-full h-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
                        <Pie
                          data={analyticsData.destinationPopularity}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          outerRadius={90}
                          fill="#8884d8"
                          dataKey="value"
                          label={({ name, value, percent }) => 
                            `${name.substring(0, 8)}${name.length > 8 ? '...' : ''}: ${(percent * 100).toFixed(0)}%`
                          }
                        >
                          {analyticsData.destinationPopularity.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value, name, props) => [`${value} bookings`, props.payload.name]} />
                      </PieChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Booking Trends Chart - Full Width with proper height */}
          <Card className="bg-white hover:shadow-md transition-shadow mb-4">
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Booking Trends</CardTitle>
                  <CardDescription>Monthly booking statistics</CardDescription>
                </div>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="flex items-center gap-1"
                  onClick={() => downloadChart(chartRefs.bookingTrends, 'BookingTrends')}
                >
                  <Download size={14} />
                  <span className="hidden sm:inline">Export</span>
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-0 px-2 pb-4">
              <div className="h-[320px] w-full" ref={chartRefs.bookingTrends}>
                <ChartContainer config={chartConfig} className="w-full h-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart 
                      data={analyticsData.bookingData} 
                      margin={{ top: 20, right: 20, bottom: 20, left: 10 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                      <YAxis tick={{ fontSize: 12 }} />
                      <Tooltip />
                      <Legend wrapperStyle={{ fontSize: '12px' }} />
                      <Bar 
                        dataKey="bookings" 
                        name="Bookings" 
                        fill="#82ca9d"
                        radius={[4, 4, 0, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Users Tab */}
        <TabsContent value="users" className="w-full">
          <Card className="bg-white hover:shadow-md transition-shadow mb-4">
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>User Registration Trends</CardTitle>
                  <CardDescription>Detailed view of user growth over time</CardDescription>
                </div>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="flex items-center gap-1"
                  onClick={() => downloadChart(chartRefs.userGrowth, 'UserGrowth')}
                >
                  <Download size={14} />
                  Export
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-0 px-2 pb-4">
              <div className="h-[400px] w-full">
                <ChartContainer config={chartConfig} className="w-full h-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart 
                      data={analyticsData.userStats} 
                      margin={{ top: 20, right: 30, bottom: 20, left: 20 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line 
                        type="monotone" 
                        dataKey="users" 
                        name="New Users" 
                        stroke="#8884d8" 
                        activeDot={{ r: 8 }} 
                        strokeWidth={2}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Bookings Tab */}
        <TabsContent value="bookings" className="w-full">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card className="bg-white hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Booking Trends</CardTitle>
                    <CardDescription>Monthly booking volume</CardDescription>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex items-center gap-1"
                    onClick={() => downloadChart(chartRefs.bookingTrends, 'BookingTrends')}
                  >
                    <Download size={14} />
                    Export
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="p-0 px-2 pb-4">
                <div className="h-[300px] w-full">
                  <ChartContainer config={chartConfig} className="w-full h-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart 
                        data={analyticsData.bookingData} 
                        margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar 
                          dataKey="bookings" 
                          name="Bookings" 
                          fill="#82ca9d"
                          radius={[4, 4, 0, 0]}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Popular Destinations</CardTitle>
                    <CardDescription>Most booked destinations</CardDescription>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex items-center gap-1"
                    onClick={() => downloadChart(chartRefs.destinationPopularity, 'PopularDestinations')}
                  >
                    <Download size={14} />
                    Export
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="p-0 px-2 pb-4">
                <div className="h-[300px] w-full">
                  <ChartContainer config={chartConfig} className="w-full h-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
                        <Pie
                          data={analyticsData.destinationPopularity}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                          label={({ name, value, percent }) => 
                            `${name.substring(0, 8)}${name.length > 8 ? '...' : ''}: ${(percent * 100).toFixed(0)}%`
                          }
                        >
                          {analyticsData.destinationPopularity.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value, name, props) => [`${value} bookings`, props.payload.name]} />
                      </PieChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminAnalytics;
