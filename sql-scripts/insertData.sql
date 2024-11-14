-- Class and related tables
INSERT INTO Class_Description (name, description, primary_ability, weapon_proficiency, armor_proficiency, hit_die, saving_throw_proficiency) VALUES 
('Fighter', 'A strong fighter skilled in melee combat.', 'Strength', 'Simple Weapons', 'Light Armor', 'd10', 'Strength, Constitution'),
('Wizard', 'A master of the arcane arts capable of casting powerful spells.', 'Intelligence', 'Spells', 'No Armor', 'd6', 'Intelligence, Wisdom'),
('Rogue', NULL, 'Dexterity', 'Simple Weapons', 'Light Armor', 'd8', 'Dexterity, Intelligence'),
('Cleric', 'A divine spellcaster who channels the power of their deity.', 'Wisdom', 'Simple Weapons', 'Medium Armor', 'd8', 'Wisdom, Charisma'),
('Paladin', 'A holy warrior bound to a sacred oath.', 'Strength', 'Martial Weapons', 'Heavy Armor', 'd10', 'Wisdom, Charisma');

INSERT INTO Class_Level_Features (level, num_hit_die, advantage_effect, modifier_effect) VALUES 
(1, 1, 2, 2),
(2, 2, 3, 2),
(3, 3, 3, 3),
(4, 4, 4, 3),
(5, 5, 4, 4);

INSERT INTO Class(name, level) VALUES 
('Fighter', 1),
('Fighter', 2),
('Fighter', 3),
('Fighter', 4),
('Fighter', 5),
('Paladin', 1),
('Paladin', 2),
('Wizard', 5),
('Cleric', 1),
('Rogue', 3);

INSERT INTO Species (name, description, weight, height, type) VALUES 
('Human', NULL, '140-250 lbs', 'Average', 'Humanoid'),
('Elf', 'Graceful beings with a natural affinity for magic and nature, known for their long lifespans.', '100-145 lbs', 'Tall', 'Fey'),
('Dwarf', 'Stout and hardy, dwarves are known for their strength, resilience, and craftsmanship.', '150-200 lbs', 'Short', 'Humanoid'),
('Dragonborn', 'Descendants of dragons, dragonborn are proud warriors with a strong sense of honor.', '250-350 lbs', 'Tall', 'Draconic'),
('Halfling', 'Small and nimble, halflings are known for their luck and ability to stay out of danger.', '40-45 lbs', 'Short', 'Humanoid');

INSERT INTO Feat (name, target_skill, description, modifier, requirement) VALUES 
('Mobile', 'DEX', 'Your speed increases by 10 feet, and difficult terrain does not hinder you when you dash.', 2, NULL),
('Tough', 'STR', 'Your hit point maximum increases by an amount equal to twice your level.', 2, NULL),
('Sharpshooter', 'DEX', NULL, 2, 'Proficiency with a ranged weapon'), 
('Great Weapon Master', 'DEX', 'You can wield massive weapons with terrifying efficiency, dealing devastating blows.', 3, 'Proficiency with a heavy weapon'),
('War Caster', 'INT', 'You have advantage on saving throws to maintain concentration on a spell.', 1, 'Ability to cast at least one spell');

-- Participant related inserts
INSERT INTO Participant (location, name, password, experience_level) VALUES
('Waterdeep', 'Momin Kashif', '1234', 5),
('Neverwinter', 'Julia Sangster', '1234', 6),
('Baldurs Gate', 'Annie Chung', '1234', 7),
('Feywild', 'Rachel Pottinger', '1234', 4),
('Icewind Dale', 'Jane Doe', '1234', 2);

INSERT INTO Game_Player (game_player_id) VALUES
(1),
(2),
(3),
(4);

INSERT INTO Game_Master (game_master_id) VALUES
(5);

-- Character and related inserts
INSERT INTO Character (name, hair_color, eye_color, level, position, hp, class_name, species_name, participant_id) VALUES
('Loathsome Dung Eater', 'Black', 'Brown', 2, 'Sallys Tavern', 18, 'Paladin', 'Dwarf', 1),
('Margit the Fell', NULL, 'Blue', 1, 'Top of Mount Doom', 12, 'Fighter', 'Human', 2),
('General Radhan', 'Silver', 'Green', 5, 'Baldurs Gate Potion Shop', 22, 'Wizard', 'Elf', 3),
('Zarak Shadowsong', 'Brown', 'Hazel', 3, 'Ravenloft Salon', 16, 'Rogue', 'Halfling', 4),
('Tarnished', NULL, NULL, 1, 'Avernus Concert Hall', 12, 'Fighter', 'Dragonborn', 5);

