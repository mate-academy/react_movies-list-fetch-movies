const reqvest = (endPoint) => {
  const yourkey = '1c07d812';
  const URL = `https://www.omdbapi.com/?apikey=${yourkey}&t=${endPoint}`;

  return fetch(URL)
    .then(response => response.json());
};

export const getMovie = title => reqvest(title);
