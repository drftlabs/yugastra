-- PLACEHOLDER reviews so the quotes section can be previewed. They are NOT real customers.
-- Before launch: Admin → Reviews → "Delete all reviews", then add real, permitted reviews.
-- FIRST delete the old placeholders: Admin → Reviews → "Delete all reviews". Then run this file once.

insert into reviews(product_id,name,rating,body,approved,featured)
  select id,$q$Arjun Malhotra · Delhi$q$,5,$q$The navy dial looks almost black indoors, then the compass and the seven stars come up the moment I'm near a window. All black on the wrist, so it goes with everything I own.$q$,true,true from products where slug='dhruv-night';
insert into reviews(product_id,name,rating,body,approved,featured)
  select id,$q$Meera Nair · Kochi$q$,4,$q$Bought it for my husband. The raised gold compass is sharper than the photos showed. Silicone strap is soft, and at about 85 g he forgets it's there. Wish the strap came in a shorter size too.$q$,true,true from products where slug='dhruv-night';
insert into reviews(product_id,name,rating,body,approved,featured)
  select id,$q$Karthik Subramanian · Chennai$q$,5,$q$Silver case with the blue strap is a lovely combination. The navy dial shows the stars well, and the blue strap picks up the colour nicely. I wear it to office and on weekends.$q$,true,true from products where slug='dhruv-north';
insert into reviews(product_id,name,rating,body,approved,featured)
  select id,$q$Ritu Bansal · Noida$q$,5,$q$My brother wanted something that did not look like every other watch at the mall. The compass on the dial got him noticed within a day. Strap is comfortable even in this heat.$q$,true,true from products where slug='dhruv-north';
insert into reviews(product_id,name,rating,body,approved,featured)
  select id,$q$Naveen Reddy · Hyderabad$q$,5,$q$Gave it to my father for his retirement. Gold case on navy, with the brown strap, looks formal without being heavy. He wears it every single morning, with his kurta too.$q$,true,true from products where slug='dhruv-star';
insert into reviews(product_id,name,rating,body,approved,featured)
  select id,$q$Anjali Deshmukh · Pune$q$,5,$q$The gold stars on the dial are raised, you can feel them with a fingertip. Brown strap keeps it dressy. Bought it for my husband's promotion and he has not taken it off.$q$,true,true from products where slug='dhruv-star';
insert into reviews(product_id,name,rating,body,approved,featured)
  select id,$q$Vikram Singh Rathore · Jaipur$q$,5,$q$Black case, black strap, and then twelve gold rays on the dial. It stays quiet until the light hits it. Perfect for meetings where I do not want a flashy watch.$q$,true,true from products where slug='surya-eclipse';
insert into reviews(product_id,name,rating,body,approved,featured)
  select id,$q$Rohan Kapoor · Chandigarh$q$,4,$q$Looks far more expensive than the price. The rays are properly raised, not printed. It is a bit dark in a dim room, but in daylight the gold really shows.$q$,true,true from products where slug='surya-eclipse';
insert into reviews(product_id,name,rating,body,approved,featured)
  select id,$q$Harpreet Singh Gill · Ludhiana$q$,5,$q$Gold case against the black dial is bold but not loud. As I move my wrist the rays flash one after another. Took two, one for my brother.$q$,true,true from products where slug='surya-radiance';
insert into reviews(product_id,name,rating,body,approved,featured)
  select id,$q$Aditya Verma · Lucknow$q$,5,$q$I like that the rays alternate between straight and wavy, you only notice it when you look closely. The black strap keeps the gold from being too much. Very comfortable.$q$,true,true from products where slug='surya-radiance';
insert into reviews(product_id,name,rating,body,approved,featured)
  select id,$q$Prakash Hegde · Mangaluru$q$,5,$q$The brown strap against the gold is warm, like the colour of early morning. I wear it for my 6 am walks and it has handled sweat and rain without any trouble.$q$,true,true from products where slug='surya-sunrise';
insert into reviews(product_id,name,rating,body,approved,featured)
  select id,$q$Shruti Kulkarni · Nashik$q$,4,$q$Gifted to my husband for his new job. Gold and brown suit him well. The case is a little wider than his old watch, but he got used to it in a day.$q$,true,true from products where slug='surya-sunrise';
insert into reviews(product_id,name,rating,body,approved,featured)
  select id,$q$Sandeep Menon · Thrissur$q$,5,$q$Black case with the brown strap is softer than all-black. At the end of the day the gold rays look gentler. I wear it from office straight to dinner.$q$,true,true from products where slug='surya-dusk';
