const API_URL = `https://www.omdbapi.com/?i=tt3896198&apikey=efb1a018`;

export async function getMovies(title) {
  return fetch(`${API_URL}&t=${title}`)
    .then(response => response.json());
}
