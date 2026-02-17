import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import "./Details.css";

function FilmDetails() {
  const { id } = useParams();
  const [film, setFilm] = useState(null);
  const [customers, setCustomers] = useState([]);
  const [customerQuery, setCustomerQuery] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [message, setMessage] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [loadingCustomers, setLoadingCustomers] = useState(false);
  const [renting, setRenting] = useState(false);


  useEffect(() => {
    fetch(`http://127.0.0.1:5000/api/films/${id}`)
      .then(res => res.json())
      .then(data => setFilm(data))
      .catch(err => console.error(err));
  }, [id]);

  const rentFilm = async () => {
    if (!selectedCustomer) {
      setMessage("Please select a customer first.");
      return;
    }

    try {
      setRenting(true);
      const res = await fetch(`http://127.0.0.1:5000/api/films/${id}/rent`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ customer_id: selectedCustomer.customer_id }),
      });

      const data = await res.json();

      if (!res.ok) {
        setMessage(data.error || "Unable to rent film.");
      } else {
        setMessage("Film rented successfully!");
      }
    } catch (err) {
      console.error(err);
      setMessage("Something went wrong.");
    } finally {
      setRenting(false);
    }
  };


const searchCustomers = async (value) => {
  setCustomerQuery(value);
  try {
    setLoadingCustomers(true);
    const res = await fetch(`http://127.0.0.1:5000/api/customers/search?query=${value}`);
    const data = await res.json();
    setCustomers(data);
  } catch (err) {
    console.error(err);
    setCustomers([]);
  } finally {
    setLoadingCustomers(false);
  }
};

const openModal = async () => {
  setModalOpen(true);
  // initial load of customers
  await searchCustomers("");
};

const closeModal = () => {
  setModalOpen(false);
  setMessage("");
  setSelectedCustomer(null);
  setCustomerQuery("");
  setCustomers([]);
};




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

        <button className="rent-button" onClick={openModal}>Rent Film</button>
        <Link to="/" className="back-button">← Back to Home</Link>

        {modalOpen && (
          <div className="modal-overlay" role="dialog" aria-modal="true">
            <div className="modal">
              <div className="modal-header">
                <h2>Rent "{film.title}"</h2>
              </div>

              <div className="modal-body">
                {message ? (
                  <div className="modal-message">{message}</div>
                ) : (
                  <>
                    <label className="small-label">Select Customer</label>
                    <input
                      className="search-input"
                      type="text"
                      placeholder="Search customer..."
                      value={customerQuery}
                      onChange={(e) => searchCustomers(e.target.value)}
                    />

                    <div className="customer-results">
                      {loadingCustomers && <div>Loading...</div>}
                      {!loadingCustomers && customers.length === 0 && (
                        <div className="empty">No customers found</div>
                      )}
                      {customers.map((c) => (
                        <div
                          key={c.customer_id}
                          className={`customer-item ${selectedCustomer && selectedCustomer.customer_id === c.customer_id ? 'selected' : ''}`}
                          onClick={() => setSelectedCustomer(c)}
                        >
                          {c.first_name} {c.last_name} {c.email ? `(${c.email})` : ''}
                        </div>
                      ))}

                    </div>

                      {selectedCustomer && (
                        <div className="selected-info">Selected: {selectedCustomer.first_name} {selectedCustomer.last_name}</div>
                      )}
                  </>
                )}
              </div>

              <div className="modal-actions">
                {!message && (
                  <button className="search-btn" onClick={rentFilm} disabled={renting}>
                    {renting ? 'Renting...' : 'Confirm Rent'}
                  </button>
                )}

                <button className="back-button" onClick={closeModal}>Close</button>
                <Link to="/" className="back-button">Go Back Home</Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}





export default FilmDetails;



