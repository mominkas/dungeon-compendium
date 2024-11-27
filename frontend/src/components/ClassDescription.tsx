import {useState} from "react";
import {Alert, Table} from "react-bootstrap";
import ClassDescProject from "./ClassDescProject.tsx";
import ClassDescInput from "./ClassDescInput.tsx";

const ClassDescription = () => {
    const [desc, setDesc] = useState([]);
    const [showAlert, setShowAlert] = useState(false);
    const [alertVariant, setAlertVariant] = useState("");
    const [alertMessage, setAlertMessage] = useState("");
    const[triggerReload, setTriggerReload] = useState(false);
    const classDescAttrs = [
        { id: "name", name: "Name" },
        { id: "description", name: "Description" },
        { id: "primary_ability", name: "Primary Ability" },
        { id: "weapon_proficiency", name: "Weapon Proficiency" },
        { id: "armor_proficiency", name: "Armor Proficiency" },
        { id: "hit_die", name: "Hit Die" },
        { id: "saving_throw_proficiency", name: "Saving Throw Proficiency" }
    ];

    const alertTimeout = () => {
        setShowAlert(true);
        setTimeout(() => {
            setShowAlert(false);
        }, 3000);
    }

    const onInputSuccess = (name) => {
        const successMessage = `Added description for ${name}.`;
        setAlertMessage(successMessage);
        setAlertVariant("success");
        alertTimeout();
        setTriggerReload(true);
    }

    const onInputFailure = (name, err) => {
        const failureMessage = `Failed to add description for ${name}. Error: ${err}.`;
        setAlertMessage(failureMessage);
        setAlertVariant("danger");
        alertTimeout();
    }

    return (
        <>
            <ClassDescInput
                onSuccess={onInputSuccess}
                onFailure={onInputFailure}
            />
            <ClassDescProject
                updateDesc={setDesc}
                triggerReload={triggerReload}
                setTriggerReload={setTriggerReload}
            />
            <Table className="mt-5">
                <thead>
                <tr>
                    {classDescAttrs.map((attr) => (
                        <th key={attr.id}>{attr.name}</th>
                    ))}
                </tr>
                </thead>
                <tbody>
                {desc.length > 0 ? (
                    desc.map((item) => (
                        <tr key={item.name}>
                            {classDescAttrs.map((attr) =>
                                <td key={attr.id}>{item[attr.id] || ""}</td>
                            )}
                        </tr>
                    ))
                ) : (
                    <tr>
                        <td colSpan={classDescAttrs.length}>No columns selected. Please select columns to view!</td>
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
        </>
    );
};

export default ClassDescription;
