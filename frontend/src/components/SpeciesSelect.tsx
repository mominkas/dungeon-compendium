import {Button, Form, Table} from "react-bootstrap";

const SpeciesSelect = ({}) => {
    const validAttrs = ["name", "description", "weight", "height", "type"];
    const validOps = ["=", "<>", "<", ">", "<=", ">=", "like"];
    const validClauses = ["AND", "OR"];

    return (
        <>
            <Table className="mt-5">
                <thead>
                <tr>
                    <th>Attribute</th>
                    <th>Operator</th>
                    <th>Input</th>
                    <th>Clause</th>
                    <th>Add</th>
                    <th>Remove</th>
                </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>
                            <Form.Select>
                                <option>Select an attribute</option>
                                {validAttrs.map((attr) =>
                                    <option value={attr}>
                                        {attr}
                                    </option>)}
                            </Form.Select>
                        </td>
                        <td>
                            <Form.Select>
                                <option>Select an attribute</option>
                                {validOps.map((attr) =>
                                    <option value={attr}>
                                        {attr}
                                    </option>)}
                            </Form.Select>
                        </td>
                        <td>
                            <Form.Control
                                type="text"
                            />
                        </td>
                        <td>
                            <Form.Select>
                                <option>Select an attribute</option>
                                {validClauses.map((attr) =>
                                    <option value={attr}>
                                        {attr}
                                    </option>)}
                            </Form.Select>
                        </td>
                        <td>
                            <Button variant="success">+</Button>
                        </td>
                        <td>
                            <Button variant="danger">-</Button>
                        </td>
                    </tr>
                </tbody>
            </Table>
            <div className="d-flex justify-content-end">
                <Button>Submit</Button>
            </div>
        </>
    );
};

export default SpeciesSelect;
