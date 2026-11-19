// Admin wording for an order: COD is confirmed by a WhatsApp code (not paid yet); prepaid is paid online.
export const orderLabel = (o) => {
  const cod = o.payment_method === 'cod';
  if (o.status === 'paid') return cod ? 'Confirmed · WhatsApp verified' : 'Payment completed';
  if (o.status === 'otp_pending') return 'Unconfirmed · WhatsApp code not entered';
  return String(o.status || '').replace('_', ' ');
};
