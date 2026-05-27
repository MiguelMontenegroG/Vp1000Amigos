"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3, PieChart, TrendingUp, Wallet, Building2 } from "lucide-react";
import { PieChart as RePieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import type { Donation, PaymentMethod, BankName } from "@/lib/donations-service";

interface StatsPanelProps {
  donations: Donation[];
}

const COLORS = ["#22c55e", "#3b82f6", "#f59e0b", "#ef4444", "#8b5cf6", "#ec4899", "#14b8a6"];

export function StatsPanel({ donations }: StatsPanelProps) {
  if (donations.length === 0) {
    return null;
  }

  // Datos para grafico de metodos de pago
  const efectivoTotal = donations
    .filter((d) => d.paymentMethod === "efectivo")
    .reduce((sum, d) => sum + d.amount, 0);
  const transferenciaTotal = donations
    .filter((d) => d.paymentMethod === "transferencia")
    .reduce((sum, d) => sum + d.amount, 0);

  const paymentMethodData = [
    { name: "Efectivo", value: efectivoTotal },
    { name: "Transferencia", value: transferenciaTotal },
  ].filter((d) => d.value > 0);

  // Datos para grafico por banco
  const bankTotals: Record<string, number> = {};
  donations
    .filter((d) => d.paymentMethod === "transferencia" && d.bank)
    .forEach((d) => {
      const bank = d.bank as BankName;
      bankTotals[bank] = (bankTotals[bank] || 0) + d.amount;
    });

  const bankData = Object.entries(bankTotals)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value);

  // Aportes por dia (ultimos 7)
  const last7Days = [...Array(7)]
    .map((_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - i);
      return d.toLocaleDateString("es-MX", { day: "2-digit", month: "short" });
    })
    .reverse();

  const dailyTotals: Record<string, number> = {};
  donations.forEach((d) => {
    const key = d.date.toLocaleDateString("es-MX", { day: "2-digit", month: "short" });
    dailyTotals[key] = (dailyTotals[key] || 0) + d.amount;
  });

  const dailyData = last7Days.map((day) => ({
    name: day,
    Monto: dailyTotals[day] || 0,
  }));

  // Top aportantes
  const topDonors = [...donations]
    .reduce((acc: { name: string; total: number; count: number }[], d) => {
      const existing = acc.find((a) => a.name === d.name);
      if (existing) {
        existing.total += d.amount;
        existing.count += 1;
      } else {
        acc.push({ name: d.name, total: d.amount, count: 1 });
      }
      return acc;
    }, [])
    .sort((a, b) => b.total - a.total)
    .slice(0, 5);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const totalGeneral = donations.reduce((sum, d) => sum + d.amount, 0);

  return (
    <div className="space-y-4">
      {/* KPIs */}
      <div className="grid grid-cols-2 gap-3">
        <Card className="border-0 shadow-lg bg-gradient-to-br from-primary/10 to-primary/5">
          <CardContent className="p-4">
            <p className="text-xs text-muted-foreground">Total Efectivo</p>
            <p className="text-lg font-bold text-primary">{formatCurrency(efectivoTotal)}</p>
            <p className="text-xs text-muted-foreground">
              {((efectivoTotal / totalGeneral) * 100).toFixed(1)}% del total
            </p>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-500/10 to-blue-500/5">
          <CardContent className="p-4">
            <p className="text-xs text-muted-foreground">Total Transferencias</p>
            <p className="text-lg font-bold text-blue-600 dark:text-blue-400">{formatCurrency(transferenciaTotal)}</p>
            <p className="text-xs text-muted-foreground">
              {((transferenciaTotal / totalGeneral) * 100).toFixed(1)}% del total
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Grafico de metodos de pago */}
      {paymentMethodData.length > 0 && (
        <Card className="border-0 shadow-lg">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-sm font-semibold">
              <PieChart className="h-4 w-4 text-primary" />
              Distribucion por metodo de pago
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <RePieChart>
                  <Pie
                    data={paymentMethodData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                    label={({ name, percent }) =>
                      `${name} ${(percent * 100).toFixed(0)}%`
                    }
                    labelLine={false}
                  >
                    {paymentMethodData.map((_entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index]} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value: number) => formatCurrency(value)}
                  />
                  <Legend />
                </RePieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Grafico por banco */}
      {bankData.length > 0 && (
        <Card className="border-0 shadow-lg">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-sm font-semibold">
              <Building2 className="h-4 w-4 text-primary" />
              Distribucion por banco
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <RePieChart>
                  <Pie
                    data={bankData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                    label={({ name, percent }) =>
                      `${name} ${(percent * 100).toFixed(0)}%`
                    }
                    labelLine={false}
                  >
                    {bankData.map((_entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value: number) => formatCurrency(value)}
                  />
                  <Legend />
                </RePieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Grafico de barras - Aportes por dia */}
      <Card className="border-0 shadow-lg">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-sm font-semibold">
            <BarChart3 className="h-4 w-4 text-primary" />
            Aportes por dia (Ultimos 7 dias)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dailyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
                <YAxis tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
                <Tooltip
                  formatter={(value: number) => formatCurrency(value)}
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                  }}
                />
                <Bar dataKey="Monto" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Top aportantes */}
      <Card className="border-0 shadow-lg">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-sm font-semibold">
            <TrendingUp className="h-4 w-4 text-primary" />
            Top Aportantes
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {topDonors.map((donor, index) => {
              const colors = ["bg-yellow-400", "bg-gray-300", "bg-amber-600", "bg-blue-400", "bg-green-400"];
              return (
                <div key={donor.name} className="flex items-center gap-3">
                  <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${colors[index]} text-white text-xs font-bold`}>
                    {index + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">{donor.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {donor.count} {donor.count === 1 ? "aporte" : "aportes"}
                    </p>
                  </div>
                  <p className="text-sm font-semibold text-primary">{formatCurrency(donor.total)}</p>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
