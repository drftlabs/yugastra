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
  return <NextLink href={pre(l, href)} {...r} />;
}
