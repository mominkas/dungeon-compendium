import {useEffect, useState} from "react";
import {Button, Modal, Stack, Table, ToggleButton, ToggleButtonGroup} from "react-bootstrap";
import {Link} from "react-router-dom";
import CharacterInputForm, {CharacterInput} from "../components/CharacterInputForm.tsx";
import LoginService from "../services/LoginService";
import 'bootstrap/dist/css/bootstrap.min.css';

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
    const [showEditCharacterModal, setShowEditCharacterModal] = useState(false);
    // const [showAlert, setShowAlert] = useState(false);
    // const [alertVariant, setAlertVariant] = useState("");
    // const [alertMessage, setAlertMessage] = useState("");
    const [triggerReload, setTriggerReload] = useState(true);
    const [characterView, setCharacterView] = useState(1);

    const login = LoginService.getInstance();
    const currUser = login.getParticipantId();

    const [formData, setFormData] = useState<CharacterInput>({
            name: null,
            hair_color: null,
            eye_color: null,
            level: null,
            position: null,
            class_name: null,
            species_name: null,
            rollForHP: true,
            hitPointsCustom: null,
            character_id: null
        }
    );

    // const alertTimeout = () => {
    //     setShowAlert(true);
    //     setTimeout(() => {
    //         setShowAlert(false);
    //     }, 3000);
    // }

    const handleCharacterViewChange = (val: number) => {
        setCharacterView(val);
        setTriggerReload(true);
    }


    const fetchData = async () => {
        if (characterView === 1) {
            try {
                const response = await fetch(`http://localhost:5001/character/${currUser}`);
                const data = await response.json();

                setCharacters(data);
                setTriggerReload(false);
            } catch (err) {
                console.error("Error fetching characters: ", err);
            }
        } else {
            try {
                const response = await fetch('http://localhost:5001/character');
                const data = await response.json();

                setCharacters(data);
                setTriggerReload(false);
            } catch (err) {
                console.error("Error fetching characters: ", err);
            }
        }
    }

    const handleCloseCharacterModal = () => setShowSelCharacterModal(false);
    const handleShowCharacterModal = (e: React.MouseEvent, char: Character) => {
        e.preventDefault();
        setShowSelCharacterModal(true);
        setSelectedCharacter(char);
    }

    const handleCloseEditCharacterModal = () => setShowEditCharacterModal(false);
    const handleShowEditCharacterModal = (e: React.MouseEvent, char: Character) => {
        e.preventDefault();
        setShowEditCharacterModal(true);
        setFormData({
            name: char.name,
            hair_color: char.hair_color,
            eye_color: char.eye_color,
            position: char.position,
            level: char.level,
            class_name: char.class_name,
            species_name: char.species_name,
            rollForHP: false,
            hitPointsCustom: char.hp,
            character_id: char.character_id
        });

    }

    const handleCloseAddCharacterModal = () => setShowAddCharacterModal(false);
    const handleShowAddCharacterModal = () => {
        setShowAddCharacterModal(true);
    }

    const handleAddCharacterInput = async () => {
        try {
            const response = await fetch(`http://localhost:5001/character/add/${currUser}`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        ...formData,
                        participant_id: currUser
                    })
                });

            if (response.ok) {
                const data = await response.json();
                handleCloseAddCharacterModal();
                setTriggerReload(true);
                setFormData({
                    name: null,
                    hair_color: null,
                    eye_color: null,
                    level: null,
                    position: null,
                    class_name: null,
                    species_name: null,
                    rollForHP: true,
                    hitPointsCustom: null,
                    character_id: null
                });
            }
        } catch (err) {
            console.error('Error creating character:', err);
        }
    }

    const handleEditCharacterInput = async () => {

        console.log("Form data being sent:", {
            name: formData.name,
            class_name: formData.class_name,
            level: formData.level,
            species_name: formData.species_name,
            character_id: formData.character_id,
            hair_color: formData.hair_color,
            eye_color: formData.eye_color,
            position: formData.position,
            rollForHP: formData.rollForHP,
            hitPointsCustom: formData.hitPointsCustom
        });

        try {
            console.log(formData);
            const response = await fetch(`http://localhost:5001/character/edit`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        ...formData
                    })
                });

            if (response.ok) {
                const data = await response.json();
                handleCloseEditCharacterModal();
                setFormData({
                    name: null,
                    hair_color: null,
                    eye_color: null,
                    level: null,
                    position: null,
                    class_name: null,
                    species_name: null,
                    rollForHP: true,
                    hitPointsCustom: null,
                    character_id: null
                });
                setTriggerReload(true);
            } else {
                console.error('Server error:', data.error, data.details);
            }
        } catch (err) {
            console.error('Error creating character:', err);
        }
    }

    useEffect(() => {
        fetchData();
    }, [triggerReload]);

    return (
        <>
            <Stack gap={3}
                   direction={"vertical"}>
                <h1> 🧙 D&D Characters 🧙 </h1>
                <h5> Click on a character to discover more!</h5>

                <Button variant={"primary"}
                        onClick={handleShowAddCharacterModal}>
                    Add a New Character!
                </Button>
                <div>
                    <ToggleButtonGroup type={"radio"}
                                       className="btn-group mb-3"
                                       name={"characterView"}
                                       defaultValue={1}
                                       onChange={handleCharacterViewChange}>
                        <ToggleButton id={"tbg-radio-1"}
                                      value={1}
                                      style={{
                                          borderTopLeftRadius: '5px',
                                          borderBottomLeftRadius: '5px',
                                      }}>
                            My Characters
                        </ToggleButton>
                        <ToggleButton id={"tbg-radio-2"}
                                      value={2}>
                            All Characters
                        </ToggleButton>
                    </ToggleButtonGroup>
                </div>
                <Table>
                    <thead>
                    <tr>
                        <th>Name</th>
                        <th>Level</th>
                        <th>Class</th>
                        <th>Species</th>
                        <th>Played By</th>
                        {characterView === 1 && <th></th>}
                    </tr>
                    </thead>
                    <tbody>
                    {characters.length > 0 && characters.map((char: Character) => (
                        <tr key={char.character_id}>
                            <td>
                                <Link
                                    to={`/character/${char.character_id}`}
                                    onClick={(e) => handleShowCharacterModal(e, char)}
                                    style={{textDecoration: 'none'}}
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

                            {characterView === 1 &&
                            <td>
                                <Button onClick={(e) => handleShowEditCharacterModal(e, char)}>
                                    Edit
                                </Button>
                            </td>
                            }
                        </tr>
                    ))}
                    </tbody>
                </Table>
            </Stack>
            {selectedCharacter !== null &&
                <Modal show={showSelCharacterModal}
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
                </Modal>
            }

            {/* Add Character Modal Code */}
            <Modal show={showAddCharacterModal}
                   onHide={handleCloseAddCharacterModal}
                   backdrop={"static"}
                   keyboard={false}>
                <Modal.Header>
                    <Modal.Title>Add A Character</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Stack direction={"vertical"}
                           gap={2}>
                        <CharacterInputForm formData={formData}
                                            setFormData={setFormData}/>
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

            {/* Edit Character Modal Code */}
            <Modal show={showEditCharacterModal}
                   onHide={handleCloseEditCharacterModal}
                   backdrop={"static"}
                   keyboard={false}>
                <Modal.Header>
                    <Modal.Title>Edit Character</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Stack direction={"vertical"}
                           gap={2}>
                        <CharacterInputForm formData={formData}
                                            setFormData={setFormData}/>
                    </Stack>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant={"danger"}
                            onClick={handleCloseEditCharacterModal}
                    >Cancel</Button>
                    <Button variant={"primary"}
                            onClick={handleEditCharacterInput}
                    >Confirm Edit</Button>
                </Modal.Footer>
            </Modal>

        </>
    )
}


const DetailRow = ({label, value}: { label: string; value: React.ReactNode }) => (
    <div className="d-flex">
        <div style={{width: '30%', textAlign: 'right', paddingRight: '15px'}}>
            <strong>{label}:</strong>
        </div>
        <div style={{width: '70%'}}>
            {value}
        </div>
    </div>
);

export default CharacterPage;