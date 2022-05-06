const port = process.env.REACT_APP_PORT || 5555;
const URL = `http://127.0.0.1:${port}/`;
console.log("URL: ", URL);

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

  const get_redis = (ttl) => {
    return ttl
      ? fetch(URL + "cache_data/+ttl").then(handleHttpErrors)
      : fetch(URL + "cache_data/").then(handleHttpErrors);
  };

  return {
    get_tweets,
    get_birthdays,
    post_birthday,
    get_redis,
  };
}

const facade = apiFacade();
export default facade;
