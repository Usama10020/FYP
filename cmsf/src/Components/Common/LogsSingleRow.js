import React from "react";

const LogsSingleRow = (test) => {
  return (
    <>
      <tr>
        <td>{test.sr}</td>
        <td>{test.uid}</td>
        <td>{test.dt}</td>
        <td style={{ width: "65%" }}>{test.desc}</td>
      </tr>
    </>
  );
};

export default LogsSingleRow;
