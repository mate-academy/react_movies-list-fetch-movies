const BASE_URL = 'https://www.omdbapi.com/?apikey=';
const API_EY = 'b753e75f';

export const request = title => fetch(`${BASE_URL}${API_EY}&t=${title}`)
  .then((response) => {
    if (response.ok) {
      return response.json();
    }

    throw new Error(`${response.status}: ${response.statusText}`);
  });
