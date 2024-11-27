import {useEffect, useState} from "react";
import {Card, Table} from "react-bootstrap";


export interface MasterClassEntry {
    name: string | null;
    location: string | null;
    experience_level: string | null;
}

interface PopularSpeciesEntry {
    name: string;
    count: number;
}

interface ClassyCharactersEntry {
    name: string;
    avg: number;
}

const HomePage = () => {
    const [masterClass, setMasterClass] = useState<MasterClassEntry[]>([])
    const [popularSpecies, setPopularSpecies] = useState<PopularSpeciesEntry[]>([])
    const [classyCharacters, setClassyCharacters] = useState<ClassyCharactersEntry[]>([])

    const fetchMasterClass = async () => {
        try {
            const response = await fetch(`http://localhost:5001/users/allClassesPlayers`);
            const data = await response.json();

            console.log(data);
            setMasterClass(data);
        } catch (err) {
            console.log("Errored:", err);
        }
    }

    const fetchPopularSpecies = async () => {
        try {
            const response = await fetch(`http://localhost:5001/species/popularSpecies`);
            const data = await response.json();

            console.log(data);
            setPopularSpecies(data);
        } catch (err) {
            console.log("Errored:", err);
        }
    }

    const fetchClassyCharacters = async () => {
        try {
            const response = await fetch(`http://localhost:5001/class/classyCharacters`);
            const data = await response.json();

            console.log(data);
            setClassyCharacters(data);
        } catch (err) {
            console.log("Errored:", err);
        }
    }

    useEffect(() => {
        fetchMasterClass();
        fetchPopularSpecies();
        fetchClassyCharacters();
    }, [])

    return (
        <>
            <h1>⚔️ Welcome to our DND Database ⚔️</h1>

            <Card className="mt-5">
                <Card.Body>
                    <Card.Title>🏆 Master Class 🏆</Card.Title>
                    Players who have played as all classes!
                    {masterClass.length === 0 &&
                        <h4>Wow y'all suck! Get better!</h4>
                    }

                    {masterClass.length > 0 &&
                        <Table>
                            <thead>
                            <tr>
                                <th>Player Name</th>
                                <th>Location</th>
                                <th>XP Level</th>
                            </tr>
                            </thead>
                            <tbody>
                            {masterClass.length > 0 && masterClass.map((entry: MasterClassEntry) => (
                                <tr key={entry.name}>
                                    <td>{entry.name}</td>
                                    <td>{entry.location}</td>
                                    <td>{entry.experience_level}</td>
                                </tr>
                            ))}
                            </tbody>
                        </Table>}
                </Card.Body>
            </Card>

            <Card className="mt-5">
                <Card.Body>
                    <Card.Title>💁‍♀️ Popular Species 💁‍♀️</Card.Title>
                    Species with the most characters!

                    {popularSpecies.length > 0 &&
                        <Table>
                            <thead>
                            <tr>
                                <th>Species Name</th>
                                <th>Total # Characters</th>
                            </tr>
                            </thead>
                            <tbody>
                            {popularSpecies.length > 0 && popularSpecies.map((entry: PopularSpeciesEntry) => (
                                <tr key={entry.name}>
                                    <td>{entry.name}</td>
                                    <td>{entry.count}</td>
                                </tr>
                            ))}
                            </tbody>
                        </Table>}
                </Card.Body>
            </Card>

            <Card className="mt-5">
                <Card.Body>
                    <Card.Title>🍷 Classy Characters 🍷</Card.Title>
                    Players with an average character level greater than 2! Super classy.

                    {classyCharacters.length > 0 &&
                        <Table>
                            <thead>
                            <tr>
                                <th>Player Name</th>
                                <th>Average Character Level</th>
                            </tr>
                            </thead>
                            <tbody>
                            {classyCharacters.length > 0 && classyCharacters.map((entry: ClassyCharactersEntry) => (
                                <tr key={entry.name}>
                                    <td>{entry.name}</td>
                                    <td>{Number(entry.avg).toFixed(2)}</td>
                                </tr>
                            ))}
                            </tbody>
                        </Table>}
                </Card.Body>
            </Card>
        </>
    )
}

export default HomePage;