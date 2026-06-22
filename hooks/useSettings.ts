"use client";

import { useEffect } from "react";
import { useSettingsStore } from "../store/settingsStore";

export function useSettings() {
  const { settings, isLoading, fetchSettings, hasLoaded } = useSettingsStore();

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  return { settings, isLoading: isLoading && !hasLoaded };
}
