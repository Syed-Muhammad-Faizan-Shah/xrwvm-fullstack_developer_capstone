import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import "./Dealers.css";
import "../assets/style.css";
import Header from '../Header/Header';

const PostReview = () => {
  const [dealer, setDealer] = useState({});
  const [review, setReview] = useState("");
  const [model, setModel] = useState("");
  const [year, setYear] = useState("");
  const [date, setDate] = useState("");
  const [carmodels, setCarmodels] = useState([]);

  const params = useParams();
  const id = params.id;

  const root_url = window.location.origin + "/";
  const dealer_url = `${root_url}djangoapp/dealer/${id}`;
  const review_url = `${root_url}djangoapp/add_review`;
  const carmodels_url = `${root_url}djangoapp/get_cars`;

  // Handle review post
  const postreview = async () => {
    let name = sessionStorage.getItem("firstname") + " " + sessionStorage.getItem("lastname");
    if (name.includes("null")) {
      name = sessionStorage.getItem("username");
    }

    if (!model || !review || !date || !year) {
      alert("All details are mandatory");
      return;
    }

    // Handle car models with spaces
    let [make_chosen, ...model_parts] = model.split(" ");
    let model_chosen = model_parts.join(" ");

    const jsoninput = JSON.stringify({
      name: name,
      dealership: id,
      review: review,
      purchase: true,
      purchase_date: date,
      car_make: make_chosen,
      car_model: model_chosen,
      car_year: year,
    });

    console.log("Posting review:", jsoninput);

    try {
      const res = await fetch(review_url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: jsoninput,
      });

      const json = await res.json();
      if (json.status === 200) {
        window.location.href = `${root_url}dealer/${id}`;
      } else {
        alert("Error posting review");
      }
    } catch (err) {
      console.error("Error posting review:", err);
    }
  };

  // Fetch dealer details
  const get_dealer = async () => {
    try {
      const res = await fetch(dealer_url);
      const retobj = await res.json();
      if (retobj.status === 200 && retobj.dealer) {
        setDealer(retobj.dealer);
      }
    } catch (err) {
      console.error("Error fetching dealer:", err);
    }
  };

  // Fetch car models
  const get_cars = async () => {
    try {
      const res = await fetch(carmodels_url);
      console.log("Fetch URL:", carmodels_url);
      console.log("Response status:", res.status);

      const text = await res.text();
      console.log("Raw response:", text);

      const retobj = JSON.parse(text);
      console.log("Parsed JSON:", retobj);

      if (retobj.CarModels) {
        setCarmodels(retobj.CarModels);
      }
    } catch (err) {
      console.error("Error fetching car models:", err);
    }
  };

  useEffect(() => {
    get_dealer();
    get_cars();
  }, []);

  return (
    <div>
      <Header />
      <div style={{ margin: "5%" }}>
        <h1 style={{ color: "darkblue" }}>{dealer.full_name}</h1>

        <textarea
          id="review"
          cols="50"
          rows="7"
          onChange={(e) => setReview(e.target.value)}
        />

        <div className="input_field">
          Purchase Date{" "}
          <input type="date" onChange={(e) => setDate(e.target.value)} />
        </div>

        <div className="input_field">
          Car Make
          <select
            name="cars"
            id="cars"
            onChange={(e) => setModel(e.target.value)}
            value={model}
          >
            <option value="" disabled hidden>
              Choose Car Make and Model
            </option>
            {carmodels.map((carmodel, index) => (
              <option
                key={index}
                value={`${carmodel.CarMake} ${carmodel.CarModel}`}
              >
                {carmodel.CarMake} {carmodel.CarModel}
              </option>
            ))}
          </select>
        </div>

        <div className="input_field">
          Car Year{" "}
          <input
            type="number"
            onChange={(e) => setYear(e.target.value)}
            max={2023}
            min={2015}
          />
        </div>

        <div>
          <button className="postreview" onClick={postreview}>
            Post Review
          </button>
        </div>
      </div>
    </div>
  );
};

export default PostReview;
