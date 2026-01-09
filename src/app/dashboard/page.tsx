"use client"

/**
 * Dashboard Home Page
 * 
 * Responsibilities:
 * - Display stat cards
 * - Show charts (UI only, static data)
 * - Display tables (mock data)
 * 
 * Rules:
 * - UI only - no API calls
 * - No hooks
 * - No logic
 * - Static/mock data only
 */

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import * as RechartsPrimitive from "recharts"
import { Users, ClipboardList, CheckCircle2, Bell } from "lucide-react"

/**
 * Mock data for stat cards
 */
const statCards = [
  {
    title: "عدد المستخدمين",
    value: "1,234",
    icon: Users,
    description: "إجمالي المستخدمين المسجلين",
  },
  {
    title: "عدد المهام",
    value: "567",
    icon: ClipboardList,
    description: "إجمالي المهام في النظام",
  },
  {
    title: "المهام المنجزة",
    value: "432",
    icon: CheckCircle2,
    description: "المهام المكتملة",
  },
  {
    title: "إشعارات غير مقروءة",
    value: "12",
    icon: Bell,
    description: "إشعارات جديدة",
  },
]

/**
 * Mock data for chart
 */
const chartData = [
  { name: "يناير", مهام: 45, منجزة: 32 },
  { name: "فبراير", مهام: 52, منجزة: 38 },
  { name: "مارس", مهام: 48, منجزة: 35 },
  { name: "أبريل", مهام: 61, منجزة: 45 },
  { name: "مايو", مهام: 55, منجزة: 42 },
  { name: "يونيو", مهام: 67, منجزة: 50 },
]

const chartConfig: ChartConfig = {
  مهام: {
    label: "المهام",
    color: "hsl(var(--chart-1))",
  },
  منجزة: {
    label: "المنجزة",
    color: "hsl(var(--chart-2))",
  },
}

/**
 * Mock data for recent users table
 */
const recentUsers = [
  { id: 1, name: "أحمد محمد", email: "ahmed@example.com", role: "مدير", date: "2024-01-15" },
  { id: 2, name: "فاطمة علي", email: "fatima@example.com", role: "مستخدم", date: "2024-01-14" },
  { id: 3, name: "محمد حسن", email: "mohammed@example.com", role: "مستخدم", date: "2024-01-13" },
  { id: 4, name: "سارة أحمد", email: "sara@example.com", role: "مشرف", date: "2024-01-12" },
  { id: 5, name: "خالد يوسف", email: "khaled@example.com", role: "مستخدم", date: "2024-01-11" },
]

/**
 * Mock data for recent tasks table
 */
const recentTasks = [
  { id: 1, title: "مراجعة التقارير الشهرية", assignee: "أحمد محمد", status: "قيد التنفيذ", date: "2024-01-15" },
  { id: 2, title: "تحديث قاعدة البيانات", assignee: "فاطمة علي", status: "مكتملة", date: "2024-01-14" },
  { id: 3, title: "إعداد العرض التقديمي", assignee: "محمد حسن", status: "قيد التنفيذ", date: "2024-01-13" },
  { id: 4, title: "مراجعة السياسات", assignee: "سارة أحمد", status: "جديدة", date: "2024-01-12" },
  { id: 5, title: "تحديث النظام", assignee: "خالد يوسف", status: "مكتملة", date: "2024-01-11" },
]

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      {/* Stat Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat) => {
          const Icon = stat.icon
          return (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                <Icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground mt-1">{stat.description}</p>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Chart Section */}
      <Card>
        <CardHeader>
          <CardTitle>إحصائيات المهام</CardTitle>
          <CardDescription>نظرة عامة على المهام خلال الأشهر الستة الماضية</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="h-[300px]">
            <RechartsPrimitive.BarChart data={chartData}>
              <RechartsPrimitive.CartesianGrid strokeDasharray="3 3" />
              <RechartsPrimitive.XAxis 
                dataKey="name" 
                tick={{ fill: "hsl(var(--muted-foreground))" }}
              />
              <RechartsPrimitive.YAxis 
                tick={{ fill: "hsl(var(--muted-foreground))" }}
              />
              <ChartTooltip content={<ChartTooltipContent />} />
              <RechartsPrimitive.Bar dataKey="مهام" fill="hsl(var(--chart-1))" radius={[4, 4, 0, 0]} />
              <RechartsPrimitive.Bar dataKey="منجزة" fill="hsl(var(--chart-2))" radius={[4, 4, 0, 0]} />
            </RechartsPrimitive.BarChart>
          </ChartContainer>
        </CardContent>
      </Card>

      {/* Tables Section */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* Recent Users Table */}
        <Card>
          <CardHeader>
            <CardTitle>آخر المستخدمين المضافين</CardTitle>
            <CardDescription>أحدث 5 مستخدمين تم إضافتهم للنظام</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-right">الاسم</TableHead>
                  <TableHead className="text-right">البريد الإلكتروني</TableHead>
                  <TableHead className="text-right">الدور</TableHead>
                  <TableHead className="text-right">التاريخ</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">{user.name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{user.role}</TableCell>
                    <TableCell className="text-muted-foreground">{user.date}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Recent Tasks Table */}
        <Card>
          <CardHeader>
            <CardTitle>آخر المهام المضافة</CardTitle>
            <CardDescription>أحدث 5 مهام تم إضافتها للنظام</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-right">المهمة</TableHead>
                  <TableHead className="text-right">المسؤول</TableHead>
                  <TableHead className="text-right">الحالة</TableHead>
                  <TableHead className="text-right">التاريخ</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentTasks.map((task) => (
                  <TableRow key={task.id}>
                    <TableCell className="font-medium">{task.title}</TableCell>
                    <TableCell>{task.assignee}</TableCell>
                    <TableCell>
                      <span
                        className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                          task.status === "مكتملة"
                            ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                            : task.status === "قيد التنفيذ"
                            ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400"
                            : "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400"
                        }`}
                      >
                        {task.status}
                      </span>
                    </TableCell>
                    <TableCell className="text-muted-foreground">{task.date}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
