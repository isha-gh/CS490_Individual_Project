import { useState } from "react";
import { Link } from "react-router-dom";
import "./Films.css";

function Films() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);

  const handleSearch = () => {
    fetch(`http://127.0.0.1:5000/api/films/search?query=${query}`)
      .then(res => res.json())
      .then(data => setResults(data))
      .catch(err => console.error(err));
  };

  return (
    <div className="search-container">
      <div className="search-panel">
        <div className="search-header">
          <h1>Search Films</h1>
        </div>

        <div className="search-controls">
          <input
            className="search-input"
            type="text"
            placeholder="Search by title, actor, or genre"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />

          <button className="search-btn" onClick={handleSearch}>Search</button>
        </div>

        <div className="results">
          {results.map(film => (
            <div className="result-card" key={film.film_id}>
              <Link to={`/films/${film.film_id}`} className="result-link">
                <h3>{film.title}</h3>
              </Link>
              <p>Category: {film.category}</p>
              <p>Length: {film.length} mins</p>
              <p>Rating: {film.rating}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Films;
