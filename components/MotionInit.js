'use client';
import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { initMotion } from '@/lib/motion';
export default function MotionInit() {
  const path = usePathname();
  useEffect(() => initMotion(), [path]);
  return null;
}
