import { useEffect, useRef, useState, useMemo } from "react";
import { MapPin, Users, Loader2, RefreshCw } from "lucide-react";
import Globe from "react-globe.gl";
import { useAudienceMap } from "@/hooks/useInstagramApi";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";

// Fallback mock data when API is unavailable
const mockGeoData = [
  { lat: 48.8566, lng: 2.3522, city: "Paris", country: "France", followers: 5200, percentage: 35 },
  { lat: 45.764, lng: 4.8357, city: "Lyon", country: "France", followers: 2850, percentage: 19 },
  { lat: 43.2965, lng: 5.3698, city: "Marseille", country: "France", followers: 1950, percentage: 13 },
  { lat: 43.6047, lng: 1.4442, city: "Toulouse", country: "France", followers: 1200, percentage: 8 },
  { lat: 47.2184, lng: -1.5536, city: "Nantes", country: "France", followers: 980, percentage: 7 },
  { lat: 50.6292, lng: 3.0573, city: "Lille", country: "France", followers: 750, percentage: 5 },
  { lat: 51.5074, lng: -0.1278, city: "London", country: "UK", followers: 680, percentage: 5 },
  { lat: 46.2044, lng: 6.1432, city: "Geneva", country: "Switzerland", followers: 520, percentage: 3 },
  { lat: 50.8503, lng: 4.3517, city: "Brussels", country: "Belgium", followers: 450, percentage: 3 },
  { lat: 52.52, lng: 13.405, city: "Berlin", country: "Germany", followers: 320, percentage: 2 },
];

