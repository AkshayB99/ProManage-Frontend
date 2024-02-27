import React, { useState, useEffect, useRef } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Cookies from "universal-cookie";
import upCss from "./updatecard.module.css";

const cookies = new Cookies();

function updateCard({ data, setShowEdit, handleMainCardReload }) {
  const authToken = cookies.get("token");
  const logInData = cookies.get("data");
  const [title, setTitle] = useState(data.title);
  const [sendInput, setSendInput] = useState([]);
  const checklistBoxRef = useRef(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectPriority, setSelectPriority] = useState(data.priority);
  const [inputs, setInputs] = useState([]);

  useEffect(() => {
    const dataChecklist = data.checklist.map((item) => {
      return {
        key: item._id,
        item: item.item,
        checked: item.checked,
      };
    });

    setInputs(dataChecklist);
  }, []);

  useEffect(() => {
    const updatedSendInput = inputs?.map(({ item, checked }) => ({
      item,
      checked,
    }));

    setSendInput(updatedSendInput);
  }, [inputs]);

  const formattedDate = selectedDate
    ? selectedDate.getFullYear() +
      "-" +
      ("0" + (selectedDate.getMonth() + 1)).slice(-2) +
      "-" +
      ("0" + selectedDate.getDate()).slice(-2)
    : null;

  const addInput = () => {
    const newInput = {
      key: Date.now(),
      item: "",
      checked: false,
    };
    setInputs((prevInputs) => [...prevInputs, newInput]);
  };

  useEffect(() => {
    if (checklistBoxRef.current) {
      const { scrollHeight, clientHeight } = checklistBoxRef.current;
      checklistBoxRef.current.scrollTop = scrollHeight - clientHeight;
    }
  }, [inputs]);

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  useEffect(() => {
    if (data?.dueDate) {
      setSelectedDate(new Date(data?.dueDate));
    }
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(
        `${import.meta.env.VITE_URL}api/v1/card/update/${data._id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`,
          },
          body: JSON.stringify({
            title: title,
            priority: selectPriority,
            checklist: sendInput,
            dueDate: formattedDate,
          }),
        }
      );
      const res = await response.json();
      console.log(res);
      if (res.status === "success") {
        handleMainCardReload();
        setShowEdit(false);
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className={upCss.mainContainer}>
      <div className={upCss.popup}>
        <div className={upCss.title}>
          <div>
            <label>
              Title <span>*</span>
            </label>
            <input
              type="text"
              name="title"
              value={title} 
              onChange={(e) => setTitle(e.target.value)} 
            />
          </div>
        </div>
        <div className={upCss.priority}>
          <p>
            Select Priority <span>*</span>
          </p>
          <div
            className={upCss.high}
            onClick={() => setSelectPriority("high")}
            style={
              selectPriority === "high" ? { backgroundColor: "#eeecec" } : null
            }
          >
            <span></span>HIGH PRIORITY
          </div>
          <div
            className={upCss.medium}
            onClick={() => setSelectPriority("medium")}
            style={
              selectPriority === "medium"
                ? { backgroundColor: "#eeecec" }
                : null
            }
          >
            <span></span>MODERATE PRIORITY
          </div>
          <div
            className={upCss.low}
            onClick={() => setSelectPriority("low")}
            style={
              selectPriority === "low" ? { backgroundColor: "#eeecec" } : null
            }
          >
            <span></span>LOW PRIORITY
          </div>
        </div>
        <div className={upCss.checklist}>
          <label>
            Checklist ({inputs.filter((input) => input.checked).length}/
            {inputs?.length}) *
          </label>
          <div ref={checklistBoxRef} className={upCss.checklistBox}>
            {inputs?.map((input) => (
              <div key={input.key} className={upCss.input}>
                <input
                  className={upCss.checkbox}
                  type="checkbox"
                  checked={input.checked}
                  onChange={() => {
                    setInputs((prevInputs) =>
                      prevInputs.map((prevInput) => {
                        if (prevInput.key === input.key) {
                          return { ...prevInput, checked: !prevInput.checked }; 
                        }
                        return prevInput;
                      })
                    );
                  }}
                />
                <input
                  type="text"
                  name={input.item}
                  value={input.item} 
                  onChange={(e) => {
                    setInputs((prevInputs) =>
                      prevInputs.map((prevInput) => {
                        if (prevInput.key === input.key) {
                          return { ...prevInput, item: e.target.value }; 
                        }
                        return prevInput;
                      })
                    );
                  }}
                  className={upCss.inputBox}
                  placeholder="Add item"
                />

                <span
                  className="material-symbols-outlined"
                  onClick={() => {
                    setInputs(
                      (prevInputs) =>
                        prevInputs.filter(
                          (prevInput) => prevInput.key !== input.key
                        ) 
                    );
                  }}
                >
                  delete
                </span>
              </div>
            ))}
            <p onClick={addInput}>Add New +</p>
          </div>
        </div>
        <div className={upCss.buttons}>
          <div className={upCss.datePickerContainer}>
            <DatePicker
              selected={selectedDate}
              onChange={handleDateChange}
              className={upCss.calendarContainer}
              placeholderText={selectedDate ? null : "Select Due Date"}
            />
          </div>
          <div className={upCss.SaveCancle}>
            <button
              className={upCss.canclebtn}
              onClick={() => {
                setShowEdit(false);
                handleMainCardReload();
              }}
            >
              Cancle
            </button>
            <button className={upCss.saveBtn} onClick={handleSave}>
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default updateCard;
