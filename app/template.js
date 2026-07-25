"use client";

// Wraps every route; re-mounts on navigation so each page fades/slides in.
export default function Template({ children }) {
  return <div className="page-enter">{children}</div>;
}
