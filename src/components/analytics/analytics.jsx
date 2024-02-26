import React, { useEffect, useState } from "react";
import anaCss from "./analytics.module.css";
import Cookies from "universal-cookie";

const cookies = new Cookies();

function analytics() {
  const authToken = cookies.get("token");
  const loginData = cookies.get("data");
  const [allData, setAllData] = useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const responce = await fetch(
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
        const data = await responce.json();
        if (data.status === "success") {
          setAllData(data.data.items);
        }
      } catch (error) {
        console.log(error);
      }
    }
    fetchData();
  }, []);

  let progressCount = 0;
  let todoCount = 0;
  let doneCount = 0;
  let backlogCount = 0;

  allData?.forEach((item) => {
    switch (item.card) {
      case "progress":
        progressCount++;
        break;
      case "todo":
        todoCount++;
        break;
      case "done":
        doneCount++;
        break;
      case "backlog":
        backlogCount++;
        break;
      default:
        break;
    }
  });

  let highPriCount = 0;
  let lowPriCount = 0;
  let modPriCount = 0;

  allData?.forEach((item) => {
    switch (item.priority) {
      case "high":
        highPriCount++;
        break;
      case "low":
        lowPriCount++;
        break;
      case "medium":
        modPriCount++;
        break;
      default:
        break;
    }
  });

  const dueDateCount = allData?.reduce((count, item) => {
    if (item.dueDate) {
        count++;
    }
    return count;
}, 0);

  return (
    <>
      <div className={anaCss.mainContainer}>
        <h2 className={anaCss.heading}>Analytics</h2>
        <div className={anaCss.subContainer}>
          <div className={anaCss.leftContainer}>
            <div>
              <span></span>
              <p>Backlog Tasks</p>
              <h4>{backlogCount}</h4>
            </div>
            <div>
              <span></span>
              <p>To-do Tasks</p>
              <h4>{todoCount}</h4>
            </div>
            <div>
              <span></span>
              <p>In-Progress Tasks</p>
              <h4>{progressCount}</h4>
            </div>
            <div>
              <span></span>
              <p>Completed Tasks</p>
              <h4>{doneCount}</h4>
            </div>
          </div>
          <div className={anaCss.rightContainer}>
            <div>
              <span></span>
              <p>Low Priority</p>
              <h4>{lowPriCount}</h4>
            </div>
            <div>
              <span></span>
              <p>Moderate Priority</p>
              <h4>{modPriCount}</h4>
            </div>
            <div>
              <span></span>
              <p>High Priority</p>
              <h4>{highPriCount}</h4>
            </div>
            <div>
              <span></span>
              <p>Due Date Tasks</p>
              <h4>{dueDateCount}</h4>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default analytics;
