import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./Landing.css";

function Landing() {
  const [topFilms, setTopFilms] = useState([]);
  const [topActors, setTopActors] = useState([]);

  useEffect(() => {
    fetch("http://127.0.0.1:5000/api/top-films")
      .then(res => res.json())
      .then(data => setTopFilms(data))
      .catch(err => console.error(err));
  }, []);

  useEffect(() => {
    fetch("http://127.0.0.1:5000/api/top-actors")
      .then(res => res.json())
      .then(data => setTopActors(data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div className="landing-container">
      <h1>Top 5 Rented Films</h1>
      <div className="card-grid">
        {topFilms.map(film => (
          <Link to={`/films/${film.film_id}`} className="card" key={film.film_id}>
            <h2>{film.title}</h2>
            <p>Rented {film.rentals} times</p> 
          </Link>
        ))}
      </div>

      <h1>Top 5 Actors</h1>
      <div className="card-grid">
        {topActors.map(actor => (
          <Link to={`/actors/${actor.actor_id}`} className="card" key={actor.actor_id}>
            <h2>{actor.first_name} {actor.last_name}</h2>
            <p>Total rentals: {actor.rentals}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default Landing;