"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ClipboardList, User, Calendar, Banknote, Wallet, Building2, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { Donation, PaymentMethod, BankName } from "@/lib/donations-service";

interface DonationsTableProps {
  donations: Donation[];
  onDelete?: (id: string) => void;
}

export function DonationsTable({ donations, onDelete }: DonationsTableProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("es-MX", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }).format(date);
  };

  const formatTime = (date: Date) => {
    return new Intl.DateTimeFormat("es-MX", {
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  const paymentMethodLabel = (method: PaymentMethod) => {
    return method === "efectivo" ? "Efectivo" : "Transferencia";
  };

  return (
    <Card className="border-0 shadow-lg">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-base font-semibold">
            <ClipboardList className="h-5 w-5 text-primary" />
            Historial de Aportes
          </CardTitle>
          <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-semibold text-primary">
            {donations.length} {donations.length === 1 ? "aporte" : "aportes"}
          </span>
        </div>
      </CardHeader>
      <CardContent>
        {donations.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10 text-center">
            <div className="rounded-full bg-secondary p-4 mb-3">
              <ClipboardList className="h-7 w-7 text-muted-foreground" />
            </div>
            <p className="text-sm font-medium text-muted-foreground">
              No hay aportes registrados
            </p>
            <p className="text-xs text-muted-foreground/70 mt-1">
              Los aportes apareceran aqui
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {/* Desktop table header — hidden on mobile */}
            <div className="hidden sm:grid sm:grid-cols-[1fr_auto_auto_auto_auto] sm:gap-x-3 rounded-lg bg-secondary/50 px-3 py-2">
              <span className="flex items-center gap-1.5 text-xs font-semibold text-foreground">
                <User className="h-3.5 w-3.5" />
                Nombre
              </span>
              <span className="flex items-center gap-1.5 text-xs font-semibold text-foreground">
                <Banknote className="h-3.5 w-3.5" />
                Monto
              </span>
              <span className="flex items-center gap-1.5 text-xs font-semibold text-foreground">
                <Wallet className="h-3.5 w-3.5" />
                Pago
              </span>
              <span className="flex items-center gap-1.5 text-xs font-semibold text-foreground">
                <Calendar className="h-3.5 w-3.5" />
                Fecha
              </span>
              <span className="w-8" />
            </div>

            {/* Rows */}
            <div className="space-y-2">
              {donations.map((donation, index) => (
                <div
                  key={donation.id}
                  className={`rounded-lg px-3 py-2.5 transition-colors ${
                    index % 2 === 0 ? "bg-secondary/30" : "bg-transparent"
                  } hover:bg-primary/5`}
                >
                  {/* Mobile layout: stacked */}
                  <div className="flex items-start justify-between gap-2 sm:hidden">
                    <div className="min-w-0 flex-1 space-y-1">
                      <p className="font-semibold text-sm text-foreground truncate">
                        {donation.name}
                      </p>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="inline-flex items-center rounded-full bg-primary/10 px-2 py-0.5 text-xs font-semibold text-primary">
                          {formatCurrency(donation.amount)}
                        </span>
                        <Badge variant="outline" className="text-xs gap-1">
                          <Wallet className="h-3 w-3" />
                          {paymentMethodLabel(donation.paymentMethod)}
                          {donation.bank && ` - ${donation.bank}`}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {formatDate(donation.date)} · {formatTime(donation.date)}
                      </p>
                    </div>
                    {onDelete && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 shrink-0 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                        onClick={() => onDelete(donation.id)}
                        aria-label="Eliminar aporte"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>

                  {/* Desktop layout: columns */}
                  <div className="hidden sm:grid sm:grid-cols-[1fr_auto_auto_auto_auto] sm:gap-x-3 sm:items-center">
                    <p className="font-medium text-sm text-foreground truncate">
                      {donation.name}
                    </p>
                    <span className="inline-flex items-center rounded-full bg-primary/10 px-2.5 py-0.5 text-sm font-semibold text-primary">
                      {formatCurrency(donation.amount)}
                    </span>
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                      <Wallet className="h-3 w-3" />
                      {paymentMethodLabel(donation.paymentMethod)}
                      {donation.bank && (
                        <span className="flex items-center gap-0.5 ml-1">
                          <Building2 className="h-3 w-3" />
                          {donation.bank}
                        </span>
                      )}
                    </span>
                    <span className="text-xs text-muted-foreground whitespace-nowrap">
                      {formatDate(donation.date)}
                    </span>
                    {onDelete && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                        onClick={() => onDelete(donation.id)}
                        aria-label="Eliminar aporte"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
