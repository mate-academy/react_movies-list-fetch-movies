const BASE_URL = `https://www.omdbapi.com/?apikey=e8bbd6b8&t=`;

export function getData(url) {
  return fetch(BASE_URL + url)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`${response.status} - ${response.statusText}`);
      }

      return response.json()
        .then(data => data);
    });
}

export const request = url => getData(url);
