import { ReactNode } from "react";

export function Container({ children }: { children: ReactNode }) {
  return (
    <div style={{ maxWidth: "1280px", margin: "0 auto", width: "100%" }}>
      {children}
    </div>
  );
}








