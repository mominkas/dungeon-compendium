import {useState} from 'react';
import {Button, Form, FormControl} from "react-bootstrap";

const ClassInput = ({ onSuccess, onFailure, updateClasses }) => {
    const [name, setName] = useState("");
    const [level, setLevel] = useState("");

    const handleSubmit = async e => {
        e.preventDefault();

        if (isNaN(Number(level)) || level.trim() === "") {
            onFailure(name, level, "Level must be a valid number.");
            return;
        }

        try {
            const response = await fetch(`http://localhost:5001/class`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({name, level})
            });

            if (response.ok) {
                onSuccess(name, level);
                updateClasses();
            } else {
                const errorData = await response.json();
                onFailure(name, level, errorData.error);
            }
        } catch (err) {
            console.error("Error inputting class: ", err);
        }
        setName("");
        setLevel("");
    };

    const canSubmit = !name || !level;

    return (
        <div className="d-flex justify-content-center">
            <h6 className="m-2">Add a class</h6>
            <Form
                className="d-flex justify-content-center"
                onSubmit={handleSubmit}
            >
                <FormControl
                    type="text"
                    value={name}
                    onChange={e=> setName(e.target.value)}
                    placeholder="Name"
                />
               <FormControl
                    type="text"
                    value={level}
                    onChange={e => setLevel(e.target.value)}
                    placeholder="Level"
                />
                <Button
                    className="btn btn-success"
                    type="submit"
                    disabled={canSubmit}>
                    Add
                </Button>
            </Form>
        </div>
    );
};

export default ClassInput;
