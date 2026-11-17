'use client';
// A button that asks "are you sure?" before running a server action (cancel / delete).
export default function ConfirmForm({ action, label, message, className = 'btn sm', style }) {
  return (<form action={action} onSubmit={(e) => { if (!window.confirm(message)) e.preventDefault(); }}><button className={className} style={style}>{label}</button></form>);
}
