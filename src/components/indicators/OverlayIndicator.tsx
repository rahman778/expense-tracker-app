import React from "react";

const OverlayIndicator: React.FC = () => {
  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-20 flex justify-center items-center"
      style={{ height: "100vh" }}
    >
      <div className="animate-spin rounded-full h-20 w-20 border-b-2 border-primary"></div>
    </div>
  );
};

export default OverlayIndicator;
