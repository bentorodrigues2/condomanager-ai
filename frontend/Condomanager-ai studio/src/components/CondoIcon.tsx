import React, { useState } from "react";
import iconsData from "../../icons.json";

interface CondoIconProps {
  id: string;
  className?: string;
  size?: number;
  fallback: React.ReactNode;
}

export function CondoIcon({ id, className = "", size = 20, fallback }: CondoIconProps) {
  const [hasError, setHasError] = useState(false);
  
  // Find icon file name from the icons.json
  let fileName = null;
  for (const category of Object.values(iconsData)) {
    if (Array.isArray(category)) {
      const found = category.find((item: any) => item.id === id);
      if (found) {
        fileName = found.file.replace("SVG/", "");
        break;
      }
    }
  }

  if (fileName && !hasError) {
    // PDF requests path: /public/icons/24x24/
    const src = `/icons/24x24/${fileName}`;
    return (
      <img 
        src={src} 
        alt={id}
        style={{ width: size, height: size }}
        className={`inline-block object-contain shrink-0 ${className}`}
        onError={() => setHasError(true)}
      />
    );
  }
  
  return <>{fallback}</>;
}
