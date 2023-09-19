import React, { useEffect, useState } from "react";
import http from "../services/utility";
import { paths } from "../utils/path";
import ListCalculations from "./ListCalculations";

export default function Calculator() {
  const [calculation, setCalculation] = useState("0");
  const [currentWorkingId, setCurrentWorkingId] = useState(null);
  const [reinitList, setReinitList] = useState(false);
  const [solution, setSolution] = useState("");
  const [name, setName] = useState("");
  var calculation_string = "";

  useEffect(() => {
    var calculator__keypad__panel__btn = document.querySelectorAll(
      ".calculator__keypad__panel__btn"
    );
    for (const button of calculator__keypad__panel__btn) {
      button.addEventListener("click", (btn) => {
        var value = btn?.target?.value;
        if (value === "clear") {
          calculation_string = "";
        } else if (value === "sign") {
          calculation_string += "-";
        } else if (value === "=") {
          try {
            setSolution(
              eval(calculation_string === "" ? 0 : calculation_string)
            );
          } catch (error) {}
        } else {
          if (calculation_string.length === 0 && /^\d/.test(value)) {
            calculation_string = calculation_string + value;
          } else if (calculation_string.length > 0) {
            calculation_string = calculation_string + value;
          }
        }
        document.querySelector("#calculations").value = calculation_string;
        if (calculation_string.length > 0) {
          setCalculation(calculation_string);
        }
      });
    }
  }, []);

  const saveCalculation = async () => {
    if (currentWorkingId) {
      await http
        .post(paths.save_calculation, {
          calculation_string: calculation,
          calculation_id: currentWorkingId,
          calculation_name: name,
        })
        .then((res) => {
          setReinitList((el) => !el);
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      await http
        .post(paths.save_calculation, {
          calculation_string: calculation,
          calculation_name: name,
        })
        .then((res) => {
          setReinitList((el) => !el);
          setCurrentWorkingId(res?.data?.id);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  const updateCalculationString = (string) => {
    calculation_string = string;
    setCalculation(string);
    try {
      document.querySelector("#calculations").value = string;
      document.querySelector("#solution").value = eval(
        calculation_string === "" ? 0 : string
      );
    } catch (error) {}
  };

  const updateCalculationId = (id) => {
    setCurrentWorkingId(id);
  };

  return (
    <div className="content">
      <div className="calculator">
        <h2>Calculator</h2>
        <br />
        <input
          type="text"
          className="calculator__text_box"
          id="calculations"
          value={calculation}
        />
        <input
          type="text"
          className="calculator__text_box_solution"
          id="solution"
          value={solution}
        />
        <div className="calculator__keypad">
          <div className="calculator__keypad__panel">
            <button className="calculator__keypad__panel__btn" value={"clear"}>
              AC
            </button>
            <button className="calculator__keypad__panel__btn" value={"sign"}>
              +/-
            </button>
            <button className="calculator__keypad__panel__btn" value={"%"}>
              %
            </button>
            <button className="calculator__keypad__panel__btn" value={"/"}>
              /
            </button>
          </div>
          <div className="calculator__keypad__panel">
            <button className="calculator__keypad__panel__btn" value={"7"}>
              7
            </button>
            <button className="calculator__keypad__panel__btn" value={"8"}>
              8
            </button>
            <button className="calculator__keypad__panel__btn" value={"9"}>
              9
            </button>
            <button className="calculator__keypad__panel__btn" value={"*"}>
              X
            </button>
          </div>
          <div className="calculator__keypad__panel">
            <button className="calculator__keypad__panel__btn" value={"4"}>
              4
            </button>
            <button className="calculator__keypad__panel__btn" value={"5"}>
              5
            </button>
            <button className="calculator__keypad__panel__btn" value={"6"}>
              6
            </button>
            <button className="calculator__keypad__panel__btn" value={"-"}>
              -
            </button>
          </div>
          <div className="calculator__keypad__panel">
            <button className="calculator__keypad__panel__btn" value={"1"}>
              1
            </button>
            <button className="calculator__keypad__panel__btn" value={"2"}>
              2
            </button>
            <button className="calculator__keypad__panel__btn" value={"3"}>
              3
            </button>
            <button className="calculator__keypad__panel__btn" value={"+"}>
              +
            </button>
          </div>
          <div className="calculator__keypad__panel">
            <button
              className="calculator__keypad__panel__btn calculator__keypad__panel__btn2"
              value={"0"}
            >
              0
            </button>
            <button className="calculator__keypad__panel__btn" value={"."}>
              .
            </button>
            <button className="calculator__keypad__panel__btn" value={"="}>
              =
            </button>
          </div>
        </div>
        <div className="calculator__save_box">
          <h3>Calculation Name</h3>
          <br />
          <input
            type="text"
            className="calculator__save_box__input"
            placeholder="Enter Your Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <button onClick={saveCalculation}>Save</button>
        </div>
      </div>
      <ListCalculations
        updateCalculationString={updateCalculationString}
        updateCalculationId={updateCalculationId}
        reinitList={reinitList}
        calculationId={currentWorkingId}
      />
    </div>
  );
}
