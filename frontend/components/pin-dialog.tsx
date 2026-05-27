"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Lock } from "lucide-react";

const APP_PIN = "0412";
const AUTH_KEY = "app_authenticated";

interface PinDialogProps {
  open: boolean;
  onSuccess: () => void;
}

export function PinDialog({ open, onSuccess }: PinDialogProps) {
  const [pin, setPin] = useState("");
  const [error, setError] = useState("");

  const handleLogin = () => {
    if (pin === APP_PIN) {
      localStorage.setItem(AUTH_KEY, "true");
      setPin("");
      setError("");
      onSuccess();
    } else {
      setError("PIN incorrecto");
    }
  };

  return (
    <Dialog open={open} onOpenChange={() => {}}>
      <DialogContent className="w-[calc(100%-2rem)] max-w-sm rounded-xl" showCloseButton={false}>
        <DialogHeader>
          <div className="mx-auto flex h-16 w-16 items-center justify-center mb-2">
            <img src="/LogoVidaPlenaTransparente.png" alt="Logo" className="h-full w-full object-contain" />
          </div>
          <DialogTitle className="text-center text-lg">
            Campana 1000 Amigos
          </DialogTitle>
          <DialogDescription className="text-center text-sm">
            Ingresa el PIN de acceso para continuar
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div className="space-y-1.5">
            <Label htmlFor="pin" className="text-sm">PIN de acceso</Label>
            <Input
              id="pin"
              type="password"
              inputMode="numeric"
              maxLength={4}
              placeholder="Ingresa el PIN"
              value={pin}
              onChange={(e) => {
                setPin(e.target.value.replace(/\D/g, "").slice(0, 4));
                setError("");
              }}
              className="h-12 text-center text-2xl tracking-[0.5em]"
              onKeyDown={(e) => {
                if (e.key === "Enter") handleLogin();
              }}
              autoFocus
            />
          </div>

          {error && (
            <p className="text-sm text-destructive text-center font-medium">{error}</p>
          )}

          <Button
            onClick={handleLogin}
            className="w-full h-11 text-base"
            disabled={pin.length < 4}
          >
            <Lock className="mr-2 h-4 w-4" />
            Entrar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export function checkAuth(): boolean {
  if (typeof window === "undefined") return false;
  return localStorage.getItem(AUTH_KEY) === "true";
}

export function logout() {
  localStorage.removeItem(AUTH_KEY);
}
