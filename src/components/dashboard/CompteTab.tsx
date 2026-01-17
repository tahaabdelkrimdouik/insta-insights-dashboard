import { useState } from "react";
import { Link2, Link2Off, CheckCircle, XCircle, BadgeCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { profileData } from "@/lib/mockData";
import { cn } from "@/lib/utils";

export function CompteTab() {
  const [isConnected, setIsConnected] = useState(profileData.isConnected);

  const handleConnectionToggle = () => {
    setIsConnected(!isConnected);
  };

  return (
    <div className="space-y-6 slide-up max-w-4xl">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-foreground">Account</h2>
        <p className="text-muted-foreground">Manage your Instagram connection</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Card */}
        <div className="lg:col-span-2 bg-card rounded-xl border border-border p-6">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
            <div className="relative">
              <img
                src={profileData.profilePicture}
                alt={profileData.displayName}
                className="w-24 h-24 rounded-full object-cover ring-4 ring-accent/20"
              />
              {profileData.verifiedBadge && (
                <div className="absolute -bottom-1 -right-1 gradient-accent rounded-full p-1">
                  <BadgeCheck className="h-5 w-5 text-accent-foreground" />
                </div>
              )}
            </div>
            <div className="flex-1 text-center sm:text-left">
              <div className="flex items-center justify-center sm:justify-start gap-2">
                <h3 className="text-xl font-bold text-foreground">{profileData.displayName}</h3>
              </div>
              <p className="text-muted-foreground">@{profileData.username}</p>
              <p className="text-sm text-muted-foreground mt-2 whitespace-pre-line">
                {profileData.bio}
              </p>
              <div className="flex items-center justify-center sm:justify-start gap-6 mt-4">
                <div className="text-center">
                  <p className="text-lg font-bold text-foreground">{profileData.posts}</p>
                  <p className="text-xs text-muted-foreground">Posts</p>
                </div>
                <div className="text-center">
                  <p className="text-lg font-bold text-foreground">
                    {(profileData.followers / 1000).toFixed(1)}K
                  </p>
                  <p className="text-xs text-muted-foreground">Followers</p>
                </div>
                <div className="text-center">
                  <p className="text-lg font-bold text-foreground">
                    {profileData.following.toLocaleString()}
                  </p>
                  <p className="text-xs text-muted-foreground">Following</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Connection Status */}
        <div className="bg-card rounded-xl border border-border p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">Connection Status</h3>
          <div className="space-y-4">
            <div
              className={cn(
                "flex items-center gap-3 p-4 rounded-xl",
                isConnected ? "bg-success/10" : "bg-destructive/10"
              )}
            >
              {isConnected ? (
                <CheckCircle className="h-6 w-6 text-success" />
              ) : (
                <XCircle className="h-6 w-6 text-destructive" />
              )}
              <div>
                <p className="font-semibold text-foreground">
                  {isConnected ? "Connected" : "Disconnected"}
                </p>
                <p className="text-xs text-muted-foreground">
                  {isConnected ? "Your account is synced" : "Connect to sync data"}
                </p>
              </div>
            </div>
            <Button
              onClick={handleConnectionToggle}
              variant={isConnected ? "destructive" : "default"}
              className={cn(
                "w-full",
                !isConnected && "gradient-accent text-accent-foreground hover:opacity-90"
              )}
            >
              {isConnected ? (
                <>
                  <Link2Off className="h-4 w-4 mr-2" />
                  Disconnect Account
                </>
              ) : (
                <>
                  <Link2 className="h-4 w-4 mr-2" />
                  Connect Instagram
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
