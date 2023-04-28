import './css/styles.css';
import axios from 'axios';
import Notiflix from 'notiflix';
// import SimpleLightbox from 'simplelightbox';
// import 'simplelightbox/dist/simple-lightbox.min.css';

const BASE_URL = 'https://pixabay.com/api/';
const My_API_key = '35792081-ad86e3eac8072124d950161bb';

// const searchBox = document.getElementsByName('searchQuery');
const searchForm = document.querySelector('.search-form');
const loadMoreBtn = document.querySelector('.load-more');
const containerMarkUp = document.querySelector('.gallery');

let searchQuery = '';
let pageNumber = 1;
let url = '';
loadMoreBtn.style.display = 'none';

searchForm.addEventListener('submit', onSearchPhotos);
loadMoreBtn.addEventListener('click', onLoadMore);

async function onSearchPhotos(evt) {
  evt.preventDefault();
  resetMarkup();
pageNumber = 1;

 searchQuery = evt.currentTarget.elements.searchQuery.value;

  // // const currentPage
  // const options = new URLSearchParams({
  //   key: My_API_key,
  //   q: searchQuery,
  //   image_type: 'photo',
  //   orientation: 'horizontal',
  //   safesearch: true,
  //   page: pageNumber,
  //   per_page: 40,
  // });
  // const url = BASE_URL + `?` + options.toString();
  // craeteSearchOptions(searchQuery);
  console.log(url);

  makeGalery(searchQuery);
  // const listPhoto = await getPhoto(craeteSearchOptions(searchQuery));
  // console.log(listPhoto.data);
  // if (listPhoto.data.total === 0) {
  //   Notiflix.Notify.failure(
  //     'Sorry, there are no images matching your search query. Please try again.'
  //   );
  //   loadMoreBtn.style.display = 'none';
  //   return;
  // } else { if (pageNumber === Math.ceil(listPhoto.data.total / 40)) {Notiflix.Notify.failure(
  //   "We're sorry, but you've reached the end of search results."
  // );
  //     loadMoreBtn.style.display = 'none';
  // }

  // }
  // console.log(listPhoto);
  // console.log(listPhoto.data.hits);
  // CreateMarkUp(listPhoto.data.hits);
  // loadMoreBtn.style.display = '';
}

async function makeGalery(searchQuery) {
  const url = craeteSearchOptions(searchQuery);
  const listPhoto = await getPhoto(url);
  console.log(listPhoto.data);
  if (listPhoto.data.total === 0) {
    Notiflix.Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.'
    );
    loadMoreBtn.style.display = 'none';
    return;
  } else {
    if (pageNumber === Math.ceil(listPhoto.data.totalHits / 40)) {
      Notiflix.Notify.failure(
        "We're sorry, but you've reached the end of search results."
      );
      loadMoreBtn.style.display = 'none';
      return;
    }else{Notiflix.Notify.success(
      `Hooray! We found ${listPhoto.data.totalHits} images.`
    );}
  }
  console.log(listPhoto);
  console.log(listPhoto.data.hits);
  CreateMarkUp(listPhoto.data.hits);
  loadMoreBtn.style.display = '';
}

async function getPhoto(URL) {
  try {
    const response = await axios.get(URL);
    // console.log(response);
    return response;
  } catch (error) {
    Notiflix.Notify.failure(error);
  }
}
function craeteSearchOptions(searchQuery) {
  // const searchQuery = e.currentTarget.elements.searchQuery.value;
  // const currentPage
  const options = new URLSearchParams({
    key: My_API_key,
    q: searchQuery,
    image_type: 'photo',
    orientation: 'horizontal',
    safesearch: true,
    page: pageNumber,
    per_page: 40,
  });
  const url = BASE_URL + `?` + options.toString();
  console.log(url);
  return url;
}

function onLoadMore(evt) {
  console.log(pageNumber);
  pageNumber += 1;
  console.log(evt.currentTarget);
  makeGalery(searchQuery);
}

function CreateMarkUp(images) {
  const markup = images.map(image => markupPhotos(image));
  //   containerMarkUp.insertAdjacentHTML('beforeend', markup);
}

function markupPhotos({
  previewURL,
  largeImageURL,
  tags,
  likes,
  views,
  comments,
  downloads,
}) {
  const markupItem = `
    <div class="photo-card">
  <a class="galery_link" href="${largeImageURL}">
  <img src="${previewURL}" alt="${tags}" width="320" loading="lazy" />
  <div class="info">
    <p class="info-item">
      <b>Likes</b>${likes}
    </p>
    <p class="info-item">
      <b>Views</b>${views}
    </p>
    <p class="info-item">
      <b>Comments</b>${comments}
    </p>
    <p class="info-item">
      <b>Downloads</b> ${downloads}
    </p>
  </div>
  </a>
</div >`;

  containerMarkUp.insertAdjacentHTML('beforeend', markupItem);
}

function resetMarkup() {
  containerMarkUp.innerHTML = '';
}
// const lightbox = new SimpleLightbox('.gallery a', {
//   // captionsData: 'alt',
//   overlay: true,
//   overlayOpacity:0.7,
//   captionPosition: 'bottom',
//   captionDelay: 250,
// });

// function markUpOneCountry({ name, capital, population, flags, languages }) {
//   const markupItemOne = `
//     <div class="list-propertises">
//         <span class="name-official"><img src='${flags.svg}'alt='${
//     flags.alt
//   }' width="50"></img>  ${name.official}</span>
//         <span >Capital: ${capital[0]}</span>
//         <span>Population: ${population}</span>
//         <span>Languages: ${Object.values(languages).join(', ')}</span>
//   </div>
//     `;
//   countryInfo.innerHTML = markupItemOne;
// }
