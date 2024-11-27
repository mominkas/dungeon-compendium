import { useEffect, useState } from "react";
import CampaignCard from "../components/CampaignCard";

interface Campaign {
  campaign_id: number;
  campaign_name: string;
  meeting_location: string;
  meeting_time: string | Date;
  setting: string;
  difficulty_level: string;
  max_num_players: string;
  current_num_players: string;
  description: string;
  role: "Game Master" | "Player";
}

type Difficulty = "all" | "Easy" | "Medium" | "Hard";

const CampaignPage = () => {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [difficultyFilter, setDifficultyFilter] = useState<Difficulty>("all");

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

  const campaignsPresent = (): boolean => {
    return campaigns.length > 0;
  };

  useEffect(() => {
    getCampaigns(difficultyFilter);
  }, [difficultyFilter]);

  return (
    <>
      <h1>🏔️ D&D Campaigns 🏔️</h1>
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
            setting={campaign.setting}
            difficulty={campaign.difficulty_level}
            maxPlayers={campaign.max_num_players}
            currPlayers={campaign.current_num_players}
            desc={campaign.description ? campaign.description : "Not Provided"}
            role={campaign.role}
          />
        ))}
    </>
  );
};

export default CampaignPage;
