import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import shareCss from "./shareData.module.css";

function shareData() {
  const { id } = useParams();
  const [data, setData] = useState([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_URL}api/v1/card/share/${id}`,
          {
            method: "GET",
          }
        );
        const res = await response.json();
        if (res.status === "success") {
          setData(res?.data?.collection);
        }
      } catch (error) {
        console.log(error);
      }
    }

    fetchData();
  }, []);

  const clipTitle = (title, limit) => {
    return title?.length > limit ? title.slice(0, limit) + "..." : title;
  };

  function formatDate(dueDate) {
    const date = new Date(dueDate);
    const monthAbbreviation = date.toLocaleString("default", {
      month: "short",
    });
    const day = date.getDate();
    return `${monthAbbreviation} ${day}`;
  }

  return (
    <>
      <div className={shareCss.maincontainer}>
        <div className={shareCss.leftHeader}>
          <span className="material-symbols-outlined">deployed_code</span>
          <h3>Pro Manage</h3>
        </div>
        <div className={shareCss.container}>
          <div className={shareCss.priority}>
            <div
              className={shareCss.priority_icon}
              style={
                data?.priority === "high"
                  ? { backgroundColor: "#ff2473" }
                  : data?.priority === "medium"
                  ? { backgroundColor: "#18b0ff" }
                  : { backgroundColor: "#63c05b" }
              }
            ></div>
            {data?.priority}
          </div>
          <div className={shareCss.heading}>
            <h2>{clipTitle(data?.title, 30)}</h2>
          </div>
          <div className={shareCss.checklist}>
            <label>
              Checklist (
              {data?.checklist?.filter((item) => item.checked === true).length}/
              {data?.checklist?.length})
            </label>
            <div className={shareCss.checklistSubCont}>
              {data?.checklist?.map((item) => (
                <div className={shareCss.checklistBox} key={item._id}>
                  <input
                    className={shareCss.checkbox}
                    type="checkbox"
                    checked={item.checked}
                    readOnly
                  />
                  <p>{item.item}</p>
                </div>
              ))}
            </div>
          </div>
          <div className={shareCss.dueDate}>
            <label>Due Date</label>
            <div
              className={shareCss.dateBtn}
              style={{
                backgroundColor: (() => {
                  if (!data?.dueDate) return "";
                  else if (data?.card === "done") return "#63C05B";
                  else if (
                    ["todo", "progress", "backlog"].includes(data?.card)
                  ) {
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
          </div>
        </div>
      </div>
    </>
  );
}

export default shareData;
