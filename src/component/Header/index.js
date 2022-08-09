import React from "react";
import "./index.css";

const Header = ({ onExportClick }) => {
  return (
    <header className="header">
      <div className="header-title">Cas de Transport de Personnel</div>
      <button
        className="header-button"
        onClick={onExportClick}
        style={{ marginRight: 20 }}
      >
        Mapping/Export en scenario CFR
      </button>
    </header>
  );
};

export default Header;
