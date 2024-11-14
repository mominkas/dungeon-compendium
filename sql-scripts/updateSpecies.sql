DROP FUNCTION IF EXISTS update_species;
CREATE OR REPLACE FUNCTION update_species(
    _name VARCHAR(100),
    _description VARCHAR(1000),
    _weight VARCHAR(100),
    _height VARCHAR(100),
    _type VARCHAR(100)
)
RETURNS json AS $$
DECLARE tuple species;
BEGIN
    UPDATE species
    SET
        description = COALESCE(_description, description),
        weight = COALESCE(_weight, weight),
        height = COALESCE(_height, height),
        type = COALESCE(_type, type)
    WHERE name = _name
    RETURNING * INTO tuple;

    RETURN to_json(tuple);
END;
$$ LANGUAGE plpgsql;