# YUGASTRA — storefront + admin

Next.js 14 · Supabase · Razorpay · Resend · Meta WhatsApp Cloud API · Vercel Blob.
Same architecture and checkout rules as Formula5 (including the updated COD rule: advance % or flat ₹ is taken on the PRODUCT amount only).

## Run locally
```
npm install
cp .env.example .env.local     # leave empty to run in preview mode with demo data
npm run dev
```
With no Supabase keys the site runs on demo data (`lib/fallback.js`); checkout and admin need Supabase.

## Go live
1. **Supabase**: new project → SQL editor → run `supabase/schema.sql`, then `supabase/seed.sql`.
2. **Admin user**: Supabase → Auth → add user (auto-confirm), then run:
   `insert into public.admins (user_id,is_owner,active,display_name) values ('<uuid>',true,true,'Your name') on conflict (user_id) do update set is_owner=true, active=true;`
   Log in at `/admin/login`. Add staff with limited tabs in Admin → Team.
3. **Razorpay**: add keys to env, webhook `https://<domain>/api/razorpay/webhook`, events `payment.captured` and `order.paid`. Test mode first, Live after KYC, then redeploy (NEXT_PUBLIC vars are baked at build).
4. **Resend** (emails), **Vercel Blob** (admin image uploads; otherwise paste image URLs).
5. **Vercel**: import repo, set every variable from `.env.example`, deploy.
6. **Admin → Settings**: shipping, COD (off by default), advance %/flat.
7. **WhatsApp COD code** (optional): set `NEXT_PUBLIC_WA_CONFIRM` + WhatsApp vars. Only used for COD with no advance.

## Where things are
- `app/(site)` storefront · `app/admin` panel · `app/api` checkout, webhook, WhatsApp, track
- `lib/pricing.js` money maths · `lib/orders.js` markPaid (idempotent) · `lib/data.js` reads
- `components/admin/Crud.js` generic admin editor used for products, collections, slides, circle, reviews, discounts, legal pages
- Theme: `app/globals.css` (`:root` tokens). Logo: `public/logo.png`, monogram `public/monogram.png`.

## Before launch
- Replace generated dial artwork with real product photos (Admin → Products / Collections / Slides).
- Redraw the logo as vector; the PNG here is cut from a gradient source.
- Placeholder copy, prices and the "Circle" members are demo values. Legal text is a starter; have counsel review.
- Catalog: 5 collections (DHRUV, SURYA, NAKSH, VYOM, SOMA), 20 watches, all ₹5,999 (MRP ₹9,999). SKU format `YG-{COL}-{CASE}-{STRAP}`. Cases: black, silver, gold. Japanese quartz, 1-year warranty.
- Re-running `schema.sql` is safe (adds new columns with `if not exists`); `seed.sql` replaces catalog rows.
- Product/collection copy (meaning, story, long description, features, SEO) is editable in Admin.
- Without Supabase env vars the site runs in preview mode from `lib/fallback.js`; checkout returns 503 until configured.
- Confirm with supplier and legal before launch: dial aperture, movement model, water resistance, and trademark checks on the collection and watch names.
- Not carried over from Formula5: the "Rohan" chatbot, wishlist, Meta Pixel events, routine builder.

## Hindi, Journal, Waitlist, Circle (added)
Run these in the Supabase SQL editor, in order: `supabase/schema.sql`, `supabase/seed.sql`, `supabase/hindi-update.sql`, `supabase/journal-waitlist.sql`.
- **Hindi:** `/hi/...` serves every page in Hindi (middleware rewrite). Strings live in `lib/i18n.js`; collection, product and journal Hindi fields are edited in Admin (`हिंदी ·` fields) and fall back to English when empty. Checkout, account, tracking, contact and legal pages are also in Hindi; Razorpay's own payment window is configured separately.
- **Ads in Hindi:** point Meta ads at `https://yourdomain/hi/...?utm_source=meta&utm_campaign=...`.
- **Waitlist (per watch):** set a product's Availability to `waitlist` in Admin → Products. Visitors join from the watch page; Admin → Waitlist lists them per watch and "Send access code" emails a single-use code (with a WhatsApp link). The code unlocks buying for that watch only and is enforced at checkout.
- **Journal:** Admin → Journal. **Circle sign-ups:** Admin → Circle sign-ups. **Hero:** one slide by default; set "Home hero" to `yes` in Settings to rotate all slides.
