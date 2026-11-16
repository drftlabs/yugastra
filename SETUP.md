# YUGASTRA: go-live guide (GitHub + Supabase + Vercel)

## 1. GitHub
Create an empty repository, upload everything in this folder (or `git init && git add . && git push`). `.env` files are ignored on purpose. Never commit keys.

## 2. Supabase (database, login, images)
1. Create a project at supabase.com.
2. SQL Editor, run in this order: `supabase/schema.sql`, then `supabase/seed.sql`, then `supabase/hindi-update.sql`, then `supabase/journal-waitlist.sql`. (`copy-update.sql` and `home-copy-update.sql` only if you want the latest copy text.)
3. Authentication: create your admin user, then add it to the `admins` table with `is_owner = true`.
4. Copy the project URL, anon key and service-role key into the environment variables below.

## 3. Vercel (hosting)
Import the GitHub repository. Framework: Next.js. Add the environment variables from `.env.example`. Add a Vercel Blob store (gives `BLOB_READ_WRITE_TOKEN`) for admin image uploads. Connect your domain.

## 4. Razorpay (online payment, and the COD advance)
Add `NEXT_PUBLIC_RAZORPAY_KEY_ID`, `RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET`. In the Razorpay dashboard add a webhook to `https://YOURDOMAIN/api/razorpay/webhook` for `payment.captured`, and put its secret in `RAZORPAY_WEBHOOK_SECRET`. The "Available soon" label disappears as soon as the key is set.

## 5. WhatsApp (confirms COD orders with nothing paid upfront)
Create a WhatsApp Cloud API app at developers.facebook.com. Add `WHATSAPP_TOKEN`, `WHATSAPP_PHONE_ID`, an approved authentication template named in `WHATSAPP_TEMPLATE` (default `order_confirm_code`), and set `NEXT_PUBLIC_WA_CONFIRM=1`. Until that is set, no-advance COD orders are not phone-verified, so set it before launch. `WA_TEST_CODE` is for testing only; leave it empty in production.

## 6. Email
Add `RESEND_API_KEY`, `EMAIL_FROM` (a verified domain) and `ADMIN_NOTIFY_EMAIL`.

## How checkout works
- Pop-up from "Buy now" and the bag. Fields: name, mobile, email, address, pincode (fills city and state, both editable), landmark (optional).
- Order summary with a discount code box.
- **Online (Razorpay):** free shipping across India.
- **Cash on delivery, two forms:** pay an advance now (default 10% of the product amount, free shipping), or ₹0 now with a ₹99 COD fee, confirmed by entering the 4-digit WhatsApp code.
- Change the COD fee, advance % and shipping rules in Admin, Settings.
- All prices are recalculated on the server; the browser is never trusted.

## Admin images
- Admin, Products: the **box photo** (shown as the last photo on every watch; `public/box.jpg` is used until you upload one).
- Admin, Site images: hero image, one tile per realm, the hand photo on product pages, size-guide photos.
- Admin, Collections: home tile image, **full-width collection banner**, and the realm gradient on/off switch.
- Admin, Home slides: extra hero slides (one is shown unless "multiple slides" is turned on in Settings).

## Before launch
Supplier 5 ATM test report; trademark check; Hindi copy read-through; place a test order in Razorpay test mode and a test COD order with WhatsApp.
