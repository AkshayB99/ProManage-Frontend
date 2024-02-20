import React, { useState } from "react";
import regcss from "./signup.module.css";
import Art from "../../assets/Art.png";
import URL from "../../services/url";
import { useNavigate } from "react-router-dom";
import Cookies from "universal-cookie";

const cookies = new Cookies();

function signup() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);
  const [user, setUser] = useState({
    name: "",
    email: "",
    password: "",
    passwordConfirm: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${URL}api/v1/user/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(user),
      });
      const data = await response.json();
      cookies.set("token", data.token);
      cookies.set("data", data);
      if (data.status === "success") {
        navigate("/");
      } else {
        alert(data.message);
      }
    } catch (err) {
      console.log("Sign Up: ", err);
    }
  };

  return (
    <>
      <div className={regcss.main}>
        <div className={regcss.leftContainer}>
          <div className={regcss.imgContainer}>
            <img src={Art} alt="" className={regcss.img} />
            <div className={regcss.round}></div>
          </div>
          <h2 className={regcss.leftTexth2}>Welcome aboard my friend</h2>
          <p className={regcss.leftTextp}>
            just a couple of clicks and we start
          </p>
        </div>
        <div className={regcss.rightContainer}>
          <div>
            <form className={regcss.form}>
              <div className={regcss.input}>
                <span
                  className="material-symbols-outlined"
                  style={{ color: "#797979" }}
                >
                  person
                </span>
                <input
                  type="text"
                  placeholder="Username"
                  className={regcss.inputBox}
                  onChange={(e) => setUser({ ...user, name: e.target.value })}
                />
              </div>
              <div className={regcss.input}>
                <span
                  className="material-symbols-outlined"
                  style={{ color: "#797979" }}
                >
                  mail
                </span>
                <input
                  type="text"
                  placeholder="Email"
                  className={regcss.inputBox}
                  onChange={(e) => setUser({ ...user, email: e.target.value })}
                />
              </div>
              <div className={regcss.input}>
                <span
                  className="material-symbols-outlined"
                  style={{ color: "#797979" }}
                >
                  lock
                </span>
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  className={regcss.inputBox}
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
              <div className={regcss.input}>
                <span
                  className="material-symbols-outlined"
                  style={{ color: "#797979" }}
                >
                  lock
                </span>
                <input
                  type={showPasswordConfirm ? "text" : "password"}
                  placeholder="Password"
                  className={regcss.inputBox}
                  onChange={(e) =>
                    setUser({ ...user, passwordConfirm: e.target.value })
                  }
                />
                <span
                  className="material-symbols-outlined"
                  onClick={() => setShowPasswordConfirm(!showPasswordConfirm)}
                  style={{ cursor: "pointer", color: "#797979" }}
                >
                  visibility
                </span>
              </div>
              <button className={regcss.register} onClick={handleSubmit}>
                Register
              </button>
              <p className={regcss.p}>Have an account?</p>
              <button
                className={regcss.login}
                onClick={() => navigate("/login")}
              >
                Log In
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}

export default signup;
