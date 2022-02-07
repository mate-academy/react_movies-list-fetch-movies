export const API_URL = 'https://www.omdbapi.com/?i=tt3896198&apikey=df1adeeb&t=';

// export const getMovie = (title: string) => {
//   return fetch(`${API_URL}[${title}]`)
//     .then(response => response.json());
// };

export const getMovie = async (title: string) => {
  const response = await fetch(`${API_URL}[${title}]`);

  return response.json();
};
