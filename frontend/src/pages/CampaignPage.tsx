import { useEffect, useState } from "react";
import CampaignCard from "../components/CampaignCard";
import { Alert, Button, Form, Modal } from "react-bootstrap";

interface Campaign {
  campaign_id: number;
  campaign_name: string;
  meeting_location: string | null;
  meeting_time: string | Date | null;
  setting: string | null;
  difficulty_level: string;
  max_num_players: number;
  current_num_players: number;
  description: string | null;
  role: "Game Master" | "Player";
}

interface CampaignInput {
  campaign_name: string | null;
  meeting_location: string | null;
  meeting_time: string | Date | null;
  setting: string | null;
  difficulty_level: string | null;
  max_num_players: number | null;
  current_num_players: number | null;
  description: string | null;
  game_master_id: number | null;
}

type Difficulty = "all" | "Easy" | "Medium" | "Hard";

const CampaignPage = () => {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [difficultyFilter, setDifficultyFilter] = useState<Difficulty>("all");
  const [displayModal, setDisplayModal] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [alertVariant, setAlertVariant] = useState("");
  const [alertMessage, setAlertMessage] = useState("");
  const [formData, setFormData] = useState<CampaignInput>({
    campaign_name: null,
    meeting_location: null,
    meeting_time: null,
    setting: null,
    difficulty_level: null,
    max_num_players: null,
    current_num_players: 0,
    description: null,
    game_master_id: parseInt(localStorage.getItem("participantId")!),
  });

  const alertTimeout = () => {
    setShowAlert(true);
    setTimeout(() => {
      setShowAlert(false);
    }, 3000);
  };

  const getCampaigns = async (difficulty: Difficulty) => {
    const id = localStorage.getItem("participantId");
    try {
      const result = await fetch(
        `http://localhost:5001/campaign/${id}?difficulty=${difficulty}`
      );

      if (!result.ok) {
        const msg = await result.json();
        console.error("Failed to get rows " + msg);
      }

      const currCampaigns = await result.json();
      setCampaigns(currCampaigns);
    } catch (error) {
      console.error(error);
    }
  };

  const onCreateSuccess = (campaignName: string) => {
    const successMessage = `Successfully created campaign: ${campaignName}`;
    setAlertMessage(successMessage);
    setAlertVariant("success");
    alertTimeout();
  };

  const onCreateFailure = (campaignName: string, err: string) => {
    const failureMessage = `Failed to create campaign: ${campaignName}. Error: ${err}`;
    setAlertMessage(failureMessage);
    setAlertVariant("danger");
    alertTimeout();
  };

  const createCampaign = async () => {
    const date_created = new Date()
      .toISOString()
      .slice(0, 19)
      .replace("T", " ");
    try {
      const result = await fetch(`http://localhost:5001/campaign/create`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, date_created }),
      });

      if (!result.ok) {
        const msg = await result.json();
        onCreateFailure(formData.campaign_name || "Unnamed", msg.error);
        console.error(msg);
        return;
      }

      onCreateSuccess(formData.campaign_name || "Unnamed");
      getCampaigns(difficultyFilter);
    } catch (error) {
      onCreateFailure(formData.campaign_name || "Unnamed", String(error));
      console.error(error);
    }
  };

  const campaignsPresent = (): boolean => {
    return campaigns.length > 0;
  };

  useEffect(() => {
    getCampaigns(difficultyFilter);
  }, [difficultyFilter]);

  const handleSubmit = async () => {
    if (!formData.campaign_name) {
      setAlertMessage("Campaign name is required");
      setAlertVariant("danger");
      alertTimeout();
      return;
    }

    if (!formData.difficulty_level) {
      setAlertMessage("Difficulty level is required");
      setAlertVariant("danger");
      alertTimeout();
      return;
    }

    if (!formData.max_num_players) {
      setAlertMessage("Maximum number of players is required");
      setAlertVariant("danger");
      alertTimeout();
      return;
    }

    // If validation passes, proceed with creation
    setDisplayModal(false);
    await createCampaign();
  };

  const handleSetCampaignName = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      campaign_name: e.target.value,
    });
  };

  const handleSetSetting = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      setting: e.target.value,
    });
  };

  const handleSetLocation = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      meeting_location: e.target.value,
    });
  };

  const handleSetTime = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      meeting_time: e.target.value,
    });
  };

  const handleSetDifficulty = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFormData({
      ...formData,
      difficulty_level: e.target.value,
    });
  };

  const handleSetMaxPlayers = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      max_num_players: parseInt(e.target.value),
    });
  };

  const handleSetDescription = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      description: e.target.value,
    });
  };

  return (
    <>
      <h1>🏔️ D&D Campaigns 🏔️</h1>
      <div>
        {" "}
        <Button onClick={() => setDisplayModal(true)}>Create a Campaign</Button>
        <div className="mb-3">
          <label htmlFor="difficulty" className="mr-2">
            Filter by Difficulty:{" "}
          </label>
          <select
            id="difficulty"
            value={difficultyFilter}
            onChange={(e) => setDifficultyFilter(e.target.value as Difficulty)}
            className="form-select"
          >
            <option value="all">All Difficulties</option>
            <option value="Easy">Easy</option>
            <option value="Medium">Medium</option>
            <option value="Hard">Hard</option>
          </select>
        </div>
      </div>

      {!campaignsPresent() && (
        <div>
          To get started, either create a campaign or ask to be added to one!
        </div>
      )}

      {campaignsPresent() &&
        campaigns.map((campaign) => (
          <CampaignCard
            id={campaign.campaign_id}
            name={campaign.campaign_name}
            location={
              campaign.meeting_location
                ? campaign.meeting_location
                : "Not Provided"
            }
            time={
              campaign.meeting_time
                ? campaign.meeting_time.toLocaleString()
                : "Not Provided"
            }
            setting={campaign.setting ? campaign.setting : "Not Provided"}
            difficulty={campaign.difficulty_level}
            maxPlayers={campaign.max_num_players}
            currPlayers={campaign.current_num_players}
            desc={campaign.description ? campaign.description : "Not Provided"}
            role={campaign.role}
          />
        ))}

      <Modal show={displayModal} onHide={() => setDisplayModal(false)} centered>
        <Modal.Header>
          <Modal.Title>Create a Campaign</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Campaign Name"
                value={formData.campaign_name || ""}
                onChange={handleSetCampaignName}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Setting</Form.Label>
              <Form.Control
                type="text"
                placeholder="Setting"
                value={formData.setting || ""}
                onChange={handleSetSetting}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Location</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter location"
                value={formData.meeting_location || ""}
                onChange={handleSetLocation}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Time</Form.Label>
              <Form.Control
                type="time"
                value={formData.meeting_time?.toString() || ""}
                onChange={handleSetTime}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Difficulty Level</Form.Label>
              <Form.Select
                value={formData.difficulty_level || ""}
                onChange={handleSetDifficulty}
              >
                <option value="">Select difficulty</option>
                <option value="Easy">Easy</option>
                <option value="Medium">Medium</option>
                <option value="Hard">Hard</option>
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Maximum Players</Form.Label>
              <Form.Control
                type="number"
                min="1"
                step="1"
                placeholder="Enter max players"
                value={formData.max_num_players || ""}
                onChange={handleSetMaxPlayers}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                placeholder="Enter campaign description"
                value={formData.description || ""}
                onChange={handleSetDescription}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setDisplayModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSubmit}>
            Create Campaign
          </Button>
        </Modal.Footer>
      </Modal>
      {showAlert && (
        <Alert
          show={showAlert}
          variant={alertVariant}
          style={{
            position: "fixed",
            bottom: "20px",
            right: "20px",
            zIndex: 9999,
          }}
        >
          {alertMessage}
        </Alert>
      )}
    </>
  );
};

export default CampaignPage;
