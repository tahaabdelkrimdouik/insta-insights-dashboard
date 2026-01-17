import { Link2, Link2Off, CheckCircle, XCircle, BadgeCheck, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useProfile, useAuthStatus } from "@/hooks/useInstagramApi";
import { profileData as mockProfileData } from "@/lib/mockData";
import { cn } from "@/lib/utils";

export function CompteTab() {
  const { data: profile, isLoading: profileLoading, error: profileError, refetch: refetchProfile } = useProfile();
  const { data: authStatus, isLoading: authLoading, refetch: refetchAuth } = useAuthStatus();

  const isLoading = profileLoading || authLoading;
  const isConnected = authStatus?.authenticated ?? mockProfileData.isConnected;
  
  const displayData = {
    username: profile?.username ?? mockProfileData.username,
    displayName: profile?.username ?? mockProfileData.displayName,
    bio: profile?.bio ?? mockProfileData.bio,
    profilePicture: profile?.profilePicture ?? mockProfileData.profilePicture,
    followers: profile?.followers ?? mockProfileData.followers,
    following: profile?.following ?? mockProfileData.following,
    posts: profile?.posts ?? mockProfileData.posts,
    verifiedBadge: mockProfileData.verifiedBadge,
  };

  const handleConnectionToggle = () => {
    if (isConnected) {
      console.log("Disconnecting...");
    } else {
      window.location.href = `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000'}/auth/login`;
    }
  };

  const handleRefresh = () => {
    refetchProfile();
    refetchAuth();
  };

  if (isLoading) {
    return (
      <div className="space-y-6 slide-up max-w-4xl">
        <div>
          <Skeleton className="h-8 w-32 mb-2" />
          <Skeleton className="h-4 w-64" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-card rounded-xl border border-border p-6">
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
              <Skeleton className="w-24 h-24 rounded-full" />
              <div className="flex-1 space-y-3">
                <Skeleton className="h-6 w-40" />
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-16 w-full" />
                <div className="flex gap-6">
                  <Skeleton className="h-12 w-16" />
                  <Skeleton className="h-12 w-16" />
                  <Skeleton className="h-12 w-16" />
                </div>
              </div>
            </div>
          </div>
          <div className="bg-card rounded-xl border border-border p-6">
            <Skeleton className="h-6 w-40 mb-4" />
            <Skeleton className="h-20 w-full mb-4" />
            <Skeleton className="h-10 w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (profileError) {
    console.warn("Failed to fetch profile, using mock data:", profileError);
  }

  return (
    <div className="space-y-6 slide-up max-w-4xl">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Account</h2>
          <p className="text-muted-foreground">Manage your Instagram connection</p>
        </div>
        <Button variant="ghost" size="icon" onClick={handleRefresh} className="text-muted-foreground hover:text-foreground">
          <RefreshCw className="h-4 w-4" />
        </Button>
      </div>

      {profileError && (
        <div className="bg-warning/10 border border-warning/20 rounded-lg p-3 text-sm text-warning">
          Unable to fetch live data. Showing cached information.
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-card rounded-xl border border-border p-6">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
            <div className="relative">
              <img src={displayData.profilePicture} alt={displayData.displayName} className="w-24 h-24 rounded-full object-cover ring-4 ring-accent/20" />
              {displayData.verifiedBadge && (
                <div className="absolute -bottom-1 -right-1 gradient-accent rounded-full p-1">
                  <BadgeCheck className="h-5 w-5 text-accent-foreground" />
                </div>
              )}
            </div>
            <div className="flex-1 text-center sm:text-left">
              <h3 className="text-xl font-bold text-foreground">{displayData.displayName}</h3>
              <p className="text-muted-foreground">@{displayData.username}</p>
              <p className="text-sm text-muted-foreground mt-2 whitespace-pre-line">{displayData.bio}</p>
              <div className="flex items-center justify-center sm:justify-start gap-6 mt-4">
                <div className="text-center">
                  <p className="text-lg font-bold text-foreground">{displayData.posts}</p>
                  <p className="text-xs text-muted-foreground">Posts</p>
                </div>
                <div className="text-center">
                  <p className="text-lg font-bold text-foreground">{(displayData.followers / 1000).toFixed(1)}K</p>
                  <p className="text-xs text-muted-foreground">Followers</p>
                </div>
                <div className="text-center">
                  <p className="text-lg font-bold text-foreground">{displayData.following.toLocaleString()}</p>
                  <p className="text-xs text-muted-foreground">Following</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-card rounded-xl border border-border p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">Connection Status</h3>
          <div className="space-y-4">
            <div className={cn("flex items-center gap-3 p-4 rounded-xl", isConnected ? "bg-success/10" : "bg-destructive/10")}>
              {isConnected ? <CheckCircle className="h-6 w-6 text-success" /> : <XCircle className="h-6 w-6 text-destructive" />}
              <div>
                <p className="font-semibold text-foreground">{isConnected ? "Connected" : "Disconnected"}</p>
                <p className="text-xs text-muted-foreground">{isConnected ? "Your account is synced" : "Connect to sync data"}</p>
              </div>
            </div>
            <Button onClick={handleConnectionToggle} variant={isConnected ? "destructive" : "default"} className={cn("w-full", !isConnected && "gradient-accent text-accent-foreground hover:opacity-90")}>
              {isConnected ? <><Link2Off className="h-4 w-4 mr-2" />Disconnect Account</> : <><Link2 className="h-4 w-4 mr-2" />Connect Instagram</>}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