insert into reviews(product_id,name,rating,body,approved,featured)
  select id,$q$Kavita Rao · Bengaluru$q$,5,$q$Bought it for my brother. He says the brown strap feels like leather but it is silicone, so no worry about sweat. The black and gold dial looks very good under lamplight.$q$,true,true from products where slug='surya-dusk';
insert into reviews(product_id,name,rating,body,approved,featured)
  select id,$q$Imran Sheikh · Mumbai$q$,5,$q$The silver case makes it cooler and cleaner than the gold ones. Black dial, silver rays, black strap. I wanted something simple, and this is exactly that.$q$,true,true from products where slug='surya-ray';
insert into reviews(product_id,name,rating,body,approved,featured)
  select id,$q$Neha Agarwal · Kolkata$q$,4,$q$Looks sharp on a slim wrist too, which I did not expect from a tonneau case. Silver on black is easy to read at a glance. Delivery was on time.$q$,true,true from products where slug='surya-ray';
insert into reviews(product_id,name,rating,body,approved,featured)
  select id,$q$Siddharth Joshi · Pune$q$,5,$q$Wore it at my cousin's wedding. The maroon dial and strap with the gold case suited the festive clothes well. Several relatives asked where I bought it.$q$,true,true from products where slug='naksh-crimson';
insert into reviews(product_id,name,rating,body,approved,featured)
  select id,$q$Lakshmi Venkatesh · Coimbatore$q$,5,$q$I counted the stars on the dial, there really are twenty-seven in a ring around the centre. Lovely detail. The maroon colour is deep and rich, not red or brown.$q$,true,true from products where slug='naksh-crimson';
insert into reviews(product_id,name,rating,body,approved,featured)
  select id,$q$Gaurav Sharma · Gurugram$q$,5,$q$Black case and strap, and the maroon on the dial only shows up in good light. I work night shifts, and this is easy on the eye at 3 am. Very light.$q$,true,true from products where slug='naksh-midnight';
insert into reviews(product_id,name,rating,body,approved,featured)
  select id,$q$Pooja Mishra · Indore$q$,4,$q$A quiet watch. At first it looks fully black, then the ring of stars appears when the angle changes. Wish the stars were a little brighter, but I like the subtlety.$q$,true,true from products where slug='naksh-midnight';
insert into reviews(product_id,name,rating,body,approved,featured)
  select id,$q$Manoj Iyer · Bengaluru$q$,5,$q$Gold case against black strap is the classic look, and the maroon dial adds depth. My boss asked about it in the first week. Strap is soft and does not pinch.$q$,true,true from products where slug='naksh-royal';
insert into reviews(product_id,name,rating,body,approved,featured)
  select id,$q$Farhan Qureshi · Hyderabad$q$,5,$q$Bought it for my own nikah. It sits well under a sherwani cuff, and the stars catch the light without any shine. It is lighter than I expected, which I prefer.$q$,true,true from products where slug='naksh-royal';
insert into reviews(product_id,name,rating,body,approved,featured)
  select id,$q$Pranav Tiwari · Varanasi$q$,5,$q$Black case with the maroon strap, the colour reminds me of the diya at the end of the evening. The stars on the dial are fine and even. I wear it daily.$q$,true,true from products where slug='naksh-ember';
insert into reviews(product_id,name,rating,body,approved,featured)
  select id,$q$Divya Pillai · Thiruvananthapuram$q$,4,$q$Gave it to my brother for Diwali. He likes the dark red strap with the black case. Neat, understated, and the silicone is smooth on the skin.$q$,true,true from products where slug='naksh-ember';
insert into reviews(product_id,name,rating,body,approved,featured)
  select id,$q$Devendra Chauhan · Dehradun$q$,5,$q$The dark green dial is deeper than I imagined, almost like forest at night. With the green strap and black case it feels calm, not showy. Good for long meetings.$q$,true,true from products where slug='vyom-space';
insert into reviews(product_id,name,rating,body,approved,featured)
  select id,$q$Ananya Das · Guwahati$q$,5,$q$I was unsure about green, but it works. The planets on the dial are small and precise. Strap is comfortable in the humidity here. Water resistant too, so I do not worry in the rain.$q$,true,true from products where slug='vyom-space';
