import React, { useEffect, useState, useRef } from "react";
import cardCss from "./card.module.css";
import Cookies from "universal-cookie";
import toast, { Toaster } from "react-hot-toast";
import UpdateCard from "./updateCard";

const cookies = new Cookies();

function Card({ data, handleMainCardReload, collaps }) {
  const authToken = cookies.get("token");
  const [expand, setExpand] = useState(true);
  const [showOptions, setShowOptions] = useState(false);
  const [showEdit, setShowEdit] = useState(false);

  const optionsRef = useRef(null);

  useEffect(() => {
    setExpand(true);
  }, [collaps]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (optionsRef.current && !optionsRef.current.contains(event.target)) {
        setShowOptions(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleCheckboxChange = async (checked, itemId) => {
    try {
      const checkedData = !checked;

      const response = await fetch(
        `${import.meta.env.VITE_URL}api/v1/card/${data._id}/${itemId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`,
          },
          body: JSON.stringify({ checked: checkedData }),
        }
      );
      const res = await response.json();
      if (res.status === "success") {
        handleMainCardReload();
      }
    } catch (error) {
      console.log(error);
    }
  };

  function formatDate(dueDate) {
    const date = new Date(dueDate);
    const monthAbbreviation = date.toLocaleString("default", {
      month: "short",
    });
    const day = date.getDate();
    return `${monthAbbreviation} ${day}`;
  }

  // Define priority options and their corresponding labels
  const priorityOptions = [
    { value: "backlog", label: "Backlog" },
    { value: "todo", label: "Todo" },
    { value: "progress", label: "Progress" },
    { value: "done", label: "Done" },
  ];

  const handlePriority = async (priority) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_URL}api/v1/card/update/${data._id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`,
          },
          body: JSON.stringify({ card: priority }),
        }
      );
      const res = await response.json();
      if (res.status === "success") {
        handleMainCardReload();
      }
    } catch (error) {
      console.log(error);
    }
  };

  //deleting the card
  const handleDelete = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_URL}api/v1/card/userdata/${data._id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`,
          },
        }
      );
      if (response.status === 204) {
        handleMainCardReload();
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleShare = () => {
    toast("Link Copied.", {
      style: { border: "1px solid #48C1B5", backgroundColor: "#F6FFF9" },
    });
  };

  const clipTitle = (title, limit) => {
    return title.length > limit ? title.slice(0, limit) + "..." : title;
  };

  return (
    <div className={cardCss.mainContainer}>
      <div className={cardCss.priorityNbtn}>
        <div className={cardCss.priority}>
          <span
            style={
              data?.priority === "high"
                ? { backgroundColor: "#ff2473" }
                : data?.priority === "medium"
                ? { backgroundColor: "#18b0ff" }
                : { backgroundColor: "#63c05b" }
            }
          ></span>
          {data?.priority}
        </div>
        <span
          className="material-symbols-outlined"
          style={{ cursor: "pointer" }}
          onClick={() => setShowOptions(!showOptions)}
        >
          more_horiz
        </span>
      </div>
      <div className={cardCss.heading} title={data?.title}>
        {clipTitle(data?.title, 20)}
      </div>
      <div className={cardCss.checklistContainer}>
        <div className={cardCss.checklistBtn}>
          <label>
            Checklist (
            {data?.checklist.filter((item) => item.checked === true).length}/
            {data.checklist.length})
          </label>
          <span
            className="material-symbols-outlined"
            onClick={() => setExpand(!expand)}
          >
            expand_more
          </span>
        </div>
        {!expand && (
          <div className={cardCss.checklistSubCont}>
            {data.checklist.map((item) => (
              <div className={cardCss.checklistBox} key={item._id}>
                <input
                  className={cardCss.checkbox}
                  type="checkbox"
                  checked={item.checked}
                  onChange={() => handleCheckboxChange(item.checked, item._id)}
                />
                <p>{item.item}</p>
              </div>
            ))}
          </div>
        )}
      </div>
      <div className={cardCss.btns}>
        <div
          className={cardCss.dateBtn}
          style={{
            backgroundColor: (() => {
              if (!data?.dueDate) return "";
              else if (data?.card === "done") return "#63C05B";
              else if (["todo", "progress", "backlog"].includes(data?.card)) {
                const today = new Date();
                const dueDate = new Date(data?.dueDate);
                if (dueDate > today) return "gray";
                else return "#CF3636";
              } else return "";
            })(),
          }}
        >
          {data?.dueDate ? formatDate(data.dueDate) : null}
        </div>
        <div className={cardCss.priorityBtns}>
          {priorityOptions
            .filter((option) => option.value !== data?.card) // Filter out the current priority
            .map((option) => (
              <p
                key={option.value}
                onClick={() => handlePriority(option.value)}
              >
                {option.label}
              </p>
            ))}
        </div>
      </div>
      {showOptions && (
        <div className={cardCss.options} ref={optionsRef}>
          <p onClick={() => setShowEdit(!showEdit)}>Edit</p>
          <p onClick={handleShare}>Share</p>
          <p style={{ color: "red" }} onClick={handleDelete}>
            Delete
          </p>
        </div>
      )}
      {showEdit && (
        <UpdateCard
          data={data}
          handleMainCardReload={handleMainCardReload}
          setShowEdit={setShowEdit}
        />
      )}
      <Toaster position="top-right" />
    </div>
  );
}

export default Card;
