import {useEffect, useState} from "react";
import {Table} from "react-bootstrap";

const ClassDescription = () => {
    const [desc, setDesc] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('http://localhost:5001/class_description');
                const data = await response.json();

                setDesc(data);
                console.log(data);
            } catch (error) {
                console.error("Error fetching class descriptions:", error);
            }
        }
        fetchData();
    }, []);

    return (
        <>
            <Table className="table mt-5 text-center">
                <thead>
                <tr>
                    <th>Name</th>
                    <th>Description</th>
                    <th>Primary Ability</th>
                    <th>Weapon Proficiency</th>
                    <th>Armor Proficiency</th>
                    <th>Hit Die</th>
                    <th>Saving Throw Proficiency</th>
                </tr>
                </thead>
                <tbody>
                {desc.map((item) => (
                    <tr key={item.name}>
                        <td>{item.name}</td>
                        <td>{item.description}</td>
                        <td>{item.primary_ability}</td>
                        <td>{item.weapon_proficiency}</td>
                        <td>{item.armor_proficiency}</td>
                        <td>{item.hit_die}</td>
                        <td>{item.saving_throw_proficiency}</td>
                    </tr>))
                }
                </tbody>
            </Table>
        </>
    );
};

export default ClassDescription;
