const url = 'http://www.omdbapi.com/?i=tt3896198&apikey=cb375747&t=';

export async function getMovie(title: string) {
  const movie = await fetch(`${url}${title}`);

  return movie.json();
}
