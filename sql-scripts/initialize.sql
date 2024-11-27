-- postgres drop tables loop: https://www.geeksforgeeks.org/how-to-drop-all-tables-from-postgresql-1/
DO $$
    DECLARE
        r RECORD;
    BEGIN
        FOR r IN (SELECT tablename FROM pg_tables WHERE schemaname = 'public') LOOP
                EXECUTE 'DROP TABLE IF EXISTS ' || quote_ident(r.tablename) || ' CASCADE';
        END LOOP;
END $$;

CREATE TABLE Class_Description (
    name VARCHAR(100) PRIMARY KEY,
    description VARCHAR(1000) NULL,
    primary_ability VARCHAR(100) NOT NULL,
    weapon_proficiency VARCHAR(100) NOT NULL,
    armor_proficiency VARCHAR(100) NOT NULL,
    hit_die VARCHAR(100) NOT NULL,
    saving_throw_proficiency VARCHAR(100) NOT NULL
);

CREATE TABLE Class_Level_Features (
    level INTEGER PRIMARY KEY,
    num_hit_die INTEGER NOT NULL,
    advantage_effect INTEGER NOT NULL,
    modifier_effect INTEGER NOT NULL
);

CREATE TABLE Class (
    name VARCHAR(100),
    level INTEGER,
    PRIMARY KEY (name, level),
    FOREIGN KEY (level) REFERENCES Class_Level_Features(level) ON DELETE CASCADE,
    FOREIGN KEY (name) REFERENCES Class_Description(name) ON DELETE CASCADE
);

CREATE TABLE Species (
    name VARCHAR(100) PRIMARY KEY,
    description VARCHAR(1000) NULL,
    weight INTEGER NOT NULL,
    height INTEGER NOT NULL,
    type VARCHAR(100) NOT NULL
);

CREATE TABLE Feat (
    name VARCHAR(100) PRIMARY KEY,
    target_skill VARCHAR(100) NOT NULL,
    description VARCHAR(1000) NULL,
    modifier INTEGER NOT NULL,
    requirement VARCHAR(1000) NULL
);

CREATE TABLE Participant (
    participant_id SERIAL PRIMARY KEY,
    location VARCHAR(1000) NULL,
    name VARCHAR(100) NOT NULL,
    password VARCHAR(255) NOT NULL,
    experience_level INTEGER NULL
);

CREATE TABLE Character (
    character_id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    hair_color VARCHAR(100) NULL,
    eye_color VARCHAR(100) NULL,
    level INTEGER NOT NULL,
    position VARCHAR(100) NULL,
    hp INTEGER NOT NULL,
    class_name VARCHAR(100) NOT NULL,
    species_name VARCHAR(100) NOT NULL,
    participant_id INTEGER NOT NULL,
    FOREIGN KEY (class_name, level) REFERENCES Class(name, level) ON DELETE CASCADE,
    FOREIGN KEY (species_name) REFERENCES Species(name) ON DELETE CASCADE,
    FOREIGN KEY (participant_id) REFERENCES Participant(participant_id) ON DELETE CASCADE
);

CREATE TABLE Has_Feat (
    character_id INTEGER,
    feat_name VARCHAR(100),
    PRIMARY KEY (character_id, feat_name),
    FOREIGN KEY (character_id) REFERENCES Character(character_id) ON DELETE CASCADE,
    FOREIGN KEY (feat_name) REFERENCES Feat(name) ON DELETE CASCADE
);

CREATE TABLE Ability_Score (
    character_id INTEGER,
    name VARCHAR(100),
    modifier INTEGER NOT NULL,
    PRIMARY KEY (character_id, name),
    FOREIGN KEY (character_id) REFERENCES Character(character_id) ON DELETE CASCADE
);

CREATE TABLE Game_Player (
    game_player_id INTEGER PRIMARY KEY,
    FOREIGN KEY (game_player_id) REFERENCES Participant(participant_id) ON DELETE CASCADE
);

CREATE TABLE Game_Master (
    game_master_id INTEGER PRIMARY KEY,
    FOREIGN KEY (game_master_id) REFERENCES Participant(participant_id) ON DELETE CASCADE
);

CREATE TABLE Campaign (
    campaign_id SERIAL PRIMARY KEY,
    campaign_name VARCHAR(100) NOT NULL,
    meeting_location VARCHAR(100) NULL,
    meeting_time TIME NULL,
    setting VARCHAR(1000) NULL,
    difficulty_level VARCHAR(100) NULL,
    max_num_players INTEGER NOT NULL,
    current_num_players INTEGER NOT NULL,
    description VARCHAR(1000) NULL,
    date_created DATE NOT NULL,
    game_master_id INTEGER NOT NULL,
    FOREIGN KEY (game_master_id) REFERENCES Game_Master(game_master_id)
);

