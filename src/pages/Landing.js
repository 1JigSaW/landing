import React, { useState, useEffect } from "react";
import { generateReview, fetchLanguages, fetchTags, createLink } from "../api";
import Tags from "../components/Tags";

const Landing = () => {
    const [tags, setTags] = useState([]);
    const [selectedTags, setSelectedTags] = useState([]);
    const [languages, setLanguages] = useState([]);
    const [language, setLanguage] = useState("");
    const [review, setReview] = useState("");
    const [loading, setLoading] = useState(false);
    const [personalizedLink, setPersonalizedLink] = useState("");
    const [copied, setCopied] = useState(false);
    const [dataLoading, setDataLoading] = useState(true);

    useEffect(() => {
        const initializeData = async () => {
            try {
                const [linkData, languagesData, tagsData] = await Promise.all([
                    createLink(),
                    fetchLanguages(),
                    fetchTags(),
                ]);

                setPersonalizedLink(linkData.link);
                setLanguages(languagesData);
                setLanguage(languagesData[0]?.code || "");
                setTags(tagsData.map((tag) => tag.name));
            } catch (error) {
                console.error("Failed to initialize data:", error);
            } finally {
                setDataLoading(false);
            }
        };

        initializeData();
    }, []);

    const handleTagToggle = (tag) => {
        setSelectedTags((prev) =>
            prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
        );
    };

    const handleGenerateReview = async () => {
        if (selectedTags.length === 0) {
            alert("Please select at least one tag.");
            return;
        }

        setLoading(true);
        try {
            const data = await generateReview(null, selectedTags, language);
            setReview(data.review);
        } catch (error) {
            console.error("Failed to generate review:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleCopyFinalText = () => {
        navigator.clipboard.writeText(review);
        setCopied(true);
        setTimeout(() => setCopied(false), 3000);
    };

    const handleNavigateToLink = () => {
        if (!personalizedLink) {
            alert("Personalized link is not available.");
            return;
        }
        window.open(personalizedLink, "_blank");
    };

    if (dataLoading) {
        return (
            <div className="data-loader-container">
                <div className="data-loader"></div>
                <p>Loading data...</p>
            </div>
        );
    }

    return (
        <div className="landing">
            {copied && (
                <div className="notification">
                    Text copied to clipboard!
                </div>
            )}
            <h1>Generate Your Review</h1>
            <div className="language-field">
                <label htmlFor="language-select">Select Language:</label>
                <select
                    id="language-select"
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                >
                    {languages.map((lang) => (
                        <option key={lang.code} value={lang.code}>
                            {lang.name}
                        </option>
                    ))}
                </select>
            </div>
            <Tags tags={tags} selectedTags={selectedTags} onTagToggle={handleTagToggle} />
            <button
                className="generate-button"
                onClick={handleGenerateReview}
                disabled={loading}
                style={{
                    position: "relative",
                    padding: "10px 15px",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                }}
            >
                {loading ? (
                    <div className="button-loader"></div>
                ) : review ? (
                    "Regenerate Review"
                ) : (
                    "Generate Review"
                )}
            </button>
            {review && (
                <div className="review-output">
                    <textarea
                        value={review}
                        onChange={(e) => setReview(e.target.value)}
                        style={{
                            width: "100%",
                            height: "150px",
                            marginTop: "10px",
                            padding: "10px",
                            fontSize: "16px",
                            lineHeight: "1.5",
                            border: "1px solid #ccc",
                            borderRadius: "5px",
                            boxSizing: "border-box",
                        }}
                    ></textarea>
                    <div className="actions" style={{ marginTop: "10px", display: "flex", gap: "10px" }}>
                        <button onClick={handleCopyFinalText} style={{ padding: "10px 15px" }}>
                            Copy Text
                        </button>
                        <button onClick={handleNavigateToLink} style={{ padding: "10px 15px" }}>
                            Go to Link
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Landing;