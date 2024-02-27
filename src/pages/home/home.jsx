import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "universal-cookie";
import hCss from "./home.module.css";

import Analytics from "../../components/analytics/analytics";
import Board from "../../components/board/board";
import Setting from "../../components/setting/setting";

const cookies = new Cookies();

function Home() {
  const navigate = useNavigate();
  const authToken = cookies.get("token");
  const [selected, setSelected] = useState("board");
  const [logoutOpt, setLogoutOpt] = useState(false);

  useEffect(() => {
    const redirectToLogin = () => {
      if (!authToken) {
        navigate("/login");
      }
    };

    redirectToLogin();
  }, [authToken, navigate]);

  const handleLogOut = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_URL}api/v1/user/logout`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });
      const data = await res.json();

      if (data.status === "success") {
        cookies.remove("token");
        navigate("/login");
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>
      <div className={hCss.mainContainer}>
        <div className={hCss.leftContainer}>
          <div className={hCss.leftHeader}>
            <span className="material-symbols-outlined">deployed_code</span>
            <h3>Pro Manage</h3>
          </div>
          <div className={hCss.leftBody}>
            <div
              onClick={() => setSelected("board")}
              style={{
                color: selected === "board" ? "black" : "inherit",
                backgroundColor:
                  selected === "board" ? "rgba(67, 145, 237, 0.1)" : "inherit",
              }}
            >
              <span className="material-symbols-outlined">space_dashboard</span>
              <p>Board</p>
            </div>
            <div
              onClick={() => setSelected("analytics")}
              style={{
                color: selected === "analytics" ? "black" : "inherit",
                backgroundColor:
                  selected === "analytics"
                    ? "rgba(67, 145, 237, 0.1)"
                    : "inherit",
              }}
            >
              <span className="material-symbols-outlined">database</span>
              <p>Analytics</p>
            </div>
            <div
              onClick={() => setSelected("setting")}
              style={{
                color: selected === "setting" ? "black" : "inherit",
                backgroundColor:
                  selected === "setting"
                    ? "rgba(67, 145, 237, 0.1)"
                    : "inherit",
              }}
            >
              <span className="material-symbols-outlined">settings</span>
              <p>Settings</p>
            </div>
          </div>
          <div className={hCss.leftFooter}>
            <div onClick={() => setLogoutOpt(true)}>
              <span className="material-symbols-outlined">logout</span>
              <p>Log out</p>
            </div>
          </div>
        </div>
        <span className={hCss.rightLine}></span>
        <div className={hCss.rightContainer}>
          {selected === "board" && <Board />}
          {selected === "analytics" && <Analytics />}
          {selected === "setting" && <Setting />}
        </div>
      </div>

      {logoutOpt && (
        <div className={hCss.overlay}>
          <div className={hCss.popup}>
            <p>Are you sure you want to log out?</p>
            <div>
              <button onClick={handleLogOut}>Yes, Logout</button>
              <button onClick={() => setLogoutOpt(false)}>Cancle</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Home;
