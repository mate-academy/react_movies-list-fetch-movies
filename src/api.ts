const BASE_URL = 'http://www.omdbapi.com/';

const request = (url: string) => {
  return fetch(`${BASE_URL}?${url}&apikey=ad4d484f`, {
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
  })
    .then(res => {
      if (!res.ok) {
        throw new Error(`${res.status}-${res.statusText}`);
      }

      return res.json();
    });
};

export const getMovie = (title: string) => {
  return request(`t=${title}`);
};
