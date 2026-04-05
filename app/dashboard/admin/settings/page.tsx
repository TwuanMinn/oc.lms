"use client";

import { useState, useEffect } from "react";
import { trpc } from "@/lib/trpc/client";
import { PageHeader } from "@/components/shared/PageHeader";
import { motion } from "motion/react";
import { toast } from "sonner";
import { Save, Loader2 } from "lucide-react";

export default function AdminSettingsPage() {
  const { data: settings, isLoading } = trpc.admin.getSettings.useQuery();
  const utils = trpc.useUtils();

  const [platformName, setPlatformName] = useState("");
  const [platformFee, setPlatformFee] = useState("10");
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (settings) {
      setPlatformName(settings.platform_name ?? "Green Academy");
      setPlatformFee(settings.platform_fee ?? "10");
      setMaintenanceMode(settings.maintenance_mode === "true");
    }
  }, [settings]);

  const updateSetting = trpc.admin.updateSetting.useMutation({
    onError: (err) => toast.error(err.message),
  });

  const handleSave = async () => {
    setSaving(true);
    try {
      await Promise.all([
        updateSetting.mutateAsync({ key: "platform_name", value: platformName }),
        updateSetting.mutateAsync({ key: "platform_fee", value: platformFee }),
        updateSetting.mutateAsync({
          key: "maintenance_mode",
          value: maintenanceMode ? "true" : "false",
        }),
      ]);
      utils.admin.getSettings.invalidate();
      toast.success("Settings saved successfully");
    } catch {
      // Error handled by mutation
    } finally {
      setSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <PageHeader title="Settings" description="Platform configuration" />
        <div className="max-w-xl space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-16 animate-pulse rounded-xl bg-muted" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <PageHeader title="Settings" description="Platform configuration and preferences" />

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-xl rounded-xl border border-border/50 bg-card p-6"
      >
        <div className="space-y-6">
          {/* Platform Name */}
          <div>
            <label htmlFor="platformName" className="mb-1.5 block text-sm font-medium">
              Platform Name
            </label>
            <input
              id="platformName"
              type="text"
              value={platformName}
              onChange={(e) => setPlatformName(e.target.value)}
              className="h-10 w-full rounded-lg border border-border/50 bg-background px-3 text-sm outline-none transition-colors focus:border-primary/50 focus:ring-1 focus:ring-primary/20"
              placeholder="Green Academy"
            />
            <p className="mt-1 text-xs text-muted-foreground">
              Displayed across the platform
            </p>
          </div>

          {/* Platform Fee */}
          <div>
            <label htmlFor="platformFee" className="mb-1.5 block text-sm font-medium">
              Platform Fee (%)
            </label>
            <div className="relative">
              <input
                id="platformFee"
                type="number"
                min="0"
                max="100"
                step="0.5"
                value={platformFee}
                onChange={(e) => setPlatformFee(e.target.value)}
                className="h-10 w-full rounded-lg border border-border/50 bg-background px-3 pr-8 text-sm outline-none transition-colors focus:border-primary/50 focus:ring-1 focus:ring-primary/20"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                %
              </span>
            </div>
            <p className="mt-1 text-xs text-muted-foreground">
              Percentage deducted from each transaction
            </p>
          </div>

          {/* Maintenance Mode */}
          <div className="flex items-center justify-between rounded-lg border border-border/50 bg-muted/30 p-4">
            <div>
              <p className="text-sm font-medium">Maintenance Mode</p>
              <p className="text-xs text-muted-foreground">
                Temporarily disable public access
              </p>
            </div>
            <button
              onClick={() => setMaintenanceMode(!maintenanceMode)}
              className={`relative h-6 w-11 rounded-full transition-colors ${
                maintenanceMode ? "bg-primary" : "bg-border"
              }`}
            >
              <span
                className={`absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white transition-transform shadow-sm ${
                  maintenanceMode ? "translate-x-5" : "translate-x-0"
                }`}
              />
            </button>
          </div>

          {/* Save Button */}
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-50"
          >
            {saving ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Save className="h-4 w-4" />
            )}
            {saving ? "Saving..." : "Save Settings"}
          </button>
        </div>
      </motion.div>
    </div>
  );
}
