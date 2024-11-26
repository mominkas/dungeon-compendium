import { Badge, Button, Card } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

interface campaignCardProps {
  id: number;
  name: string;
  location: string;
  time: string;
  setting: string;
  difficulty: string;
  maxPlayers: string;
  currPlayers: string;
  desc: string;
  role: "Game Master" | "Player";
}

interface Events {
  event_id: number;
  location: string;
  start_time: string;
  completion_status: string;
}

const CampaignCard = (campaign: campaignCardProps) => {
  const navigate = useNavigate();
  const handleOpenCampaign = async () => {
    try {
      const result = await fetch(`http://localhost:5001/events/${campaign.id}`);

      if (!result.ok) {
        const msg = await result.json();
        console.error("Failed to get rows " + msg);
      }

      const currEvents: Events[] = await result.json();

      const campaignDetails = {
        details: campaign,
        events: currEvents,
      };

      navigate(`campaign-details/${campaign.id}`, {
        state: { campaign: campaignDetails },
      });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Card className="mb-4 shadow-sm">
      <Card.Body>
        <Card.Title className="fs-4 mb-2">{campaign.name}</Card.Title>
        <Card.Subtitle className="mb-3 text-muted">
          {campaign.setting}
        </Card.Subtitle>
        <Badge bg={campaign.role === "Game Master" ? "danger" : "primary"}>
          Role: {campaign.role}
        </Badge>
        <Card.Text>
          <strong>Location: </strong>
          {campaign.location} <br />
          <strong>Time: </strong>
          {campaign.time}
          <br />
          <strong>Difficulty: </strong>
          {campaign.difficulty} <br />
          <strong>Max Players: </strong>
          {campaign.maxPlayers} <br />
          <strong>Current Players: </strong>
          {campaign.currPlayers} <br />
          <strong>Description: </strong>
          {campaign.desc} <br />
        </Card.Text>
        <Button variant="primary" onClick={handleOpenCampaign}>
          Open
        </Button>
      </Card.Body>
    </Card>
  );
};

export default CampaignCard;
