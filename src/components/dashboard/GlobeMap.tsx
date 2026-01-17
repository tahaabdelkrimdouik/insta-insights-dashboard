import { useEffect, useRef, useState, useMemo } from "react";
import { MapPin, Users } from "lucide-react";
import Globe from "react-globe.gl";

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
  const globeRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 340 });

  // Points data for the globe
  const pointsData = useMemo(() => 
    mockGeoData.map(d => ({
      ...d,
      size: Math.sqrt(d.percentage) * 0.5,
      color: `rgba(249, 115, 22, ${0.6 + d.percentage / 100})`,
    })), 
  []);

  // Handle container resize
  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        setDimensions({
          width: containerRef.current.clientWidth,
          height: 340
        });
      }
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  // Configure globe after mount
  useEffect(() => {
    if (globeRef.current) {
      // Set initial camera position
      globeRef.current.pointOfView({ lat: 30, lng: 0, altitude: 2.2 });
      
      // Enable auto-rotation
      const controls = globeRef.current.controls();
      if (controls) {
        controls.autoRotate = true;
        controls.autoRotateSpeed = 0.5;
        controls.enableZoom = true;
        controls.minDistance = 150;
        controls.maxDistance = 500;
      }
    }
  }, [dimensions.width]);

  return (
    <div className="space-y-4">
      {/* Globe container */}
      <div 
        ref={containerRef}
        className="relative h-[340px] rounded-xl overflow-hidden bg-gradient-to-b from-primary/10 via-background to-background"
      >
        {dimensions.width > 0 && (
          <Globe
            ref={globeRef}
            width={dimensions.width}
            height={dimensions.height}
            backgroundColor="rgba(0,0,0,0)"
            globeImageUrl="//unpkg.com/three-globe/example/img/earth-night.jpg"
            atmosphereColor="#f97316"
            atmosphereAltitude={0.18}
            pointsData={pointsData}
            pointLat="lat"
            pointLng="lng"
            pointAltitude={0.01}
            pointRadius="size"
            pointColor="color"
            pointLabel={(d: any) => `
              <div style="background: hsl(222, 47%, 11%); padding: 8px 12px; border-radius: 8px; border: 1px solid hsl(340, 82%, 52%); font-family: system-ui;">
                <div style="font-weight: 600; color: white;">${d.city}, ${d.country}</div>
                <div style="color: hsl(340, 82%, 65%); font-size: 12px; margin-top: 4px;">
                  ${(d.followers / 1000).toFixed(1)}K followers (${d.percentage}%)
                </div>
              </div>
            `}
            onPointClick={(point: any) => {
              if (globeRef.current) {
                globeRef.current.pointOfView(
                  { lat: point.lat, lng: point.lng, altitude: 1.5 },
                  1000
                );
              }
            }}
          />
        )}
        
        {/* Overlay label */}
        <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between pointer-events-none">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <MapPin className="w-4 h-4 text-accent" />
            <span>Audience Distribution</span>
          </div>
          <span className="text-xs text-muted-foreground/70">Interactive Globe</span>
        </div>
      </div>

      {/* Location stats grid */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {mockGeoData.slice(0, 5).map((location) => (
          <div
            key={location.city}
            className="p-3 rounded-lg bg-muted/30 border border-border/50 hover:bg-muted/50 transition-colors cursor-pointer"
            onClick={() => {
              if (globeRef.current) {
                globeRef.current.pointOfView(
                  { lat: location.lat, lng: location.lng, altitude: 1.5 },
                  1000
                );
              }
            }}
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
