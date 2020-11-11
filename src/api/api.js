const BASE_URL = 'http://www.omdbapi.com/?apikey=6807e454&t=';

export const loadMovie = async(title) => {
  const result = await fetch(`${BASE_URL}${title}`);

  if (!result.ok) {
    throw new Error(`${result.status}-${result.statusText}`);
  }

  return result.json();
};
