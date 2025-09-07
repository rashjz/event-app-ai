-- Create categories
INSERT INTO category (name) VALUES
('travel'),
('entertainment'),
('sports'),
('education'),
('food'),
('music'),
('art'),
('business'),
('technology');

-- Create event types
INSERT INTO event_type (name) VALUES
('Event'),
('Concert'),
('Movie'),
('Theatre'),
('Exhibition');

-- Create events with category and event type references
INSERT INTO EVENT (event_type_id, title, description, date, image, category_id)
VALUES ((SELECT id FROM event_type WHERE name = 'Event'), 'Bus Travel from NYC to Longwood Gardens, Kennett Square, PA',
'Join us for a fun-filled day trip from NYC to Longwood Gardens in Kennett Square, PA! The bus leaves at 9:30 am from Hudson Yards - 11th Avenue between W. 35th and W. 36th Streets, across from Javits Convention Center. Explore the beautiful gardens, lush landscapes, and stunning displays at Longwood Gardens. Take a break from the city hustle and bustle and immerse yourself in nature beauty. Our comfortable bus will take you there and back, so you can sit back, relax, and enjoy the ride. Don miss out on this exciting opportunity to experience one of the top botanical gardens in the country!',
'2025-06-29',
'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop',
(SELECT id FROM category WHERE name = 'travel'));

INSERT INTO EVENT (event_type_id, title, description, date, image, category_id)
VALUES ((SELECT id FROM event_type WHERE name = 'Theatre'), 'Amazing Scavenger Hunt! - Coatesville Caper: Steel City Search',
'Steel yourself for an adventure like no other in the heart of Coatesville, Pennsylvania! Our Coatesville, Pennsylvania scavenger hunt will take you through the Downtown neighborhood, uncovering the fascinating history and culture of this charming city that was once a powerhouse of America''s steel industry. Let our witty guide lead you on an unforgettable journey filled with intrigue, laughter, and a healthy dash of challenge. Follow in the footsteps of iron magnates and fearless inventors as you explore iconic locales such as a building adorned by intricate friezes or the picturesque house once inhabited by an influential executive. Take a moment to appreciate the majestic craftsmanship behind towering symbols of strength while also admiring the vibrant nature seemingly sprouting around every corner. It''s time to grab your friends and put your wits to the test with our captivating Coatesville, Pennsylvania scavenger hunt. You won''t want to miss out on this thrilling exploit – join us now for an experience that will forge lasting memories!',
'2025-07-15',
'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=600&fit=crop',
(SELECT id FROM category WHERE name = 'entertainment'));

-- Add more diverse events
INSERT INTO EVENT (event_type_id, title, description, date, image, category_id)
VALUES ((SELECT id FROM event_type WHERE name = 'Concert'), 'Summer Music Festival - Philadelphia',
'Experience the ultimate summer music extravaganza at the Philadelphia Summer Music Festival! Featuring world-renowned artists from various genres including pop, rock, indie, and electronic music. This three-day festival will take place at the beautiful Benjamin Franklin Parkway with multiple stages, food vendors, and interactive art installations. Don''t miss performances by top artists that will create unforgettable memories under the summer sky. Tickets include access to all stages, complimentary water stations, and shuttle service from downtown Philadelphia.',
'2025-08-20',
'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&h=600&fit=crop',
(SELECT id FROM category WHERE name = 'music'));

INSERT INTO EVENT (event_type_id, title, description, date, image, category_id)
VALUES ((SELECT id FROM event_type WHERE name = 'Movie'), 'Outdoor Cinema Night - Classic Film Festival',
'Join us for a magical evening under the stars at our Outdoor Cinema Night! We''re bringing back the classics with a special screening of timeless films that have shaped cinema history. This month features "Casablanca" - the romantic masterpiece that defined an era. Bring your blankets, picnic baskets, and loved ones for a cozy outdoor movie experience. Free popcorn and lemonade will be provided, and we''ll have cozy seating arrangements for everyone. Weather permitting, this will be a night to remember!',
'2025-09-10',
'https://images.unsplash.com/photo-1489599735734-79b4d8c3b0bb?w=800&h=600&fit=crop',
(SELECT id FROM category WHERE name = 'entertainment'));

INSERT INTO EVENT (event_type_id, title, description, date, image, category_id)
VALUES ((SELECT id FROM event_type WHERE name = 'Event'), 'Tech Innovation Summit 2025',
'Join industry leaders, innovators, and tech enthusiasts at the premier Tech Innovation Summit 2025! This two-day conference will feature keynote speeches from Silicon Valley executives, hands-on workshops on emerging technologies like AI, blockchain, and IoT, and networking opportunities with fellow professionals. Topics include digital transformation, cybersecurity, cloud computing, and the future of work. Early bird registration includes lunch both days, access to all sessions, and a exclusive networking dinner.',
'2025-10-15',
'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&h=600&fit=crop',
(SELECT id FROM category WHERE name = 'technology'));

