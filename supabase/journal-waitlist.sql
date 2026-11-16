-- Journal and per-watch waitlist
create table if not exists journal_posts(
  id uuid primary key default gen_random_uuid(), slug text unique not null, realm text,
  title text, title_hi text, excerpt text, excerpt_hi text, body text, body_hi text, cover text,
  published boolean default true, published_at timestamptz default now(), sort int default 0);
alter table journal_posts enable row level security;
drop policy if exists "pub read journal" on journal_posts;
create policy "pub read journal" on journal_posts for select using (published);

alter table products add column if not exists stock_mode text default 'in_stock'; -- in_stock | waitlist | sold_out
create table if not exists waitlist_entries(
  id uuid primary key default gen_random_uuid(), product_id uuid references products on delete cascade, product_name text,
  name text, phone text, email text, status text default 'waiting', -- waiting | invited | purchased
  created_at timestamptz default now());
create table if not exists access_codes(
  id uuid primary key default gen_random_uuid(), code text unique not null, product_id uuid references products on delete cascade,
  entry_id uuid references waitlist_entries on delete set null, used boolean default false, used_at timestamptz, created_at timestamptz default now());
alter table waitlist_entries enable row level security; alter table access_codes enable row level security;
insert into journal_posts(slug,realm,title,title_hi,excerpt,excerpt_hi,body,body_hi,sort) values ('the-star-that-keeps-its-place','dhruv','The star that keeps its place','वह तारा जो अपना स्थान नहीं छोड़ता','Dhruva, the pole star, the seven sages who circle it, and a promise made at every Indian wedding.','ध्रुव, ध्रुव तारा, उसकी परिक्रमा करते सात ऋषि, और हर भारतीय विवाह में दिया जाने वाला एक वचन।','Turn your face to the north on a clear night and almost every star will seem to wheel across the sky. One does not. It hangs nearly motionless while the heavens turn about it, and for as long as there have been travellers, it has told them which way is north.

In the Indian tradition this star is Dhruva, the unmoving. The Puranas tell of a young prince who sat in unbroken stillness, in tapas, until Vishnu granted him a place in the sky that could never be taken from him. The Saptarishi, the seven sages we know as the Great Bear, circle him patiently. Follow the two stars at the end of the Great Bear''s bowl in a straight line, and your eye arrives at him.

The star has remained a quiet witness at the threshold of married life. In the Vedic wedding, the bride is shown Dhruva after the vows, and asked to look at it: a wish that the bond be as steady as the star. Few symbols of constancy are older, or more tender.

This is the idea behind DHRUV. Not speed, not display, but a fixed point: something to steer by. We set a compass rose in raised gold upon navy, the hour just after sunset when the first star appears, with the seven stars of the Saptarishi leading the eye to north. Everything else we left out.','किसी स्वच्छ रात्रि में उत्तर की ओर मुख कीजिए, और लगभग हर तारा आकाश में घूमता प्रतीत होगा। एक नहीं घूमता। वह लगभग निश्चल टंगा रहता है और संपूर्ण आकाश उसके चारों ओर घूमता है। जब से पथिक हुए हैं, तब से वही उन्हें उत्तर की दिशा बताता आया है।

भारतीय परंपरा में यह तारा ध्रुव है, अचल। पुराण एक बालक राजकुमार की कथा कहते हैं, जो अखंड स्थिरता में तप करता रहा, जब तक भगवान विष्णु ने उसे आकाश में ऐसा स्थान प्रदान नहीं किया जो उससे कभी छीना न जाए। सप्तर्षि, सात ऋषि, जिन्हें हम सप्तर्षि मंडल के रूप में जानते हैं, धैर्यपूर्वक उसकी परिक्रमा करते हैं। सप्तर्षि के कटोरे के छोर के दो तारों को सीधी रेखा में आगे बढ़ाइए, और दृष्टि उसी तक पहुँचती है।

यही तारा वैवाहिक जीवन की देहरी पर एक मौन साक्षी रहा है। वैदिक विवाह में वचनों के पश्चात वधू को ध्रुव के दर्शन कराए जाते हैं और उससे उसे निहारने को कहा जाता है: इस कामना के साथ कि यह बंधन उस तारे की भाँति अडिग रहे। स्थिरता के इससे प्राचीन और इससे कोमल प्रतीक कम ही हैं।

यही ध्रुव के पीछे का भाव है। गति नहीं, प्रदर्शन नहीं, बल्कि एक अचल बिंदु: कुछ ऐसा जिससे दिशा पाई जा सके। हमने नीलवर्ण पर उभरे स्वर्ण में एक दिशासूचक रचा, सूर्यास्त के ठीक पश्चात की वह बेला जब पहला तारा प्रकट होता है, और सप्तर्षि के सात तारे दृष्टि को उत्तर की ओर ले जाते हैं। शेष सब कुछ हमने छोड़ दिया।',1) on conflict (slug) do update set title=excluded.title,title_hi=excluded.title_hi,excerpt=excluded.excerpt,excerpt_hi=excluded.excerpt_hi,body=excluded.body,body_hi=excluded.body_hi;
insert into journal_posts(slug,realm,title,title_hi,excerpt,excerpt_hi,body,body_hi,sort) values ('twelve-forms-of-the-sun','surya','Twelve forms of the sun','सूर्य के बारह स्वरूप','The Adityas, the chariot of Konark, and why the sun was never counted as one.','आदित्य, कोणार्क का रथ, और सूर्य को कभी एक क्यों नहीं गिना गया।','The Rigveda addresses some of its most radiant hymns to Surya, the sun that wakes the world, the eye by which the gods look upon the earth. Yet the tradition did not stop at one sun. Later texts speak of twelve Adityas, twelve forms of the sun, one for each month of the turning year.

The thought is a beautiful one: that the sun is not the same in spring as in the monsoon, nor at dawn as at noon, and that each of its faces deserves a name. It is the same idea that lives on in Surya Namaskar, the salutation of twelve movements, each offered to a form of the sun.

In stone, the idea reaches its grandest at Konark, where the temple is built as the sun''s own chariot, drawn by seven horses, on twenty-four carved wheels. Those wheels still serve as sundials: the shadow of the spokes tells the hour.

The Gayatri, perhaps the most recited verse in the Vedic tradition, is addressed to Savitr, the sun in its quickening aspect: the light that awakens thought.

SURYA carries twelve raised rays, six straight for steady light and six wavy for heat, alternating around a golden disc. We set it on black, because the sun in the real sky is a single source of light in a vast dark. It is made for those who do not wait to be lit.','ऋग्वेद अपने कुछ सर्वाधिक दीप्तिमान सूक्त सूर्य को अर्पित करता है, उस सूर्य को जो संसार को जगाता है, वह नेत्र जिससे देवता पृथ्वी को देखते हैं। फिर भी परंपरा एक सूर्य पर नहीं ठहरी। परवर्ती ग्रंथ बारह आदित्यों की बात करते हैं, सूर्य के बारह स्वरूप, घूमते वर्ष के प्रत्येक मास के लिए एक।

विचार अत्यंत सुंदर है: कि सूर्य वसंत में वैसा नहीं जैसा वर्षा में, न भोर में वैसा जैसा मध्याह्न में, और उसके प्रत्येक मुख को एक नाम मिलना चाहिए। यही भाव सूर्य नमस्कार में आज भी जीवित है, बारह गतियों वाला वह अभिवादन, जिसकी प्रत्येक गति सूर्य के एक स्वरूप को अर्पित है।

पाषाण में यह विचार कोणार्क में अपने भव्यतम रूप में पहुँचता है, जहाँ मंदिर स्वयं सूर्य के रथ के रूप में रचा गया है, सात अश्वों से खिंचता हुआ, चौबीस उत्कीर्ण चक्रों पर। उन चक्रों से आज भी धूपघड़ी का काम लिया जा सकता है: अरों की छाया समय बताती है।

गायत्री, संभवतः वैदिक परंपरा का सर्वाधिक पठित मंत्र, सवितृ को संबोधित है, सूर्य के प्रेरक स्वरूप को: उस प्रकाश को जो विचार को जगाता है।

सूर्य में बारह उभरी किरणें हैं, छह सीधी स्थिर प्रकाश के लिए और छह लहरदार ऊष्मा के लिए, जो एक स्वर्ण मंडल के चारों ओर बारी-बारी से सजती हैं। हमने इसे श्याम पर स्थापित किया, क्योंकि वास्तविक आकाश में सूर्य एक विशाल अंधकार में प्रकाश का अकेला स्रोत है। यह उनके लिए रचा गया है जो प्रज्वलित किए जाने की प्रतीक्षा नहीं करते।',2) on conflict (slug) do update set title=excluded.title,title_hi=excluded.title_hi,excerpt=excluded.excerpt,excerpt_hi=excluded.excerpt_hi,body=excluded.body,body_hi=excluded.body_hi;
insert into journal_posts(slug,realm,title,title_hi,excerpt,excerpt_hi,body,body_hi,sort) values ('twenty-seven-resting-places','naksh','Twenty-seven resting places','सत्ताईस विश्राम-स्थल','The nakshatras, the moon''s slow procession through them, and a king who loved one wife too well.','नक्षत्र, उनमें से होकर चंद्रमा की धीमी यात्रा, और एक राजा की कथा जिसे एक पत्नी सबसे प्रिय थी।','The moon returns to the same place among the stars in a little over twenty-seven days. The old sky-watchers divided its path into twenty-seven nakshatras, each a stretch of thirteen degrees and twenty minutes, one resting place for each night of the journey. The common reckoning begins with Ashwini, and passes through Bharani, Krittika and Rohini, and onward to Revati.

The nakshatras are old. The lists appear in the Vedic literature, and the heavens have been read by them ever since, for festivals, for journeys, for the naming of children.

There is a tale that the moon, Chandra, was wed to twenty-seven sisters, the daughters of Daksha, and loved one of them, Rohini, above the rest. The neglected sisters complained to their father, and the moon was cursed to wane, and was restored only in part. The tradition tells it as the story of the moon''s waxing and waning, and also of what happens when attention is not given evenly.

To be born under a nakshatra is, in the tradition, to be marked by it. The word naksh itself means a mark, an imprint, something that stays. It is why we chose it as the name of this realm.

NAKSH sets all twenty-seven as raised eight-point stars in an unbroken ring, beginning with Ashwini at the top, around a quiet gold hub, on a ground of maroon: the colour of ritual and long festival evenings. It is for those who believe that some things are written, and who keep what matters close.','चंद्रमा तारों के बीच उसी स्थान पर सत्ताईस दिन से कुछ अधिक में लौट आता है। प्राचीन आकाश-द्रष्टाओं ने उसके पथ को सत्ताईस नक्षत्रों में विभाजित किया, प्रत्येक तेरह अंश और बीस कला का विस्तार, यात्रा की प्रत्येक रात्रि के लिए एक विश्राम-स्थल। प्रचलित गणना अश्विनी से आरंभ होती है, भरणी, कृत्तिका और रोहिणी से होती हुई रेवती तक पहुँचती है।

नक्षत्र प्राचीन हैं। उनकी सूचियाँ वैदिक साहित्य में मिलती हैं, और तब से आकाश को उन्हीं के सहारे पढ़ा जाता रहा है: उत्सवों के लिए, यात्राओं के लिए, शिशुओं के नामकरण के लिए।

एक कथा है कि चंद्रमा का विवाह दक्ष की सत्ताईस पुत्रियों से हुआ था, और उसे उनमें से रोहिणी सर्वाधिक प्रिय थी। उपेक्षित बहनों ने पिता से शिकायत की, और चंद्रमा को क्षीण होने का शाप मिला, जो केवल अंशतः ही शमित हुआ। परंपरा इसे चंद्रमा के बढ़ने और घटने की कथा के रूप में कहती है, और उस बात की भी कि जब ध्यान समान रूप से नहीं बाँटा जाता तो क्या होता है।

परंपरा में किसी नक्षत्र के अंतर्गत जन्म लेना उससे अंकित होना है। नक्श शब्द का अर्थ ही चिह्न है, एक छाप, कुछ ऐसा जो बना रहे। इसीलिए हमने इसे इस लोक का नाम चुना।

नक्श सभी सत्ताईस को उभरे अष्टकोणीय तारों के रूप में एक अविच्छिन्न वलय में स्थापित करता है, शीर्ष पर अश्विनी से आरंभ करते हुए, एक शांत स्वर्ण केंद्र के चारों ओर, गहरे रक्तवर्ण के पटल पर: अनुष्ठान और उत्सव की लंबी संध्याओं का रंग। यह उनके लिए है जो मानते हैं कि कुछ बातें लिखी जा चुकी हैं, और जो महत्त्वपूर्ण है उसे निकट रखते हैं।',3) on conflict (slug) do update set title=excluded.title,title_hi=excluded.title_hi,excerpt=excluded.excerpt,excerpt_hi=excluded.excerpt_hi,body=excluded.body,body_hi=excluded.body_hi;
insert into journal_posts(slug,realm,title,title_hi,excerpt,excerpt_hi,body,body_hi,sort) values ('nine-wanderers','vyom','Nine wanderers','नौ पथिक','The Navagraha, and the Vedic idea of the sky as an element.','नवग्रह, और आकाश को तत्त्व मानने की वैदिक दृष्टि।','Vyom is the open sky. In the old way of seeing it is also akasha, the space that holds the other four elements, the ether in which everything moves and has its being. Of the five great elements, the tradition places it first in subtlety: the one that cannot be touched, only held within.

Across that sky the Vedic astronomers followed nine bodies, the Navagraha: Surya the sun, Chandra the moon, and the five planets visible to the eye, Mangala, Budha, Brihaspati, Shukra and Shani, together with Rahu and Ketu, the two points where the moon''s path crosses the sun''s, where eclipses are born. The word graha means that which seizes, or holds, for each was thought to hold a share of what befalls us.

It is a reading of the sky in which nothing is idle. The wanderers are not scenery; they are in conversation with the days.

VYOM draws the nine as gold beads on orbit rings around a striated sphere, so that the whole sky reads as an instrument on the wrist. It is set on a deep green, the sky seen through leaves after rain. It is for those who still look up, and who know that depth is a form of luxury.','व्योम खुला आकाश है। प्राचीन दृष्टि में वही आकाश तत्त्व भी है, वह अवकाश जो अन्य चार तत्त्वों को धारण करता है, वह आकाश जिसमें सब कुछ गतिमान है और अपना अस्तित्व पाता है। पाँच महाभूतों में परंपरा इसे सूक्ष्मता में प्रथम रखती है: वह जिसे छुआ नहीं जा सकता, केवल जिसके भीतर रहा जा सकता है।

उसी आकाश में वैदिक खगोलविदों ने नौ पिंडों का अनुसरण किया, नवग्रह: सूर्य, चंद्र, और आँखों से दिखने वाले पाँच ग्रह, मंगल, बुध, बृहस्पति, शुक्र और शनि, तथा राहु और केतु, वे दो बिंदु जहाँ चंद्रमा का पथ सूर्य के पथ को काटता है, जहाँ ग्रहण जन्म लेते हैं। ग्रह शब्द का अर्थ है जो ग्रहण करे, या थामे, क्योंकि प्रत्येक के विषय में माना गया कि वह हम पर बीतने वाली बातों में एक अंश धारण करता है।

यह आकाश का ऐसा पाठ है जिसमें कुछ भी निष्क्रिय नहीं है। ये पथिक दृश्यावली नहीं हैं; ये दिनों के साथ संवाद में हैं।

व्योम इन नौ को एक धारीदार गोले के चारों ओर कक्षा-वलयों पर स्वर्ण मणियों के रूप में रचता है, ताकि संपूर्ण आकाश कलाई पर एक यंत्र की भाँति पढ़ा जा सके। इसे गहरे हरित पर स्थापित किया गया है, वर्षा के पश्चात पत्तों के बीच से दिखते आकाश की भाँति। यह उनके लिए है जो आज भी ऊपर देखते हैं, और जानते हैं कि गहराई स्वयं एक प्रकार की विलासिता है।',4) on conflict (slug) do update set title=excluded.title,title_hi=excluded.title_hi,excerpt=excluded.excerpt,excerpt_hi=excluded.excerpt_hi,body=excluded.body,body_hi=excluded.body_hi;
insert into journal_posts(slug,realm,title,title_hi,excerpt,excerpt_hi,body,body_hi,sort) values ('the-moon-and-its-thirty-days','soma','The moon and its thirty days','चंद्रमा और उसके तीस दिन','Soma, the Rigveda''s book of the moon, and the count of the tithis.','सोम, चंद्रमा को समर्पित ऋग्वेद का मंडल, और तिथियों की गणना।','The ninth book of the Rigveda, more than a hundred hymns, is given almost entirely to Soma Pavamana, the pure and flowing Soma: the luminous drink of the gods, pressed, strained and offered with song. In later tradition Soma becomes the moon itself, the vessel of that light.

The lunar month is counted in thirty tithis. Each tithi is the time the moon takes to draw twelve degrees further from the sun, a measure so precise that it is still how the festival calendar is kept. Fifteen of them belong to the shukla paksha, the bright fortnight, as the moon grows toward Purnima; and fifteen to the krishna paksha, the dark, as it fades toward Amavasya.

Neither half is held to be better than the other. The tradition simply understands that all things wax and wane, and that everything returns in its own time. There are fasts and observances for both, and a quiet respect for the dark half as the season of rest.

SOMA sets thirty dots in a ring, fifteen bright and fifteen dark, around a hammered silver crescent upon graphite. There is no gold here, because the moon has none. It is the quietest of our realms, made for those who find calm in cycles.','ऋग्वेद का नवम मंडल, सौ से अधिक सूक्त, लगभग पूर्णतः सोम पवमान को समर्पित है, शुद्ध और प्रवाहित सोम को: देवताओं का दीप्तिमान पेय, जिसे निचोड़ा जाता है, छाना जाता है और गान के साथ अर्पित किया जाता है। परवर्ती परंपरा में सोम स्वयं चंद्रमा बन जाता है, उस प्रकाश का पात्र।

चांद्र मास की गणना तीस तिथियों में होती है। प्रत्येक तिथि वह समय है जिसमें चंद्रमा सूर्य से बारह अंश और दूर हो जाता है, एक ऐसा माप जो इतना सटीक है कि पर्वों का पंचांग आज भी उसी से चलता है। उनमें से पंद्रह शुक्ल पक्ष की हैं, उज्ज्वल पखवाड़ा, जब चंद्रमा पूर्णिमा की ओर बढ़ता है; और पंद्रह कृष्ण पक्ष की, अंधकारमय, जब वह अमावस्या की ओर घटता है।

कोई भी पक्ष दूसरे से श्रेष्ठ नहीं माना गया। परंपरा बस यह समझती है कि सब कुछ बढ़ता और घटता है, और सब कुछ अपने समय पर लौट आता है। दोनों के लिए व्रत और अनुष्ठान हैं, और कृष्ण पक्ष के प्रति विश्राम की ऋतु के रूप में एक शांत आदर।

सोम धूसर पटल पर एक गढ़े हुए रजत अर्धचंद्र के चारों ओर एक वलय में तीस बिंदु स्थापित करता है, पंद्रह उज्ज्वल और पंद्रह श्याम। यहाँ स्वर्ण नहीं है, क्योंकि चंद्रमा के पास स्वर्ण नहीं होता। यह हमारे लोकों में सबसे शांत है, उनके लिए रचा गया जो चक्रों में शांति पाते हैं।',5) on conflict (slug) do update set title=excluded.title,title_hi=excluded.title_hi,excerpt=excluded.excerpt,excerpt_hi=excluded.excerpt_hi,body=excluded.body,body_hi=excluded.body_hi;

alter table orders add column if not exists lang text default 'en';
alter table products add column if not exists video text;
create table if not exists site_images(
  id uuid primary key default gen_random_uuid(), slot text unique, image text, caption text, caption_hi text, active boolean default true);
alter table site_images enable row level security;
alter table pages add column if not exists title_hi text, add column if not exists body_hi text;

alter table collections add column if not exists show_glow boolean default true;

alter table collections add column if not exists wide_banner text;
alter table orders add column if not exists landmark text;
