import { RefObject, useEffect } from "react";

export const useClickOutside = (ref: RefObject<HTMLElement>, onClickOutside: () => void) => {
  useEffect(() => {
    const handler = (event: MouseEvent) => {
      if (!ref.current || ref.current.contains(event.target as Node)) {
        return;
      }
      onClickOutside();
    };

    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [ref, onClickOutside]);
};
