import React, { useState, useEffect } from "react";
import facade from "../facade";
import { Button, Form, Alert } from "react-bootstrap";

export default function Redis() {
  const [ttl, setTtl] = useState(null);
  const [doGet, setDoGet] = useState(false);
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState(null);

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

  const onTtlChange = (e) => {
    setTtl(e.target.value);
    console.log(ttl);
  };
  const onSubmit = (e) => {
    e.preventDefault();
    setAlert(null);
    setDoGet(true);
  };

  useEffect(() => {
    if (doGet) {
      setLoading(true);
      facade
        .get_redis(ttl)
        .then((result) => {
          console.log(result);
          setAlert(JSON.stringify(result));
          setDoGet(false);
          setLoading(false);
        })
        .catch((error) => {
          setAlert(JSON.stringify(error));
        });
    }
  }, [doGet]);

  return (
    <div>
      <h1>Redis</h1>
      <h2>How to enhence applications performance with Redis?</h2>
      <h4>
        You can play a bit by fetching data from theserver
        <br />
        and observing response time according to where data comes from.
        <br />
      </h4>
      <Form>
        <Form.Group key="f1" className="mb-3" controlId="formBasicEmail">
          <Form.Label>Time To Live</Form.Label>
          <Form.Control
            key="person.name"
            type="number"
            placeholder="For how many seconds shoud data be cached?"
            onChange={onTtlChange}
          />
        </Form.Group>
        <Button variant="dark" type="submit" onClick={onSubmit}>
          Submit
        </Button>
        <div>
          {loading ? loader : ""}
          {alert ? <Alert variant={"secondary"}>{alert}</Alert> : ""}
        </div>
      </Form>
    </div>
  );
}
