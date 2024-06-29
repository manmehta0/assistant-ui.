import { useLayoutEffect, useRef, type FC } from "react";

type OutPortalProps = {
  node: HTMLElement;
};

export const OutPortal: FC<OutPortalProps> = ({ node }) => {
  const parentRef = useRef<HTMLSpanElement>(null);
  useLayoutEffect(() => {
    const parent = parentRef.current;
    if (!parent || !node) return;

    parent.appendChild(node);
    return () => {
      parent.removeChild(node);
    };
  }, [node]);

  if (!node) return null;
  return <span ref={parentRef} />;
};
