const API_KEY = 'e695d20c';
const API_URL = `https://www.omdbapi.com/?apikey=${API_KEY}`;

const request = url => fetch(`${API_URL}${url}`)
  .then((response) => {
    if (!response.ok) {
      throw new Error(`${response.status} --- ${response.statusText}`);
    }

    return response.json();
  });

export const getByTitle = title => request(`&t=${title}`);
