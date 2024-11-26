import {useState} from "react";
import {Table} from "react-bootstrap";
import ClassDescProject from "./ClassDescProject.tsx";

const ClassDescription = () => {
    const [desc, setDesc] = useState([]);
    const classDescAttrs = [
        { id: "name", name: "Name" },
        { id: "description", name: "Description" },
        { id: "primary_ability", name: "Primary Ability" },
        { id: "weapon_proficiency", name: "Weapon Proficiency" },
        { id: "armor_proficiency", name: "Armor Proficiency" },
        { id: "hit_die", name: "Hit Die" },
        { id: "saving_throw_proficiency", name: "Saving Throw Proficiency" }
    ];

    return (
        <>
            <ClassDescProject updateDesc={setDesc} />
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
        </>
    );
};

export default ClassDescription;
