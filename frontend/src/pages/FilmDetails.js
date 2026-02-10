import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import "./Details.css";

function FilmDetails() {
  const { id } = useParams();
  const [film, setFilm] = useState(null);

  useEffect(() => {
    fetch(`http://127.0.0.1:5000/api/films/${id}`)
      .then(res => res.json())
      .then(data => setFilm(data))
      .catch(err => console.error(err));
  }, [id]);

  if (!film) return <div className="loading">Loading...</div>;

  return (
    <div className="details-container">
      {/* Change this div class */}
      <div className="film-details-wrapper">
        <h1>{film.title}</h1>
        <p className="description">{film.description}</p>
        
        <div className="film-stats">
          <p><strong>Release Year:</strong> {film.release_year}</p>
          <p><strong>Rental Rate:</strong> ${film.rental_rate}</p>
          <p><strong>Length:</strong> {film.length} minutes</p>
        </div>

        <Link to="/" className="back-button">← Back to Home</Link>
      </div>
    </div>
  );
}

export default FilmDetails;