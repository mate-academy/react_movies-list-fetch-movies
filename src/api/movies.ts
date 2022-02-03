export async function getMovie(title: string) {
  const url = `https://www.omdbapi.com/?apikey=b170ffd0&t=${title}`;

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`${response.status}: ${response.text}`);
  }

  return response.json();
}
