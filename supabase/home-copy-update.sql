-- Home page copy refresh
insert into site_settings(key,value) values ('ticker','"The weapon of timelessness ✦ Time, written in the sky ✦ Made to outlast the hour ✦ कालजयी · समय से परे ✦ A piece to keep"') on conflict (key) do update set value=excluded.value;
update collections set description='The still point of the turning sky. A compass of raised gold upon deepest navy, for those who keep their bearing.' where slug='dhruv';
update collections set description='Twelve rays, one sovereign light. Burnished gold upon black, in homage to the sun that wakes the world.' where slug='surya';
update collections set description='Twenty-seven stars, one for each night of the moon''s long procession, impressed upon a ground of ritual maroon.' where slug='naksh';
update collections set description='Nine luminaries in their ordained orbits, suspended in the green hush of the open sky.' where slug='vyom';
update collections set description='Thirty lunar days circle a crescent of silver, upon graphite as calm as moonlit stone.' where slug='soma';
update slides set subtitle='Pieces drawn from the Vedic sky, made to outlast the hour.' where title ilike 'yugastra';
update slides set subtitle='Be the fixed point. The still point of the turning sky. A compass of raised gold upon deepest navy, for those who keep their bearing.' where theme='dhruv' and title ilike 'DHRUV';
update slides set subtitle='Carry your own light. Twelve rays, one sovereign light. Burnished gold upon black, in homage to the sun that wakes the world.' where theme='surya' and title ilike 'SURYA';
update slides set subtitle='Some things are written. Twenty-seven stars, one for each night of the moon''s long procession, impressed upon a ground of ritual maroon.' where theme='naksh' and title ilike 'NAKSH';
update slides set subtitle='Keep looking up. Nine luminaries in their ordained orbits, suspended in the green hush of the open sky.' where theme='vyom' and title ilike 'VYOM';
update slides set subtitle='Calm, in cycles. Thirty lunar days circle a crescent of silver, upon graphite as calm as moonlit stone.' where theme='soma' and title ilike 'SOMA';
-- Audit copy fixes
update collections set description='The still point of the turning sky. A compass of raised gold upon deepest navy, for those who keep their bearing.' where slug='dhruv';
update collections set description='Twelve rays of burnished gold upon black, in homage to the sun that wakes the world.' where slug='surya';
update collections set description='Twenty-seven stars, one for each night of the moon''s long procession, impressed upon a ground of ritual maroon.' where slug='naksh';
update collections set description='Nine luminaries in their ordained orbits, suspended in the green hush of the open sky.' where slug='vyom';
update collections set description='Thirty lunar days circle a crescent of silver, upon graphite as quiet as moonlit stone.' where slug='soma';
update slides set subtitle='Be the fixed point.' where theme='dhruv' and title ilike 'DHRUV';
update slides set subtitle='Carry your own light.' where theme='surya' and title ilike 'SURYA';
update slides set subtitle='Some things are written.' where theme='naksh' and title ilike 'NAKSH';
update slides set subtitle='Keep looking up.' where theme='vyom' and title ilike 'VYOM';
update slides set subtitle='Calm, in cycles.' where theme='soma' and title ilike 'SOMA';
