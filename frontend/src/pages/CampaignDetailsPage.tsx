import { useLocation } from "react-router-dom";
import {
  Container,
  Card,
  Badge,
  Button,
  Table,
  Row,
  Col,
  Modal,
  Form,
} from "react-bootstrap";
import { useEffect, useState } from "react";
import EventDetails from "../components/EventDetails";
import CampaignCard from "../components/CampaignCard";

interface BaseEncounter {
  type: "Combat Encounter" | "Social Encounter";
}

interface CombatEncounter extends BaseEncounter {
  type: "Combat Encounter";
  combat_encounter_id: number;
  terrain?: string;
  visibility?: string;
  first_turn: string;
  turn_order: string;
}

interface SocialEncounter extends BaseEncounter {
  type: "Social Encounter";
  social_encounter_id: number;
  social_setting?: string;
  action: string;
}

export type Encounter = CombatEncounter | SocialEncounter;

const CampaignDetailsPage = () => {
  const location = useLocation();
  const { campaign } = location.state || {};
  const { details, events } = campaign;
  const [selectedEventId, setSelectedEventId] = useState<number | null>(null);
  const [eventDetails, setEventDetails] = useState<Encounter | null>(null);
  const [currentPlayers, setCurrentPlayers] = useState<
    { participant_id: number; name: string }[]
  >([]);
  const [newPlayers, setNewPlayers] = useState<
    { participant_id: number; name: string }[]
  >([]);
  const [selectedPlayers, setSelectedPlayers] = useState<number[]>([]);
  const [showPlayersModal, setShowPlayersModal] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getStatusBadgeColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "completed":
        return "success";
      case "in progress":
        return "warning";
      default:
        return "secondary";
    }
  };

  const setDifficultyColor = () => {
    if (campaign.difficulty === "Hard") {
      return "danger";
    } else if (campaign.difficulty === "Medium") {
      return "warning";
    } else return "success";
  };

  const getEventDetails = async (id: number) => {
    try {
      const result = await fetch(`http://localhost:5001/events/details/${id}`);

      if (!result.ok) {
        const msg = await result.json();
        console.error(msg);
      }

      const details = await result.json();
      setEventDetails(Array.isArray(details) ? details[0] : details);
      setSelectedEventId(id);
    } catch (error) {
      console.error(error);
    }
  };

  const getPlayers = async () => {
    try {
      const result = await fetch(
        `http://localhost:5001/campaign/players/${details.id}`
      );

      if (!result.ok) {
        const msg = await result.json();
        console.error(msg);
      }

      const res = await result.json();
      setCurrentPlayers(res);
      console.log(currentPlayers);
    } catch (error) {
      console.error(error);
    }

    try {
      const result = await fetch(
        `http://localhost:5001/campaign/${localStorage.getItem(
          "participantId"
        )}/${details.id}`
      );

      if (!result.ok) {
        const msg = await result.json();
        console.error(msg);
      }

      const res = await result.json();
      setNewPlayers(res);
      console.log(newPlayers);
    } catch (error) {
      console.error(error);
    }
  };

  const addPlayers = async () => {
    if (details.currPlayers + selectedPlayers.length > details.maxPlayers) {
      setError(`Cannot exceed the max player limit (${details.maxPlayers})`);
      return;
    }

    try {
      const currentDate = new Date()
        .toISOString()
        .slice(0, 19)
        .replace("T", " ");

      const response = await fetch(
        `http://localhost:5001/campaign/add-players/${details.id}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            playerIds: selectedPlayers,
            date: currentDate,
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to add players");
      }

      await getPlayers();

      details.currPlayers += selectedPlayers.length;

      setError("Players successfully added to the campaign!");

      setTimeout(() => {
        setSelectedPlayers([]);
        setError(null);
        setShowPlayersModal(false);
      }, 2000);
    } catch (err) {
      console.error("Error adding players:", err);
      setError(err.message || "Failed to add players. Please try again.");
    }
  };

  const handleCloseDetails = () => {
    setEventDetails(null);
    setSelectedEventId(null);
  };

  const handlePlayerSelect = (playerId: number) => {
    setSelectedPlayers((prev) => {
      const isSelected = prev.includes(playerId);
      const updatedSelection = isSelected
        ? prev.filter((id) => id !== playerId)
        : [...prev, playerId];
      return updatedSelection;
    });
  };

  const handleCloseModal = () => {
    setShowPlayersModal(false);
    setSelectedPlayers([]);
    setError(null);
  };

  useEffect(() => {
    if (eventDetails) {
      console.log("Event details updated:", eventDetails);
    }
  }, [eventDetails]);

  return (
    <Container fluid>
      <h1 className="mb-4">🎭 Campaign Details 🎭</h1>
      <Row>
        <Col md={eventDetails ? 8 : 12} className="transition-all duration-300">
          <CampaignCard
            id={details.id}
            name={details.name}
            location={details.location}
            time={details.time}
            setting={details.setting}
            difficulty={details.difficulty}
            maxPlayers={details.maxPlayers}
            currPlayers={details.currPlayers}
            desc={details.desc}
            role={details.role}
            inPage={true}
          ></CampaignCard>
          {details.role === "Game Master" && (
            <div className="mb-4">
              <Button
                size="sm"
                onClick={() => {
                  getPlayers();
                  setShowPlayersModal(true);
                }}
              >
                Manage Players
              </Button>
            </div>
          )}
          {/* </Card> */}

          <Card className="shadow-sm">
            <Card.Header className="bg-secondary text-white">
              <h3 className="h5 mb-0">Events</h3>
            </Card.Header>
            <Card.Body>
              {events.length > 0 ? (
                <Table responsive hover className="mb-0">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Location</th>
                      <th>Status</th>
                      <th>Type</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {events.map((event, index) => (
                      <tr
                        key={index}
                        className={
                          selectedEventId === event.event_id
                            ? "table-primary"
                            : ""
                        }
                      >
                        <td>{index + 1}</td>
                        <td>{event.location}</td>
                        <td>
                          <Badge
                            bg={getStatusBadgeColor(event.completion_status)}
                          >
                            {event.completion_status}
                          </Badge>
                        </td>
                        <td>{event.type}</td>
                        <td>
                          <Button
                            size="sm"
                            variant={
                              selectedEventId === event.event_id
                                ? "primary"
                                : "outline-primary"
                            }
                            onClick={() => getEventDetails(event.event_id)}
                          >
                            {selectedEventId === event.event_id
                              ? "Viewing"
                              : "View Details"}
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              ) : (
                <p className="text-muted mb-0">
                  No events available for this campaign.
                </p>
              )}
            </Card.Body>
          </Card>
        </Col>

        {eventDetails && (
          <Col md={4} className="mt-0">
            <Card className="shadow-sm sticky-top" style={{ top: "1rem" }}>
              <Card.Header className="bg-secondary text-white d-flex justify-content-between align-items-center">
                <h3 className="h5 mb-0">Event Details</h3>
                <Button
                  variant="light"
                  size="sm"
                  onClick={handleCloseDetails}
                  aria-label="Close details"
                >
                  ✕
                </Button>
              </Card.Header>
              <Card.Body className="p-0">
                <EventDetails eventDetails={eventDetails} />
              </Card.Body>
            </Card>
          </Col>
        )}
      </Row>

      <Modal
        show={showPlayersModal}
        onHide={() => setShowPlayersModal(false)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Manage Players</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {error && <p className="text-danger">{error}</p>}
          <Row>
            <Col>
              <h5>
                Current Players {details.currPlayers}/{details.maxPlayers}
              </h5>
              {currentPlayers.map((player) => (
                <div>{player.name}</div>
              ))}
            </Col>
            <Col>
              <h5>Add Players</h5>
              {newPlayers.length > 0 ? (
                <Form>
                  {newPlayers.map((player) => {
                    return (
                      <Form.Check
                        key={player.participant_id}
                        type="checkbox"
                        label={player.name}
                        checked={selectedPlayers.includes(
                          player.participant_id
                        )}
                        onChange={() => {
                          handlePlayerSelect(player.participant_id);
                        }}
                        disabled={
                          details.currPlayers >= details.maxPlayers &&
                          !selectedPlayers.includes(player.participant_id)
                        }
                      />
                    );
                  })}
                </Form>
              ) : (
                <p>No players available</p>
              )}
            </Col>
          </Row>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Close
          </Button>
          {details.currPlayers < details.maxPlayers && (
            <Button variant="primary" onClick={addPlayers}>
              Add
            </Button>
          )}
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default CampaignDetailsPage;
