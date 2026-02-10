import { useState } from "react";

function FilmsPage() {
  const [query, setQuery] = useState("");
  const [films, setFilms] = useState([]);
  const [error, setError] = useState("");

  const searchFilms = async () => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/films/search?query=${query}`
      );

      const data = await response.json();
      setFilms(data);
    } catch (err) {
      setError("Failed to fetch films");
    }
  };

  return (
    <div>
      <h1>Films</h1>

      <input
        type="text"
        placeholder="Search by title, actor, or category"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />

      <button onClick={searchFilms}>Search</button>

      {error && <p>{error}</p>}

      {films.map((film) => (
        <div key={film.film_id}>
          <h3>{film.title}</h3>
          <p>Category: {film.category}</p>
          <p>Release Year: {film.release_year}</p>
          <p>Rating: {film.rating}</p>
        </div>
      ))}
    </div>
  );
}

export default FilmsPage;

