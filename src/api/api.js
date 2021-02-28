const BASE_URL = `http://www.omdbapi.com/?apikey=1a5efd02&t=`;

const request = url => fetch(`${BASE_URL}${url}`)
  .then((response) => {
    if (!response.ok) {
      throw new Error(`${response.status} - ${response.statusText}`);
    }

    return response.json();
  });

export const getMovie = title => request(`${title}`);
