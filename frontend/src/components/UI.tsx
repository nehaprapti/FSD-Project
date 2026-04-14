import React from "react";
import { motion } from "motion/react";

export const GlassCard = ({ children, className = "", ...props }: any) => (
  <div className={`glass p-6 ${className}`} {...props}>
    {children}
  </div>
);

export const Button = ({
  children,
  variant = "primary",
  className = "",
  ...props
}: any) => {
  const base =
    "px-4 py-3 rounded-xl font-semibold transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed";
  const variants = {
    primary: "bg-primary text-[#0B0B0B] hover:bg-[#E6C200]",
    outline: "border border-white/20 text-white hover:bg-white/10",
    danger:
      "bg-red-500/20 text-red-500 border border-red-500/50 hover:bg-red-500/30",
    ghost: "text-white/70 hover:text-white hover:bg-white/10",
  };
  return (
    <button
      className={`${base} ${variants[variant as keyof typeof variants]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export const Input = ({ label, icon: Icon, className = "", ...props }: any) => (
  <div className={`flex flex-col gap-1.5 mb-4 w-full ${className}`}>
    {label && <label className="text-sm text-white/70 ml-1">{label}</label>}
    <div className="relative">
      {Icon && (
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-white/50">
          <Icon size={18} />
        </div>
      )}
      <input
        className={`w-full bg-black/20 border border-white/10 rounded-xl py-3 text-white focus:border-primary focus:outline-none transition-colors ${Icon ? "pl-11 pr-4" : "px-4"}`}
        {...props}
      />
    </div>
  </div>
);

export const ScreenTransition = ({
  children,
  keyId,
  className = "",
}: {
  children: React.ReactNode;
  keyId: string;
  className?: string;
}) => (
  <motion.div
    key={keyId}
    initial={{ opacity: 0, y: 15 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -15 }}
    transition={{ duration: 0.25, ease: "easeOut" }}
    className={`w-full h-full ${className}`}
  >
    {children}
  </motion.div>
);

import { MapContainer, TileLayer, Marker, Polyline, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const MapUpdater = ({ center, zoom, route }: { center?: [number, number], zoom: number, route?: [number, number][] }) => {
  const map = useMap();
  React.useEffect(() => {
    if (route && route.length > 0) {
      const bounds = L.latLngBounds(route);
      map.fitBounds(bounds, { padding: [50, 50], animate: true });
    } else if (center && center.length === 2 && center[0] !== undefined && center[1] !== undefined) {
      map.setView(center, map.getZoom(), { animate: true });
    }
  }, [center, map, route]);
  return null;
};

const createCustomIcon = (color: string) => {
  return L.divIcon({
    className: "custom-leaflet-marker",
    html: `<div style="background-color: ${color}; width: 14px; height: 14px; border-radius: 50%; border: 2px solid white; box-shadow: 0 0 4px rgba(0,0,0,0.5);"></div>`,
    iconSize: [14, 14],
    iconAnchor: [7, 7],
  });
};

export const MapBackground = ({ children, center, zoom = 13, markers = [], route = [] }: any) => (
  <div className="absolute inset-0 z-0 bg-dark overflow-hidden">
    <MapContainer center={center || [51.505, -0.09]} zoom={zoom} style={{ height: "100%", width: "100%", zIndex: 0 }} zoomControl={false}>
      <TileLayer
        url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>'
      />
      <MapUpdater center={center} zoom={zoom} route={route} />
      {route && route.length > 0 && (
        <Polyline positions={route} color="#E6C200" weight={4} opacity={0.8} />
      )}
      {markers.map((m: any, i: number) => (
         m.position && m.position[0] && m.position[1] ? (
           <Marker 
             key={i} 
             position={m.position} 
             icon={createCustomIcon(m.color || '#E6C200')} 
           />
         ) : null
      ))}
    </MapContainer>
    <div className="absolute inset-0 bg-linear-to-t from-dark via-transparent to-transparent opacity-80 pointer-events-none z-1" />
    <div className="absolute inset-0 z-2 pointer-events-none">
      <div className="*:pointer-events-auto h-full w-full">
        {children}
      </div>
    </div>
  </div>
);
