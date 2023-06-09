import './css/styles.css';
import axios from 'axios';
import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const BASE_URL = 'https://pixabay.com/api/';
const My_API_key = '35792081-ad86e3eac8072124d950161bb';

const searchForm = document.querySelector('.search-form');
const loadMoreBtn = document.querySelector('.load-more');
const containerMarkUp = document.querySelector('.gallery');

let searchQuery = '';
let pageNumber = 1;
let url = '';
loadMoreBtn.style.display = 'none';
searchForm[1].disabled = true;
let gallery = '';

searchForm.addEventListener('submit', onSearchPhotos);
loadMoreBtn.addEventListener('click', onLoadMore);
searchForm.addEventListener('input', checkInput);

function checkInput(e) {
  const inputPlace = e.currentTarget.elements[0].value.trim();
  if (inputPlace.length === 0) {
    searchForm[1].disabled = true;
  } else {
    searchForm[1].disabled = false;
  }
}

async function onSearchPhotos(evt) {
  evt.preventDefault();
  resetMarkup();
  pageNumber = 1;
  searchQuery = evt.currentTarget.elements.searchQuery.value.trim();
  makeGalery(searchQuery);
}

async function makeGalery(searchQuery) {
  const url = craeteSearchOptions(searchQuery);
  const listPhoto = await getPhoto(url);
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
    } else {
      Notiflix.Notify.success(
        `Hooray! We found ${listPhoto.data.totalHits} images.`
      );
    }
  }
  CreateMarkUp(listPhoto.data.hits);
  loadMoreBtn.style.display = '';
  gallery = new SimpleLightbox('.gallery a');
  gallery.on('show.simplelightbox');
}

async function getPhoto(URL) {
  try {
    const response = await axios.get(URL);
    return response;
  } catch (error) {
    Notiflix.Notify.failure(error);
  }
}
function craeteSearchOptions(searchQuery) {
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
  return url;
}

function onLoadMore(evt) {
  pageNumber += 1;
  makeGalery(searchQuery);
  gallery.refresh();
}

function CreateMarkUp(images) {
  const markup = images.map(image => markupPhotos(image));
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
  <img class="galery_image" src="${previewURL}" alt="${tags}" width="320" loading="lazy" />
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
