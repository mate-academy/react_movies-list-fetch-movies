export async function getMovies(title: string) {
  const movie = await (await fetch(`https://www.omdbapi.com/?apikey=f7bb3169&t=${title}`)).json();

  return movie;
}
