const BASE_URL = `http://www.omdbapi.com/?apikey=8424f04f&t=`;

// export function getMovie(title) {
//   return fetch(`${BASE_URL}${title}`)
//     .then(response => response.json());
// }

export const getMovie = async(title) => {
  const response = await fetch(`${BASE_URL}${title}`);

  return response.json();
};
