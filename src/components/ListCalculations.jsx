import React, { useEffect, useState } from "react";
import http from "../services/utility";
import { paths } from "../utils/path";
import CachedIcon from "@mui/icons-material/Cached";
import { IconButton } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

export default function ListCalculations({
  updateCalculationString,
  updateCalculationId,
  reinitList,
  calculationId,
}) {
  const [data, setData] = useState([]);

  useEffect(() => {
    listCalculations();
  }, [reinitList]);

  const listCalculations = async () => {
    await http
      .get(paths?.get_calculations)
      .then((res) => {
        let data = res?.data?.data;
        for (let i = 0; i < data.length; i++) {
          data[i]["backend_id"] = data[i]?.id;
          data[i].id = i + 1;
          data[i].updatedAt = new Date(data[i]?.updatedAt)
            .toUTCString()
            .split("GMT")[0];
          try {
            data[i]["evalSolution"] = eval(data[i].calculation_string);
          } catch (error) {}
        }
        setData(data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const existingCalculation = (id, string) => {
    updateCalculationId(id);
    updateCalculationString(string);
  };

  const deleteCalculation = async (id) => {
    if (id === calculationId) {
      updateCalculationId(null);
    }
    await http
      .post(paths?.delete_calculation, { id: id })
      .then((res) => {
        listCalculations();
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div className="list_calculations">
      <h2>Your Calculations</h2>
      <br />
      <table>
        <tr>
          <th>Id</th>
          <th>Name</th>
          <th>Calculation</th>
          <th>Created Time</th>
          <th>Result</th>
          <th></th>
        </tr>
        {data.map((list) => {
          return (
            <tr key={list.id}>
              <td>{list?.id}</td>
              <td>
                {list?.calculation_name ? list?.calculation_name : "Unknown"}
              </td>
              <td>
                {list?.calculation_string?.length > 10
                  ? list?.calculation_string?.substring(0, 9) + "..."
                  : list?.calculation_string}
              </td>
              <td>{list?.updatedAt}</td>
              <td>{list?.evalSolution}</td>
              <td>
                <IconButton
                  aria-label="edit"
                  onClick={() =>
                    existingCalculation(
                      list?.backend_id,
                      list?.calculation_string
                    )
                  }
                >
                  <CachedIcon fontSize="small" />
                </IconButton>
                <IconButton
                  aria-label="delete"
                  onClick={() => deleteCalculation(list?.backend_id)}
                >
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </td>
            </tr>
          );
        })}
      </table>
    </div>
  );
}
