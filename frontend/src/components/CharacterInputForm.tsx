import {Form} from "react-bootstrap";
import {useEffect, useState} from "react";

export interface CharacterInput {
    name:               string | null;
    hair_color:         string | null;
    eye_color:          string | null;
    level:              number | null;
    position:           string | null;
    class_name:         string | null;
    species_name:       string | null;
    rollForHP:          boolean | null;
    hitPointsCustom:    string | null;
}

export interface ClassLevelOption {
    name: string;
    level: number;
}

export interface SpeciesOption {
    name: string;
}

const CharacterInputForm = () => {

    const [triggerReload, setTriggerReload] = useState(true);
    const [classLevelOptions, setClassLevelOptions] = useState<ClassLevelOption[]>([]);
    const [speciesOptions, setSpeciesOptions] = useState<SpeciesOption[]>([]);
    const [formData, setFormData] = useState<CharacterInput>({
            name: null,
            hair_color: null,
            eye_color: null,
            level: null,
            position: null,
            class_name: null,
            species_name: null,
            rollForHP: true,
            hitPointsCustom: null
        }
    );

    useEffect(() => {
        fetchOptions();
    }, [triggerReload]);

    const fetchOptions = async () => {

        try {
            const response = await fetch('http://localhost:5001/class/options');
            const data = await response.json();
            setClassLevelOptions(data);
        } catch (err) {
            console.error("Error fetching class + level combos", err);
        }

        try {
            const response = await fetch('http://localhost:5001/species/options');
            const data = await response.json();
            setSpeciesOptions(data);
        } catch (err) {
            console.error("Error fetching species options", err);
        }

        setTriggerReload(false);
    }

    const uniqueClassNames = [... new Set(classLevelOptions.map(opt => opt.name))];

    const levelsForSelectedClass = classLevelOptions.filter(option => option.name === formData.class_name)
        .map(opt => opt.level);

    const uniqueSpecies = [... new Set(speciesOptions.map(species => species.name))];

    const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const {id, value} = e.target;
        const field = id.split(".")[1] as keyof CharacterInput;

        setFormData(prev => ({
            ...prev,
            [field]: value || null,
        }))
    }

    const handleCustomHpToggle = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData(prev => ({
            ...prev,
            rollForHP: !e.target.checked,
            hitPointsCustom: !e.target.checked ? null : prev.hitPointsCustom
        }));
    }

    const handleCustomHPChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;

        if(!value || (Number(value) > 0 && Number.isInteger(Number(value)))) {
            setFormData(prev => ({
                ...prev,
                hitPointsCustom: value
            }))
        }
    }

    return (
        <>
            <Form>
                <h4> Identifying Features </h4>
                <Form.Group className={"mb-3"} controlId={"charInput.name"}>
                    <Form.Label>Name</Form.Label>
                    <Form.Control   type={"text"}
                                    placeholder={"They Themington"}
                                    onChange={handleFormChange}></Form.Control>
                </Form.Group>
                <Form.Group className={"mb-3"} controlId={"charInput.hair_color"}>
                    <Form.Label>Hair Color</Form.Label>
                    <Form.Control type={"text"} placeholder={"Honey Mist Auburn"}></Form.Control>
                </Form.Group>
                <Form.Group className={"mb-3"} controlId={"charInput.eye_color"}>
                    <Form.Label>Eye Color</Form.Label>
                    <Form.Control type={"text"} placeholder={"Blue"}></Form.Control>
                </Form.Group>

                <h4>Character Build</h4>
                <Form.Group className={"mb-3"} controlId={"charInput.class_name"}>
                    <Form.Label>Class</Form.Label>
                    <Form.Select
                        value={formData.class_name || ''}
                        onChange={handleFormChange}>
                        <option value = "">Select a Class</option>
                        {uniqueClassNames.map(className => (
                            <option key={className} value={className}>
                                {className}
                            </option>
                        ))}
                    </Form.Select>
                </Form.Group>
                <Form.Group className={"mb-3"} controlId={"charInput.level"}>
                    <Form.Label>Level</Form.Label>
                    <Form.Select
                        value={formData.level || ''}
                        onChange={handleFormChange}
                        disabled={!formData.class_name}>
                        <option value = "">Select a Level</option>
                        {levelsForSelectedClass.map(level => (
                            <option key={level} value={level}>
                                {level}
                            </option>
                        ))}
                    </Form.Select>
                </Form.Group>
                <Form.Group className={"mb-3"} controlId={"charInput.species_name"}>
                    <Form.Label>Species</Form.Label>
                    <Form.Select
                        value={formData.species_name || ''}
                        onChange={handleFormChange}>
                        <option value = "">Select a Species</option>
                        {uniqueSpecies.map(species => (
                            <option key={species} value={species}>
                                {species}
                            </option>
                        ))}
                    </Form.Select>
                </Form.Group>
                By default, we will roll for your HP with your classes hit die
                <Form.Group className={"mb-3"}>
                    <Form.Check
                        type={"switch"}
                        id={"charInput.rollForHP"}
                        label={"Toggle Custom HP"}
                        checked={!formData.rollForHP}
                        onChange={handleCustomHpToggle}>
                    </Form.Check>
                </Form.Group>
                {!formData.rollForHP && (
                    <Form.Group className="mb-3" controlId="charInput.hitPointsCustom">
                        <Form.Label>Custom HP Value (min. 1)</Form.Label>
                        <Form.Control
                            type="number"
                            min="1"
                            value={formData.hitPointsCustom || ''}
                            onChange={handleCustomHPChange}
                            placeholder="Enter HP value"
                        />
                    </Form.Group>)
                }
            </Form>
        </>
    );
};

export default CharacterInputForm