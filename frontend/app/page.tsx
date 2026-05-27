"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { SavingsProgress } from "@/components/savings-progress";
import { DonationForm } from "@/components/donation-form";
import { subscribeToDonations, addDonation, type Donation, type PaymentMethod, type BankName } from "@/lib/donations-service";
import { PinDialog, checkAuth } from "@/components/pin-dialog";
import { Settings, BarChart3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const DEFAULT_GOAL = 500000;

export default function Home() {
  const [donations, setDonations] = useState<Donation[]>([]);
  const [loading, setLoading] = useState(true);
  const [goal, setGoal] = useState(DEFAULT_GOAL);
  const [tempGoal, setTempGoal] = useState(DEFAULT_GOAL.toString());
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [unlocked, setUnlocked] = useState(false);

  useEffect(() => {
    if (checkAuth()) {
      setUnlocked(true);
    }
  }, []);

  useEffect(() => {
    const savedGoal = localStorage.getItem("savings_goal");
    if (savedGoal) {
      const parsed = Number(savedGoal);
      if (parsed > 0) {
        setGoal(parsed);
        setTempGoal(parsed.toString());
      }
    }
  }, []);

  useEffect(() => {
    if (unlocked) {
      const unsubscribe = subscribeToDonations((donations) => {
        setDonations(donations);
        setLoading(false);
      });
      return () => unsubscribe();
    }
  }, [unlocked]);

  const totalSaved = donations.reduce((sum, d) => sum + d.amount, 0);

  const handleAddDonation = async (name: string, amount: number, paymentMethod: PaymentMethod, bank?: BankName) => {
    try {
      await addDonation(name, amount, paymentMethod, bank);
    } catch (error) {
      console.error("Error al agregar donacion:", error);
    }
  };

  const handleSaveGoal = () => {
    const newGoal = Number(tempGoal);
    if (newGoal > 0) {
      setGoal(newGoal);
      localStorage.setItem("savings_goal", newGoal.toString());
      setIsDialogOpen(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  if (!unlocked) {
    return (
      <PinDialog
        open={true}
        onSuccess={() => setUnlocked(true)}
      />
    );
  }

  return (
    <main className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border bg-card/90 backdrop-blur-md">
        <div className="mx-auto flex h-14 max-w-lg items-center justify-between px-4">
          <div className="flex items-center gap-2.5 min-w-0 flex-1">
            <div className="flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-xl overflow-hidden shrink-0">
              <img src="/LogoVidaPlenaTransparente.png" alt="Logo" className="h-full w-full object-contain" />
            </div>
            <div className="min-w-0">
              <h1 className="text-sm sm:text-base font-bold text-foreground leading-tight truncate">
                Campaña 1000 Amigos
              </h1>
              <p className="text-[10px] sm:text-xs text-muted-foreground leading-tight truncate">
                Ahorro para la fundación
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <Link href="/historial">
              <Button
                variant="outline"
                size="sm"
                className="h-9 gap-1.5 border-0 bg-secondary/60 hover:bg-secondary text-sm"
              >
                <BarChart3 className="h-4 w-4" />
                <span>Panel</span>
              </Button>
            </Link>

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-9 gap-1.5 border-0 bg-secondary/60 hover:bg-secondary text-sm"
                >
                  <Settings className="h-4 w-4" />
                  <span>Meta</span>
                </Button>
              </DialogTrigger>
              <DialogContent className="w-[calc(100%-2rem)] max-w-sm rounded-xl">
                <DialogHeader>
                  <DialogTitle className="text-base">Configurar Meta de Ahorro</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-2">
                  <div className="space-y-1.5">
                    <Label htmlFor="goal" className="text-sm">Meta de ahorro (COP)</Label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">
                        $
                      </span>
                      <Input
                        id="goal"
                        type="number"
                        value={tempGoal}
                        onChange={(e) => setTempGoal(e.target.value)}
                        className="h-11 pl-7 text-base"
                        inputMode="numeric"
                        min="1"
                      />
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Meta actual: {formatCurrency(goal)}
                    </p>
                  </div>
                  <Button onClick={handleSaveGoal} className="w-full h-11">
                    Guardar Meta
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="mx-auto max-w-lg px-4 py-4 space-y-4 pb-8">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : (
          <>
            <SavingsProgress current={totalSaved} goal={goal} />
            <DonationForm onAddDonation={handleAddDonation} />
          </>
        )}
      </div>
    </main>
  );
}
