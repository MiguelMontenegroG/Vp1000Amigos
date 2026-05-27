"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PlusCircle, User, DollarSign, Wallet, Building2 } from "lucide-react";
import type { PaymentMethod, BankName } from "@/lib/donations-service";

interface DonationFormProps {
  onAddDonation: (name: string, amount: number, paymentMethod: PaymentMethod, bank?: BankName) => void;
}

const PRESET_AMOUNTS = [5000, 10000, 20000, 50000, 100000];

const BANKS: BankName[] = ["Nequi", "Daviplata", "Bancolombia", "Davivienda", "BBVA", "Banco de Bogota", "Otro"];

export function DonationForm({ onAddDonation }: DonationFormProps) {
  const [name, setName] = useState("");
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);
  const [customAmount, setCustomAmount] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("efectivo");
  const [bank, setBank] = useState<BankName | "">("");

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const amount = selectedAmount || Number(customAmount);
    if (name.trim() && amount > 0) {
      onAddDonation(
        name.trim(),
        amount,
        paymentMethod,
        paymentMethod === "transferencia" ? (bank as BankName) || undefined : undefined
      );
      setName("");
      setSelectedAmount(null);
      setCustomAmount("");
      setPaymentMethod("efectivo");
      setBank("");
    }
  };

  const handleAmountSelect = (amount: number) => {
    setSelectedAmount(amount);
    setCustomAmount("");
  };

  const handleCustomAmountChange = (value: string) => {
    setCustomAmount(value);
    setSelectedAmount(null);
  };

  const isValid =
    name.trim() &&
    (selectedAmount || (customAmount && Number(customAmount) > 0)) &&
    (paymentMethod === "efectivo" || (paymentMethod === "transferencia" && bank));

  return (
    <Card className="border-0 shadow-lg">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-base font-semibold">
          <PlusCircle className="h-5 w-5 text-primary" />
          Registrar Aporte
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name field */}
          <div className="space-y-1.5">
            <Label htmlFor="name" className="flex items-center gap-1.5 text-sm font-medium">
              <User className="h-4 w-4 text-muted-foreground" />
              Nombre del aportante
            </Label>
            <Input
              id="name"
              type="text"
              placeholder="Ingresa el nombre"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="h-11 bg-secondary/50 border-0 focus-visible:ring-primary text-base"
              autoComplete="off"
            />
          </div>

          {/* Amount selection */}
          <div className="space-y-2">
            <Label className="flex items-center gap-1.5 text-sm font-medium">
              <DollarSign className="h-4 w-4 text-muted-foreground" />
              Monto del aporte
            </Label>

            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
              {PRESET_AMOUNTS.map((amount) => (
                <Button
                  key={amount}
                  type="button"
                  variant={selectedAmount === amount ? "default" : "outline"}
                  className={`h-11 text-sm font-semibold transition-all ${
                    selectedAmount === amount
                      ? "bg-primary text-primary-foreground shadow-md"
                      : "bg-secondary/50 border-0 hover:bg-primary/10 hover:text-primary"
                  }`}
                  onClick={() => handleAmountSelect(amount)}
                >
                  {formatCurrency(amount)}
                </Button>
              ))}
            </div>

            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">
                $
              </span>
              <Input
                type="number"
                placeholder="Otro monto"
                value={customAmount}
                onChange={(e) => handleCustomAmountChange(e.target.value)}
                className="h-11 pl-7 bg-secondary/50 border-0 focus-visible:ring-primary text-base"
                min="1"
                inputMode="numeric"
              />
            </div>
          </div>

          {/* Payment method */}
          <div className="space-y-2">
            <Label className="flex items-center gap-1.5 text-sm font-medium">
              <Wallet className="h-4 w-4 text-muted-foreground" />
              Metodo de pago
            </Label>
            <div className="grid grid-cols-2 gap-2">
              <Button
                type="button"
                variant={paymentMethod === "efectivo" ? "default" : "outline"}
                className={`h-11 text-sm font-semibold ${
                  paymentMethod === "efectivo"
                    ? "bg-primary text-primary-foreground shadow-md"
                    : "bg-secondary/50 border-0 hover:bg-primary/10 hover:text-primary"
                }`}
                onClick={() => setPaymentMethod("efectivo")}
              >
                Efectivo
              </Button>
              <Button
                type="button"
                variant={paymentMethod === "transferencia" ? "default" : "outline"}
                className={`h-11 text-sm font-semibold ${
                  paymentMethod === "transferencia"
                    ? "bg-primary text-primary-foreground shadow-md"
                    : "bg-secondary/50 border-0 hover:bg-primary/10 hover:text-primary"
                }`}
                onClick={() => setPaymentMethod("transferencia")}
              >
                Transferencia
              </Button>
            </div>

            {paymentMethod === "transferencia" && (
              <div className="space-y-1.5">
                <Label className="flex items-center gap-1.5 text-sm font-medium">
                  <Building2 className="h-4 w-4 text-muted-foreground" />
                  Banco
                </Label>
                <Select value={bank} onValueChange={(v) => setBank(v as BankName)}>
                  <SelectTrigger className="h-11 bg-secondary/50 border-0 focus-visible:ring-primary text-base">
                    <SelectValue placeholder="Selecciona un banco" />
                  </SelectTrigger>
                  <SelectContent>
                    {BANKS.map((b) => (
                      <SelectItem key={b} value={b}>
                        {b}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>

          <Button
            type="submit"
            disabled={!isValid}
            className="w-full h-12 text-base font-semibold shadow-md active:scale-95 transition-all disabled:opacity-50"
          >
            <PlusCircle className="mr-2 h-5 w-5" />
            Agregar Aporte
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
