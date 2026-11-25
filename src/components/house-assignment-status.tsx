"use client";

import { useAuth } from "@/components/auth-provider";
import { useHouse } from "@/components/house-provider";
import { houseThemes, selectableHouses } from "@/lib/houses";
import { useHouseAssignment } from "@/hooks/useHouseAssignment";
import { Crown, RefreshCw } from "lucide-react";
import { useState } from "react";

/**
 * Display current house assignment and provide reassignment control
 * Useful for user accounts pages and development
 */
export function HouseAssignmentStatus() {
  const { user } = useAuth();
  const { house } = useHouse();
  const { reassign } = useHouseAssignment();
  const [reassigning, setReassigning] = useState(false);

  if (!user) {
    return (
      <div className="house-status guest">
        <Crown size={18} />
        <span>Sign in to get sorted into your house</span>
      </div>
    );
  }

  const houseTheme = houseThemes[house];

  return (
    <div className="house-status-card" data-house={house}>
      <div className="house-status-header">
        <Crown size={20} style={{ color: `var(${houseTheme.accent})` }} />
        <div>
          <h3>{houseTheme.name}</h3>
          <p>{houseTheme.motto}</p>
        </div>
      </div>

      <p className="house-status-quality">{houseTheme.quality}</p>

      <details className="house-status-details">
        <summary>Reassign House (Testing)</summary>
        <div className="house-reassign-options">
          <button
            onClick={async () => {
              setReassigning(true);
              await reassign();
              setReassigning(false);
            }}
            disabled={reassigning}
            className="button-small"
          >
            <RefreshCw size={14} />
            Random Reassignment
          </button>

          {selectableHouses.map((h) => (
            <button
              key={h}
              onClick={async () => {
                setReassigning(true);
                await reassign(h);
                setReassigning(false);
              }}
              disabled={reassigning || house === h}
              className="button-small"
            >
              {houseThemes[h].name}
            </button>
          ))}
        </div>
      </details>
    </div>
  );
}
