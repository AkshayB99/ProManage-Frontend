import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "universal-cookie";
import URL from "./../../services/url";

const cookies = new Cookies();

function home() {
  const navigate = useNavigate();
  const authToken = cookies.get("token");

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
      const res = await fetch(`${URL}api/v1/user/logout`, {
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
      <div>Home Page</div>
      <button onClick={handleLogOut}>LogOut</button>
    </>
  );
}

export default home;
