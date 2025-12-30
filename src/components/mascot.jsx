import React, { useState, useEffect } from "react";


// ⭐ Import images from src/assets (correct Vite way)
import cleaning from "../assets/chorebunny.png";
import laundry from "../assets/chorebunny.png";
import lawn from "../assets/chorebunny.png";
import snow from "../assets/chorebunny.png";

export default function Mascot() {
  const [expression, setExpression] = useState("normal");
  const [bubble, setBubble] = useState("");
  const [open, setOpen] = useState(false);

  // Expression → Image map
  const expressions = {
    normal: cleaning,
    happy: laundry,
    blink: lawn,
    surprised: snow,
  };

  // Cycle chore poses every 3s
  useEffect(() => {
    const poses = ["normal", "happy", "blink", "surprised"];
    const cycle = setInterval(() => {
      setExpression(poses[Math.floor(Math.random() * poses.length)]);
    }, 3000);

    return () => clearInterval(cycle);
  }, []);



  // Jump animation
  const jump = () => {
    const el = document.querySelector(".mascot-img");
    el.classList.add("jump");
    setTimeout(() => el.classList.remove("jump"), 450);
  };

  const toggleMenu = () => setOpen((prev) => !prev);

  return (
    <div className="mascot-container">
      {/* Speech bubble */}
      {bubble && <div className="mascot-bubble">{bubble}</div>}

      {/* Mascot (Click = Jump + Toggle Menu) */}
      <img
        src={expressions[expression]}
        className="mascot-img"
        alt="ChorEscape"
        onClick={() => {
          jump();
          toggleMenu();
        }}
      />

      {/* Quick Menu (Shows ONLY when mascot is clicked) */}
      {open && (
        <div className="mascot-links">
          <h4>Let me help you</h4>

          <button onClick={() => (window.location.href = "/pricing-booking")}>
            Book Now!
          </button>

          <button onClick={() => (window.location.href = "/services")}>
            Explore Services
          </button>

          <button onClick={() => (window.location.href = "/shop")}>
            Shop Supplies
          </button>

          <button onClick={() => (window.location.href = "/contact")}>
            Contact Us
          </button>
        </div>
      )}
    </div>
  );
}