INSERT INTO EVENT (event_type_id, title, description, date, image, category_id)
VALUES ((SELECT id FROM event_type WHERE name = 'Event'), 'Farm-to-Table Cooking Workshop',
'Discover the joy of cooking with fresh, locally-sourced ingredients at our Farm-to-Table Cooking Workshop! Led by renowned chef Maria Rodriguez, this interactive session will teach you how to prepare a complete three-course meal using seasonal produce from Pennsylvania farms. Learn knife skills, cooking techniques, and flavor combinations that will elevate your home cooking. The workshop includes all ingredients, wine pairings, and a beautiful meal to enjoy together. Perfect for food enthusiasts, couples, or anyone looking to impress their dinner guests!',
'2025-11-08',
'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&h=600&fit=crop',
(SELECT id FROM category WHERE name = 'food'));

INSERT INTO EVENT (event_type_id, title, description, date, image, category_id)
VALUES ((SELECT id FROM event_type WHERE name = 'Theatre'), 'Philadelphia Marathon 2025',
'Lace up your running shoes and join thousands of participants for the prestigious Philadelphia Marathon 2025! This iconic 26.2-mile race winds through the historic streets of Philadelphia, passing by world-famous landmarks including Independence Hall, the Liberty Bell, and the Philadelphia Museum of Art. Whether you''re a seasoned marathoner or running your first race, our event offers multiple distance options including the full marathon, half marathon, and 5K fun run. Professional timing, water stations, medical support, and post-race celebrations make this an unforgettable experience.',
'2025-11-23',
'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=600&fit=crop',
(SELECT id FROM category WHERE name = 'sports'));

INSERT INTO EVENT (event_type_id, title, description, date, image, category_id)
VALUES ((SELECT id FROM event_type WHERE name = 'Theatre'), 'Digital Marketing Masterclass',
'Transform your marketing skills with our comprehensive Digital Marketing Masterclass! This intensive one-day workshop covers everything from social media strategy and content creation to SEO optimization and paid advertising. Learn from industry experts with real-world experience at top digital agencies. Hands-on exercises, case studies, and practical tools will give you immediately applicable skills. Whether you''re a business owner, marketer, or entrepreneur, this masterclass will equip you with the knowledge and strategies needed to succeed in today''s digital landscape.',
'2025-12-05',
'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=600&fit=crop',
(SELECT id FROM category WHERE name = 'business'));

INSERT INTO EVENT (event_type_id, title, description, date, image, category_id)
VALUES ((SELECT id FROM event_type WHERE name = 'Exhibition'), 'Modern Art Exhibition - "Digital Dreams"',
'Immerse yourself in the intersection of technology and creativity at our groundbreaking Modern Art Exhibition: "Digital Dreams"! This curated collection features works by emerging and established artists who explore how digital tools are reshaping artistic expression. From interactive installations and AI-generated artwork to traditional pieces inspired by the digital age, this exhibition challenges our perceptions of what constitutes "art" in the 21st century. Special evening hours with live music and artist talks. Free admission with advance registration.',
'2025-12-18',
'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop',
(SELECT id FROM category WHERE name = 'art'));

INSERT INTO EVENT (event_type_id, title, description, date, image, category_id)
VALUES ((SELECT id FROM event_type WHERE name = 'Exhibition'), 'Startup Pitch Competition',
'Are you ready to launch your startup dreams? Join our exciting Startup Pitch Competition where entrepreneurs pitch their innovative ideas to a panel of experienced investors and industry experts! This high-energy event features 3-minute pitches followed by Q&A sessions, with prizes including seed funding, mentorship opportunities, and office space. Categories include technology, healthcare, sustainability, and consumer products. Network with fellow entrepreneurs, learn from successful founders, and potentially secure the funding you need to bring your vision to life.',
'2026-01-14',
'https://images.unsplash.com/photo-1556761175-b413da4baf72?w=800&h=600&fit=crop',
(SELECT id FROM category WHERE name = 'business'));

INSERT INTO EVENT (event_type_id, title, description, date, image, category_id)
VALUES ((SELECT id FROM event_type WHERE name = 'Exhibition'), 'Jazz Night at The Fillmore',
'Transport yourself to the golden age of jazz at our exclusive Jazz Night at The Fillmore! Featuring the legendary Philadelphia Jazz Quartet with special guest vocalist Sarah Mitchell, this intimate evening celebrates the rich tradition of American jazz music. From classic standards to contemporary jazz fusion, experience the magic of live jazz in one of Philadelphia''s most historic venues. The Fillmore''s renowned acoustics and ambiance create the perfect setting for an unforgettable musical journey. Cocktails, small plates, and a sophisticated atmosphere make this the perfect date night or special occasion.',
'2026-02-20',
'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&h=600&fit=crop',
(SELECT id FROM category WHERE name = 'music'));

INSERT INTO EVENT (event_type_id, title, description, date, image, category_id)
VALUES ((SELECT id FROM event_type WHERE name = 'Exhibition'), 'Photography Workshop - Urban Landscapes',
'Unlock your creative potential with our Photography Workshop: Urban Landscapes! Led by award-winning photographer and National Geographic contributor, Michael Chen, this hands-on workshop will teach you how to capture the beauty and energy of cityscapes. Learn composition techniques, lighting mastery, and post-processing skills using professional-grade equipment. We''ll explore Philadelphia''s most photogenic locations including Center City, Old City, and the waterfront. All skill levels welcome - from beginners to advanced photographers. Includes use of professional cameras, private critique sessions, and a beautiful printed portfolio of your work.',
'2026-03-15',
'https://images.unsplash.com/photo-1452587925148-ce544e77e70d?w=800&h=600&fit=crop',
(SELECT id FROM category WHERE name = 'art'));
