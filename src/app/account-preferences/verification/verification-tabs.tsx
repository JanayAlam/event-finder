"use client";

import Tabs from "@/components/shared/molecules/tabs";
import React, { useCallback } from "react";
import NIDForm from "./nid-form";
import PassportForm from "./passport-form";

const VerificationTabs: React.FC = () => {
  const render = useCallback((_label: string, value: string) => {
    switch (value) {
      case "nid":
        return <NIDForm />;
      case "passport":
        return <PassportForm />;
      default:
        return null;
    }
  }, []);

  return (
    <Tabs
      items={[
        { label: "NID", value: "nid" },
        { label: "Passport", value: "passport" }
      ]}
      render={render}
    />
  );
};

export default VerificationTabs;
