DROP FUNCTION IF EXISTS update_class_level_features;
CREATE OR REPLACE FUNCTION update_class_level_features(
    _level INTEGER,
    _num_hit_die INTEGER,
    _advantage_effect INTEGER,
    _modifier_effect INTEGER
)
RETURNS json AS $$
DECLARE tuple class_level_features;
BEGIN
    UPDATE class_level_features
    SET
        level = COALESCE(_level, level),
        num_hit_die = COALESCE(_num_hit_die, num_hit_die),
        advantage_effect = COALESCE(_advantage_effect, advantage_effect),
        modifier_effect = COALESCE(_modifier_effect, modifier_effect)
    WHERE level = _level
    RETURNING * INTO tuple;

    RETURN to_json(tuple);
END;
$$ LANGUAGE plpgsql;