"use client";

import { useEffect, useState, useRef } from "react";
import { usePathname } from "next/navigation";

export default function RouteTransitionLoader() {
  const pathname = usePathname();
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const prevPathnameRef = useRef(pathname);
  const intervalRef = useRef(null);

  useEffect(() => {
    // Only show loader if pathname actually changed
    if (prevPathnameRef.current === pathname) {
      return;
    }

    prevPathnameRef.current = pathname;
    setIsLoading(true);
    setProgress(0);

    // Clear any existing interval
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    // Simulate progress with realistic increments
    let currentProgress = 0;
    intervalRef.current = setInterval(() => {
      // Fast initial progress (0-30%)
      if (currentProgress < 30) {
        currentProgress += Math.random() * 8 + 4;
      }
      // Medium progress (30-70%)
      else if (currentProgress < 70) {
        currentProgress += Math.random() * 4 + 2;
      }
      // Slow progress (70-90%)
      else if (currentProgress < 90) {
        currentProgress += Math.random() * 2 + 0.5;
      }
      // Cap at 90% until route fully loads
      else {
        clearInterval(intervalRef.current);
        return;
      }

      setProgress(Math.min(currentProgress, 90));
    }, 50);

    // Complete loading after route transition completes
    const completeTimeout = setTimeout(() => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      setProgress(100);
      // Hide loader after completion
      setTimeout(() => {
        setIsLoading(false);
        setProgress(0);
      }, 200);
    }, 300);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      clearTimeout(completeTimeout);
    };
  }, [pathname]);

  if (!isLoading) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-[9999] h-1 bg-gray-100/50">
      <div
        className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-indigo-500 transition-all duration-200 ease-out shadow-lg shadow-blue-500/50"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
}

