const API_URL = 'https://www.omdbapi.com/?apikey=522ae143';

export async function getMovie(title: string) {
  const movie = await fetch(`${API_URL}&t=${title}`);

  return movie.json();
}
