
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
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

const AdminAnalytics: React.FC = () => {
  // Mock data for dashboard analytics
  const userStats = [
    { month: 'Jan', users: 30 },
    { month: 'Feb', users: 45 },
    { month: 'Mar', users: 60 },
    { month: 'Apr', users: 90 },
    { month: 'May', users: 120 },
    { month: 'Jun', users: 150 },
    { month: 'Jul', users: 200 },
  ];

  const bookingData = [
    { month: 'Jan', bookings: 15 },
    { month: 'Feb', bookings: 25 },
    { month: 'Mar', bookings: 35 },
    { month: 'Apr', bookings: 45 },
    { month: 'May', bookings: 60 },
    { month: 'Jun', bookings: 80 },
    { month: 'Jul', bookings: 100 },
  ];

  const destinationPopularity = [
    { name: 'Victoria Falls', value: 400 },
    { name: 'Hwange', value: 300 },
    { name: 'Great Zimbabwe', value: 200 },
    { name: 'Mana Pools', value: 150 },
    { name: 'Nyanga', value: 100 },
  ];

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

  // Summary statistics
  const totalUsers = 695;
  const totalBookings = 360;
  const totalRevenue = 45600;
  const activeEvents = 12;

  const chartConfig = {
    users: { color: '#8884d8' },
    bookings: { color: '#82ca9d' },
    destinations: {
      victoria: { color: '#0088FE' },
      hwange: { color: '#00C49F' },
      zimbabwe: { color: '#FFBB28' },
      mana: { color: '#FF8042' },
      nyanga: { color: '#8884D8' },
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Summary Cards Row */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Total Users</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalUsers}</div>
          <p className="text-xs text-muted-foreground">+12.5% from last month</p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Total Bookings</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalBookings}</div>
          <p className="text-xs text-muted-foreground">+8.2% from last month</p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">${totalRevenue.toLocaleString()}</div>
          <p className="text-xs text-muted-foreground">+15.3% from last month</p>
        </CardContent>
      </Card>

      {/* Charts Row */}
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle>User Growth</CardTitle>
          <CardDescription>Monthly new user registrations</CardDescription>
        </CardHeader>
        <CardContent className="h-[300px]">
          <ChartContainer config={chartConfig}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={userStats}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="users" 
                  name="Users" 
                  stroke="#8884d8" 
                  activeDot={{ r: 8 }} 
                />
              </LineChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Popular Destinations</CardTitle>
          <CardDescription>Booking distribution</CardDescription>
        </CardHeader>
        <CardContent className="h-[300px]">
          <ChartContainer config={chartConfig}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={destinationPopularity}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                >
                  {destinationPopularity.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>

      <Card className="lg:col-span-3">
        <CardHeader>
          <CardTitle>Booking Trends</CardTitle>
          <CardDescription>Monthly booking statistics</CardDescription>
        </CardHeader>
        <CardContent className="h-[300px]">
          <ChartContainer config={chartConfig}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={bookingData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar 
                  dataKey="bookings" 
                  name="Bookings" 
                  fill="#82ca9d" 
                />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminAnalytics;
