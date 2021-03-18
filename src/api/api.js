const url = 'http://www.omdbapi.com/?apikey=7942a07a&t=';

export const getMovie = async(title) => {
  const response = await fetch(`${url}${title}`);

  if (!response.ok) {
    // eslint-disable-next-line
    return Promise.reject(
      `${response.status} ${response.status.text}`,
    );
  }

  return response.json();
};
