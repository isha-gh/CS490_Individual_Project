import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";

function CustomerDetails() {
  const { id } = useParams();
  const [customer, setCustomer] = useState(null);
  const [rentals, setRentals] = useState([]);

  useEffect(() => {
    fetch(`http://127.0.0.1:5000/api/customers/${id}/details`)
      .then(res => res.json())
      .then(data => {
        setCustomer(data.customer);
        setRentals(data.rentals);
      });
  }, [id]);

  const returnMovie = async (rentalId) => {
    await fetch(
      `http://127.0.0.1:5000/api/rentals/${rentalId}/return`,
      { method: "POST" }
    );

    // refresh rentals list without reloading the whole page
    const res = await fetch(`http://127.0.0.1:5000/api/customers/${id}/details`);
    const data = await res.json();
    setRentals(data.rentals);
  };

  if (!customer) return <div>Loading...</div>;

  // split rentals into active and returned groups
  const activeRentals = rentals.filter(r => !r.return_date);
  const historyRentals = rentals.filter(r => r.return_date);

  return (
    <div className="landing-container">
      <h1>{customer.first_name} {customer.last_name}</h1>
      <p>Email: {customer.email}</p>

      {activeRentals.length > 0 && (
        <>
          <h2>Active Rentals</h2>
          <table>
            <thead>
              <tr>
                <th>Film</th>
                <th>Rented</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {activeRentals.map(r => (
                <tr key={r.rental_id}>
                  <td>{r.title}</td>
                  <td>{new Date(r.rental_date).toLocaleDateString()}</td>
                  <td>
                    <button onClick={() => returnMovie(r.rental_id)}>
                      Mark Returned
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}

      {historyRentals.length > 0 && (
        <>
          <h2>Rental History</h2>
          <table>
            <thead>
              <tr>
                <th>Film</th>
                <th>Rented</th>
                <th>Returned</th>
              </tr>
            </thead>
            <tbody>
              {historyRentals.map(r => (
                <tr key={r.rental_id}>
                  <td>{r.title}</td>
                  <td>{new Date(r.rental_date).toLocaleDateString()}</td>
                  <td>{new Date(r.return_date).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}

      <Link to="/customers">← Back</Link>
    </div>
  );
}

export default CustomerDetails;