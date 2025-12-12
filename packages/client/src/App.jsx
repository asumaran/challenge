import { useState, useEffect } from "react";
import "./App.css";

function useProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("http://localhost:3000/products");
        const json = await res.json();
        setProducts(json);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const addReview = async (productId, review) => {
    const res = await fetch(
      `http://localhost:3000/products/${productId}/reviews`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(review),
      }
    );
    const data = await res.json();
    setProducts(data);
  };

  return { products, loading, error, addReview };
}

function App() {
  const { products, loading, error, addReview } = useProducts();
  const [selectedProductId, setSelectedProductId] = useState(null);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  const handleAddReview = async (productId, review) => {
    await addReview(productId, review);
    setSelectedProductId(null);
  };

  return (
    <>
      <h1>Products</h1>
      <ul>
        {products.map((product) => (
          <li key={product.id} className="product">
            <h2>{product.name}</h2>
            <h3>Reviews ({product.reviews.length})</h3>
            <ul>
              {product.reviews.map((review) => (
                <li key={review.id} className="review">
                  <strong>{review.reviewer}</strong> -{" "}
                  {"★".repeat(review.rating)}
                  <p>{review.comment}</p>
                </li>
              ))}
            </ul>
            {selectedProductId === product.id ? (
              <ReviewForm
                productId={product.id}
                onCancel={() => setSelectedProductId(null)}
                onSubmit={handleAddReview}
              />
            ) : (
              <button onClick={() => setSelectedProductId(product.id)}>
                Add Review
              </button>
            )}
          </li>
        ))}
      </ul>
    </>
  );
}

function ReviewForm({ productId, onCancel, onSubmit }) {
  const [form, setForm] = useState({ reviewer: "", rating: 5, comment: "" });
  const [errors, setErrors] = useState({});

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};
    if (!form.reviewer.trim()) newErrors.reviewer = "Required";
    if (!form.comment.trim()) newErrors.comment = "Required";
    if (Object.keys(newErrors).length) {
      setErrors(newErrors);
      return;
    }
    onSubmit(productId, form);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor={`name${productId}`}>Name</label>
        <br />
        <input
          autoFocus={true}
          id={`name${productId}`}
          placeholder="Your name"
          value={form.reviewer}
          onChange={(e) => setForm({ ...form, reviewer: e.target.value })}
        />
        {errors.reviewer && <span className="error">{errors.reviewer}</span>}
      </div>
      <div>
        <label htmlFor={`stars${productId}`}>Stars: </label>
        <br />
        <select
          value={form.rating}
          id={`stars${productId}`}
          onChange={(e) => setForm({ ...form, rating: Number(e.target.value) })}
        >
          {[5, 4, 3, 2, 1].map((n) => (
            <option key={n} value={n}>
              {n}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label htmlFor={`comment${productId}`}>Comment</label>
        <br />
        <textarea
          id={`comment${productId}`}
          placeholder="Comment"
          value={form.comment}
          onChange={(e) => setForm({ ...form, comment: e.target.value })}
        />
        {errors.comment && <span className="error">{errors.comment}</span>}
      </div>
      <button type="submit">Submit</button>
      <button type="button" onClick={onCancel}>
        Cancel
      </button>
    </form>
  );
}

export default App;
