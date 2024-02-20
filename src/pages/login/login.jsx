import React, { useState } from "react";
import logcss from "./login.module.css";
import Art from "../../assets/Art.png";
import URL from "../../services/url";
import { useNavigate } from "react-router-dom";
import Cookies from "universal-cookie";

const cookies = new Cookies();

function login() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [user, setUser] = useState({
    email: "",
    password: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${URL}api/v1/user/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(user),
      });
      const data = await response.json();
      cookies.set("token", data.token);
      cookies.set("data", data);
      navigate("/");
    } catch (err) {
      console.log("Sign Up: ", err);
    }
  };

  return (
    <>
      <div className={logcss.main}>
        <div className={logcss.leftContainer}>
          <div className={logcss.imgContainer}>
            <img src={Art} alt="" className={logcss.img} />
            <div className={logcss.round}></div>
          </div>
          <h2 className={logcss.leftTexth2}>Welcome aboard my friend</h2>
          <p className={logcss.leftTextp}>
            just a couple of clicks and we start
          </p>
        </div>
        <div className={logcss.rightContainer}>
          <div>
            <form className={logcss.form}>
              <div className={logcss.input}>
                <span
                  className="material-symbols-outlined"
                  style={{ color: "#797979" }}
                >
                  mail
                </span>
                <input
                  type="text"
                  placeholder="Email"
                  className={logcss.inputBox}
                  onChange={(e) =>
                    setUser({ ...user, email: e.target.value })
                  }
                />
              </div>
              <div className={logcss.input}>
                <span
                  className="material-symbols-outlined"
                  style={{ color: "#797979" }}
                >
                  lock
                </span>
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  className={logcss.inputBox}
                  onChange={(e) =>
                    setUser({ ...user, password: e.target.value })
                  }
                />
                <span
                  className="material-symbols-outlined"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{ cursor: "pointer", color: "#797979" }}
                >
                  visibility
                </span>
              </div>
              <button className={logcss.login} onClick={handleSubmit}>
                Log in
              </button>
              <p className={logcss.p}>Have no account yet?</p>
              <button
                className={logcss.register}
                onClick={() => navigate("/signup")}
              >
                Registr
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}

export default login;
