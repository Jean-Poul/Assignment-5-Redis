const URL = "http://127.0.0.1:5000/";

function handleHttpErrors(res) {
  if (!res.ok) {
    return Promise.reject({ status: res.status, fullError: res.json() });
  }
  return res.json();
}

function apiFacade() {
  const makeOptions = (method, body) => {
    var opts = {
      method: method,
      headers: {
        "Content-type": "application/json",
        Accept: "application/json",
      },
    };

    if (body) {
      opts.body = JSON.stringify(body);
    }
    return opts;
  };

  const get_tweets = () => {
    const options = makeOptions("GET");
    return fetch(URL + "10tweets", options).then(handleHttpErrors);
  };

  const get_birthdays = () => {
    const options = makeOptions("GET");
    return fetch(URL + "10birthdays", options).then(handleHttpErrors);
  };

  const post_birthday = (birthday) => {
    const options = makeOptions("POST", birthday);
    return fetch(URL + "addbirthday", options).then(handleHttpErrors);
  };

  return {
    get_tweets,
    get_birthdays,
    post_birthday,
  };
}

const facade = apiFacade();
export default facade;
