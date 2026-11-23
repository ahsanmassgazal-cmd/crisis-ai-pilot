import React from "react";

interface LtrProps {
  children: React.ReactNode;
  className?: string;
}

export const Ltr: React.FC<LtrProps> = ({ children, className = "" }) => {
  return (
    <bdi dir="ltr" className={`inline-block tabular-nums ${className}`}>
      {children}
    </bdi>
  );
};
