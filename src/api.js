const MOVIES_URL = `https://www.omdbapi.com/?apikey=6b42759e`;

export async function getMovie(title) {
  const response = await fetch(`${MOVIES_URL}&t=${title}`);

  if (response.status === 200) {
    return response.json();
  }

  throw new Error(response.status);
}
