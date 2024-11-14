DROP FUNCTION IF EXISTS update_class_description;
CREATE OR REPLACE FUNCTION update_class_description(
    _name VARCHAR(100),
    _description VARCHAR(1000),
    _primary_ability VARCHAR(100),
    _weapon_proficiency VARCHAR(100),
    _armor_proficiency VARCHAR(100),
    _hit_die VARCHAR(100),
    _saving_throw_proficiency VARCHAR(100)
)
RETURNS json AS $$
DECLARE tuple class_description;
BEGIN
    UPDATE class_description
    SET
        description = COALESCE(_description, description),
        primary_ability = COALESCE(_primary_ability, primary_ability),
        weapon_proficiency = COALESCE(_weapon_proficiency, weapon_proficiency),
        armor_proficiency = COALESCE(_armor_proficiency, armor_proficiency),
        hit_die = COALESCE(_hit_die, hit_die),
        saving_throw_proficiency = COALESCE(_saving_throw_proficiency, saving_throw_proficiency)
    WHERE name = _name
    RETURNING * INTO tuple;

    RETURN to_json(tuple);
END;
$$ LANGUAGE plpgsql;