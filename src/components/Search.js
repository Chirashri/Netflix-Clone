import React, { useState } from "react";
import axios from "../axios";

function Search() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);

  const searchMovies = async (e) => {
    e.preventDefault();
    if (!query) return;

    const res = await axios.get(
      `/search/movie?api_key=395a4027f4be2c81eda5ab3a6f3bdce8&query=${query}`
    );

    setResults(res.data.results);
  };

  return (
    <div style={{ padding: "20px", color: "white" }}>
      <form onSubmit={searchMovies}>
        <input
          type="text"
          placeholder="Search movies..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </form>

      <div style={{ display: "flex", flexWrap: "wrap", marginTop: "20px" }}>
        {results.map((movie) => (
          <div key={movie.id} style={{ margin: "10px" }}>
            <img
              src={`https://image.tmdb.org/t/p/w200${movie.poster_path}`}
              alt={movie.title}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export default Search;
