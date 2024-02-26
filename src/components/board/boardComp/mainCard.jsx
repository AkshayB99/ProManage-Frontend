import React, { useState, useEffect, useMemo } from "react";
import cCss from "./mainCard.module.css";
import Card from "./card";
import AddItem from "./addItem";

function MainCard({ heading, handleMainCardReload, cardData }) {
  const [showAddItem, setShowAddItem] = useState(false);
  const [collaps, setCollaps] = useState(true);

  const getHeadingText = () => {
    switch (heading) {
      case 1:
        return "Backlog";
      case 2:
        return "To do";
      case 3:
        return "In Progress";
      case 4:
        return "Done";
      default:
        return "";
    }
  };

  const renderAddSpan = () => {
    if (heading === 2) {
      return (
        <span
          className="material-symbols-outlined"
          onClick={() => setShowAddItem(!showAddItem)}
        >
          add
        </span>
      );
    }
    return null;
  };

  const filteredData = useMemo(() => {
    return cardData.filter((item) => {
      return (
        (item.card === "todo" && heading === 2) ||
        (item.card === "backlog" && heading === 1) ||
        (item.card === "progress" && heading === 3) ||
        (item.card === "done" && heading === 4)
      );
    });
  }, [cardData, heading]);

  return (
    <div className={cCss.mainContainer}>
      <div className={cCss.header}>
        <h4>{getHeadingText()}</h4>
        <div>
          {renderAddSpan()}
          <span
            className="material-symbols-outlined"
            onClick={() => setCollaps(!collaps)}
          >
            layers
          </span>
        </div>
      </div>
      <div className={cCss.card}>
        <div className={cCss.cardContainer}>
          {filteredData.map((item) => (
            <Card
              key={item._id}
              data={item}
              handleMainCardReload={handleMainCardReload}
              collaps={collaps}
            />
          ))}
        </div>
      </div>

      {showAddItem && <AddItem setShowAddItem={setShowAddItem} handleMainCardReload={handleMainCardReload}/>}
    </div>
  );
}

export default MainCard;
