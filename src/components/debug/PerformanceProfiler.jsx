"use client";

import { Profiler } from 'react';

export function PerformanceProfiler({ id, children }) {
  const onRenderCallback = (id, phase, actualDuration, baseDuration, startTime, commitTime) => {
    // Performance monitoring disabled
  };

  return (
    <Profiler id={id} onRender={onRenderCallback}>
      {children}
    </Profiler>
  );
}