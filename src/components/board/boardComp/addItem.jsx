import React, { useState, useEffect, useRef } from "react";
import aiCss from "./additem.module.css";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Cookies from "universal-cookie";

const cookies = new Cookies();

function AddItem({ setShowAddItem, handleMainCardReload }) {
  const authToken = cookies.get("token");
  const logInData = cookies.get("data");
  const [title, setTitle] = useState("");
  const [inputs, setInputs] = useState([]);
  const [sendInput, setSendInput] = useState([]);
  const checklistBoxRef = useRef(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectPriority, setSelectPriority] = useState(null);

  useEffect(() => {
    const updatedSendInput = inputs.map(({ value, checked }) => ({
      item: value,
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

  const removeInput = (keyToRemove) => {
    setInputs((prevInputs) => {
      return prevInputs.filter((input) => input.key !== keyToRemove);
    });
  };

  const toggleChecked = (keyToToggle) => {
    setInputs((prevInputs) => {
      return prevInputs.map((input) => {
        if (input.key === keyToToggle) {
          return { ...input, checked: !input.checked };
        }
        return input;
      });
    });
  };

  const addInput = () => {
    const newInput = {
      key: Date.now(),
      name: `task${inputs.length}`,
      value: "",
      checked: false,
    };
    setInputs((prevInputs) => [...prevInputs, newInput]);
  };

  useEffect(() => {
    // Scroll to the bottom of the checklistBox after adding a new item
    if (checklistBoxRef.current) {
      const { scrollHeight, clientHeight } = checklistBoxRef.current;
      checklistBoxRef.current.scrollTop = scrollHeight - clientHeight;
    }
  }, [inputs]);

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };


  // Sending all the data to the server
  const handleSave = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(`${import.meta.env.VITE_URL}api/v1/card`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({
          userId: logInData.data.user._id,
          title: title,
          priority: selectPriority,
          checklist: sendInput,
          dueDate: formattedDate,
        }),
      });
      const data = await res.json();

      if (data.status === "success") {
        setShowAddItem(false);
        handleMainCardReload();
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className={aiCss.mainContainer}>
      <div className={aiCss.popup}>
        <div className={aiCss.title}>
          <div>
            <label>
              Title <span>*</span>
            </label>
            <input
              type="text"
              name="title"
              placeholder="Enter Task Title"
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
        </div>
        <div className={aiCss.priority}>
          <p>
            Select Priority <span>*</span>
          </p>
          <div
            className={aiCss.high}
            onClick={() => setSelectPriority("high")}
            style={
              selectPriority === "high" ? { backgroundColor: "#eeecec" } : null
            }
          >
            <span></span>HIGH PRIORITY
          </div>
          <div
            className={aiCss.medium}
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
            className={aiCss.low}
            onClick={() => setSelectPriority("low")}
            style={
              selectPriority === "low" ? { backgroundColor: "#eeecec" } : null
            }
          >
            <span></span>LOW PRIORITY
          </div>
        </div>
        <div className={aiCss.checklist}>
          <label>
            Checklist ({inputs.filter((input) => input.checked).length}/
            {inputs.length}) *
          </label>
          <div ref={checklistBoxRef} className={aiCss.checklistBox}>
            {inputs.map((input) => (
              <div key={input.key} className={aiCss.input}>
                <input
                  className={aiCss.checkbox}
                  type="checkbox"
                  checked={input.checked}
                  onChange={() => toggleChecked(input.key)}
                />
                <input
                  type="text"
                  name={input.name}
                  value={input.value}
                  onChange={(e) => {
                    setInputs((prevInputs) =>
                      prevInputs.map((prevInput) => {
                        if (prevInput.key === input.key) {
                          return { ...prevInput, value: e.target.value };
                        }
                        return prevInput;
                      })
                    );
                  }}
                  className={aiCss.inputBox}
                  placeholder="Add a task"
                />
                <span
                  className="material-symbols-outlined"
                  onClick={() => removeInput(input.key)}
                >
                  delete
                </span>
              </div>
            ))}
            <p onClick={addInput}>Add New +</p>
          </div>
        </div>
        <div className={aiCss.buttons}>
          <div className={aiCss.datePickerContainer}>
            <DatePicker
              selected={selectedDate}
              onChange={handleDateChange}
              className={aiCss.calendarContainer}
              placeholderText={selectedDate ? null : "Select Due Date"}
            />
          </div>
          <div className={aiCss.SaveCancle}>
            <button
              className={aiCss.canclebtn}
              onClick={() => {setShowAddItem(false); handleMainCardReload()}}
            >
              Cancle
            </button>
            <button className={aiCss.saveBtn} onClick={handleSave}>
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AddItem;
