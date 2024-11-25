import {Button, Form, Table} from "react-bootstrap";
import {useState} from "react";
import { TbTrash } from "react-icons/tb";


const SpeciesSelect = ({onSuccess, onFailure, updateSpecies}) => {
    const validAttrs = ["name", "description", "weight", "height", "type"];
    const validClauses = ["AND", "OR"];
    const attrOps = {
        name: ["like"],
        description: ["like"],
        weight: ["=", "<>", "<", ">", "<=", ">="],
        height: ["=", "<>", "<", ">", "<=", ">="],
        type: ["like"],
    };
    const attrPlaceholders = {
        name: "Text",
        description: "Text",
        weight: "Number",
        height: "Number",
        type: "Text",
    };
    const [conditions, setConditions] = useState([{ index: 0, attr: "", op: "", val: "" }]);
    const [clauses, setClauses] = useState([{ index: 0, val: ""}]);

    const handleCondition = (index, field, value) => {
        setConditions(prev =>
            prev.map(cond =>
                cond.index === index ? { ...cond, [field]: value } : cond
            )
        );
    }

    const handleClause = (index, field, value) => {
        setClauses(prev =>
            prev.map(cond =>
                cond.index === index ? { ...cond, [field]: value } : cond
            )
        );
    }

    const handleAdd = () => {
        const hiIndex = Math.max(...conditions.map(cond => cond.index)) + 1;
        setConditions(prev => [...prev, { index: hiIndex, attr: "", op: "", val: "" }]);
        setClauses(prev => [...prev, { index: hiIndex, val: "" }]);
    }

    const handleDelete = (index) => {
        setConditions(prev => prev.filter(cond => cond.index !== index));
        setClauses(prev => prev.filter(clause => clause.index !== index));
    }

    const handleReset = () => {
        setConditions([{ index: 0, attr: "", op: "", val: "" }]);
        setClauses([{ index: 0, val: ""}]);
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch(`http://localhost:5001/species`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({conditions: conditions, clauses: clauses})
            });

            if (response.ok) {
                const data = await response.json();
                onSuccess();
                updateSpecies(data);

            } else {
                const errorData = await response.json();
                onFailure(errorData.error);
            }
        } catch (err) {
            console.error("Error: ", err);
        }
    }

    return (
        <>
            <Table className="mt-5">
                <thead>
                <tr>
                    <th>Attribute</th>
                    <th>Operator</th>
                    <th>Input</th>
                    <th>Clause</th>
                    <th>Delete</th>
                </tr>
                </thead>
                <tbody>
                {conditions.map((cond) => {
                    const availableOps = attrOps[cond.attr] || [];
                    const placeholder = attrPlaceholders[cond.attr] || "";
                    return (
                        <tr className>
                            <td className="align-content-center">
                                <Form.Select
                                    value={cond.attr}
                                    onChange={(e) =>
                                        handleCondition(cond.index, "attr", e.target.value)}
                                >
                                    <option value="">Select an attribute</option>
                                    {validAttrs.map((attr) =>
                                        <option value={attr}>
                                            {attr}
                                        </option>)}
                                </Form.Select>
                            </td>
                            <td className="align-content-center">
                                <Form.Select
                                    value={cond.op}
                                    onChange={(e) =>
                                        handleCondition(cond.index, "op", e.target.value)}
                                >
                                    <option value="">Select an operator</option>
                                    {availableOps.map((op) =>
                                        <option value={op}>
                                            {op}
                                        </option>)}
                                </Form.Select>
                            </td>
                            <td className="align-content-center">
                                <Form.Control
                                    placeholder={placeholder}
                                    type="text"
                                    value={cond.val}
                                    onChange={(e) =>
                                        handleCondition(cond.index, "val", e.target.value)}
                                />
                            </td>
                            <td className="align-content-center">
                                <Form.Select
                                    onChange={(e) =>
                                        handleClause(cond.index, "val", e.target.value)}
                                >
                                    <option value="">Select a clause</option>
                                    {validClauses.map((clause) =>
                                        <option value={clause}>
                                            {clause}
                                        </option>)}
                                </Form.Select>
                            </td>
                            <td className="align-content-center">
                                <Button
                                    disabled={conditions.length === 1}
                                    className="custom-icon-btn" variant="danger"
                                    onClick={() => (handleDelete(cond.index))}>
                                    <TbTrash />
                                </Button>
                            </td>
                        </tr>
                    );
                })}
                </tbody>
            </Table>
            <div className="d-flex justify-content-between align-items-center">
                <Button
                    className="custom-icon-btn"
                    variant="success"
                    onClick={handleAdd}>
                    Add a condition
                </Button>
                <div className="small">
                    Note: Text inputs are case-sensitive and can accept <a href="https://www.postgresql.org/docs/7.3/functions-matching.html">wildcards</a>.
                </div>
                <Button variant="secondary" onClick={handleReset}>Reset</Button>
                <Button onClick={handleSubmit}>Search</Button>
            </div>
        </>
    );
};

export default SpeciesSelect;
