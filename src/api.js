const BASE_URL = 'http://www.omdbapi.com/?apikey=dd1635ad&';

export const request = title => fetch(`${BASE_URL}t=${title}`)
  .then((response) => {
    if (response.ok) {
      return response.json();
    }

    throw new Error(
      `${response.status} ${response.statusText}`,
    );
  });
