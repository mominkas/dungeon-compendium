import {useEffect, useState} from 'react';
import ClassInput from "../components/ClassInput.tsx";
import {Alert, Navbar, NavItem, Table} from "react-bootstrap";
import { Routes, Route, Link, useLocation  } from "react-router-dom";
import ClassDescription from "../components/ClassDescription.tsx";
import ClassLevelFeatures from "../components/ClassLevelFeatures.tsx";

const ClassPage = () => {
    const [classes, setClasses] = useState([]);
    const [showAlert, setShowAlert] = useState(false);
    const [alertVariant, setAlertVariant] = useState("");
    const [alertMessage, setAlertMessage] = useState("");
    const [triggerReload, setTriggerReload] = useState(true);

    const alertTimeout = () => {
        setShowAlert(true);
        setTimeout(() => {
            setShowAlert(false);
        }, 3000);
    }

    const onInputSuccess = (name, level) => {
        const successMessage = `Added ${name} ${level}.`;
        setAlertMessage(successMessage);
        setAlertVariant("success");
        alertTimeout();
    }

    const onInputFailure = (name, level, err) => {
        const failureMessage = `Failed to add ${name} ${level}. Error: ${err}.`;
        setAlertMessage(failureMessage);
        setAlertVariant("danger");
        alertTimeout();
    }

    const fetchData = async () => {
        try {
            const response = await fetch('http://localhost:5001/class');
            const data = await response.json();

            setClasses(data);
            setTriggerReload(false);
        } catch (err) {
            console.error("Error fetching classes: ", err);
        }
    }

    useEffect(() => {
        fetchData();
    }, [triggerReload]);

    const location = useLocation();
    const isDescOrLevel = location.pathname.includes("descriptions") || location.pathname.includes("level_features");

    return (
        <>
            <h1>🏛️ D&D Classes 🏛️</h1>
            <Navbar className="d-flex flex-row justify-content-evenly">
                <NavItem className="list-group-item"><Link to="/classes">Classes</Link></NavItem>
                <NavItem className="list-group-item"><Link to="/classes/descriptions">Descriptions</Link></NavItem>
                <NavItem className="list-group-item"><Link to="/classes/level_features">Level Features</Link></NavItem>
            </Navbar>
            <Routes>
                <Route path="descriptions" element={<ClassDescription/>}/>
                <Route
                    path="level_features"
                    element={<ClassLevelFeatures setTriggerReload={setTriggerReload}/>}
                />
            </Routes>
            {!isDescOrLevel && <div>
                <ClassInput
                    onSuccess={onInputSuccess}
                    onFailure={onInputFailure}
                    updateClasses={fetchData}
                />
                <Table className="mt-5">
                    <thead>
                    <tr>
                        <th>Name</th>
                        <th>Level</th>
                    </tr>
                    </thead>
                    <tbody>
                    {classes.length > 0 ? (
                        classes.map((item) => (
                            <tr key={[item.name, item.level]}>
                                <td>{item.name}</td>
                                <td>{item.level}</td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="3">No classes available. Please add a class!</td>
                        </tr>
                    )}
                    </tbody>
                </Table>
                {showAlert &&
                    <Alert
                        show={showAlert}
                        variant={alertVariant}
                        style={{position:'fixed', left:'50%', bottom:'50px', transform:'translateX(-50%)'}}
                    >
                        {alertMessage}
                </Alert>}
            </div>}
        </>
    );
};

export default ClassPage;
