--
-- PostgreSQL database dump
--

\restrict dbVpqKdm5JlezrRvCTtrnK2JbCpdmKqRbtt7dXUoXYfDGiRQtilGzz0PT3kcREY

-- Dumped from database version 18.3
-- Dumped by pg_dump version 18.3

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Data for Name: Product; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."Product" (id, marca, modelo, precio, tipo, "formaGafa", "formasCaraIdeal", descripcion, activo) FROM stdin;
0a0d2595-31ec-476c-a442-400f64d53b47	Ray-Ban	Wayfarer	120.990000000000000000000000000000	SOL	RECTANGULAR	{REDONDA,OVALADA}	Icónica montura cuadrada Wayfarer. Estilo atemporal.	t
a4b97fa6-1ed9-4914-bec0-3cdd56ebfc4a	Ray-Ban	Round Metal	145.000000000000000000000000000000	SOL	REDONDA	{CUADRADA,DIAMANTE,OVALADA}	Redonda metálica clásica. Estilo retro años 70.	t
2d67633a-6de2-4cee-8c79-d3e8fce303b5	Oakley	Holbrook	110.500000000000000000000000000000	SOL	RECTANGULAR	{REDONDA,OVALADA}	Montura rectangular deportiva y resistente.	t
ce39ad95-3d5b-448a-adf8-64817678859e	Oakley	Wire	98.000000000000000000000000000000	SOL	AVIADOR	{CUADRADA,OVALADA,REDONDA}	Aviador ligero en montura metálica fina.	t
1bfa5e50-3d92-4c52-a2bb-e9ae840df762	Persol	649	220.000000000000000000000000000000	SOL	CUADRADA	{REDONDA,OVALADA}	Elegancia italiana en montura cuadrada de acetato.	t
8c772f72-c0de-449f-b3ff-fbefefa29263	Miu Miu	MU 01VS	310.000000000000000000000000000000	SOL	MARIPOSA	{DIAMANTE,CORAZON,OVALADA}	Mariposa de alta moda con lente oversized.	t
e60eea6b-8585-4d0f-b997-2e749644875c	Oliver Peoples	Gregory Peck	380.000000000000000000000000000000	VISTA	REDONDA	{CUADRADA,DIAMANTE,OVALADA}	Redonda inspirada en el Hollywood clásico.	t
35708a75-5644-4999-ba1e-0d28434a3327	Warby Parker	Haskell	95.000000000000000000000000000000	VISTA	RECTANGULAR	{REDONDA,OVALADA}	Rectangular moderna y asequible en acetato.	t
8a95a5e7-aa36-4775-8999-2a4db1192cb9	Gucci	GG0010S	420.000000000000000000000000000000	SOL	BROWLINE	{CORAZON,OVALADA,DIAMANTE}	Browline de lujo con logotipo icónico.	t
b9d9e531-354a-4172-9e77-012f093a448e	Tom Ford	Henry	350.000000000000000000000000000000	VISTA	RECTANGULAR	{REDONDA,OVALADA}	Rectangular masculina y sofisticada en acetato negro.	t
40f5d933-991f-4590-a902-e0cb1f75a399	Vogue	Angle V	85.500000000000000000000000000000	VISTA	POLIGONAL	{REDONDA,OVALADA,DIAMANTE}	Montura poligonal metálica de seis lados. Estilo geométrico moderno.	t
5c4d5c2a-919a-4747-991a-3a705c459297	firmoo	YSL-201	45.980000000000000000000000000000	VISTA	RECTANGULAR	{REDONDA,OVALADA}	Montura rectangular fina en acetato negro. Clásica y ligera.	f
\.


