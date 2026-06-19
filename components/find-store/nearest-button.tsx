"use client";

import { useState } from "react";
import { Crosshair, Loader2, AlertCircle, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

type Status = "idle" | "locating" | "success" | "error";

// Rough state-center coordinates (lat, lng) for distance matching
const STATE_CENTERS: Record<string, [number, number]> = {
  Assam: [26.2006, 92.9376],
  Meghalaya: [25.467, 91.366],
  Manipur: [24.6637, 93.9063],
  Tripura: [23.9408, 91.9882],
  Mizoram: [23.1645, 92.9376],
  Nagaland: [26.1584, 94.5624],
  "Arunachal Pradesh": [28.218, 94.7278],
  "West Bengal": [22.9868, 87.855],
  Bihar: [25.0961, 85.3131],
  Odisha: [20.9517, 85.0985],
};

function haversineKm(
  a: [number, number],
  b: [number, number]
): number {
  const R = 6371;
  const toRad = (d: number) => (d * Math.PI) / 180;
  const dLat = toRad(b[0] - a[0]);
  const dLng = toRad(b[1] - a[1]);
  const lat1 = toRad(a[0]);
  const lat2 = toRad(b[0]);
  const s =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(s));
}

export function NearestStoresButton({
  onNearestState,
}: {
  onNearestState: (state: string, distanceKm: number) => void;
}) {
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState<string>("");

  function locate() {
    if (typeof navigator === "undefined" || !navigator.geolocation) {
      setStatus("error");
      setMessage("Your browser doesn't support location.");
      return;
    }
    setStatus("locating");
    setMessage("");
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const userCoords: [number, number] = [
          pos.coords.latitude,
          pos.coords.longitude,
        ];
        let nearest: { state: string; km: number } | null = null;
        for (const [state, coords] of Object.entries(STATE_CENTERS)) {
          const km = haversineKm(userCoords, coords);
          if (!nearest || km < nearest.km) nearest = { state, km };
        }
        if (nearest) {
          setStatus("success");
          setMessage(
            `Closest state: ${nearest.state} (~${Math.round(nearest.km)} km)`
          );
          onNearestState(nearest.state, nearest.km);
        }
      },
      (err) => {
        setStatus("error");
        setMessage(
          err.code === err.PERMISSION_DENIED
            ? "Location permission denied."
            : "Couldn't get your location."
        );
      },
      { timeout: 10000, maximumAge: 60000 }
    );
  }

  return (
    <div className="flex flex-col gap-2">
      <button
        onClick={locate}
        disabled={status === "locating"}
        className={cn(
          "inline-flex items-center justify-center gap-2 rounded-pill px-5 py-2.5 text-sm font-bold transition-all duration-300 disabled:opacity-70",
          status === "success"
            ? "bg-emerald-500 text-white shadow-md shadow-emerald-500/30 hover:bg-emerald-600"
            : "bg-wasro-yellow text-wasro-charcoal shadow-md shadow-wasro-yellow/40 hover:bg-wasro-yellow-dark hover:-translate-y-0.5"
        )}
      >
        {status === "locating" ? (
          <>
            <Loader2 size={14} className="animate-spin" /> Finding…
          </>
        ) : status === "success" ? (
          <>
            <CheckCircle2 size={14} /> Located
          </>
        ) : (
          <>
            <Crosshair size={14} /> Find stores near me
          </>
        )}
      </button>
      {message && (
        <span
          className={cn(
            "inline-flex items-center gap-1.5 text-xs font-medium",
            status === "error" ? "text-rose-700" : "text-emerald-700"
          )}
        >
          {status === "error" && <AlertCircle size={12} />}
          {message}
        </span>
      )}
    </div>
  );
}
