import React, { useState, useEffect, useRef } from 'react';
import { Search, MapPin } from 'lucide-react';

interface GeocodingAutocompleteProps {
  placeholder?: string;
  defaultValue?: string;
  onChange?: (place: { address: string; lat: number; lng: number } | null) => void;
  className?: string;
}

export const GeocodingAutocomplete: React.FC<GeocodingAutocompleteProps> = ({
  placeholder = "Search location...",
  defaultValue = "",
  onChange,
  className = ""
}) => {
  const [query, setQuery] = useState(defaultValue);
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    if (!query || query === defaultValue) {
      setResults([]);
      return;
    }

    if (timeoutRef.current) clearTimeout(timeoutRef.current);

    timeoutRef.current = setTimeout(async () => {
      setLoading(true);
      try {
        const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=5`);
        const data = await response.json();
        setResults(data);
        setIsOpen(true);
      } catch (error) {
        console.error("Geocoding error:", error);
      } finally {
        setLoading(false);
      }
    }, 500);

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [query, defaultValue]);

  const handleSelect = (item: any) => {
    setQuery(item.display_name);
    setIsOpen(false);
    if (onChange) {
      onChange({
        address: item.display_name,
        lat: parseFloat(item.lat),
        lng: parseFloat(item.lon)
      });
    }
  };

  return (
    <div className="relative w-full">
      <div className="flex items-center">
        <input
          type="text"
          className={className}
          placeholder={placeholder}
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            if (onChange && e.target.value === "") {
                onChange(null);
            }
          }}
          onFocus={() => { if (results.length > 0) setIsOpen(true); }}
          onBlur={() => setTimeout(() => setIsOpen(false), 200)}
        />
        {loading && <Search className="absolute right-2 w-4 h-4 text-white/50 animate-pulse" />}
      </div>
      
      {isOpen && results.length > 0 && (
        <div className="absolute top-10 left-0 w-full bg-dark/95 border border-white/10 rounded-xl shadow-2xl z-50 max-h-60 overflow-y-auto">
          {results.map((item, idx) => (
            <div 
              key={idx} 
              className="p-3 hover:bg-white/10 cursor-pointer flex items-start gap-3 border-b border-white/5 last:border-b-0"
              onClick={() => handleSelect(item)}
            >
              <MapPin className="w-4 h-4 text-primary shrink-0 mt-1" />
              <div className="text-sm truncate white-space-normal">{item.display_name}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
