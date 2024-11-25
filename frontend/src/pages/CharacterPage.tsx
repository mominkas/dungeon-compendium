import {useEffect, useState} from "react";
import {Button, Modal, Stack, Table} from "react-bootstrap";
import {Link} from "react-router-dom";


export interface Character {
    character_id: number;       // PK
    name: string;
    level: number;
    hp: number;
    class_name: string;         // FK
    species_name: string;       // FK
    participant_id: number;     // FK
    hair_color: string | null;
    eye_color: string | null;
    position: string | null;
}

const CharacterPage = () => {

    const [characters, setCharacters] = useState<Character[]>([]);
    const [selectedCharacter, setSelectedCharacter] = useState<Character | null>(null);
    const [showSelCharacterModal, setShowSelCharacterModal] = useState(false);
    const [showAddCharacterModal, setShowAddCharacterModal] = useState(false);
    // const [showAlert, setShowAlert] = useState(false);
    // const [alertVariant, setAlertVariant] = useState("");
    // const [alertMessage, setAlertMessage] = useState("");
    const [triggerReload, setTriggerReload] = useState(true);

    // const alertTimeout = () => {
    //     setShowAlert(true);
    //     setTimeout(() => {
    //         setShowAlert(false);
    //     }, 3000);
    // }


    const fetchData = async () => {
        try {
            const response = await fetch('http://localhost:5001/character');
            const data = await response.json();

            setCharacters(data);
            setTriggerReload(false);
        } catch (err) {
            console.error("Error fetching characters: ", err);
        }
    }

    const handleCloseCharacterModal = () => setShowSelCharacterModal(false);
    const handleShowCharacterModal = (e: React.MouseEvent, char: Character) => {
        e.preventDefault();
        setShowSelCharacterModal(true);
        setSelectedCharacter(char);
    }

    const handleCloseAddCharacterModal = () => setShowAddCharacterModal(false);
    const handleShowAddCharacterModal = () => {
        setShowAddCharacterModal(true);
    }

    const handleAddCharacterInput = () => {

    }

    useEffect(() => {
        fetchData();
    }, [triggerReload]);

    return (
        <>
            <Stack  gap={10}
                    direction={"vertical"}>
                <h1> 🧙 D&D Characters 🧙 </h1>
                <h5> Click on a character to discover more!</h5>

                <Button     variant={"primary"}
                            onClick={handleShowAddCharacterModal}>
                    Add a New Character!
                </Button>

                <Table>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Level</th>
                            <th>Class</th>
                            <th>Species</th>
                            <th>Played By</th>
                        </tr>
                    </thead>
                    <tbody>
                    {characters.length > 0 && characters.map((char: Character) => (
                        <tr key={char.character_id}>
                            <td>
                                <Link
                                    to={`/character/${char.character_id}`}
                                    onClick={(e) => handleShowCharacterModal(e, char)}
                                    style={{ textDecoration: 'none' }}
                                >
                                    {char.name}
                                </Link>
                            </td>
                            <td>
                                {char.level}
                            </td>
                            <td>
                                <Link to={`/character/${char.class_name}`}>
                                    {char.class_name}
                                </Link>
                            </td>
                            <td>
                                <Link to={`/character/${char.species_name}`}>
                                    {char.species_name}
                                </Link>
                            </td>
                            <td>
                                <Link to={`/participant${char.participant_id}`}>
                                    {char.participant_id}
                                </Link>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </Table>
            </Stack>
            {selectedCharacter !== null &&
            <Modal  show={showSelCharacterModal}
                    onHide={handleCloseCharacterModal}
                    backdrop={"static"}
                    keyboard={false}>
                <Modal.Header>
                    <Modal.Title>{selectedCharacter.name}</Modal.Title>
                    <Button variant={"danger"}
                            onClick={handleCloseCharacterModal}
                    >Close</Button>
                </Modal.Header>
                <Modal.Body>
                    <Stack direction={"vertical"}
                           gap={2}>
                        <DetailRow label={"Character ID"} value={selectedCharacter.character_id}/>
                        <DetailRow label={"Name"} value={selectedCharacter.name}/>
                        <DetailRow label={"Hair Color"} value={selectedCharacter.hair_color}/>
                        <DetailRow label={"Eye Color"} value={selectedCharacter.eye_color}/>
                        <DetailRow label={"Level"} value={selectedCharacter.level}/>
                        <DetailRow label={"Position"} value={selectedCharacter.position}/>
                        <DetailRow label={"HP"} value={selectedCharacter.hp}/>
                        <DetailRow label={"Class"} value={selectedCharacter.class_name}/>
                        <DetailRow label={"Species"} value={selectedCharacter.species_name}/>
                        <DetailRow label={"Player ID"} value={selectedCharacter.participant_id}/>
                    </Stack>
                </Modal.Body>
            </Modal>}
            <Modal  show={showAddCharacterModal}
                    onHide={handleCloseAddCharacterModal}
                    backdrop={"static"}
                    keyboard={false}>
                    <Modal.Header>
                        <Modal.Title>Add A Character</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Stack direction={"vertical"}
                               gap={2}>
                        </Stack>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant={"danger"}
                                onClick={handleCloseAddCharacterModal}
                        >Close</Button>
                        <Button variant={"primary"}
                                onClick={handleAddCharacterInput}
                        >Add Character</Button>
                    </Modal.Footer>
                </Modal>
        </>
    )
}


const DetailRow = ({ label, value }: { label: string; value: React.ReactNode }) => (
    <div className="d-flex">
        <div style={{ width: '30%', textAlign: 'right', paddingRight: '15px' }}>
            <strong>{label}:</strong>
        </div>
        <div style={{ width: '70%' }}>
            {value}
        </div>
    </div>
);

export default CharacterPage;