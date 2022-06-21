const API_KEY = '6e81b2fe';

export async function getFilms(title: string) {
  const response = await fetch(`https://www.omdbapi.com/?apikey=${API_KEY}&t=${title}`);

  return response.json();
}