-- Campaign related inserts
INSERT INTO Campaign (campaign_name, meeting_location, meeting_time, setting, difficulty_level, max_num_players, current_num_players, description, date_created, game_master_id) VALUES
('The Lost Mines of Phandelver', 'CS Building UBC', '18:00:00', 'Sword Coast', 'Easy', 5, 2, 'A classic adventure for new players.', '2024-01-15', 5),
('Curse of Strahd', NULL, '19:30:00', 'Ravenloft', 'Hard', 6, 2, NULL, '2024-02-20', 5),
('Storm Kings Thunder', 'AMS Nest', NULL, 'Sword Coast', 'Medium', 7, 5, 'A quest to unite the realms against a giant threat.', '2024-03-01', 5),
('Tales from the Yawning Portal', 'Stanley Park', '20:00:00', NULL, 'Medium', 5, 5, 'A collection of classic D&D adventures.', '2024-04-10', 5),
('Descent into Avernus', 'Dundas Square', '16:00:00', 'Avernus', NULL, 6, 2, NULL, '2024-05-15', 5);

INSERT INTO Event (location, start_time, completion_status, campaign_id) VALUES 
('Castle of Shadows', '18:00:00', 'Completed', 1),
('Forest of Whispers', '14:30:00', 'In Progress', 1),
('Mountain Fortress', '20:00:00', 'Pending', 2),
('City of Gold', '19:00:00', 'Completed', 2),
('Desert Ruins', '15:00:00', 'In Progress', 3);

INSERT INTO Combat_Encounter (terrain, visibility, first_turn, turn_order, event_id) VALUES 
('Forest', 'Low', 'Player 1', 'Player 1, Player 2, Monster A', 1),
('Cave', 'Dark', 'Monster B', 'Monster B, Player 3, Player 1', 2),
('Open Field', 'Clear', 'Player 2', 'Player 2, Player 3, Monster C', 3),
('Dungeon', 'Dim', 'Player 1', 'Player 1, Monster D, Player 2', 4),
('Ruins', 'Foggy', 'Player 3', 'Player 3, Monster E, Player 1', 5);

INSERT INTO Social_Encounter (social_setting, action, event_id) VALUES 
('Tavern', 'Negotiate with the bartender', 1),
('Marketplace', 'Haggle for prices', 2),
('Nobles Ball', 'Dance with a noble', 3),
('Street Corner', 'Informally chat with locals', 4),
('Library', 'Research ancient texts', 5);

INSERT INTO Has_Feat (character_id, feat_name) VALUES 
(1, 'Sharpshooter'),
(2, 'War Caster'),
(3, 'Great Weapon Master'),
(4, 'Mobile'),
(5, 'Tough');

INSERT INTO Ability_Score (character_id, name, modifier) VALUES
(1, 'Strength', 2),
(1, 'Dexterity', 1),
(1, 'Constitution', 2),
(1, 'Intelligence', 1),
(1, 'Wisdom', 1),
(2, 'Intelligence', 3),
(2, 'Wisdom', 1),
(2, 'Charisma', 2),
(2, 'Dexterity', 2),
(3, 'Constitution', 1),
(3, 'Intelligence', 3),
(3, 'Wisdom', 2),
(3, 'Dexterity', 2),
(3, 'Strength', 2),
(3, 'Charisma', 1),
(4, 'Dexterity', -4),
(4, 'Strength', 1),
(5, 'Charisma', 1);

INSERT INTO Enrol (game_player_id, campaign_id, date_joined) VALUES
(1, 1, '2024-01-15'),
(2, 2, '2024-02-20'),
(3, 1, '2024-04-10'),
(4, 2, '2024-03-05');

INSERT INTO Skill (name, description) VALUES 
('Stealth', 'The ability to move silently and avoid detection'),
('Persuasion', 'The ability to convince others to agree with your point of view'),
('Athletics', 'The ability to perform physical feats, such as climbing or jumping'),
('Arcana', 'The ability to understand the mystical arts and magicians'),
('Insight', 'The ability to read people and sense their motivations');

INSERT INTO Social_Check (social_encounter_id, character_id, ability_score_name, skill_name, threshold, dice, success_state) VALUES 
(1, 1, 'Strength', 'Persuasion', 15, '1d20', TRUE),
(2, 2, 'Charisma', 'Persuasion', 12, '1d20', FALSE),
(3, 1, 'Intelligence', 'Insight', 10, '1d20', TRUE),
(4, 3, 'Wisdom', 'Insight', 14, '2d20', TRUE),
(5, 2, 'Dexterity', 'Athletics', 8, '1d20', FALSE);

INSERT INTO Turn (combat_encounter_id, turn_number, movement, action) VALUES 
(1, 1, 30, 'Move to the north and attack'),
(1, 2, 20, 'Cast a spell'),
(2, 1, 25, 'Take cover behind a tree'),
(2, 2, 15, 'Charge at the enemy'),
(3, 1, 0, 'Use a ranged attack from a distance');

INSERT INTO Combat_Check (attacker_character_id, attackee_character_id, combat_id, turn_number, threshold, dice, success_state) VALUES 
(1, 2, 1, 1, 15, '2d8', TRUE),
(2, 1, 1, 2, 12, '1d20', FALSE),
(3, 1, 2, 1, 18, '1d10', TRUE),
(2, 3, 2, 2, 10, '3d20', TRUE),
(1, 3, 3, 1, 20, '1d8', FALSE);