const url = 'https://www.omdbapi.com/?apikey=6381aaff&t=';

export async function getMovie(title: string) {
  const movie = await fetch(`${url}${title}`);

  return movie.json();
}
