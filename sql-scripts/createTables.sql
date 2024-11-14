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
    weight VARCHAR(100) NOT NULL,
    height VARCHAR(100) NOT NULL,
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
    participant_id INTEGER PRIMARY KEY,
    location VARCHAR(1000) NULL,
    name VARCHAR(100) NOT NULL,
    experience_level INTEGER NULL
);

CREATE TABLE Character (
    character_id INTEGER PRIMARY KEY,
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
    campaign_id INTEGER PRIMARY KEY,
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
    event_id INTEGER PRIMARY KEY,
    location VARCHAR(100) NOT NULL,
    start_time TIME NOT NULL,
    completion_status VARCHAR(100) NOT NULL,
    campaign_id INTEGER NOT NULL,
    FOREIGN KEY (campaign_id) REFERENCES Campaign(campaign_id) ON DELETE CASCADE
);

CREATE TABLE Combat_Encounter (
    combat_encounter_id INTEGER PRIMARY KEY,
    terrain VARCHAR(100) NULL,
    visibility VARCHAR(100) NULL,
    first_turn VARCHAR(100) NOT NULL,
    turn_order VARCHAR(1000) NOT NULL,
    event_id INTEGER NOT NULL,
    FOREIGN KEY (event_id) REFERENCES Event(event_id) ON DELETE CASCADE
);

CREATE TABLE Social_Encounter (
    social_encounter_id INTEGER PRIMARY KEY,
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