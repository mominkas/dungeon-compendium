import { Card, Badge } from "react-bootstrap";
import { Encounter } from "../pages/CampaignDetailsPage";

interface EventDetailsProps {
  eventDetails: Encounter;
}

const EventDetails = ({ eventDetails }: EventDetailsProps) => {
  const renderCombatDetails = () => (
    <div className="p-3">
      <div className="mb-3">
        <strong>Combat ID:</strong>{" "}
        <Badge bg="secondary">{eventDetails.combat_encounter_id}</Badge>
      </div>

      <div className="mb-3">
        <strong>Terrain:</strong>{" "}
        <Badge bg="info">{eventDetails.terrain || "N/A"}</Badge>
      </div>

      <div className="mb-3">
        <strong>Visibility:</strong>{" "}
        <Badge bg="info">{eventDetails.visibility || "N/A"}</Badge>
      </div>

      <div className="mb-3">
        <strong>First Turn:</strong>{" "}
        <Badge bg="success">{eventDetails.first_turn}</Badge>
      </div>

      <div>
        <strong>Turn Order:</strong>
        <div className="mt-2">
          {eventDetails.turn_order?.split(",").map((participant, index) => (
            <Badge key={index} bg="primary" className="me-2 mb-2">
              {index + 1}. {participant.trim()}
            </Badge>
          ))}
        </div>
      </div>
    </div>
  );

  const renderSocialDetails = () => (
    <div className="p-3">
      <div className="mb-3">
        <strong>Encounter ID:</strong>{" "}
        <Badge bg="secondary">{eventDetails.combat_encounter_id}</Badge>
      </div>

      <div className="mb-3">
        <strong>Location:</strong>{" "}
        <Badge bg="info">{eventDetails.terrain || "N/A"}</Badge>
      </div>

      <div>
        <strong>Action:</strong>
        <p className="mt-2 p-3 bg-light rounded">{eventDetails.first_turn}</p>
      </div>
    </div>
  );

  return (
    <Card className="shadow-sm">
      <Card.Header
        className={`${
          eventDetails.type === "Combat Encounter" ? "bg-danger" : "bg-primary"
        } text-white`}
      >
        <h3 className="h5 mb-0">
          {eventDetails.type === "Combat Encounter" ? (
            <>⚔️ Combat Encounter</>
          ) : (
            <>🗣️ Social Encounter</>
          )}
        </h3>
      </Card.Header>
      <Card.Body className="p-0">
        {eventDetails.type === "Combat Encounter"
          ? renderCombatDetails()
          : renderSocialDetails()}
      </Card.Body>
    </Card>
  );
};

export default EventDetails;
