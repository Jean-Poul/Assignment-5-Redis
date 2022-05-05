import facade from "../facade";
import React, { useEffect, useState } from "react";
import { Table, Button } from "react-bootstrap";

export default function Birthdays() {
  const [birthdays, setBirthdays] = useState(null);
  const [loading, setLoading] = useState(false);
  const [startFetch, SetStartFetch] = useState(false);

  function map_birthdays(arr) {
    return arr.map((b) => {
      return (
        <tr key={"tr_" + arr.indexOf(b)}>
          <td>{arr.indexOf(b) + 1}</td>
          <td>{b.date ? b.date : "date not present"}</td>
          <td>{b.person.name ? b.person.name : "name not present"}</td>
          <td>{b.gifts ? b.gifts.join(", ") : "gifts not present"}</td>
        </tr>
      );
    });
  }
  const loader = (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        textAlign: "center",
      }}
    >
      <div className="loader"></div>
    </div>
  );
  const table = (
    <Table striped bordered hover>
      <thead>
        <tr>
          <th>#</th>
          <th>Date</th>
          <th>Person</th>
          <th>Gift List</th>
        </tr>
      </thead>
      <tbody>{birthdays}</tbody>
    </Table>
  );

  const button = (
    <Button variant="dark" onClick={(e) => get_birthdays(e)}>
      Show top 10 hashtags
    </Button>
  );
  const get_birthdays = (e) => {
    e.preventDefault();
    SetStartFetch(true);

    // setBirthdays(map_birthdays([init_birthday]));
  };

  useEffect(() => {
    if (startFetch) {
      setLoading(true);
      facade
        .get_birthdays()
        .then((result) => {
          setBirthdays(map_birthdays(result));
          SetStartFetch(false);
          setLoading(false);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }, [startFetch]);

  return (
    <div>
      {birthdays ? table : button}
      {loading ? loader : ""}
    </div>
  );
}
