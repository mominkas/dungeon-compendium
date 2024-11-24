import { useEffect, useState } from "react";
import { Table } from "react-bootstrap";
import SpeciesSelect from "../components/SpeciesSelect.tsx";

const SpeciesPage = () => {
    const [species, setSpecies] = useState([]);
    const [selectedAttrs, setSelectedAttrs] = useState([]);
    const speciesAttrs = [
        { id: "name", name: "Name" },
        { id: "description", name: "Description" },
        { id: "weight", name: "Weight" },
        { id: "height", name: "Height" },
        { id: "type", name: "Type" }
    ];

    const fetchData = async (selectedAttrs) => {
        try {
            const response = await fetch(`http://localhost:5001/species/projection`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ attributes: selectedAttrs }),
            });

            if (response.ok) {
                const data = await response.json();
                setSpecies(data);
            }
        } catch (error) {
            console.error("Error fetching species:", error);
            setSpecies([]);
        }
    };

    useEffect(() => {
        fetchData(selectedAttrs);
    }, [selectedAttrs]);

    return (
        <>
            <h1>🐉️ D&D Species 🐉</h1>
            <SpeciesSelect updateSpecies={setSelectedAttrs} />
            <Table className="mt-5">
                <thead>
                <tr>
                    {speciesAttrs.map((attr) => (
                        <th key={attr.id}>{attr.name}</th>
                    ))}
                </tr>
                </thead>
                <tbody>
                {species.length > 0 ? (
                    species.map((item) => (
                        <tr key={item.name}>
                            {speciesAttrs.map((attr) =>
                                    <td key={attr.id}>{item[attr.id] || ""}</td>
                            )}
                        </tr>
                    ))
                ) : (
                    <tr>
                        <td colSpan={speciesAttrs.length}>No columns selected.</td>
                    </tr>
                )}
                </tbody>
            </Table>
        </>
    );
};

export default SpeciesPage;
