const apiKey = 'e45b811a';
const BASE_URL = `https://www.omdbapi.com/?apikey=${apiKey}&t=`;

const request = (title: string): Promise<Movie> => {
  return fetch(`${BASE_URL}${title}`)
    .then(response => {
      if (!response.ok) {
        throw new Error(`${response.status} - ${response.statusText}`);
      }

      return response.json();
    });
};

export const getMovie = (title: string) => {
  return request(title);
};
