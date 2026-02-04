import { useState } from "react";
import axios from "../api/axios";

export default function Summary({ roomId, getImage }) {
  const [summary, setSummary] = useState("");
  const [loading, setLoading] = useState(false);

  const generateSummary = async () => {
    try {
      setLoading(true);

      const image = await getImage();

      const res = await axios.post("/summary", {
        roomId,
        image,
        text: "Summarize the content on the whiteboard"
      });

      setSummary(res.data.summary);
    } catch (err) {
      alert("Summary generation failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-800 p-4 rounded text-white w-full">

      <button
        onClick={generateSummary}
        className="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded"
      >
        {loading ? "Summarizing..." : "Generate Summary"}
      </button>

      {summary && (
        <div className="mt-3 bg-gray-900 p-3 rounded text-sm">
          {summary}
        </div>
      )}
    </div>
  );
}
