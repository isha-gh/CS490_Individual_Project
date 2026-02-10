import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import "./Details.css";

function ActorDetails() {
  const { id } = useParams(); 
  const [actorData, setActorData] = useState(null);

  useEffect(() => {
    setActorData(null); 
    fetch(`http://127.0.0.1:5000/api/actors/${id}`)
      .then(res => res.json())
      .then(data => setActorData(data))
      .catch(err => console.error(err));
  }, [id]); 

  if (!actorData) return <div className="loading">Loading...</div>;

  const { actor_info, top_rented_films } = actorData;

  return (
    <div className="details-container">
      <div className="details-wrapper">
        <h1 className="actor-name">{actor_info.first_name} {actor_info.last_name}</h1>
        <hr />
        <h2 className="section-title">Top 5 Rented Films</h2>
        
        <div className="card-grid">
          {top_rented_films.map(film => (
            <Link to={`/films/${film.film_id}`} className="card" key={film.film_id}>
              <h3>{film.title}</h3>
              <p>Rented <strong>{film.rentals}</strong> times</p>
            </Link>
          ))}
        </div>
        
        <Link to="/" className="back-button">← Back to Dashboard</Link>
      </div>
    </div>
  );
}

export default ActorDetails;