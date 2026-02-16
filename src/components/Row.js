import React, { useEffect, useState } from "react";
import axios from "../axios";
import API from "../api";
import "./Row.css";
import YouTube from "react-youtube";
import movieTrailer from "movie-trailer";

const base_url = "https://image.tmdb.org/t/p/original/";

function Row({
  title,
  fetchUrl,
  moviesProp,
  isMyList,
  updateMyList
}) {
  const [movies, setMovies] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [trailerUrl, setTrailerUrl] = useState("");

  useEffect(() => {
    if (moviesProp) {
      setMovies(moviesProp);
      return;
    }

    async function fetchData() {
      if (!fetchUrl) return;

      try {
        const request = await axios.get(fetchUrl);
        setMovies(request.data.results);
      } catch (error) {
        console.error(error);
      }
    }

    fetchData();
  }, [fetchUrl, moviesProp]);

  const openModal = (movie) => {
    setSelectedMovie(movie);
    setTrailerUrl("");
  };

  const playTrailer = () => {
    movieTrailer(selectedMovie?.title || selectedMovie?.name || "")
      .then((url) => {
        const urlParams = new URLSearchParams(new URL(url).search);
        setTrailerUrl(urlParams.get("v"));
      })
      .catch((error) => console.log(error));
  };

  // 🔥 ADD TO BACKEND
  const addToMyList = async () => {
    try {
      await API.post("/auth/mylist", selectedMovie);

      const res = await API.get("/auth/mylist");
      updateMyList(res.data);

    } catch (error) {
      console.log(error);
    }
  };

  // 🔥 REMOVE FROM BACKEND
  const removeFromMyList = async () => {
    try {
      await API.delete(`/auth/mylist/${selectedMovie.id}`);

      const res = await API.get("/auth/mylist");
      updateMyList(res.data);

      setSelectedMovie(null);

    } catch (error) {
      console.log(error);
    }
  };

  const opts = {
    height: "390",
    width: "100%",
    playerVars: { autoplay: 1 },
  };

  return (
    <div className="row">
      <h2>{title}</h2>

      <div className="row_posters">
        {movies?.map(
          (movie) =>
            movie.poster_path && (
              <img
                key={movie.id}
                className="row_poster"
                src={`${base_url}${movie.poster_path}`}
                alt={movie.title}
                onClick={() => openModal(movie)}
              />
            )
        )}
      </div>

      {selectedMovie && (
        <div
          className="modal_overlay"
          onClick={() => setSelectedMovie(null)}
        >
          <div
            className="modal_content"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              className="modal_backdrop"
              src={`https://image.tmdb.org/t/p/original/${selectedMovie.backdrop_path}`}
              alt={selectedMovie.title}
            />

            <div className="modal_details">
              <h2>{selectedMovie.title || selectedMovie.name}</h2>

              <p><strong>⭐ Rating:</strong> {selectedMovie.vote_average}</p>
              <p><strong>📅 Release:</strong> {selectedMovie.release_date}</p>
              <p>{selectedMovie.overview}</p>

              <div className="modal_buttons">
                <button className="play_button" onClick={playTrailer}>
                  ▶ Play
                </button>

                {!isMyList ? (
                  <button className="list_button" onClick={addToMyList}>
                    + My List
                  </button>
                ) : (
                  <button className="list_button" onClick={removeFromMyList}>
                    ❌ Remove
                  </button>
                )}
              </div>

              {trailerUrl && <YouTube videoId={trailerUrl} opts={opts} />}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Row;
