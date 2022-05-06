import React, { useState, useEffect } from "react";
import facade from "../facade";
import { Button, Form, Alert, Table } from "react-bootstrap";

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
      const sendDate = new Date().getTime();
      let receiveDate = new Date().getTime();

      facade
        .get_redis(ttl)
        .then((result) => {
          receiveDate = new Date().getTime();
          const responseTimeMs = receiveDate - sendDate;

          console.log(result);
          setAlert(printTable({ ...result, res_time: responseTimeMs }));
          setDoGet(false);
          setLoading(false);
        })
        .catch((error) => {
          console.log(error);
          setAlert(JSON.stringify(error));
        });
    }
  }, [doGet]);
  const printTable = (obj) => {
    return (
      <div>
        <Table styel={{ border: "solid" }}>
          <tbody>
            <tr>
              <th scope="row">cached:</th>
              <td>{JSON.stringify(obj.cached)}</td>
            </tr>
            <tr>
              <th scope="row">response time:</th>
              <td>{JSON.stringify(obj.res_time)} ms</td>
            </tr>
            <tr>
              <th scope="row">top result:</th>
              <td>
                score: {JSON.stringify(obj.top_result.score)} <br />
                value: {JSON.stringify(obj.top_result.value)}
              </td>
            </tr>

            <tr>
              <th scope="row" colSpan="2">
                data:
              </th>
              <td>{JSON.stringify(obj.alldata)}</td>
            </tr>
          </tbody>
        </Table>
      </div>
    );
  };
  return (
    <div>
      <h1>Redis</h1>
      <h2>How to enhence applications performance with Redis?</h2>
      <h4>
        You can play a bit by fetching data from the server
        <br />
        and observing response time according to where the data comes from.
        <br />
        <br />
      </h4>
      <h5>
        You can insert retention time in the form belov - data will be cached
        for given amount of seconds <br />
        <br />
      </h5>
      <h5>
        If cached is 'true', it means that the data have been cached in Redis
        database, <br />
        otherwise data needed to be fetched from the external API. <br />
      </h5>
      <h5>
        Fetched data are being saved in Redis database as sorted set. <br />
        The score is "Average Wage" of each element of the array returned from
        the external API <br />
        and value is the element itself. <br />
        The top score is retrived by 'ZRANGE set_key 0 0 WITHSCORES' command
        <br />
      </h5>
      <br />
      <br />
      <Form>
        <Form.Group key="f1" className="mb-3" controlId="formBasicEmail">
          <Form.Label>Time To Live:</Form.Label>
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
