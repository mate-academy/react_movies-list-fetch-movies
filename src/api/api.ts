const URL_BASE = 'https://www.omdbapi.com?i=tt3896198&apikey=fa576852';

export async function getFilm(title: string) {
  try {
    const response = await fetch(`${URL_BASE}&t=${title}`);

    return await response.json();
  } catch (error) {
    throw new Error('error');
  }
}
