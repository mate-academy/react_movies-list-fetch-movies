const BASE_URL = 'http://www.omdbapi.com/';

export const request = (url, options) => fetch(`${BASE_URL}${url}`, options)
  .then((res) => {
    if (!res.ok) {
      throw new Error(`${res.status} - ${res.statusText}`);
    }

    return res.json();
  });

export const getMovieFromServer = async(title) => {
  const response
    = await fetch(`${BASE_URL}?apikey=70273a11&t=${title}`);

  return response.json();
};

// export const getMovieFromServer = async() => {
//   const response
//     = await fetch(`${BASE_URL}?apikey=70273a11&t=Reign of Judges`);

//   return response.json();
// };
