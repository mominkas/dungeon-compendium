import {useEffect, useState} from "react";
import {Alert, Table} from "react-bootstrap";

const ClassLevelFeatures = ({setTriggerReload}) => {
    const [desc, setDesc] = useState([]);
    const [showAlert, setShowAlert] = useState(false);
    const [alertVariant, setAlertVariant] = useState("secondary");
    const [alertMessage, setAlertMessage] = useState("");

    const alertTimeout = () => {
        setShowAlert(true);
        setTimeout(() => {
            setShowAlert(false);
        }, 2000);
    }

    const onDeleteSuccess = (level) => {
        const successMessage = `SUCCESS! Deleted Level ${level}`;
        setAlertMessage(successMessage);
        setAlertVariant("success");
        alertTimeout();
    }

    const onDeleteFailure = (level, err) => {
        const failureMessage = `WARNING! Failed to delete Level ${level} Error: ${err}`;
        setAlertMessage(failureMessage);
        setAlertVariant("danger");
        alertTimeout();
    }

    const deleteLevelFeatures = async (level) => {
        try {
            await fetch(`http://localhost:5001/class_level_features/${level}` , {
                method: "DELETE"
            });
            setDesc(desc.filter((item) => item.level !== level));
            onDeleteSuccess(level);
            setTriggerReload(true);
        } catch (err) {
            console.error("Error deleting class: ", err);
            onDeleteFailure(level, err);
        }
    }

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('http://localhost:5001/class_level_features');
                const data = await response.json();

                setDesc(data);
                console.log(data);
            } catch (error) {
                console.error("Error fetching class level features:", error);
            }
        }
        fetchData();
    }, []);

    return (
        <>
            <Table className="table mt-5 text-center">
                <thead>
                <tr>
                    <th>Level</th>
                    <th>Num Hit Die</th>
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
                                            onClick={() => deleteLevelFeatures(item.level)}>
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
        </>
    );
};

export default ClassLevelFeatures;
