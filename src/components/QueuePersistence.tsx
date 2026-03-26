import { useEffect } from "react";
import { useSelector } from "react-redux";

import { RootState } from "../store";
import { queueStorage } from "../services/queueStorage";

export default function QueuePersistence() {
  const queue = useSelector(
    (state: RootState) => state.player.queue
  );

  useEffect(() => {
    queueStorage.save(queue);
  }, [queue]);

  return null;
}