import React from "react";

const Tags = ({ tags, selectedTags, onTagToggle }) => {
    return (
        <div className="tag-cloud">
            {tags.map((tag) => (
                <button
                    key={tag}
                    className={`tag-button ${selectedTags.includes(tag) ? "selected" : ""}`}
                    onClick={() => onTagToggle(tag)}
                >
                    {tag}
                </button>
            ))}
        </div>
    );
};

export default Tags;
