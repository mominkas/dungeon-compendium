import { useLocation } from "react-router-dom";
import { Container, Row, Col, Card, ListGroup, Badge } from "react-bootstrap";

const CampaignDetailsPage = () => {
  const location = useLocation();
  const { campaign } = location.state || {};
  const { details, events } = campaign;

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

  return (
    <Container className="my-4">
      <h1>🎭 Campaign Details 🎭</h1>
      <Row>
        <Col lg={7}>
          <Card className="mb-4 shadow-sm">
            <Card.Header className="bg-primary text-white">
              <h2 className="h4 mb-0">{details.name}</h2>
            </Card.Header>
            <Card.Body>
              <Row className="mb-4">
                <Col sm={6}>
                  <ListGroup variant="flush">
                    <ListGroup.Item>
                      <strong>Location:</strong>
                      <div className="text-muted">{details.location}</div>
                    </ListGroup.Item>
                    <ListGroup.Item>
                      <strong>Time:</strong>
                      <div className="text-muted">
                        {details.time.toLocaleString()}
                      </div>
                    </ListGroup.Item>
                  </ListGroup>
                </Col>
                <Col sm={6}>
                  <ListGroup variant="flush">
                    <ListGroup.Item>
                      <strong>Players:</strong>
                      <div className="text-muted">
                        {details.currPlayers} / {details.maxPlayers}
                      </div>
                    </ListGroup.Item>
                    <ListGroup.Item>
                      <strong>Difficulty:</strong>
                      <div>
                        <Badge
                          bg={
                            details.difficulty === "Easy"
                              ? "success"
                              : "warning"
                          }
                        >
                          {details.difficulty}
                        </Badge>
                      </div>
                    </ListGroup.Item>
                  </ListGroup>
                </Col>
              </Row>
              <Card.Text>
                <strong>Description:</strong>
                <p className="mt-2 mb-0 text-muted">{details.desc}</p>
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>

        <Col lg={5}>
          <Card className="shadow-sm">
            <Card.Header className="bg-secondary text-white">
              <h3 className="h5 mb-0">Events</h3>
            </Card.Header>
            <div style={{ maxHeight: "600px", overflowY: "auto" }}>
              <Card.Body className="p-3">
                {events.length > 0 ? (
                  <Row xs={1} className="g-3">
                    {events.map((event, index) => (
                      <Col key={index}>
                        <Card className="h-100 border">
                          <Card.Body className="p-3">
                            <div className="d-flex justify-content-between align-items-start mb-2">
                              <h6 className="mb-0">Event #{index + 1}</h6>
                              <Badge
                                bg={getStatusBadgeColor(
                                  event.completion_status
                                )}
                              >
                                {event.completion_status}
                              </Badge>
                            </div>
                            <ListGroup variant="flush" className="small">
                              <ListGroup.Item className="px-0 py-2">
                                <strong>Location:</strong>
                                <div className="text-muted">
                                  {event.location}
                                </div>
                              </ListGroup.Item>
                              <ListGroup.Item className="px-0 py-2">
                                <strong>Start Time:</strong>
                                <div className="text-muted">
                                  {event.start_time.toLocaleString()}
                                </div>
                              </ListGroup.Item>
                            </ListGroup>
                          </Card.Body>
                        </Card>
                      </Col>
                    ))}
                  </Row>
                ) : (
                  <p className="text-muted mb-0">
                    No events available for this campaign.
                  </p>
                )}
              </Card.Body>
            </div>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default CampaignDetailsPage;
