import {useEffect, useState} from "react";
import {Alert, Button, Modal, Table} from "react-bootstrap";
import ClassLevelFeaturesInput from "./ClassLevelFeaturesInput.tsx";

const ClassLevelFeatures = ({setTriggerReload}) => {
    const [desc, setDesc] = useState([]);
    const [level, setLevel] = useState(null);
    const [showAlert, setShowAlert] = useState(false);
    const [alertVariant, setAlertVariant] = useState("");
    const [alertMessage, setAlertMessage] = useState("");
    const [showModal, setShowModal] = useState(false);

    const alertTimeout = () => {
        setShowAlert(true);
        setTimeout(() => {
            setShowAlert(false);
        }, 3000);
    }

    const onInputSuccess = (level) => {
        const successMessage = `Added Level ${level}.`;
        setAlertMessage(successMessage);
        setAlertVariant("success");
        alertTimeout();
    }

    const onInputFailure = (level, err) => {
        const failureMessage = `Failed to add Level ${level}. Error: ${err}.`;
        setAlertMessage(failureMessage);
        setAlertVariant("danger");
        alertTimeout();
    }

    const onDeleteSuccess = (level) => {
        const successMessage = `Deleted Level ${level}`;
        setAlertMessage(successMessage);
        setAlertVariant("success");
        alertTimeout();
    }

    const onDeleteFailure = (level, err) => {
        const failureMessage = `Failed to delete Level ${level} Error: ${err}`;
        setAlertMessage(failureMessage);
        setAlertVariant("danger");
        alertTimeout();
    }

    const handleDelete = (level) => {
        setLevel(level);
        setShowModal(true);
    }

    const handleCloseModal = () => {
        setLevel(null);
        setShowModal(false);
    }

    const deleteLevelFeatures = async () => {
        try {
            await fetch(`http://localhost:5001/class_level_features/${level}` , {
                method: "DELETE"
            });
            setDesc(desc.filter((item) => item.level !== level));
            onDeleteSuccess(level);
            setLevel(null);
            setShowModal(false);
            setTriggerReload(true);
        } catch (err) {
            console.error("Error deleting class: ", err);
            onDeleteFailure(level, err);
        }
    }

    const fetchData = async () => {
        try {
            const response = await fetch('http://localhost:5001/class_level_features');
            const data = await response.json();

            setDesc(data);
        } catch (error) {
            console.error("Error fetching class level features:", error);
        }
    }

    useEffect(() => {
        fetchData();
    }, []);

    return (
        <>
            <ClassLevelFeaturesInput
                onSuccess={onInputSuccess}
                onFailure={onInputFailure}
                updateClassLevelFeatures={fetchData}
            />
            <Table className="mt-5">
                <thead>
                <tr>
                    <th>Level</th>
                    <th>Number of Hit Die</th>
                    <th>Advantage Effect</th>
                    <th>Modifier Effect</th>
                    <th>Delete</th>
                </tr>
                </thead>
                <tbody>
                    {desc.length > 0 ? (
                        desc.map((item) => (
                                <tr key={item.level}>
                                    <td>{item.level}</td>
                                    <td>{item.num_hit_die}</td>
                                    <td>{item.advantage_effect}</td>
                                    <td>{item.modifier_effect}</td>
                                    <td>
                                        <button
                                            className='btn btn-danger'
                                            onClick={() => handleDelete(item.level)}>
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))
                    ) : (
                        <tr>
                            <td colSpan="5">No class descriptions available.</td>
                        </tr>
                    )}
                </tbody>
            </Table>
            {showAlert && <Alert
                show={showAlert}
                variant={alertVariant}>
                {alertMessage}
            </Alert>}
            <Modal show={showModal}>
                <Modal.Header>
                    <Modal.Title>Delete Class Level Feature</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    Are you sure you want to delete features for Level {level}?
                    Deleting features here will delete Classes and Characters associated with Level {level}.
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseModal}>
                        No
                    </Button>
                    <Button variant="primary" onClick={deleteLevelFeatures}>
                        Yes, delete
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
};

export default ClassLevelFeatures;
