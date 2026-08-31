"use client";

/**
 * ContactMap — client-only Leaflet map of the A&A Aviation office.
 *
 * The Leaflet stack (react-leaflet + leaflet) is browser-only, so it's
 * imported lazily inside an effect instead of at module top level: the
 * server-reachable module graph never contains it, which also keeps the
 * production build from evaluating `window`-dependent code during page
 * data collection.
 */

import { useEffect, useState, type ComponentType } from "react";

type LeafletMapProps = { latitude: number; longitude: number; address: string };

export default function ContactMap({ latitude, longitude, address }: LeafletMapProps) {
  const [Map, setMap] = useState<ComponentType<LeafletMapProps> | null>(null);

  useEffect(() => {
    let active = true;
    import("./LeafletMap")
      .then((m) => {
        if (active) setMap(() => m.default);
      })
      .catch(() => {});
    return () => {
      active = false;
    };
  }, []);

  if (!Map) {
    return (
      <div className="flex h-full w-full items-center justify-center rounded-2xl bg-sky text-sm text-navy/60">
        Loading map…
      </div>
    );
  }

  return <Map latitude={latitude} longitude={longitude} address={address} />;
}
