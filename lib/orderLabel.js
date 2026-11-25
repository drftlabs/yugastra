// Admin wording for an order: COD is confirmed by a WhatsApp code (not paid yet); prepaid is paid online.
// The WhatsApp code is valid for 10 minutes, so an unconfirmed order older than that is shown as expired.
export const orderLabel = (o) => {
  const cod = o.payment_method === 'cod';
  if (o.status === 'paid') return cod ? 'Confirmed · WhatsApp verified' : 'Payment completed';
  if (o.status === 'otp_pending') return Date.now() - new Date(o.created_at).getTime() > 10 * 60000 ? 'Expired · WhatsApp code not entered' : 'Waiting · WhatsApp code not entered yet';
  return String(o.status || '').replace('_', ' ');
};
