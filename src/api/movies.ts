const url = 'https://www.omdbapi.com';
const apikey = '39f1f4ec';

export async function getMovie(title: string): Promise<Movie> {
  const response = await fetch(`${url}/?apikey=${apikey}&t=[${title}]`);

  return response.json();
}