CREATE TABLE Enroll (
    game_player_id INTEGER,
    campaign_id INTEGER,
    date_joined DATE NOT NULL,
    PRIMARY KEY (game_player_id, campaign_id),
    FOREIGN KEY (game_player_id) REFERENCES Game_Player(game_player_id) ON DELETE CASCADE,
    FOREIGN KEY (campaign_id) REFERENCES Campaign(campaign_id) ON DELETE CASCADE
);

CREATE TABLE Event (
    event_id SERIAL PRIMARY KEY,
    location VARCHAR(100) NOT NULL,
    start_time TIME NOT NULL,
    completion_status VARCHAR(100) NOT NULL,
    campaign_id INTEGER NOT NULL,
    FOREIGN KEY (campaign_id) REFERENCES Campaign(campaign_id) ON DELETE CASCADE
);

CREATE TABLE Combat_Encounter (
    combat_encounter_id SERIAL PRIMARY KEY,
    terrain VARCHAR(100) NULL,
    visibility VARCHAR(100) NULL,
    first_turn VARCHAR(100) NOT NULL,
    turn_order VARCHAR(1000) NOT NULL,
    event_id INTEGER NOT NULL,
    FOREIGN KEY (event_id) REFERENCES Event(event_id) ON DELETE CASCADE
);

CREATE TABLE Social_Encounter (
    social_encounter_id SERIAL PRIMARY KEY,
    social_setting VARCHAR(100) NULL,
    action VARCHAR(100) NOT NULL,
    event_id INTEGER NOT NULL,
    FOREIGN KEY (event_id) REFERENCES Event(event_id) ON DELETE CASCADE
);

CREATE TABLE Skill (
    name VARCHAR(100) PRIMARY KEY,
    description VARCHAR(1000) NULL
);

CREATE TABLE Social_Check (
    social_encounter_id INTEGER PRIMARY KEY,
    character_id INTEGER NOT NULL,
    ability_score_name VARCHAR(100) NOT NULL,
    skill_name VARCHAR(100) NOT NULL,
    threshold INTEGER NULL,
    dice VARCHAR(100) NULL,
    success_state BOOLEAN NULL,
    FOREIGN KEY (skill_name) REFERENCES Skill(name) ON DELETE CASCADE,
    FOREIGN KEY (character_id, ability_score_name) REFERENCES Ability_Score(character_id, name) ON DELETE CASCADE
);

CREATE TABLE Turn (
    combat_encounter_id INTEGER,
    turn_number INTEGER,
    movement INTEGER NULL,
    action VARCHAR(100) NOT NULL,
    PRIMARY KEY (combat_encounter_id, turn_number),
    FOREIGN KEY (combat_encounter_id) REFERENCES Combat_Encounter(combat_encounter_id) ON DELETE CASCADE
);

CREATE TABLE Combat_Check (
    attacker_character_id INTEGER NOT NULL,
    attackee_character_id INTEGER NOT NULL,
    combat_id INTEGER,
    turn_number INTEGER,
    threshold INTEGER NULL,
    dice VARCHAR(100) NULL,
    success_state BOOLEAN NULL,
    PRIMARY KEY (combat_id, turn_number),
    FOREIGN KEY (combat_id, turn_number) REFERENCES Turn(combat_encounter_id, turn_number) ON DELETE CASCADE,
    FOREIGN KEY (attacker_character_id) REFERENCES Character(character_id) ON DELETE CASCADE,
    FOREIGN KEY (attackee_character_id) REFERENCES Character(character_id) ON DELETE CASCADE
);

-- Class and related tables
INSERT INTO Class_Description (name, description, primary_ability, weapon_proficiency, armor_proficiency, hit_die, saving_throw_proficiency) VALUES
('Fighter', 'A strong fighter skilled in melee combat.', 'Strength', 'Simple Weapons', 'Light Armor', 'd10', 'Strength, Constitution'),
('Wizard', 'A master of the arcane arts capable of casting powerful spells.', 'Intelligence', 'Spells', 'No Armor', 'd6', 'Intelligence, Wisdom'),
('Rogue', NULL, 'Dexterity', 'Simple Weapons', 'Light Armor', 'd8', 'Dexterity, Intelligence'),
('Cleric', 'A divine spellcaster who channels the power of their deity.', 'Wisdom', 'Simple Weapons', 'Medium Armor', 'd8', 'Wisdom, Charisma'),
('Paladin', 'A holy warrior bound to a sacred oath.', 'Strength', 'Martial Weapons', 'Heavy Armor', 'd10', 'Wisdom, Charisma'),
('Barbarian', 'A mighty warrior powered by primal forces of the multiverse that manifest as a Rage.', 'Strength', 'Simple Weapons', 'Light Armor', 'd12', 'Strength, Constitution'),
('Bard', 'An expert at inspiring others, soothing hurts, disheartening foes, and creating illusions.', 'Charisma', 'Simple Weapons', 'Light Armor', 'd8', 'Dexterity, Charisma'),
('Druid', 'A being belonging to ancient orders that call on the forces of nature.', 'Wisdom', 'Simple Weapons', 'Light Armor', 'd8', 'Intelligence, Wisdom'),
('Monk', NULL, 'Dexterity', 'Simple Weapons', 'No Armor', 'd8', 'Dexterity, Wisdom');

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
('Paladin', 4),
('Wizard', 5),
('Rogue', 3),
('Cleric', 3),
('Barbarian', 5),
('Bard', 4),
('Druid', 2),
('Monk', 5);

