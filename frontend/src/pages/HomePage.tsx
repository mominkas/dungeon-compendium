import {useEffect, useState} from "react";
import {Table} from "react-bootstrap";


export interface MasterClassEntry {
    name: string | null;
    location: string | null;
    experience_level: string | null;
}


const HomePage = () => {

    const [masterClass, setMasterClass] = useState<MasterClassEntry[]>([])
    const [triggerReload, setTriggerReload] = useState(true);

    const fetchData = async () => {
        try {
            const response = await fetch(`http://localhost:5001/users/allClassesPlayers`);
            const data = await response.json();

            console.log(data);
            setMasterClass(data);
            setTriggerReload(false);
        } catch (err) {
            console.log("Errored:", err);
        }
    }

    useEffect(() => {
        fetchData();
    }, [triggerReload])

    return (
        <>
            <h1>⚔️ Welcome to our DND Database ⚔️</h1>

            <h2> 🏆 Master Class 🏆</h2>
            Players who have played as all classes!

            {masterClass.length === 0 &&
                <h4>Wow y'all suck! Get better!</h4>
            }

            {masterClass.length > 0 &&
                <Table>
                    <thead>
                    <tr>
                        <th>Name</th>
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


        </>
    )
}

export default HomePage;