--
-- Data for Name: ImagenProducto; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."ImagenProducto" (id, url, "esPrincipal", "productoId") FROM stdin;
ff31f81e-dd99-4e33-9ab7-a75c75d8ec79	https://picsum.photos/seed/1/400/300	t	0a0d2595-31ec-476c-a442-400f64d53b47
27c11d24-8607-44d7-837d-50702e1a0c4a	https://picsum.photos/seed/100/400/300	f	0a0d2595-31ec-476c-a442-400f64d53b47
85f41b54-07d3-4c92-b612-02c72174fe04	https://picsum.photos/seed/2/400/300	t	a4b97fa6-1ed9-4914-bec0-3cdd56ebfc4a
58483f59-3638-4f04-9d28-a478307d525c	https://picsum.photos/seed/101/400/300	f	a4b97fa6-1ed9-4914-bec0-3cdd56ebfc4a
1f4e7c33-8303-4e6d-be27-d11bf40e1566	https://picsum.photos/seed/3/400/300	t	2d67633a-6de2-4cee-8c79-d3e8fce303b5
00a5af12-7ddf-499b-96c7-6627b7353ab0	https://picsum.photos/seed/102/400/300	f	2d67633a-6de2-4cee-8c79-d3e8fce303b5
92e92331-a350-41e3-86fc-582be04fe0dc	https://picsum.photos/seed/4/400/300	t	ce39ad95-3d5b-448a-adf8-64817678859e
42d9bcbe-47f3-4378-8b12-67b89ff5cd47	https://picsum.photos/seed/103/400/300	f	ce39ad95-3d5b-448a-adf8-64817678859e
4f04ad09-8d4a-4c09-9e6e-0cb18adab62c	https://picsum.photos/seed/5/400/300	t	1bfa5e50-3d92-4c52-a2bb-e9ae840df762
965b61c4-25b2-4969-b003-e40ac752697b	https://picsum.photos/seed/104/400/300	f	1bfa5e50-3d92-4c52-a2bb-e9ae840df762
4d4d0f74-8f2b-44d5-ab1b-22e653659009	https://picsum.photos/seed/6/400/300	t	8c772f72-c0de-449f-b3ff-fbefefa29263
180a5da3-8325-432f-a737-76dc1e7bede6	https://picsum.photos/seed/105/400/300	f	8c772f72-c0de-449f-b3ff-fbefefa29263
d0b9321f-7598-42ab-bcb4-f4cefc96e5f7	https://picsum.photos/seed/7/400/300	t	e60eea6b-8585-4d0f-b997-2e749644875c
00d3ad63-7c33-4ba1-b811-691b3a025123	https://picsum.photos/seed/106/400/300	f	e60eea6b-8585-4d0f-b997-2e749644875c
ad6c8120-1f28-461a-99f3-72524c3b7d2e	https://picsum.photos/seed/8/400/300	t	35708a75-5644-4999-ba1e-0d28434a3327
75b6d7a3-7eb4-4cb7-b2a1-d0d7c425decb	https://picsum.photos/seed/107/400/300	f	35708a75-5644-4999-ba1e-0d28434a3327
e927b7a1-57fe-427c-9c86-a8815d9c65d1	https://picsum.photos/seed/9/400/300	t	8a95a5e7-aa36-4775-8999-2a4db1192cb9
4b0f7929-bfb8-4e48-9f29-ad7e08b68bc1	https://picsum.photos/seed/108/400/300	f	8a95a5e7-aa36-4775-8999-2a4db1192cb9
a9e57e26-653e-49b1-a3d5-11c415351cee	https://picsum.photos/seed/10/400/300	t	b9d9e531-354a-4172-9e77-012f093a448e
1700d77e-8ce6-4767-becd-12761fa4fecb	https://picsum.photos/seed/109/400/300	f	b9d9e531-354a-4172-9e77-012f093a448e
fd3a945c-e6a1-4a18-981e-9344127f9b3e	https://res.cloudinary.com/dj7qaabrv/image/upload/v1775071868/vogueAngleV1_eulcfx.png	t	40f5d933-991f-4590-a902-e0cb1f75a399
2ce020d1-d07b-46c9-bebc-e46ccae26853	https://res.cloudinary.com/dj7qaabrv/image/upload/v1775071868/vogueAngleV2_gorgoe.png	f	40f5d933-991f-4590-a902-e0cb1f75a399
8c6436d4-a3af-4b3f-8572-7ac16ecc77b5	https://res.cloudinary.com/dj7qaabrv/image/upload/v1775071868/firmooYSL-201-1_dthnvm.png	t	5c4d5c2a-919a-4747-991a-3a705c459297
1d6ac8c4-2d47-4578-a62e-e439f9991b63	https://res.cloudinary.com/dj7qaabrv/image/upload/v1775071868/firmooYSL-201-2_bfgt7x.png	f	5c4d5c2a-919a-4747-991a-3a705c459297
\.


--
-- Data for Name: User; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."User" (id, email, "passwordHash", rol) FROM stdin;
b2f5c817-aeac-4af3-8df5-f7c32b0f58fa	admin@optica.com	$2b$12$2lwlTqCEbAdVf1hGmWxlr.CAXWgyuNrcMYbtGAB1aas60LKoU6bfW	ADMIN
\.


--
-- Data for Name: UserFavorites; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."UserFavorites" ("userId", "productId") FROM stdin;
\.


--
-- Data for Name: _prisma_migrations; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public._prisma_migrations (id, checksum, finished_at, migration_name, logs, rolled_back_at, started_at, applied_steps_count) FROM stdin;
526af24e-7600-4ae6-ad5d-8321b2d3b894	09989f5687866b5155f0dccd12d7aaaf9770c9e3d513cfc9269a511a8923fa2f	2026-03-31 20:57:45.204718+01	20260331195745_init	\N	\N	2026-03-31 20:57:45.112331+01	1
\.


--
-- PostgreSQL database dump complete
--

\unrestrict dbVpqKdm5JlezrRvCTtrnK2JbCpdmKqRbtt7dXUoXYfDGiRQtilGzz0PT3kcREY