INSERT INTO Species (name, description, weight, height, type) VALUES
('Human', NULL, '65', '180', 'Humanoid'),
('Elf', 'Graceful beings with a natural affinity for magic and nature, known for their long lifespans.', '45', '190', 'Fey'),
('Dwarf', 'Stout and hardy, dwarves are known for their strength, resilience, and craftsmanship.', '70', '140', 'Humanoid'),
('Dragonborn', 'Descendants of dragons, dragonborn are proud warriors with a strong sense of honor.', '130', '190', 'Draconic'),
('Halfling', 'Small and nimble, halflings are known for their luck and ability to stay out of danger.', '40', '110', 'Humanoid'),
('Aasimar', 'Mortals who carry a spark of the Upper Planes within their souls.', '65', '180', 'Humanoid'),
('Gnome', NULL, '20', '120', 'Humanoid'),
('Goliath', 'A nomadic race of humanoids native to the mountainous regions of Toril.', '150', '110', 'Humanoid'),
('Orc', 'A race of humanoids.', '110', '180', 'Humanoid'),
('Tiefling', NULL, '60', '160', 'Humanoid');

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
('Loathsome Dung Eater', 'Black', 'Brown', 4, 'Sally’s Tavern', 18, 'Paladin', 'Dwarf', 1),
('Margit the Fell', NULL, 'Blue', 1, 'Top of Mount Doom', 12, 'Fighter', 'Human', 2),
('General Radhan', 'Silver', 'Green', 5, 'Baldur’s Gate Potion Shop', 22, 'Wizard', 'Elf', 3),
('Zarak Shadowsong', 'Brown', 'Hazel', 3, 'Ravenloft Salon', 16, 'Rogue', 'Halfling', 4),
('Tarnished', NULL, NULL, 1, 'Avernus Concert Hall', 12, 'Fighter', 'Dragonborn', 5),
('Zylar Nightwing', 'Silver', 'Purple', 5, 'The High Elven Court', 20, 'Wizard', 'Elf', 1),
('Kaltor Mistshade', 'Brown', 'Gray', 3, 'The Stoneforge', 18, 'Cleric', 'Dwarf', 2),
('Nestor Blackflit', 'Blonde', 'Green', 2, 'Cedarwood Forest', 15, 'Fighter', 'Halfling', 3),
('Elowen Heartstride', 'Red', 'Yellow', 2, 'Firepeak Forge', 24, 'Fighter', 'Elf', 3),
('Aurelia Lightbringer', 'White', 'Amber', 4, 'Celestial Temple', 22, 'Paladin', 'Elf', 2),
('Nimblefoot Brightspark', 'Brown', 'Blue', 5, 'Glimmerstone Village', 17, 'Wizard', 'Gnome', 1),
('Thalindra Dawnhooves', 'Black', 'Gray', 3, 'Himalayan Peaks', 28, 'Fighter', 'Elf', 4),
('Thrak Bloodfury', 'Green', 'Red', 3, 'Warlord Fortress', 20, 'Rogue', 'Orc', 5),
('Lilith Shadowflame', 'Purple', 'Red', 5, 'Infernal Citadel', 21, 'Wizard', 'Tiefling', 1),
('Aeryn Brightblade', 'Blonde', 'Blue', 1, 'Sally’s Tavern', 15, 'Fighter', 'Human', 1),
('Darrael Swiftshadow', 'Grey', 'Green', 5, 'Tower of the Arcane', 12, 'Wizard', 'Elf', 1),
('Celestra Valianthoof', 'Black', 'Brown', 3, 'Thieves Guild', 18, 'Rogue', 'Halfling', 1),
('Seraphina Lightbringer', 'Red', 'Hazel', 3, 'Holy Chapel', 20, 'Cleric', 'Aasimar', 1),
('Valeria Sunhammer', 'Brown', 'Blue', 4, 'Paladin’s Keep', 25, 'Paladin', 'Dwarf', 1),
('Gorrak Ironfist', 'Black', 'Yellow', 5, 'Battlefield', 30, 'Barbarian', 'Dragonborn', 1),
('Liora Songbird', 'Brown', 'Green', 4, 'Forest Glade', 22, 'Bard', 'Gnome', 1),
('Lyra Gracewalker', 'Silver', 'Amber', 2, 'Ancient Grove', 16, 'Druid', 'Elf', 1),
('Vorin Ashblood', 'Black', 'Grey', 5, 'Monastery of the Empty Fist', 24, 'Monk', 'Human', 1);

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

INSERT INTO Enroll (game_player_id, campaign_id, date_joined) VALUES
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