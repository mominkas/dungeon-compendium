import {useState} from 'react';
import {Button, Form, FormControl} from "react-bootstrap";

const ClassInput = ({ onSuccess, onFailure, updateClasses }) => {
    const [form, setForm] = useState({
        name: "",
        level: ""
    });

    const handleChange = (e) => {
        setForm({
          ...form,
          [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch(`http://localhost:5001/class`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form)
            });
            if (response.ok) {
                onSuccess(form.name, form.level);
                updateClasses();
                setForm({
                    name: "",
                    level: ""
                });
            } else {
                const errorData = await response.json();
                onFailure(form.name, form.level, errorData.error);
            }
        } catch (err) {
            console.error("Error inputting class: ", err);
        }
    };

    const canSubmit = form.name && form.level;

    return (
        <div className="d-flex justify-content-center align-content-center">
            <h6 className="custom-h6-label">Add a class</h6>
            <Form
                className="d-flex justify-content-center"
                onSubmit={handleSubmit}
            >
                <FormControl
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Name"
                />
               <FormControl
                    type="text"
                    name="level"
                    value={form.level}
                    onChange={handleChange}
                    placeholder="Level"
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

export default ClassInput;
