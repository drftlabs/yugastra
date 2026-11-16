'use client';
import { createContext, useContext } from 'react';
const Ctx = createContext('en');
export const LangProvider = ({ lang, children }) => <Ctx.Provider value={lang}>{children}</Ctx.Provider>;
export const useLangCtx = () => useContext(Ctx);
