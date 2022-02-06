const url = 'https://www.omdbapi.com/?apikey=42fb5338&t=';

export async function getMovie(title: string) {
  const movie = await fetch(`${url}${title}`);

  return movie.json();
}
