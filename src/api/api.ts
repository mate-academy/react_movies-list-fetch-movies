export async function request(title: string) {
  const requestUrl = `https://www.omdbapi.com/?apikey=77b633d7&t=${title}`;
  const response = await fetch(requestUrl);

  if (!response.ok) {
    throw new Error(`Error ${response.status} - ${response.statusText}`);
  }

  return response.json();
}

export async function getMovie(title: string) {
  const movie = await request(title);

  if (movie.Response === 'False') {
    throw new Error(`Error: ${movie.Error}`);
  }

  return movie;
}
