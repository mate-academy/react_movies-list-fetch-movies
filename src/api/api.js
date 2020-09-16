const API_MOVIES = `https://www.omdbapi.com/?apikey=6627e870&t=`;

export async function getMovie(title) {
  const responce = await fetch(`${API_MOVIES}${title}`);
  const result = await responce.json();
  const movie = await result;

  return movie;
}
