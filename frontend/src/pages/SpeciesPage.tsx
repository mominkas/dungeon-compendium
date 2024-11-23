import {useEffect, useState} from "react";
import {Table} from "react-bootstrap";

const SpeciesPage = () => {
    const [species, setSpecies] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('http://localhost:5001/species');
                const data = await response.json();

                setSpecies(data);
            } catch (error) {
                console.error("Error fetching species:", error);
            }
        }
        fetchData();
    }, []);

    return (
        <>
            <h1>🐉️ D&D Species 🐉</h1>
            <Table className="table mt-5 text-center">
                <thead>
                <tr>
                    <th>Name</th>
                    <th>Description</th>
                    <th>Weight</th>
                    <th>Height</th>
                    <th>Type</th>
                </tr>
                </thead>
                <tbody>
                {species.map((item) => (
                    <tr key={item.name}>
                        <td>{item.name}</td>
                        <td>{item.description}</td>
                        <td>{item.weight}</td>
                        <td>{item.height}</td>
                        <td>{item.type}</td>
                    </tr>))
                }
                </tbody>
            </Table>
        </>
    );
};

export default SpeciesPage;
