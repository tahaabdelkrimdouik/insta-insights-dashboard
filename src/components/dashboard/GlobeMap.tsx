import { useEffect, useRef, useState } from "react";
import { MapPin, Users } from "lucide-react";

// Mock geographic data for audience distribution
const mockGeoData = [
  { lat: 48.8566, lng: 2.3522, city: "Paris", country: "France", followers: 12450, percentage: 27 },
  { lat: 40.7128, lng: -74.006, city: "New York", country: "USA", followers: 8920, percentage: 19 },
  { lat: 51.5074, lng: -0.1278, city: "London", country: "UK", followers: 6830, percentage: 15 },
  { lat: 35.6762, lng: 139.6503, city: "Tokyo", country: "Japan", followers: 4560, percentage: 10 },
  { lat: -33.8688, lng: 151.2093, city: "Sydney", country: "Australia", followers: 3420, percentage: 7 },
  { lat: 52.52, lng: 13.405, city: "Berlin", country: "Germany", followers: 2890, percentage: 6 },
  { lat: 55.7558, lng: 37.6173, city: "Moscow", country: "Russia", followers: 2340, percentage: 5 },
  { lat: 19.4326, lng: -99.1332, city: "Mexico City", country: "Mexico", followers: 1980, percentage: 4 },
  { lat: -23.5505, lng: -46.6333, city: "São Paulo", country: "Brazil", followers: 1650, percentage: 4 },
  { lat: 1.3521, lng: 103.8198, city: "Singapore", country: "Singapore", followers: 852, percentage: 2 },
];

export function GlobeMap() {
  const containerRef = useRef<HTMLDivElement>(null);
  const globeRef = useRef<any>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let globe: any = null;
    
    const initGlobe = async () => {
      if (!containerRef.current) return;
      
      try {
        const Globe = (await import("react-globe.gl")).default;
        
        // Create a wrapper for the globe
        const container = containerRef.current;
        const width = container.clientWidth;
        const height = 340;
        
        // Dynamic import and render
        setIsLoaded(true);
      } catch (err) {
        console.error("Failed to load globe:", err);
        setError("Failed to load 3D globe");
      }
    };
    
    initGlobe();
    
    return () => {
      if (globe) {
        // Cleanup if needed
      }
    };
  }, []);

  return (
    <div className="space-y-4">
      {/* Globe placeholder with gradient background */}
      <div 
        ref={containerRef}
        className="relative h-[340px] rounded-xl overflow-hidden bg-gradient-to-b from-primary/20 via-primary/10 to-background"
      >
        {/* Decorative globe visualization */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="relative">
            {/* Globe circle */}
            <div className="w-64 h-64 rounded-full bg-gradient-to-br from-primary/30 via-accent/20 to-primary/40 border border-accent/30 shadow-2xl shadow-accent/20 animate-pulse">
              {/* Grid lines */}
              <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100">
                {/* Horizontal lines */}
                {[20, 35, 50, 65, 80].map((y) => (
                  <ellipse
                    key={`h-${y}`}
                    cx="50"
                    cy="50"
                    rx={Math.sin((y / 100) * Math.PI) * 48}
                    ry={(y - 50) * 0.96}
                    fill="none"
                    stroke="hsl(var(--accent))"
                    strokeWidth="0.3"
                    opacity="0.4"
                    transform={`rotate(-15 50 50)`}
                  />
                ))}
                {/* Vertical lines */}
                {[0, 30, 60, 90, 120, 150].map((angle) => (
                  <ellipse
                    key={`v-${angle}`}
                    cx="50"
                    cy="50"
                    rx="2"
                    ry="48"
                    fill="none"
                    stroke="hsl(var(--accent))"
                    strokeWidth="0.3"
                    opacity="0.4"
                    transform={`rotate(${angle - 15} 50 50)`}
                  />
                ))}
              </svg>
              
              {/* Animated data points */}
              {mockGeoData.slice(0, 6).map((point, index) => {
                const angle = (index / 6) * 360;
                const radius = 80 + (index % 3) * 15;
                const x = 128 + Math.cos((angle * Math.PI) / 180) * radius;
                const y = 128 + Math.sin((angle * Math.PI) / 180) * radius;
                
                return (
                  <div
                    key={point.city}
                    className="absolute w-3 h-3 rounded-full bg-accent animate-ping"
                    style={{
                      left: `${x}px`,
                      top: `${y}px`,
                      animationDelay: `${index * 0.3}s`,
                      animationDuration: "2s",
                    }}
                  >
                    <div className="absolute inset-0 rounded-full bg-accent" />
                  </div>
                );
              })}
            </div>
            
            {/* Glow effect */}
            <div className="absolute inset-0 w-64 h-64 rounded-full bg-accent/10 blur-xl -z-10" />
          </div>
        </div>
        
        {/* Overlay label */}
        <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <MapPin className="w-4 h-4 text-accent" />
            <span>Audience Distribution</span>
          </div>
          <span className="text-xs text-muted-foreground/70">Globe.gl Ready</span>
        </div>
      </div>

      {/* Location stats grid */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {mockGeoData.slice(0, 5).map((location) => (
          <div
            key={location.city}
            className="p-3 rounded-lg bg-muted/30 border border-border/50 hover:bg-muted/50 transition-colors"
          >
            <div className="flex items-center gap-2 mb-2">
              <div className="w-2 h-2 rounded-full bg-accent" />
              <span className="text-xs font-medium text-foreground truncate">
                {location.city}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Users className="w-3 h-3" />
                <span>{(location.followers / 1000).toFixed(1)}K</span>
              </div>
              <span className="text-xs font-semibold text-accent">
                {location.percentage}%
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
