import React from "react";

const SearchBar = ({ searchTerm, onSearch }) => {
  return (
    <div
      style={{
        marginBottom: "20px",
        position: "absolute",
        top: "90px",
        right: "100px",
      }}
    >
      <input
        type="text"
        placeholder="Search by name, class, etc."
        value={searchTerm}
        onChange={(event) => onSearch(event.target.value)}
        style={{
          padding: "8px",
          border: "1px solid #ccc",
          borderRadius: "4px",
          fontSize: "14px",
          width: "200px",
        }}
      />
    </div>
  );
};

export default SearchBar;
