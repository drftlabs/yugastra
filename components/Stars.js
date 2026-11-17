'use client';
import { useEffect, useRef } from 'react';
import { initStars } from '@/lib/stars';
export default function Stars() {
  const ref = useRef(null);
  useEffect(() => { initStars(ref.current); }, []);
  return <div className="stars" ref={ref} aria-hidden="true" />;
}
