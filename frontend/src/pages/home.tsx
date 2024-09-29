import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import placeholderImage from "../assets/placeholder-image.jpg";
import { useWebSocketContext } from "../context/websocket-context";
import { CreatePresentationPayload, ActionType, Message } from "../shared/types/message";
import { useUser } from "../context/user-context";

interface Presentation {
  id: string;
  creatorId: string;
}

const Home: React.FC = () => {
  const { sendMessage, messages } = useWebSocketContext();
  const { userId } = useUser();
  const navigate = useNavigate();

  const [presentations, setPresentations] = useState<Presentation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // fetch presentations from backend
  const fetchPresentations = async () => {
    try {
      const response = await axios.get("/api/presentations");
      setPresentations(response.data);
    } catch (error) {
      setError(`Error fetching presentations: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  // listen for websocket messages
  useEffect(() => {
    const newPresentationMessages = messages.some(
      (msg: Message) => msg.action === ActionType.CreatePresentation
    );
    if (newPresentationMessages) {
      fetchPresentations();
    }
  }, [messages]);

  // fetch presentations on component mount
  useEffect(() => {
    fetchPresentations();
  }, []);

  // send create presentation message
  const handleCreatePresentation = async () => {
    if (!userId) return;

    const payload: CreatePresentationPayload = { presentationId: "New Presentation Content" };
    const message: Message = {
      type: "action",
      action: ActionType.CreatePresentation,
      payload,
      userId,
    };

    sendMessage(message);

    try {
      // fetch the updated presentations after creating new one
      const response = await axios.get("/api/presentations");
      setPresentations(response.data);

      // redirect to newly created presentation
      const newPresentationId = response.data[response.data.length - 1].id;
      navigate(`/presentation/${newPresentationId}`);
    } catch (error) {
      console.error("Error creating presentation:", error);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="container-fluid h-100 d-flex p-0">
      {/* left sidebar */}
      <div className="bg-white border-end shadow-sm d-flex flex-column align-items-center p-3" style={{ width: "12rem" }}>
        <h4 className="text-dark mb-4">Create your own presentation!</h4>
        <button className="btn btn-primary w-100 mb-3" onClick={handleCreatePresentation}>
          New Presentation
        </button>
      </div>

      {/* presentation list */}
      <div className="flex-grow-1 bg-light p-4">
        <h1 className="text-center display-4 mb-3">See what others are doing</h1>
        <p className="text-center text-muted">Explore and join presentations happening right now.</p>

        <div className="row row-cols-2 row-cols-md-5 g-3">
          {presentations.length > 0 ? (
            presentations.map((presentation) => (
              <div key={presentation.id} className="col">
                <div className="card h-100">
                  <img
                    src={placeholderImage}
                    className="card-img-top"
                    alt={`Presentation ${presentation.id}`}
                  />
                  <div className="card-body p-2">
                    <h6 className="card-title text-truncate">Presentation by {presentation.creatorId}</h6>
                    <p className="card-text text-truncate small">Join to see what's happening.</p>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p>No presentations available yet. create a new one!</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
