const baseURL = 'https://www.omdbapi.com/?apikey=314cbfea&t=';

export async function loadMovie(title: string) {
  try {
    const result = await fetch(`${baseURL}${title}`);
    const data = await result.json();

    return data;
  } catch (error) {
    return (`Error: ${error}`);
  }
}
