import React, { useEffect, useState } from "react";
import setCss from "./setting.module.css";
import Cookies from "universal-cookie";

const cookies = new Cookies();

function setting() {
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [updatebtn, setUpdateBtn] = useState(false);
  const [userName, setName] = useState({
    name: "",
  });
  const [user, setUser] = useState({
    passwordCurrent: "",
    password: "",
    passwordConfirm: "",
  });

  useEffect(() => {
    const updateName = async () => {
      if (userName.name) {
        const response = await fetch(`${import.meta.env.VITE_URL}api/v1/user/updateName`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${cookies.get("token")}`,
          },
          body: JSON.stringify(userName),
        });
        const data = await response.json();
        if (data.status === "success") {
          alert("Name updated successfully");
          cookies.set("token", data.token, { path: "/" }); 
          cookies.set("data", data, { path: "/" }); 
          setName({ name: "" }); 
        }
      }
    };

    const updatePassword = async () => {
      if (user.passwordCurrent && user.password && user.passwordConfirm) {
        const response = await fetch(`${import.meta.env.VITE_URL}api/v1/user/updateMyPassword`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${cookies.get("token")}`,
          },
          body: JSON.stringify(user),
        });
        const data = await response.json();
        if (data.status === "success") {
          alert("Password updated successfully");
          cookies.set("token", data.token, { path: "/" }); // Update the token in the cookies
          cookies.set("data", data, { path: "/" }); // Update the user in the cookies
          setUser({ passwordCurrent: "", password: "", passwordConfirm: "" }); // Reset password fields after update
        }
      }
    };

    if (updatebtn) {
      // Only attempt updates if the update button was clicked
      updateName();
      updatePassword();
      setUpdateBtn(false); // Reset the update button state
    }
  }, [updatebtn, userName, user]);

  return (
    <>
      <div className={setCss.mainContainer}>
        <h3>Settings</h3>
        <div className={setCss.subContainer}>
          <div className={setCss.input}>
            <span
              className="material-symbols-outlined"
              style={{ color: "#797979" }}
            >
              person
            </span>
            <input
              type="text"
              placeholder="Name"
              className={setCss.inputBox}
              value={userName.name}
              onChange={(e) => setName({ name: e.target.value })}
            />
          </div>
          <div className={setCss.input}>
            <span
              className="material-symbols-outlined"
              style={{ color: "#797979" }}
            >
              lock
            </span>
            <input
              type={showOldPassword ? "text" : "password"}
              placeholder="Password"
              className={setCss.inputBox}
              value={user.passwordCurrent}
              onChange={(e) =>
                setUser({ ...user, passwordCurrent: e.target.value })
              }
            />
            <span
              className="material-symbols-outlined"
              onClick={() => setShowOldPassword(!showOldPassword)}
              style={{ cursor: "pointer", color: "#797979" }}
            >
              visibility
            </span>
          </div>
          <div className={setCss.input}>
            <span
              className="material-symbols-outlined"
              style={{ color: "#797979" }}
            >
              lock
            </span>
            <input
              type={showNewPassword ? "text" : "password"}
              placeholder="Password"
              className={setCss.inputBox}
              value={user.password}
              onChange={(e) =>
                setUser({
                  ...user,
                  password: e.target.value,
                  passwordConfirm: e.target.value,
                })
              }
            />
            <span
              className="material-symbols-outlined"
              onClick={() => setShowNewPassword(!showNewPassword)}
              style={{ cursor: "pointer", color: "#797979" }}
            >
              visibility
            </span>
          </div>
          <button className={setCss.btn} onClick={() => setUpdateBtn(true)}>
            Update
          </button>
        </div>
      </div>
    </>
  );
}

export default setting;
