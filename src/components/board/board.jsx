import React, { useEffect, useState } from "react";
import boardCss from "./board.module.css";
import Cookies from "universal-cookie";
import MainCard from "./boardComp/mainCard";

const cookies = new Cookies();

function Board() {
  const [data, setData] = useState(cookies.get("data"));
  const authToken = cookies.get("token");
  const loginData = cookies.get("data");
  const [selectedPeriod, setSelectedPeriod] = useState("today");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [rendering, setRendering] = useState(false);
  const [cardData, setCardData] = useState([]);
  const [showAddItem, setShowAddItem] = useState(false);

  const handlePeriodChange = (period) => {
    setSelectedPeriod(period);
    setDropdownOpen(false);
  };

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const periods = ["today", "this_week", "this_month"];

  const userName = data?.data?.user?.name;

  const currentDate = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  const handleMainCardReload = () => {
    setRendering(!rendering);
  };

  // changes
  useEffect(() => {
    async function getCard() {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_URL}api/v1/card/userdata/${
            loginData.data.user._id
          }`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${authToken}`,
            },
          }
        );
        const data = await res.json();
        if (data.status === "success") {
          setCardData(data?.data?.items);
        }
      } catch (error) {
        console.log(error);
      }
    }
    getCard();
  }, [showAddItem, rendering]);

  useEffect(() => {
    async function getCard() {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_URL}api/v1/card/${
            loginData.data.user._id
          }/period?period=${selectedPeriod}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${authToken}`,
            },
          }
        );
        const data = await res.json();
        if (data.status === "success") {
          setCardData(data?.data?.items);
        }
      } catch (error) {
        console.log(error);
      }
    }
    getCard()
  }, [selectedPeriod]);

  return (
    <div className={boardCss.mainContainer}>
      <div className={boardCss.heading}>
        <div>
          <h3>Welcome! {userName}</h3>
          <h4>{currentDate}</h4>
        </div>
        <div className={boardCss.secDiv}>
          <h2>Board</h2>
          <div className={boardCss.dropdown}>
            <div className={boardCss.dropdownToggle} onClick={toggleDropdown}>
              {selectedPeriod}
            </div>
            {dropdownOpen && (
              <div className={boardCss.dropdownMenu}>
                {periods.map((period) => (
                  <div
                    key={period}
                    className={boardCss.dropdownItem}
                    onClick={() => handlePeriodChange(period)}
                  >
                    {period}
                  </div>
                ))}
              </div>
            )}
            <span className="material-symbols-outlined">expand_more</span>
          </div>
        </div>
      </div>
      <div className={boardCss.body}>
        <div className={boardCss.bodyDiv}>
          <MainCard
            heading={1}
            handleMainCardReload={handleMainCardReload}
            cardData={cardData}
          />
          <MainCard
            heading={2}
            handleMainCardReload={handleMainCardReload}
            cardData={cardData}
          />
          <MainCard
            heading={3}
            handleMainCardReload={handleMainCardReload}
            cardData={cardData}
          />
          <MainCard
            heading={4}
            handleMainCardReload={handleMainCardReload}
            cardData={cardData}
          />
        </div>
      </div>
    </div>
  );
}

export default Board;
