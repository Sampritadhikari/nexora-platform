"use client";

import React, { useState } from "react";
import { authApi } from "@/lib/api";
import { useTheme } from "@/context/ThemeContext";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import { Lock, Sun, Moon, ShieldCheck, CheckCircle2 } from "lucide-react";

export default function SettingsPage() {
  const { theme, toggleTheme } = useTheme();

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setMessage(null);

    if (newPassword.length < 8) {
      setError("New password must be at least 8 characters.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("New passwords do not match.");
      return;
    }

    try {
      setLoading(true);
      await authApi.changePassword({ current_password: currentPassword, new_password: newPassword });
      setMessage("Password updated successfully.");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err: any) {
      setError(err.message || "Failed to change password. Please check your current password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <div className="pb-4 border-b border-slate-200 dark:border-slate-800">
        <h1 className="font-display text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
          Account Settings
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Security controls, authentication credentials, and system interface preferences.
        </p>
      </div>

      {/* Password Change */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Lock className="h-4 w-4 text-brand-500" />
            <CardTitle className="text-base font-bold">Change Password</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          {message && (
            <div className="mb-4 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 p-3 text-xs font-medium text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
              {message}
            </div>
          )}
          {error && (
            <div className="mb-4 rounded-lg bg-red-50 dark:bg-red-950/40 p-3 text-xs font-medium text-red-600 dark:text-red-400 border border-red-200 dark:border-red-900">
              {error}
            </div>
          )}

          <form onSubmit={handlePasswordChange} className="space-y-4">
            <Input
              label="Current Password *"
              type="password"
              required
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="••••••••"
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="New Password *"
                type="password"
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Min 8 characters"
              />
              <Input
                label="Confirm New Password *"
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Repeat new password"
              />
            </div>

            <div className="flex justify-end pt-2">
              <Button type="submit" size="sm" loading={loading}>
                Update Password
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Visual Appearance */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            {theme === "dark" ? <Moon className="h-4 w-4 text-brand-400" /> : <Sun className="h-4 w-4 text-amber-500" />}
            <CardTitle className="text-base font-bold">Visual Theme Interface</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-900 dark:text-white">Active Theme Mode: {theme.toUpperCase()}</p>
            <p className="text-xs text-slate-500 mt-0.5">Toggle between crisp modern Light mode and dark studio palette.</p>
          </div>
          <Button variant="outline" size="sm" onClick={toggleTheme}>
            Switch to {theme === "dark" ? "Light Mode" : "Dark Mode"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
