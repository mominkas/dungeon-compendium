import { useEffect, useState } from "react";
import { Table } from "react-bootstrap";
import SpeciesSelect from "../components/SpeciesSelect.tsx";

const SpeciesPage = () => {
    const [species, setSpecies] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`http://localhost:5001/species`);

                if (response.ok) {
                    const data = await response.json();
                    setSpecies(data);
                }
            } catch (error) {
                console.error("Error fetching species:", error);
                setSpecies([]);
            }
        }
        fetchData();
    }, []);

    return (
        <>
            <h1>🐉️ D&D Species 🐉</h1>
            <SpeciesSelect/>
            <Table className="mt-3">
                <thead>
                <tr>
                    <th>Name</th>
                    <th>Description</th>
                    <th>Weight (lbs)</th>
                    <th>Height</th>
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
                        <td colSpan="5">No species from your search. Please try again!</td>
                    </tr>
                )}
                </tbody>
            </Table>
        </>
    );
};

export default SpeciesPage;
