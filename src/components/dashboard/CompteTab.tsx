import { useState } from "react";
import { Link2, Link2Off, Settings, Clock, Globe, CheckCircle, XCircle, BadgeCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { profileData } from "@/lib/mockData";
import { cn } from "@/lib/utils";

export function CompteTab() {
  const [isConnected, setIsConnected] = useState(profileData.isConnected);
  const [timezone, setTimezone] = useState("Europe/Paris");
  const [refreshInterval, setRefreshInterval] = useState("15");
  const [autoRefresh, setAutoRefresh] = useState(true);

  const handleConnectionToggle = () => {
    setIsConnected(!isConnected);
  };

  return (
    <div className="space-y-6 slide-up max-w-4xl">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-foreground">Account</h2>
        <p className="text-muted-foreground">Manage your Instagram connection and settings</p>
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

      {/* Settings */}
      <div className="bg-card rounded-xl border border-border p-6">
        <div className="flex items-center gap-2 mb-6">
          <Settings className="h-5 w-5 text-muted-foreground" />
          <h3 className="text-lg font-semibold text-foreground">Settings</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Timezone */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Globe className="h-4 w-4 text-muted-foreground" />
              <label className="text-sm font-medium text-foreground">Timezone</label>
            </div>
            <Select value={timezone} onValueChange={setTimezone}>
              <SelectTrigger className="bg-muted/50">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-card">
                <SelectItem value="Europe/Paris">Europe/Paris (UTC+1)</SelectItem>
                <SelectItem value="America/New_York">America/New York (UTC-5)</SelectItem>
                <SelectItem value="America/Los_Angeles">America/Los Angeles (UTC-8)</SelectItem>
                <SelectItem value="Asia/Tokyo">Asia/Tokyo (UTC+9)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Refresh Interval */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <label className="text-sm font-medium text-foreground">Refresh Interval</label>
            </div>
            <Select value={refreshInterval} onValueChange={setRefreshInterval}>
              <SelectTrigger className="bg-muted/50">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-card">
                <SelectItem value="5">Every 5 minutes</SelectItem>
                <SelectItem value="15">Every 15 minutes</SelectItem>
                <SelectItem value="30">Every 30 minutes</SelectItem>
                <SelectItem value="60">Every hour</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Auto Refresh Toggle */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Auto Refresh</label>
            <div className="flex items-center justify-between p-3 rounded-xl bg-muted/50">
              <span className="text-sm text-muted-foreground">Enable automatic data refresh</span>
              <Switch checked={autoRefresh} onCheckedChange={setAutoRefresh} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