export function GlobeMap() {
  const globeRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 280 });
  
  // Fetch real audience data from API
  const { data: audienceData, isLoading, isError, refetch } = useAudienceMap();

  // Transform API data or fall back to mock data
  const { pointsData, locationCards } = useMemo(() => {
    // If we have real API data with map_markers
    if (audienceData?.map_markers && audienceData.map_markers.length > 0) {
      const points = audienceData.map_markers.map(marker => ({
        lat: marker.lat,
        lng: marker.lng,
        city: marker.country_name, // Use country name for markers
        country: marker.country_code,
        followers: marker.followers,
        percentage: marker.percentage,
        size: Math.max(0.3, Math.sqrt(marker.percentage) * 0.5),
        color: `rgba(249, 115, 22, ${0.6 + marker.percentage / 100})`,
      }));

      // Use top_cities for location cards, fallback to top_countries
      const cities = audienceData.geographic?.top_cities || [];
      const cards = cities.length > 0 
        ? cities.slice(0, 5).map(city => ({
            lat: city.lat || 0,
            lng: city.lng || 0,
            city: city.city,
            country: city.country,
            followers: city.followers,
            percentage: city.percentage,
          }))
        : audienceData.geographic?.top_countries?.slice(0, 5).map(c => ({
            lat: c.coordinates.lat,
            lng: c.coordinates.lng,
            city: c.country_name,
            country: c.country_code,
            followers: c.followers,
            percentage: c.percentage,
          })) || [];

      return { pointsData: points, locationCards: cards };
    }

    // Fallback to mock data
    const points = mockGeoData.map(d => ({
      ...d,
      size: Math.sqrt(d.percentage) * 0.5,
      color: `rgba(249, 115, 22, ${0.6 + d.percentage / 100})`,
    }));

    return { pointsData: points, locationCards: mockGeoData.slice(0, 5) };
  }, [audienceData]);

  // Handle container resize
  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        const isMobile = window.innerWidth < 640;
        setDimensions({
          width: containerRef.current.clientWidth,
          height: isMobile ? 280 : 340
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

  // Loading state
  if (isLoading) {
    return (
      <div className="space-y-3 sm:space-y-4">
        <div className="relative h-[280px] sm:h-[340px] rounded-xl overflow-hidden bg-gradient-to-b from-primary/10 via-background to-background flex items-center justify-center">
          <div className="flex flex-col items-center gap-3">
            <Loader2 className="w-8 h-8 animate-spin text-accent" />
            <span className="text-sm text-muted-foreground">Loading audience data...</span>
          </div>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2 sm:gap-3">
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} className="h-16 sm:h-20 rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3 sm:space-y-4">
      {/* Error banner */}
      {isError && (
        <div className="flex items-center justify-between p-2 rounded-lg bg-destructive/10 border border-destructive/20">
          <span className="text-xs text-destructive">Using cached data</span>
          <Button variant="ghost" size="sm" onClick={() => refetch()} className="h-6 px-2">
            <RefreshCw className="w-3 h-3 mr-1" />
            Retry
          </Button>
        </div>
      )}

      {/* Account info banner */}
      {audienceData?.account && (
        <div className="flex items-center justify-between p-2 rounded-lg bg-muted/30 border border-border/50">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-accent" />
            <span className="text-xs text-muted-foreground">
              <span className="font-medium text-foreground">@{audienceData.account.username}</span>
              {' • '}{(audienceData.account.total_followers / 1000).toFixed(1)}K followers
            </span>
          </div>
          {audienceData.insights_available && (
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-accent/20 text-accent">
              Live Data
            </span>
          )}
        </div>
      )}

      {/* Globe container */}
      <div 
        ref={containerRef}
        className="relative h-[280px] sm:h-[340px] rounded-xl overflow-hidden bg-gradient-to-b from-primary/10 via-background to-background"
      >
        {dimensions.width > 0 && (
          <Globe
            ref={globeRef}
            width={dimensions.width}
            height={dimensions.height}
            backgroundColor="rgba(0,0,0,0)"
            globeImageUrl="//unpkg.com/three-globe/example/img/earth-blue-marble.jpg"
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
                <div style="font-weight: 600; color: white;">${d.city}${d.country !== d.city ? `, ${d.country}` : ''}</div>
                <div style="color: hsl(340, 82%, 65%); font-size: 12px; margin-top: 4px;">
                  ${d.followers >= 1000 ? (d.followers / 1000).toFixed(1) + 'K' : d.followers} followers (${d.percentage.toFixed(1)}%)
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
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2 sm:gap-3">
        {locationCards.map((location, index) => (
          <div
            key={`${location.city}-${index}`}
            className="p-2 sm:p-3 rounded-lg bg-muted/30 border border-border/50 hover:bg-muted/50 transition-colors cursor-pointer"
            onClick={() => {
              if (globeRef.current && location.lat && location.lng) {
                globeRef.current.pointOfView(
                  { lat: location.lat, lng: location.lng, altitude: 1.5 },
                  1000
                );
              }
            }}
          >
            <div className="flex items-center gap-1.5 sm:gap-2 mb-1.5 sm:mb-2">
              <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-accent" />
              <span className="text-[10px] sm:text-xs font-medium text-foreground truncate">
                {location.city}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1 text-[10px] sm:text-xs text-muted-foreground">
                <Users className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                <span>{location.followers >= 1000 ? (location.followers / 1000).toFixed(1) + 'K' : location.followers}</span>
              </div>
              <span className="text-[10px] sm:text-xs font-semibold text-accent">
                {location.percentage.toFixed(1)}%
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Demographics section (if available) */}
      {audienceData?.demographics && (
        <div className="grid grid-cols-2 gap-3">
          {/* Gender breakdown */}
          {audienceData.demographics.gender.length > 0 && (
            <div className="p-3 rounded-lg bg-muted/30 border border-border/50">
              <h4 className="text-xs font-medium text-muted-foreground mb-2">Gender</h4>
              <div className="space-y-1.5">
                {audienceData.demographics.gender.map(g => (
                  <div key={g.gender} className="flex items-center justify-between">
                    <span className="text-xs text-foreground">
                      {g.gender === 'M' ? 'Male' : g.gender === 'F' ? 'Female' : g.gender}
                    </span>
                    <span className="text-xs font-semibold text-accent">{g.percentage.toFixed(1)}%</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Age breakdown */}
          {audienceData.demographics.age.length > 0 && (
            <div className="p-3 rounded-lg bg-muted/30 border border-border/50">
              <h4 className="text-xs font-medium text-muted-foreground mb-2">Age Groups</h4>
              <div className="space-y-1.5">
                {audienceData.demographics.age.slice(0, 4).map(a => (
                  <div key={a.age_range} className="flex items-center justify-between">
                    <span className="text-xs text-foreground">{a.age_range}</span>
                    <span className="text-xs font-semibold text-accent">{a.percentage.toFixed(1)}%</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}