const BASE_URL = 'https://www.omdbapi.com/?apikey=de242cb8&t=';

// eslint-disable-next-line consistent-return
export const getMovie = async(url) => {
  try {
    const response = await fetch(`${BASE_URL}${url}`);

    if (!response.ok) {
      // eslint-disable-next-line no-console
      console.log(response.statusText);
    }

    const result = await response.json();

    return result;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log(error);
  }
};
