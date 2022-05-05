import facade from "../facade";
import React, { useEffect, useState } from "react";
import { Button, Form, Alert } from "react-bootstrap";

const prepared_gifts = [
  "Creative Thinking Journal",
  "Personalized Tree Wood Carving",
  "Photo Print",
  "Master Theorem Book of Puzzles",
  "Ultimate Birthday Gift Set",
  "Banana-Saving Hats",
  "Flower Glass",
];
const init_gifts = Object.assign(
  {},
  prepared_gifts.map((g) => {
    return { value: g, checked: false };
  })
);
export default function AddBirthday() {
  const [new_birthday, setNewBirthday] = useState({});
  const [gifts, setGifts] = useState(init_gifts);
  const [alert, setAlert] = useState(null);
  const [doPost, setDoPost] = useState(false);
  const [loading, setLoading] = useState(false);

  const form_checks = prepared_gifts.map((g) => (
    <Form.Check
      key={`ch${prepared_gifts.indexOf(g)}`}
      type="checkbox"
      label={g}
      value={prepared_gifts.indexOf(g)}
      onChange={(e) => check_box(e)}
    />
  ));

  const check_box = (e) => {
    gifts[e.target.value].checked = !gifts[e.target.value].checked;
    setGifts(gifts);
  };

  const onNameChange = (e) => {
    setAlert(null);
    setNewBirthday({ ...new_birthday, person: { name: e.target.value } });
  };
  const onDateChange = (e) => {
    setAlert(null);
    setNewBirthday({ ...new_birthday, date: e.target.value });
  };
  const validate_input = () => {
    let valid;
    new_birthday.person && new_birthday.person.name && new_birthday.date
      ? (valid = true)
      : (valid = false);
    return valid;
  };

  const onSubmit = (e) => {
    e.preventDefault();
    setAlert(null);
    const gifts_arr = Object.values(gifts).reduce((p, c) => {
      if (c.checked) p.push(c.value);
      return p;
    }, []);
    const birthday = { ...new_birthday, gifts: gifts_arr };
    if (validate_input()) {
      setNewBirthday(birthday);
      setDoPost(true);
    } else {
      setAlert("Input is incomplete");
    }
  };

  useEffect(() => {
    if (doPost) {
      setLoading(true);
      facade
        .post_birthday(new_birthday)
        .then((result) => {
          console.log(result);
          setAlert(JSON.stringify(result));
          setDoPost(false);
          setLoading(false);
        })
        .catch((error) => {
          setAlert(JSON.stringify(error));
        });
    }
  }, [doPost]);
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
  const form = (
    <Form>
      <Form.Group key="f1" className="mb-3" controlId="formBasicEmail">
        <Form.Label>Persons name</Form.Label>
        <Form.Control
          key="person.name"
          type="text"
          placeholder="Enter name"
          onChange={onNameChange}
        />
      </Form.Group>

      <Form.Group key="f2" className="mb-3" controlId="formBasicPassword">
        <Form.Label>Birthday</Form.Label>
        <Form.Control
          key="date"
          type="date"
          placeholder="date"
          onChange={onDateChange}
        />
      </Form.Group>

      <Form.Group key="f3" className="mb-3" controlId="formBasicCheckbox">
        <Form.Text className="text-muted">Choose some gifts</Form.Text>
        {form_checks}
      </Form.Group>
      <Button variant="dark" type="submit" onClick={onSubmit}>
        Submit
      </Button>
    </Form>
  );
  return (
    <div>
      {loading ? loader : form}
      {alert ? <Alert variant={"secondary"}>{alert}</Alert> : ""}
    </div>
  );
}
