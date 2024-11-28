import {useState} from 'react';
import {Button, Col, Form, FormControl, Row} from "react-bootstrap";
import { MdAdd } from "react-icons/md";

const ClassDescInput = ({ onSuccess, onFailure }) => {
    const [form, setForm] = useState({
        name: "",
        description: "",
        primary_ability: "",
        weapon_proficiency: "",
        armor_proficiency: "",
        hit_die: "",
        saving_throw_proficiency: "",
    });
    const classDescAttrs = [
        { id: "name", name: "Name" },
        { id: "description", name: "Description (optional)" },
        { id: "primary_ability", name: "Primary Ability" },
        { id: "weapon_proficiency", name: "Weapon Proficiency" },
        { id: "armor_proficiency", name: "Armor Proficiency" },
        { id: "hit_die", name: "Hit Die" },
        { id: "saving_throw_proficiency", name: "Saving Throw Proficiency" }
    ];

    const handleChange = (e) => {
        setForm({
          ...form,
          [e.target.name]: e.target.value
        });
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch(`http://localhost:5001/class_description/insert`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form)
            });
            if (response.ok) {
                onSuccess(form.name);
                setForm({
                    name: "",
                    description: "",
                    primary_ability: "",
                    weapon_proficiency: "",
                    armor_proficiency: "",
                    hit_die: "",
                    saving_throw_proficiency: "",
                });
            } else {
                const errorData = await response.json();
                onFailure(form.name, errorData.error);
            }
        } catch (err) {
            console.error("Error inputting class description: ", err);
        }
    };

    const canSubmit = form.name && form.primary_ability && form.weapon_proficiency && form.armor_proficiency && form.hit_die && form.saving_throw_proficiency;

    return (
        <div className="d-flex justify-content-center align-items-center mt-3">
            <Form
                className="d-flex flex-row align-items-center"
                onSubmit={handleSubmit}
            >
            <h6 className="custom-h6-label">Add a description</h6>
                <div>
                    <Row className="mb-2">
                        {classDescAttrs.slice(0, 3).map((item) => (
                            <Col md={4} key={item.id}>
                                <FormControl
                                    type="text"
                                    name={item.id}
                                    value={form[item.id]}
                                    onChange={handleChange}
                                    placeholder={item.name}
                                />
                            </Col>
                        ))}
                    </Row>
                    <Row>
                        {classDescAttrs.slice(3).map((item) => (
                            <Col md={3} key={item.id} className="mb-2">
                                <FormControl
                                    type="text"
                                    name={item.id}
                                    value={form[item.id]}
                                    onChange={handleChange}
                                    placeholder={item.name}
                                />
                            </Col>
                        ))}
                    </Row>
                </div>
                <div className="text-center ml-2">
                    <Button
                        className="btn btn-success custom-icon-btn"
                        type="submit"
                        disabled={!canSubmit}
                    >
                        <MdAdd/>
                    </Button>
                </div>
            </Form>
        </div>
    );
};

export default ClassDescInput;
