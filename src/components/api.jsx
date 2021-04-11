const BASE_URL = 'http://www.omdbapi.com/?apikey=a3a9579f';

export const request = title => fetch(`${BASE_URL}&t=${title}`)
  .then((response) => {
    if (!response.ok) {
      throw new Error(`Movie wasn't downloaded`);
    }

    return response.json();
  });
