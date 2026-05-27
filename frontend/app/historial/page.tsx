"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { DonationsTable } from "@/components/donations-table";
import { StatsPanel } from "@/components/stats-panel";
import { subscribeToDonations, deleteDonation, type Donation } from "@/lib/donations-service";
import { PinDialog, checkAuth } from "@/components/pin-dialog";
import { DonationsFilters, filterDonations, type FiltersState } from "@/components/donations-filters";
import { ArrowLeft, ClipboardList, BarChart3, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function HistorialPage() {
  const [donations, setDonations] = useState<Donation[]>([]);
  const [loading, setLoading] = useState(true);
  const [unlocked, setUnlocked] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<FiltersState>({
    search: "",
    paymentMethod: "todos",
    bank: "todos",
  });

  useEffect(() => {
    if (checkAuth()) {
      setUnlocked(true);
    }
  }, []);

  useEffect(() => {
    const unsubscribe = subscribeToDonations((donations) => {
      setDonations(donations);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleDelete = async (id: string) => {
    try {
      await deleteDonation(id);
    } catch (error) {
      console.error("Error al eliminar:", error);
    }
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
      <header className="sticky top-0 z-50 border-b border-border bg-card/90 backdrop-blur-md">
        <div className="mx-auto flex h-14 max-w-lg items-center justify-between px-4">
          <div className="flex items-center gap-2.5">
            <Link href="/">
              <Button variant="ghost" size="icon" className="h-9 w-9">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl overflow-hidden">
              <img src="/LogoVidaPlenaTransparente.png" alt="Logo" className="h-full w-full object-contain" />
            </div>
            <div>
              <h1 className="text-base font-bold text-foreground leading-tight">
                Panel de Control
              </h1>
              <p className="text-xs text-muted-foreground leading-tight">
                Administracion de aportes
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowFilters(!showFilters)}
              className={`h-9 w-9 p-0 ${showFilters ? "bg-primary/10 text-primary" : ""}`}
            >
              <Filter className="h-4 w-4" />
            </Button>
            <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-semibold text-primary">
              {donations.length} aportes
            </span>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-lg px-4 py-4 space-y-4 pb-8">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : (
          <Tabs defaultValue="historial" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="historial" className="flex items-center gap-1.5">
                <ClipboardList className="h-4 w-4" />
                Historial
              </TabsTrigger>
              <TabsTrigger value="estadisticas" className="flex items-center gap-1.5">
                <BarChart3 className="h-4 w-4" />
                Estadisticas
              </TabsTrigger>
            </TabsList>
            <TabsContent value="historial" className="mt-4 space-y-4">
              {showFilters && (
                <DonationsFilters filters={filters} onChange={setFilters} />
              )}
              <DonationsTable
                donations={filterDonations(donations, filters)}
                onDelete={handleDelete}
              />
              {filterDonations(donations, filters).length === 0 && donations.length > 0 && (
                <p className="text-center text-sm text-muted-foreground py-4">
                  No se encontraron aportes con los filtros seleccionados
                </p>
              )}
            </TabsContent>
            <TabsContent value="estadisticas" className="mt-4">
              <StatsPanel donations={donations} />
            </TabsContent>
          </Tabs>
        )}
      </div>
    </main>
  );
}
