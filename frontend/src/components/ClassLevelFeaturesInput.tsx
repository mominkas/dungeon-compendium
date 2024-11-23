import {useState} from 'react';
import {Button, Form, FormControl} from "react-bootstrap";

const ClassLevelFeaturesInput = ({ onSuccess, onFailure, updateClassLevelFeatures }) => {
    const [form, setForm] = useState({
        level: "",
        num_hit_die: "",
        advantage_effect: "",
        modifier_effect: ""
    })

    const handleChange = (e) => {
        setForm({
          ...form,
          [e.target.name]: e.target.value
        });
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch(`http://localhost:5001/class_level_features`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form)
            });
            if (response.ok) {
                onSuccess(form.level);
                updateClassLevelFeatures();
                setForm({
                    level: "",
                    num_hit_die: "",
                    advantage_effect: "",
                    modifier_effect: ""
                });
            } else {
                const errorData = await response.json();
                onFailure(form.level, errorData.error);
            }
        } catch (err) {
            console.error("Error inputting class: ", err);
        }
    };

    const canSubmit = form.level && form.num_hit_die && form.advantage_effect && form.modifier_effect;

    return (
        <div className="d-flex justify-content-center align-content-center">
            <h6 className="custom-h6-label">Add a level</h6>
            <Form
                className="d-flex justify-content-center"
                onSubmit={handleSubmit}
            >
               <FormControl
                    type="text"
                    name="level"
                    value={form.level}
                    onChange={handleChange}
                    placeholder="Level"
                />
                <FormControl
                    type="text"
                    name="num_hit_die"
                    value={form.num_hit_die}
                    onChange={handleChange}
                    placeholder="Number of hit die"
                />
                <FormControl
                    type="text"
                    name="advantage_effect"
                    value={form.advantage_effect}
                    onChange={handleChange}
                    placeholder="Advantage effect"
                />
                <FormControl
                    type="text"
                    name="modifier_effect"
                    value={form.modifier_effect}
                    onChange={handleChange}
                    placeholder="Modifier effect"
                />
                <Button
                    className="btn btn-success custom-add-btn"
                    type="submit"
                    disabled={!canSubmit}>
                    Add
                </Button>
            </Form>
        </div>
    );
};

export default ClassLevelFeaturesInput;
