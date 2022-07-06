const baseUrl = 'https://www.omdbapi.com/?i=tt3896198&apikey=e6fbf5ec&t=';

export async function getMovie(title: string) {
  const movie = await fetch(`${baseUrl}${title}`);

  return movie.json();
}
