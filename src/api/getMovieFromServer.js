const BASE_URL = `https://www.omdbapi.com/?apikey=5a5359e&t=`;

export const getMivieFromServer = (title) => {
  const url = BASE_URL + title;

  return fetch(url)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`${response.status} - ${response.statusText}`);
      }

      return response.json();
    });
};
