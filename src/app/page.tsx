"use client";

import { Button } from "@/components/shared/atoms/button";
import StatusRepository from "@/repositories/status.repository";
import { useState } from "react";

export default function Home() {
  const [loading, setLoading] = useState(false);

  const onClick = async () => {
    setLoading(true);
    const data = await StatusRepository.health();
    setLoading(false);
    console.log(data);
  };

  return (
    <div className="flex flex-col gap-2">
      <Button onClick={onClick}>{loading ? "Loading" : "Health"}</Button>
    </div>
  );
}
