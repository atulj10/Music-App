import { useEffect } from "react";
import { useDispatch } from "react-redux";

import { setQueue } from "../store/slices/playerSlice";
import { queueStorage } from "../services/queueStorage";

export default function QueueLoader() {
  const dispatch = useDispatch();

  useEffect(() => {
    const loadQueue = async () => {
      const savedQueue =
        await queueStorage.load();

      if (savedQueue.length > 0) {
        dispatch(setQueue(savedQueue));
      }
    };

    loadQueue();
  }, []);

  return null;
}