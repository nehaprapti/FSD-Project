import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Star, Check } from "lucide-react";
import { Button } from "@/components/ui/button";

const feedbackChips = ["Great driving", "Clean car", "Friendly", "On time"];

const TripCompleted: React.FC = () => {
  const navigate = useNavigate();
  const [rating, setRating] = useState(0);
  const [selectedChips, setSelectedChips] = useState<string[]>([]);
  const [comment, setComment] = useState("");

  const toggleChip = (chip: string) => {
    setSelectedChips(prev => prev.includes(chip) ? prev.filter(c => c !== chip) : [...prev, chip]);
  };

  return (
    <div className="min-h-screen bg-white px-5 py-8">
      <div className="max-w-sm mx-auto">
        {/* Checkmark */}
        <div className="flex justify-center mb-4">
          <div className="w-[72px] h-[72px] rounded-full bg-green-success/15 flex items-center justify-center">
            <svg width="40" height="40" viewBox="0 0 40 40">
              <circle cx="20" cy="20" r="18" fill="none" stroke="#2ECC71" strokeWidth="2.5" />
              <path d="M12 20l6 6 10-12" fill="none" stroke="#2ECC71" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="animate-draw-check" style={{ strokeDasharray: 50 }} />
            </svg>
          </div>
        </div>

        <h1 className="text-2xl font-bold text-rx-black text-center">Trip Completed!</h1>
        <p className="text-metric text-green-success text-xl text-center mt-1">₹187 charged to your wallet</p>

        {/* Trip summary */}
        <div className="bg-white rounded-card border border-rx-gray-100 p-5 mt-6">
          <div className="flex gap-3 mb-4">
            <div className="flex flex-col items-center pt-1">
              <div className="w-3 h-3 rounded-full bg-green-success" />
              <div className="w-px h-6 border-l border-dashed border-rx-gray-400" />
              <div className="w-3 h-3 rounded-full bg-y-primary" />
            </div>
            <div>
              <p className="font-bold text-rx-black text-sm">T. Nagar, Chennai</p>
              <div className="h-4" />
              <p className="font-bold text-rx-black text-sm">Anna Nagar, Chennai</p>
            </div>
          </div>
          <div className="flex gap-6 text-center">
            {[{ label: "Distance", value: "3.4 km" }, { label: "Duration", value: "14 mins" }, { label: "Type", value: "Economy" }].map(s => (
              <div key={s.label}>
                <p className="text-label text-rx-gray-400">{s.label}</p>
                <p className="font-bold text-rx-black text-sm mt-0.5">{s.value}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Rating */}
        <div className="mt-8 text-center">
          <div className="w-12 h-12 rounded-full bg-y-primary mx-auto mb-2 flex items-center justify-center text-y-dark font-bold">R</div>
          <p className="font-bold text-rx-black">Ravi Kumar</p>
          <div className="flex justify-center gap-2 mt-3">
            {[1,2,3,4,5].map(s => (
              <button key={s} onClick={() => setRating(s)}>
                <Star size={40} className={s <= rating ? "fill-y-primary text-y-primary" : "text-rx-gray-100"} />
              </button>
            ))}
          </div>
        </div>

        {/* Feedback chips */}
        <div className="flex gap-2 flex-wrap justify-center mt-4">
          {feedbackChips.map(chip => (
            <button
              key={chip}
              onClick={() => toggleChip(chip)}
              className={`rounded-pill px-4 py-2 text-sm font-medium transition-colors ${
                selectedChips.includes(chip) ? "bg-y-surface border-2 border-y-primary text-y-text" : "bg-rx-gray-100 text-rx-gray-700"
              }`}
            >
              {chip}
            </button>
          ))}
        </div>

        <textarea
          value={comment}
          onChange={e => setComment(e.target.value)}
          placeholder="Add a comment..."
          className="w-full mt-4 h-20 bg-off-white rounded-input p-3 text-sm text-rx-black outline-none resize-none border border-rx-gray-100 focus:border-y-primary"
        />

        <Button className="w-full mt-4" onClick={() => navigate("/passenger/home")}>Submit Rating</Button>
        <button onClick={() => navigate("/passenger/home")} className="w-full text-center text-rx-gray-400 text-sm mt-3">Skip</button>
      </div>
    </div>
  );
};

export default TripCompleted;
