import {Button, Form} from "react-bootstrap";
import {useEffect, useState} from "react";

const ClassDescProject = ({updateDesc, triggerReload, setTriggerReload}) => {
    const [selectedAttrs, setSelectedAttrs] = useState([]);
    const classDescAttrs = [
        { id: "name", name: "Name" },
        { id: "description", name: "Description" },
        { id: "primary_ability", name: "Primary Ability" },
        { id: "weapon_proficiency", name: "Weapon Proficiency" },
        { id: "armor_proficiency", name: "Armor Proficiency" },
        { id: "hit_die", name: "Hit Die" },
        { id: "saving_throw_proficiency", name: "Saving Throw Proficiency" }
    ]; // id/name setup: https://www.geeksforgeeks.org/how-to-use-multi-select-dropdown-in-react-bootstrap/

    const handleChange = (e) => {
        const attrId = e.target.value;

        setSelectedAttrs((prev) => {
            return prev.includes(attrId) ? prev.filter((id) => id !== attrId) : [...prev, attrId];
        });
    };

    const handleSelectAll = (e) => {
        e.preventDefault();
        setSelectedAttrs(classDescAttrs.map(attr => attr.id));
    }

    const handleDeselectAll = (e) => {
        e.preventDefault();
        setSelectedAttrs([]);
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        fetchData();
        updateDesc(selectedAttrs);
    }

    const fetchData = async () => {
        try {
            const response = await fetch(`http://localhost:5001/class_description/projection`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ attributes: selectedAttrs }),
            });

            if (response.ok) {
                const data = await response.json();
                updateDesc(data);
                setTriggerReload(false);
            }
        } catch (err) {
            console.error("Error fetching class descriptions:", err);
            updateDesc([]);
        }
    };

    useEffect(() => {
        fetchData();
    }, [triggerReload]);

    return (
        <div className="flex-column justify-content-start align-content-start align-items-start mt-3">
            <div className="d-flex justify-content-center align-items-center">
                <h6 className="custom-h6-label">Select columns to view</h6>
                <Form className="d-flex flex-row">
                    {classDescAttrs.map((attr) => (
                        <Form.Check
                            key={attr.id}
                            type="checkbox"
                            id={attr.id}
                            label={attr.name}
                            checked={selectedAttrs.includes(attr.id)}
                            onChange={handleChange}
                            value={attr.id}
                        />
                    ))}
                </Form>
            </div>
            <div className="d-flex justify-content-end mt-3">
                <Button
                    className="mr-2"
                    variant="secondary"
                    onClick={handleSelectAll}>
                    Select All
                </Button>
                <Button
                    className="mr-2"
                    variant="secondary"
                    onClick={handleDeselectAll}>
                    Deselect All
                </Button>
                <Button
                    className="mr-2"
                    onClick={handleSubmit}>
                    View
                </Button>
            </div>
        </div>

    );
};

export default ClassDescProject;
