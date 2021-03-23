const titleUrl = 'https://www.omdbapi.com/?apikey=de242cb8&t=';

export const getFilm = async(breakPoint) => {
  try {
    const response = await fetch(`${titleUrl}${breakPoint}`);

    if (!response.ok) {
      throw new Error();
    }

    return await response.json();
  } catch (error) {
    throw new Error();
  }
};
