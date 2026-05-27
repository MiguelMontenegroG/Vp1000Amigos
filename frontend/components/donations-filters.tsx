"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, X } from "lucide-react";
import type { PaymentMethod, BankName } from "@/lib/donations-service";

export interface FiltersState {
  search: string;
  paymentMethod: PaymentMethod | "todos";
  bank: BankName | "todos";
}

interface DonationsFiltersProps {
  filters: FiltersState;
  onChange: (filters: FiltersState) => void;
}

const PAYMENT_METHODS: { value: PaymentMethod | "todos"; label: string }[] = [
  { value: "todos", label: "Todos" },
  { value: "efectivo", label: "Efectivo" },
  { value: "transferencia", label: "Transferencia" },
];

const BANKS: { value: BankName | "todos"; label: string }[] = [
  { value: "todos", label: "Todos los bancos" },
  { value: "Nequi", label: "Nequi" },
  { value: "Daviplata", label: "Daviplata" },
  { value: "Bancolombia", label: "Bancolombia" },
  { value: "Davivienda", label: "Davivienda" },
  { value: "BBVA", label: "BBVA" },
  { value: "Banco de Bogota", label: "Banco de Bogota" },
  { value: "Otro", label: "Otro" },
];

export function DonationsFilters({ filters, onChange }: DonationsFiltersProps) {
  const hasActiveFilters = filters.search || filters.paymentMethod !== "todos" || filters.bank !== "todos";

  const clearFilters = () => {
    onChange({ search: "", paymentMethod: "todos", bank: "todos" });
  };

  return (
    <div className="space-y-3">
      {/* Buscador */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Buscar por nombre..."
          value={filters.search}
          onChange={(e) => onChange({ ...filters, search: e.target.value })}
          className="h-10 pl-9 bg-secondary/50 border-0 focus-visible:ring-primary text-sm"
        />
        {filters.search && (
          <button
            onClick={() => onChange({ ...filters, search: "" })}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Filtros de metodo de pago */}
      <div className="flex flex-wrap gap-1.5">
        {PAYMENT_METHODS.map((method) => (
          <button
            key={method.value}
            onClick={() => onChange({ ...filters, paymentMethod: method.value })}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
              filters.paymentMethod === method.value
                ? "bg-primary text-primary-foreground shadow-sm"
                : "bg-secondary/50 text-muted-foreground hover:bg-secondary hover:text-foreground"
            }`}
          >
            {method.label}
          </button>
        ))}
      </div>

      {/* Filtros de banco (solo si hay transferencias o esta en "todos") */}
      {(filters.paymentMethod === "todos" || filters.paymentMethod === "transferencia") && (
        <div className="flex flex-wrap gap-1.5">
          {BANKS.map((bank) => (
            <button
              key={bank.value}
              onClick={() => onChange({ ...filters, bank: bank.value })}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                filters.bank === bank.value
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "bg-secondary/50 text-muted-foreground hover:bg-secondary hover:text-foreground"
              }`}
            >
              {bank.label}
            </button>
          ))}
        </div>
      )}

      {/* Boton para limpiar filtros */}
      {hasActiveFilters && (
        <Button
          variant="ghost"
          size="sm"
          onClick={clearFilters}
          className="h-8 text-xs w-full text-muted-foreground hover:text-foreground"
        >
          <X className="h-3 w-3 mr-1" />
          Limpiar filtros
        </Button>
      )}
    </div>
  );
}

// Funcion para filtrar donaciones
export function filterDonations(donations: Donation[], filters: FiltersState): Donation[] {
  return donations.filter((donation) => {
    // Filtro por nombre
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      if (!donation.name.toLowerCase().includes(searchLower)) {
        return false;
      }
    }

    // Filtro por metodo de pago
    if (filters.paymentMethod !== "todos" && donation.paymentMethod !== filters.paymentMethod) {
      return false;
    }

    // Filtro por banco
    if (filters.bank !== "todos" && donation.bank !== filters.bank) {
      return false;
    }

    return true;
  });
}
