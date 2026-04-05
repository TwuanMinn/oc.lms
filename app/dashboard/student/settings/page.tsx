"use client";

import { useState } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Sidebar } from "@/components/layout/Sidebar";
import { PageHeader } from "@/components/shared/PageHeader";
import { useAuth } from "@/lib/hooks/useAuth";
import { motion } from "motion/react";
import { AnimatedPage } from "@/components/ui/animated";
import { User, Lock, Bell, Shield, Save, Check } from "lucide-react";
import { toast } from "sonner";
import { springBounce } from "@/lib/motion";

type Tab = "profile" | "password" | "notifications";

export default function StudentSettingsPage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<Tab>("profile");
  const [name, setName] = useState(user?.name ?? "");
  const [bio, setBio] = useState("");
  const [emailNotifs, setEmailNotifs] = useState(true);
  const [pushNotifs, setPushNotifs] = useState(true);
  const [weeklyDigest, setWeeklyDigest] = useState(false);
  const [saved, setSaved] = useState(false);

  const tabs: { id: Tab; label: string; icon: typeof User }[] = [
    { id: "profile", label: "Profile", icon: User },
    { id: "password", label: "Password", icon: Lock },
    { id: "notifications", label: "Notifications", icon: Bell },
  ];

  function handleSave() {
    setSaved(true);
    toast.success("Settings saved successfully");
    setTimeout(() => setSaved(false), 2000);
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="flex">
        <Sidebar role="STUDENT" />
        <main className="flex-1 p-6">
          <AnimatedPage>
            <PageHeader
              title="Settings"
              description="Manage your account preferences"
            />

            <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-4">
              {/* Tab navigation */}
              <div className="lg:col-span-1">
                <nav className="flex flex-row gap-1 lg:flex-col">
                  {tabs.map((tab) => (
                    <motion.button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      whileHover={{ x: 2 }}
                      transition={springBounce}
                      className={`flex cursor-pointer items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-colors ${
                        activeTab === tab.id
                          ? "bg-primary/10 text-primary"
                          : "text-muted-foreground hover:bg-accent/50 hover:text-foreground"
                      }`}
                    >
                      <tab.icon className="h-4 w-4" />
                      {tab.label}
                    </motion.button>
                  ))}
                </nav>
              </div>

              {/* Tab content */}
              <div className="lg:col-span-3">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                  className="rounded-2xl border border-border/50 bg-card p-6 sm:p-8"
                >
                  {activeTab === "profile" && (
                    <div className="space-y-6">
                      <div>
                        <h3 className="text-lg font-bold">Profile Information</h3>
                        <p className="text-sm text-muted-foreground">Update your personal details</p>
                      </div>

                      {/* Avatar */}
                      <div className="flex items-center gap-4">
                        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-xl font-bold text-primary">
                          {user?.name?.[0]?.toUpperCase() ?? "?"}
                        </div>
                        <div>
                          <p className="text-sm font-medium">{user?.email}</p>
                          <p className="text-xs text-muted-foreground">Student Account</p>
                        </div>
                      </div>

                      <div className="grid gap-4 sm:grid-cols-2">
                        <div>
                          <label className="mb-1.5 block text-sm font-medium">Full Name</label>
                          <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary/30 transition-colors"
                          />
                        </div>
                        <div>
                          <label className="mb-1.5 block text-sm font-medium">Email</label>
                          <input
                            type="email"
                            value={user?.email ?? ""}
                            disabled
                            className="w-full rounded-lg border border-border bg-muted/50 px-3 py-2 text-sm text-muted-foreground cursor-not-allowed"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="mb-1.5 block text-sm font-medium">Bio</label>
                        <textarea
                          value={bio}
                          onChange={(e) => setBio(e.target.value)}
                          rows={3}
                          placeholder="Tell us about yourself..."
                          className="w-full resize-none rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary/30 transition-colors"
                        />
                      </div>
                    </div>
                  )}

                  {activeTab === "password" && (
                    <div className="space-y-6">
                      <div>
                        <h3 className="text-lg font-bold">Change Password</h3>
                        <p className="text-sm text-muted-foreground">Ensure your account stays secure</p>
                      </div>

                      <div className="max-w-md space-y-4">
                        <div>
                          <label className="mb-1.5 block text-sm font-medium">Current Password</label>
                          <input type="password" className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary/30 transition-colors" />
                        </div>
                        <div>
                          <label className="mb-1.5 block text-sm font-medium">New Password</label>
                          <input type="password" className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary/30 transition-colors" />
                        </div>
                        <div>
                          <label className="mb-1.5 block text-sm font-medium">Confirm Password</label>
                          <input type="password" className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary/30 transition-colors" />
                        </div>

                        <div className="rounded-lg bg-amber-500/10 p-3">
                          <div className="flex items-start gap-2">
                            <Shield className="mt-0.5 h-4 w-4 text-amber-500" />
                            <p className="text-xs text-amber-600 dark:text-amber-400">
                              Password must be at least 8 characters with a mix of letters, numbers, and symbols.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {activeTab === "notifications" && (
                    <div className="space-y-6">
                      <div>
                        <h3 className="text-lg font-bold">Notification Preferences</h3>
                        <p className="text-sm text-muted-foreground">Choose how you want to be notified</p>
                      </div>

                      <div className="space-y-4">
                        {[
                          { label: "Email Notifications", desc: "Receive updates about your courses via email", value: emailNotifs, setter: setEmailNotifs },
                          { label: "Push Notifications", desc: "Get browser notifications for new content", value: pushNotifs, setter: setPushNotifs },
                          { label: "Weekly Digest", desc: "Receive a weekly summary of your learning progress", value: weeklyDigest, setter: setWeeklyDigest },
                        ].map((item) => (
                          <div key={item.label} className="flex items-center justify-between rounded-xl border border-border/50 p-4 transition-colors hover:bg-accent/20">
                            <div>
                              <p className="text-sm font-medium">{item.label}</p>
                              <p className="text-xs text-muted-foreground">{item.desc}</p>
                            </div>
                            <button
                              onClick={() => item.setter(!item.value)}
                              className={`relative h-6 w-11 cursor-pointer rounded-full transition-colors ${item.value ? "bg-primary" : "bg-muted-foreground/30"}`}
                            >
                              <motion.div
                                animate={{ x: item.value ? 20 : 2 }}
                                transition={springBounce}
                                className="absolute top-1 h-4 w-4 rounded-full bg-white shadow-sm"
                              />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Save button */}
                  <div className="mt-8 flex justify-end border-t border-border/50 pt-6">
                    <motion.button
                      onClick={handleSave}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      transition={springBounce}
                      className="flex cursor-pointer items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
                    >
                      {saved ? <Check className="h-4 w-4" /> : <Save className="h-4 w-4" />}
                      {saved ? "Saved!" : "Save changes"}
                    </motion.button>
                  </div>
                </motion.div>
              </div>
            </div>
          </AnimatedPage>
        </main>
      </div>
    </div>
  );
}
