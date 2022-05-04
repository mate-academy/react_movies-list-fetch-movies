/* eslint-disable */
export async function getMovie(title: string) {
  const url = `https://www.omdbapi.com/?apikey=b170ffd0&t=${title}`;

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`${response.status}: ${response.text}`);
  }

  return response.json();
}

export async function getMovies(title?: string, year?: number, type?: string, page?: number) {
  const filmTitle = title ? `&s=${title}` : '';
  const filmYear = year ? `&y=${year}` : '';
  const filmPage = page ? `&=${page}` : '';
  const filmType = type ? `&=${type}` : '';
  const url = `https://www.omdbapi.com/?apikey=b170ffd0${filmTitle + filmYear + filmPage + filmType}`;

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`${response.status}: ${response.text}`);
  }

  const json = await response.json();

  const result = await json['Search'];

  return result || [];
}
