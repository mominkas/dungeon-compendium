import { useEffect, useState } from "react";
import { Badge, Card, Table } from "react-bootstrap";

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

interface PopularDifficultyEntry {
  difficulty_level: string;
  avg_ratio: number;
}

const HomePage = () => {
  const [masterClass, setMasterClass] = useState<MasterClassEntry[]>([]);
  const [msgForDifficulty, setMsgForDiificulty] = useState("");
  const [popularSpecies, setPopularSpecies] = useState<PopularSpeciesEntry[]>(
    []
  );
  const [classyCharacters, setClassyCharacters] = useState<
    ClassyCharactersEntry[]
  >([]);
  const [popularDifficulty, setPopularDifficulty] = useState<
    PopularDifficultyEntry[]
  >([]);

  const fetchMasterClass = async () => {
    try {
      const response = await fetch(
        `http://localhost:5001/users/allClassesPlayers`
      );
      const data = await response.json();

      console.log(data);
      setMasterClass(data);
    } catch (err) {
      console.log("Errored:", err);
    }
  };

  const fetchPopularSpecies = async () => {
    try {
      const response = await fetch(
        `http://localhost:5001/species/popularSpecies`
      );
      const data = await response.json();

      console.log(data);
      setPopularSpecies(data);
    } catch (err) {
      console.log("Errored:", err);
    }
  };

  const fetchClassyCharacters = async () => {
    try {
      const response = await fetch(
        `http://localhost:5001/class/classyCharacters`
      );
      const data = await response.json();

      console.log(data);
      setClassyCharacters(data);
    } catch (err) {
      console.log("Errored:", err);
    }
  };

  const fetchPopularDifficulty = async () => {
    try {
      const response = await fetch(
        `http://localhost:5001/campaign/popularDifficulty`
      );
      console.log("HERE");
      const data = await response.json();

      setPopularDifficulty(data);
      handleDifficultyMsg(data[0].difficulty_level);
    } catch (err) {
      console.log("Errored:", err);
    }
  };

  const setDifficultyColor = (difficulty: string) => {
    if (difficulty === "Hard") {
      return "danger";
    } else if (difficulty === "Medium") {
      return "warning";
    } else return "success";
  };

  const handleDifficultyMsg = (difficulty: string) => {
    let msg = "";
    if (difficulty === "Hard") {
      msg = "Hardcore!";
    } else if (difficulty === "Medium") {
      msg = "Git Gud :(";
    } else if (difficulty === "Easy") {
      msg = "Wow, so many Noobs";
    }
    setMsgForDiificulty(msg);
  };

  useEffect(() => {
    fetchMasterClass();
    fetchPopularSpecies();
    fetchClassyCharacters();
    fetchPopularDifficulty();
  }, []);

  return (
    <>
      <h1>⚔️ Welcome to our DND Database ⚔️</h1>

      <Card className="mt-5">
        <Card.Body>
          <Card.Title>🏆 Master Class 🏆</Card.Title>
          Players who have played as all classes!
          {masterClass.length === 0 && <h4>Wow y'all suck! Get better!</h4>}
          {masterClass.length > 0 && (
            <Table>
              <thead>
                <tr>
                  <th>Player Name</th>
                  <th>Location</th>
                  <th>XP Level</th>
                </tr>
              </thead>
              <tbody>
                {masterClass.length > 0 &&
                  masterClass.map((entry: MasterClassEntry) => (
                    <tr key={entry.name}>
                      <td>{entry.name}</td>
                      <td>{entry.location}</td>
                      <td>{entry.experience_level}</td>
                    </tr>
                  ))}
              </tbody>
            </Table>
          )}
        </Card.Body>
      </Card>

      <Card className="mt-5">
        <Card.Body>
          <Card.Title>💁‍♀️ Popular Species 💁‍♀️</Card.Title>
          Species with the most characters!
          {popularSpecies.length > 0 && (
            <Table>
              <thead>
                <tr>
                  <th>Species Name</th>
                  <th>Total # Characters</th>
                </tr>
              </thead>
              <tbody>
                {popularSpecies.length > 0 &&
                  popularSpecies.map((entry: PopularSpeciesEntry) => (
                    <tr key={entry.name}>
                      <td>{entry.name}</td>
                      <td>{entry.count}</td>
                    </tr>
                  ))}
              </tbody>
            </Table>
          )}
        </Card.Body>
      </Card>

      <Card className="mt-5">
        <Card.Body>
          <Card.Title>🍷 Classy Characters 🍷</Card.Title>
          Players with an average character level greater than 2! Super classy.
          {classyCharacters.length > 0 && (
            <Table>
              <thead>
                <tr>
                  <th>Player Name</th>
                  <th>Average Character Level</th>
                </tr>
              </thead>
              <tbody>
                {classyCharacters.length > 0 &&
                  classyCharacters.map((entry: ClassyCharactersEntry) => (
                    <tr key={entry.name}>
                      <td>{entry.name}</td>
                      <td>{Number(entry.avg).toFixed(2)}</td>
                    </tr>
                  ))}
              </tbody>
            </Table>
          )}
        </Card.Body>
      </Card>

      <Card className="mt-5">
        <Card.Body>
          <Card.Title>🤼 Popular Difficulty 🤼</Card.Title>
          Difficulty with higest ratio of current to max players across all
          campaigns! <br />
          {msgForDifficulty}
          {classyCharacters.length > 0 && (
            <Table>
              <thead>
                <tr>
                  <th>Difficulty</th>
                  <th>Ratio of current to max players</th>
                </tr>
              </thead>
              <tbody>
                {popularDifficulty.length > 0 &&
                  popularDifficulty.map((entry: PopularDifficultyEntry) => (
                    <tr key={entry.difficulty_level}>
                      <td>
                        <Badge bg={setDifficultyColor(entry.difficulty_level)}>
                          {entry.difficulty_level}
                        </Badge>
                      </td>
                      <td>{Number(entry.avg_ratio).toFixed(2)}</td>
                    </tr>
                  ))}
              </tbody>
            </Table>
          )}
        </Card.Body>
      </Card>
    </>
  );
};

export default HomePage;
