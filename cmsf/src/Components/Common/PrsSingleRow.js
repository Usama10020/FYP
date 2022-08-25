import React from "react";

const PrsSingleRow = (test) => {
  return (
    <>
      <tr>
        <td>{test.sr}</td>
        <td>{test.id}</td>
        <td>{test.dt}</td>
        <td>{test.desc}</td>
        <td>{test.status}</td>
      </tr>
    </>
  );
};

export default PrsSingleRow;

/*<td style={{ textAlign: "center" }}>
          <button
            title="Mark As Read"
            data-toggle="tooltip"
            style={{
              color: "#57baed",
            }}
          >
            <i className="fa fa-check"></i>
          </button>
        </td>*/
