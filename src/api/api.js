
// export const request = async title => fetch(`${BASE_URL}&t=${title}`)
//   .then((response) => {
//     // if (!response.ok) {
//     //   throw new Error(`${response.status} - ${response.statusText}`);
//     // }

//     return response.json();
//   });

const BASE_URL = 'https://www.omdbapi.com/?apikey=c77ea3c8';

export const request = async title => fetch(`${BASE_URL}&t=${title}`)
  .then((response) => {
    if (!response.ok) {
      throw new Error(`${response.status} - ${response.statusText}`);
    }

    return response.json();
  });
