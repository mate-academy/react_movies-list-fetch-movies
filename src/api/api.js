const url = 'https://www.omdbapi.com/?apikey=7942a07a&t=';

export const getMovie = async(title) => {
  const response = await fetch(`${url}${title}`);

  try {
    return response.json();
  } catch {
    if (!response.ok) {
      return Promise.reject(
        `${response.status} ${response.status.text}`
      );
  }}
};
