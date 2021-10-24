const BASE_URL = 'http://www.omdbapi.com/?apikey=14dd0af7';

export const movies = (title: string) => {
  return fetch(`${BASE_URL}&t=${title}`)
    .then(res => {
      if (!res.ok) {
        throw new Error(`${res.status} - ${res.statusText}`);
      }

      return res.json();
    });
};
