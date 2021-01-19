import { useEffect, useRef } from "react";
import { history } from "../api/history";

const componentName = "useHistory";
const debug = require("debug")(`front:${componentName}`);

/**
 * Get dynamic current location
 */

export const useHistory = (
  callback: (e: { location: any; action: any }) => void,
  deps = []
) => {
  const unlistenHistory = useRef(null);
  useEffect(() => {
    unlistenHistory.current = history.listen(({ location, action }) => {
      callback({ location, action });
    });
    return () => unlistenHistory.current();
  }, deps);
};
