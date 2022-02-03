export async function getMovie(title: string) {
  const URL = `https://www.omdbapi.com/?apikey=9a9e9e07&t=${title}`;

  const response = await fetch(URL);

  if (!response) {
    throw new Error('NONE');
  }

  return response.json();
}
