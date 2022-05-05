import facade from "../facade";
import React, { useEffect, useState } from "react";
import { Button, Table } from "react-bootstrap";

export default function Hashtags() {
  const [tweets, setTweets] = useState(null);
  const [loading, setLoading] = useState(false);
  const [startFetch, SetStartFetch] = useState(false);

  const get_tweets = (e) => {
    e.preventDefault();
    SetStartFetch(true);
  };

  useEffect(() => {
    if (startFetch) {
      setLoading(true);
      facade
        .get_birthdays()
        .then((result) => {
          setTweets(map_table(result));
          SetStartFetch(false);
          setLoading(false);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }, [startFetch]);

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

  const map_table = (arr) => {
    return arr.map((t) => {
      return (
        <tr key={"tr_" + t.text}>
          <td>{arr.indexOf(t) + 1}</td>
          <td>{t.text}</td>
          <td>{t.fequency}</td>
        </tr>
      );
    });
  };

  const table = (
    <Table striped bordered hover>
      <thead>
        <tr>
          <th>#</th>
          <th>Hashtag</th>
          <th>Fequency</th>
        </tr>
      </thead>
      <tbody>{tweets}</tbody>
    </Table>
  );

  const button = (
    <Button variant="dark" onClick={(e) => get_tweets(e)}>
      Show top 10 hashtags
    </Button>
  );

  return (
    <div>
      {tweets ? table : button}
      {loading ? loader : ""}
    </div>
  );
}