insert into reviews(product_id,name,rating,body,approved,featured)
  select id,$q$Rahul Bhatia · Delhi$q$,5,$q$Gold case, brown strap, green dial. It travelled with me on three flights this month and still looks new. I like finding the planets on the dial when I am bored at the gate.$q$,true,true from products where slug='vyom-planet';
insert into reviews(product_id,name,rating,body,approved,featured)
  select id,$q$Swati Jain · Jaipur$q$,4,$q$A warm, earthy watch. The brown strap tones down the gold nicely. A little large for my wrist, but my husband says it is just right on him.$q$,true,true from products where slug='vyom-planet';
insert into reviews(product_id,name,rating,body,approved,featured)
  select id,$q$Arvind Pandey · Prayagraj$q$,5,$q$The silver case and black strap make it light-looking, as the name says. The green dial looks nearly black until it catches the sun. Very comfortable at 85 g.$q$,true,true from products where slug='vyom-cloud';
insert into reviews(product_id,name,rating,body,approved,featured)
  select id,$q$Tanvi Shah · Ahmedabad$q$,5,$q$I bought it for my father who likes plain things. He says it is easy to read and does not catch on his sleeve. The dial is a lovely deep green in daylight.$q$,true,true from products where slug='vyom-cloud';
insert into reviews(product_id,name,rating,body,approved,featured)
  select id,$q$Sudhir Kamat · Goa$q$,5,$q$Gold on dark green is the best colour pairing of the lot. The strap matches the dial, so everything looks planned. Worn it to dinner twice, and people noticed.$q$,true,true from products where slug='vyom-emerald';
insert into reviews(product_id,name,rating,body,approved,featured)
  select id,$q$Nisha Choudhary · Udaipur$q$,5,$q$It reminded me of the old palace gardens. The case shape is a bit rounder than ordinary watches, which I like. The finish on the gold is smooth and even.$q$,true,true from products where slug='vyom-emerald';
insert into reviews(product_id,name,rating,body,approved,featured)
  select id,$q$Pranjal Saikia · Dibrugarh$q$,5,$q$Silver and black, with a graphite dial that has a soft sheen. The crescent shapes are clear, and the silver case does not get fingerprints easily. Very easy to wear.$q$,true,true from products where slug='soma-crescent';
insert into reviews(product_id,name,rating,body,approved,featured)
  select id,$q$Rekha Subramaniam · Madurai$q$,4,$q$Bought it for my son's first job. Looks mature without being old-fashioned. The black strap is comfortable. I wish the box had a pamphlet about the moon phases.$q$,true,true from products where slug='soma-crescent';
insert into reviews(product_id,name,rating,body,approved,featured)
  select id,$q$Ishaan Mehta · Surat$q$,5,$q$White strap with the silver case looks fresh, almost summer-like. The graphite dial makes the silver stand out. Needs wiping now and then, as white shows marks.$q$,true,true from products where slug='soma-full-moon';
insert into reviews(product_id,name,rating,body,approved,featured)
  select id,$q$Charulata Ghosh · Kolkata$q$,5,$q$My husband and I got one each. The silver and white is gentle on the wrist and goes with both sarees and shirts. Light enough to wear all day.$q$,true,true from products where slug='soma-full-moon';
insert into reviews(product_id,name,rating,body,approved,featured)
  select id,$q$Yash Thakur · Bhopal$q$,5,$q$Black case, black strap, graphite dial. Honestly just a plain dark watch, but the fine details show up in sunlight. Perfect for a quiet new start at a new job.$q$,true,true from products where slug='soma-new-moon';
insert into reviews(product_id,name,rating,body,approved,featured)
  select id,$q$Aparna Menon · Kochi$q$,4,$q$Gave it to my brother who is moving to Dubai. He likes that it is minimal and does not draw attention. Strap is soft. The dial is dark, so reading it in the dim takes a second.$q$,true,true from products where slug='soma-new-moon';
insert into reviews(product_id,name,rating,body,approved,featured)
  select id,$q$Dhruv Arora · Amritsar$q$,5,$q$Black case with the white strap, and the graphite dial between them. People notice the strap first. Comfortable for a full day, and 50 m water resistance is more than I need.$q$,true,true from products where slug='soma-moonlight';
insert into reviews(product_id,name,rating,body,approved,featured)
  select id,$q$Kriti Sinha · Patna$q$,5,$q$I picked this as a gift for my sister. She loves that it is gentle and not a heavy men's-style watch. The white strap goes with her kurtas and jeans equally.$q$,true,true from products where slug='soma-moonlight';
