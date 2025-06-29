-- Create categories
INSERT INTO category (name, description, color) VALUES 
('travel', 'Travel and transportation related events', '#3498db'),
('entertainment', 'Entertainment and leisure activities', '#e74c3c'),
('sports', 'Sports and fitness events', '#2ecc71'),
('education', 'Educational and learning events', '#f39c12'),
('food', 'Food and dining experiences', '#e67e22'),
('music', 'Music concerts and performances', '#9b59b6'),
('art', 'Art and cultural events', '#34495e'),
('business', 'Business and professional events', '#1abc9c'),
('technology', 'Technology and innovation events', '#95a5a6');

-- Create events with category references
INSERT INTO EVENT (type, title, description, date, image, category_id) 
VALUES ('event', 'Bus Travel from NYC to Longwood Gardens, Kennett Square, PA', 
'Join us for a fun-filled day trip from NYC to Longwood Gardens in Kennett Square, PA! The bus leaves at 9:30 am from Hudson Yards - 11th Avenue between W. 35th and W. 36th Streets, across from Javits Convention Center. Explore the beautiful gardens, lush landscapes, and stunning displays at Longwood Gardens. Take a break from the city hustle and bustle and immerse yourself in nature beauty. Our comfortable bus will take you there and back, so you can sit back, relax, and enjoy the ride. Don miss out on this exciting opportunity to experience one of the top botanical gardens in the country!',
'2025-06-29',
'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop',
(SELECT id FROM category WHERE name = 'travel'));

INSERT INTO EVENT (type, title, description, date, image, category_id) 
VALUES ('event', 'Amazing Scavenger Hunt! - Coatesville Caper: Steel City Search', 
'Steel yourself for an adventure like no other in the heart of Coatesville, Pennsylvania! Our Coatesville, Pennsylvania scavenger hunt will take you through the Downtown neighborhood, uncovering the fascinating history and culture of this charming city that was once a powerhouse of America''s steel industry. Let our witty guide lead you on an unforgettable journey filled with intrigue, laughter, and a healthy dash of challenge. Follow in the footsteps of iron magnates and fearless inventors as you explore iconic locales such as a building adorned by intricate friezes or the picturesque house once inhabited by an influential executive. Take a moment to appreciate the majestic craftsmanship behind towering symbols of strength while also admiring the vibrant nature seemingly sprouting around every corner. It''s time to grab your friends and put your wits to the test with our captivating Coatesville, Pennsylvania scavenger hunt. You won''t want to miss out on this thrilling exploit – join us now for an experience that will forge lasting memories!',
'2025-07-15',
'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=600&fit=crop',
(SELECT id FROM category WHERE name = 'entertainment')); 