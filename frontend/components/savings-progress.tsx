"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Target, TrendingUp } from "lucide-react";

interface SavingsProgressProps {
  current: number;
  goal: number;
}

export function SavingsProgress({ current, goal }: SavingsProgressProps) {
  const percentage = Math.min((current / goal) * 100, 100);
  const remaining = Math.max(goal - current, 0);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <Card className="border-0 shadow-lg">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-base font-semibold">
          <Target className="h-5 w-5 text-primary" />
          Progreso del Ahorro
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Amount row */}
        <div className="flex items-end justify-between">
          <div>
            <p className="text-xs text-muted-foreground">Ahorrado</p>
            <p className="text-xl sm:text-2xl font-bold text-primary leading-tight break-all">
              {formatCurrency(current)}
            </p>
          </div>
          <div className="text-right shrink-0 ml-2">
            <p className="text-xs text-muted-foreground">Meta</p>
            <p className="text-sm sm:text-base font-semibold text-foreground whitespace-nowrap">
              {formatCurrency(goal)}
            </p>
          </div>
        </div>

        {/* Progress bar */}
        <div className="space-y-1.5">
          <div className="relative">
            <div className="h-5 w-full overflow-hidden rounded-full bg-secondary">
              <div
                className="h-full rounded-full bg-primary transition-all duration-700 ease-out"
                style={{ width: `${percentage}%` }}
              />
            </div>
            <div
              className="absolute top-1/2 -translate-y-1/2 transition-all duration-700 ease-out"
              style={{ left: `calc(${Math.min(percentage, 93)}% - 10px)` }}
            >
              <div className="flex h-5 w-5 items-center justify-center rounded-full border-2 border-primary bg-card shadow-md">
                <TrendingUp className="h-2.5 w-2.5 text-primary" />
              </div>
            </div>
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-primary">
              {percentage.toFixed(1)}% completado
            </span>
            <span className="text-muted-foreground text-[11px] sm:text-xs whitespace-nowrap ml-1">
              Faltan {formatCurrency(remaining)}
            </span>
          </div>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-3 gap-2 rounded-lg bg-secondary/50 p-2 sm:p-3">
          <div className="text-center min-w-0">
            <p className="text-base sm:text-lg font-bold text-foreground leading-tight">
              {percentage.toFixed(0)}%
            </p>
            <p className="text-[11px] sm:text-xs text-muted-foreground">Avance</p>
          </div>
          <div className="text-center border-x border-border min-w-0 px-1">
            <p className="text-xs sm:text-sm font-bold text-accent leading-tight truncate">
              {formatCurrency(remaining)}
            </p>
            <p className="text-[11px] sm:text-xs text-muted-foreground">Restante</p>
          </div>
          <div className="text-center min-w-0">
            <p className="text-xs sm:text-sm font-bold text-primary leading-tight truncate">
              {formatCurrency(goal)}
            </p>
            <p className="text-[11px] sm:text-xs text-muted-foreground">Meta</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
