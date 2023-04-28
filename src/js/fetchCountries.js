import Notiflix from 'notiflix';

export default function fetchCountries(name) {
  const option = 'fields=name,capital,population,flags,languages';
  const url = 'https://restcountries.com/v3.1/name/';
  return fetch(`${url}${name}?${option}`)
    .then(response => {
      if (!response.ok) {
        throw new Error(response.status);
      }
      return response.json();
    })
    .then(data => {
      return data;
    })
    .catch(error => {
      Notiflix.Notify.failure('Oops, there is no country with that name');
      return error;
    });
}
