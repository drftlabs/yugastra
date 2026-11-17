'use client';
import NextLink from 'next/link';
import { HI } from '@/lib/i18n';
import { useLangCtx } from '@/components/LangCtx';

export const useLang = () => useLangCtx();
export const useT = () => { const l = useLang(); return (s) => (l === 'hi' ? HI[s] || s : s); };
export const pre = (l, href) => (l === 'hi' && typeof href === 'string' && href.startsWith('/') && !href.startsWith('/hi') && !href.startsWith('/admin') && !href.startsWith('/api') ? '/hi' + (href === '/' ? '' : href) : href);

// Drop-in replacement for next/link that keeps the visitor in their language.
export default function Link({ href, ...r }) {
  const l = useLang();
  const { onClick, ...rest } = r;
  const go = (e) => {
    onClick?.(e);
    try { if (!e.defaultPrevented && !e.metaKey && !e.ctrlKey && !e.shiftKey && e.button === 0 && typeof href === 'string' && href.startsWith('/')) { const d = document.documentElement; d.classList.add('nav-out'); setTimeout(() => d.classList.remove('nav-out'), 700); } } catch {}
  };
  return <NextLink href={pre(l, href)} onClick={go} {...rest} />;
}
