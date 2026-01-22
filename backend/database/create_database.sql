-- Create Database
DROP DATABASE IF EXISTS vacations_db;
CREATE DATABASE vacations_db;
USE vacations_db;

-- Create Users Table
CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role ENUM('user', 'admin') DEFAULT 'user',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create Vacations Table
CREATE TABLE vacations (
    id INT PRIMARY KEY AUTO_INCREMENT,
    destination VARCHAR(100) NOT NULL,
    description TEXT NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    price DECIMAL(10, 2) NOT NULL CHECK (price >= 0 AND price <= 10000),
    image_name VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create Followers Table (Many-to-Many relationship)
CREATE TABLE followers (
    user_id INT NOT NULL,
    vacation_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (user_id, vacation_id),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (vacation_id) REFERENCES vacations(id) ON DELETE CASCADE
);

-- Insert Admin User (password: admin123)
-- Password hash for 'admin123' using bcrypt
INSERT INTO users (first_name, last_name, email, password, role) VALUES
('Admin', 'Manager', 'admin@vacations.com', '$2b$10$rQEY9VOY9VPwwJPGTZQ4/.cR5K.8HKxL/fVu.3lANHZWlBYK.LMBi', 'admin');

-- Insert Regular Users (password: user1234)
-- Password hash for 'user1234' using bcrypt
INSERT INTO users (first_name, last_name, email, password, role) VALUES
('John', 'Smith', 'john@example.com', '$2b$10$ULb9OjVqWEFrY9N.lPZEXOvEyaQD9CZwJq8L5JX1w.XJYvWrKq5Wy', 'user'),
('Sarah', 'Johnson', 'sarah@example.com', '$2b$10$ULb9OjVqWEFrY9N.lPZEXOvEyaQD9CZwJq8L5JX1w.XJYvWrKq5Wy', 'user'),
('Michael', 'Brown', 'michael@example.com', '$2b$10$ULb9OjVqWEFrY9N.lPZEXOvEyaQD9CZwJq8L5JX1w.XJYvWrKq5Wy', 'user'),
('Emily', 'Davis', 'emily@example.com', '$2b$10$ULb9OjVqWEFrY9N.lPZEXOvEyaQD9CZwJq8L5JX1w.XJYvWrKq5Wy', 'user');

-- Insert 12 Vacations with real data
INSERT INTO vacations (destination, description, start_date, end_date, price, image_name) VALUES
('Rome, Italy', 'You can create a dream vacation of famous artistic wonders and historic hidden gems punctuated by top-notch dining in fabulous restaurants with a Rome vacation package. Fill your days with tours of the Roman Forum, the Pantheon, the Colosseum, all the show-off Rome sights, then meander down cobbled streets to find a pretty basement trattoria.', '2025-02-15', '2025-02-28', 1931, 'rome.jpg'),

('Rhodes, Greece', 'It''s time to take a break and enjoy a cocktail by the sea on a Rhodes vacation. Incredible seaside views are there for the taking on a trip to Rhodes — Pefkos Beach (28 miles or 45 km away) is a well-known example. We recommend staying close by. If you want other options, a lot of travelers also book Rhodes vacation packages in the vicinity of Elli Beach.', '2025-03-08', '2025-03-22', 462, 'rhodes.jpg'),

('Lahaina, Hawaii', 'It''s time to take a break and relax by the ocean on a Lahaina vacation. Incredible seaside views are in plentiful supply on a trip to Lahaina — Kaanapali Beach (3 miles or 5 km away) is the perfect example. We recommend staying close by. If you want more options, loads of travelers also book Lahaina packages around Black Rock Beach.', '2025-03-15', '2025-03-30', 1049, 'lahaina.jpg'),

('Corfu, Greece', 'Discover the emerald island of Corfu with its Venetian architecture, crystal-clear waters, and lush green landscapes. Explore the UNESCO-listed Old Town, relax on stunning beaches like Paleokastritsa, and indulge in delicious Greek cuisine. The perfect Mediterranean escape awaits you.', '2025-04-12', '2025-04-27', 689, 'corfu.jpg'),

('Hilo, Hawaii', 'Experience the natural wonders of Hawaii''s Big Island in Hilo. Visit the spectacular Akaka Falls, explore Hawaii Volcanoes National Park, and discover the beautiful Rainbow Falls. Hilo offers a more authentic Hawaiian experience with its farmers markets, botanical gardens, and rich cultural heritage.', '2025-04-17', '2025-04-30', 1299, 'hilo.jpg'),

('Montego Bay, Jamaica', 'Welcome to Montego Bay, Jamaica''s second-largest city and a paradise for beach lovers. Enjoy the famous Doctor''s Cave Beach, explore the historic Rose Hall Great House, and experience the vibrant nightlife. Don''t miss the chance to taste authentic Jamaican jerk cuisine and feel the reggae rhythm.', '2025-05-03', '2025-05-17', 875, 'montego.jpg'),

('Santorini, Greece', 'Experience the magic of Santorini with its iconic white-washed buildings, stunning sunsets over the caldera, and world-class wineries. Explore the charming villages of Oia and Fira, relax on unique volcanic beaches, and savor delicious Mediterranean cuisine with breathtaking sea views.', '2025-05-20', '2025-06-03', 1450, 'santorini.jpg'),

('Bali, Indonesia', 'Discover the Island of the Gods with its ancient temples, terraced rice paddies, and pristine beaches. From the cultural heart of Ubud to the surf beaches of Kuta, Bali offers a perfect blend of spirituality, adventure, and relaxation. Experience traditional Balinese ceremonies and world-class spa treatments.', '2025-06-10', '2025-06-25', 1180, 'bali.jpg'),

('Barcelona, Spain', 'Immerse yourself in the vibrant culture of Barcelona. Marvel at Gaudí''s architectural masterpieces including the Sagrada Familia and Park Güell. Stroll down Las Ramblas, enjoy tapas in the Gothic Quarter, and soak up the sun on Barceloneta Beach. Art, history, and Mediterranean charm await.', '2025-07-01', '2025-07-14', 920, 'barcelona.jpg'),

('Maldives', 'Escape to paradise in the Maldives. Stay in an overwater bungalow surrounded by crystal-clear turquoise waters and pristine white sand beaches. Snorkel with tropical fish, enjoy world-class diving, and witness spectacular sunsets. The ultimate luxury tropical getaway awaits.', '2025-07-20', '2025-08-02', 3500, 'maldives.jpg'),

('Tokyo, Japan', 'Experience the fascinating blend of ancient traditions and cutting-edge modernity in Tokyo. Visit historic temples and shrines, explore the bustling streets of Shibuya and Shinjuku, and indulge in the world''s best sushi. From serene gardens to neon-lit nightlife, Tokyo never fails to amaze.', '2025-08-15', '2025-08-28', 1650, 'tokyo.jpg'),

('Paris, France', 'Fall in love with the City of Light. Climb the Eiffel Tower, wander through the Louvre, and stroll along the Champs-Élysées. Enjoy croissants at charming cafés, explore the artistic Montmartre, and take a romantic cruise on the Seine. Paris is always a good idea.', '2025-09-05', '2025-09-18', 1280, 'paris.jpg');

-- Insert some followers data
INSERT INTO followers (user_id, vacation_id) VALUES
(2, 1), (2, 3), (2, 5), (2, 7),
(3, 1), (3, 2), (3, 4), (3, 8), (3, 10),
(4, 2), (4, 5), (4, 6), (4, 9), (4, 11), (4, 12),
(5, 1), (5, 3), (5, 7), (5, 10), (5, 12);
