import React from "react";
import { ProfileEventList } from "./profile-event-list";

export const ProfileSection: React.FC = () => {
  return (
    <div className="flex flex-col gap-4">
      <ProfileEventList
        title="Recently hosted events"
        events={[]}
        emptyMessage="No events hosted yet"
      />
      <ProfileEventList
        title="Recently joined events"
        events={[]}
        emptyMessage="No events joined yet"
      />
    </div>
  );
};
