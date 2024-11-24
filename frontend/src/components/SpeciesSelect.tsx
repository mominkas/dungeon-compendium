import {Form} from "react-bootstrap";
import {useEffect, useState} from "react";

const SpeciesSelect = ({updateSpecies}) => {
    const [selectedAttrs, setSelectedAttrs] = useState([]);
    const speciesAttrs = [
        { id: "name", name: "Name" },
        { id: "description", name: "Description" },
        { id: "weight", name: "Weight" },
        { id: "height", name: "Height" },
        { id: "type", name: "Type" }
    ]

    const handleChange = (e) => {
        const attrId = e.target.value;

        setSelectedAttrs((prev) => {
            return prev.includes(attrId) ? prev.filter((id) => id !== attrId) : [...prev, attrId];
        });
    };

    useEffect(() => {
        updateSpecies(selectedAttrs);
    }, [selectedAttrs, updateSpecies]);

    return (
        <div className="d-flex justify-content-center align-content-center mt-5">
            <h6 className="custom-h6-label">Select columns</h6>
            <Form className="d-flex flex-row">
                {speciesAttrs.map((attr) => (
                    <Form.Check
                        type="checkbox"
                        id={attr.name}
                        label={attr.name}
                        checked={selectedAttrs.includes(attr.id)}
                        onChange={handleChange}
                        value={attr.id}
                    />
                ))}
            </Form>
        </div>
    );
};

export default SpeciesSelect;
