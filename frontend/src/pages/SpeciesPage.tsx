import { useState } from "react";
import {Alert, Table} from "react-bootstrap";
import SpeciesSelect from "../components/SpeciesSelect.tsx";

const SpeciesPage = () => {
    const [species, setSpecies] = useState([]);
    const [showAlert, setShowAlert] = useState(false);
    const [alertVariant, setAlertVariant] = useState("");
    const [alertMessage, setAlertMessage] = useState("");

    const alertTimeout = () => {
        setShowAlert(true);
        setTimeout(() => {
            setShowAlert(false);
        }, 3000);
    }

    const onSuccess = () => {
        setAlertMessage("Loaded search results.");
        setAlertVariant("success");
        alertTimeout();
    }

    const onFailure = (err) => {
        const failureMessage = `Error: ${err}.`;
        setAlertMessage(failureMessage);
        setAlertVariant("danger");
        alertTimeout();
    }

    return (
        <>
            <h1>🐉️ D&D Species 🐉</h1>
            <SpeciesSelect
                onSuccess={onSuccess}
                onFailure={onFailure}
                updateSpecies={setSpecies}
            />
            <Table className="mt-3">
                <thead>
                <tr>
                    <th>Name</th>
                    <th>Description</th>
                    <th>Weight (kg)</th>
                    <th>Height (cm)</th>
                    <th>Type</th>
                </tr>
                </thead>
                <tbody>
                {species.length > 0 ? (
                    species.map((item) => (
                        <tr key={item.name}>
                            <td>{item.name}</td>
                            <td>{item.description}</td>
                            <td>{item.weight}</td>
                            <td>{item.height}</td>
                            <td>{item.type}</td>
                        </tr>
                    ))
                ) : (
                    <tr>
                        <td colSpan={5}>No species results from your search. Please try again!</td>
                    </tr>
                )}
                </tbody>
            </Table>
            {showAlert && <Alert
                show={showAlert}
                variant={alertVariant}>
                {alertMessage}
            </Alert>}
        </>
    );
};

export default SpeciesPage;
