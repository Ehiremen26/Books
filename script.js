// const axios = require("axios");
import {
  get,
  createBookObject,
  removeSpinner,
  renderSpinner,
  clear,
  navigateById,
  pageUpdate,
} from "./common.js";

const searchButton = document.querySelector(".btn");
const searchTextField = document.querySelector(".search-bar");
const parentElement = document.querySelector(".books-tile");
const spinnerParent = document.querySelector(".spinner-parent");
const pagePrev = document.querySelector(".page-prev");
const pageNext = document.querySelector(".page-next");
const pagePrevText = document.querySelector(".page-prev-text");
const pageNextText = document.querySelector(".page-next-text");
const paginationSection = document.querySelector(".pagination");
const homePage = document.querySelector(".books-title");

let maxPages = 1;
let bookAvailable = false;
let searchMode = false;
let pageIndex = 1;

async function Main() {
  // setup

  displayBooks(pageIndex);

  // listeners
}

async function displayBooks(index) {
  // Index is an integer
  hidePaginationSection();

  clear(parentElement);

  renderSpinner(spinnerParent);

  const pageBookList = await pageUpdate(
    index,
    searchMode,
    searchTextField.value
  );

  maxPages = pageBookList[1];

  render(pageBookList[0]);

  removeSpinner(spinnerParent);

  showPaginationSection();
}

// homePage.addEventListener("click", function () {
//   get(url);
// });

searchButton.addEventListener("click", function () {
  searchMode = true;
  pageIndex = 1;

  displayBooks(pageIndex);
});

pagePrev.addEventListener("click", function () {
  paginationPrevious();
});

pageNext.addEventListener("click", function () {
  paginationNext();
});

// pagination

function paginationNext() {
  pageIndex++;
  displayBooks(pageIndex);
}

function paginationPrevious() {
  pageIndex--;
  if (pageIndex < 1) {
    pageIndex = 1;
  }
  displayBooks(pageIndex);
}

function showPaginationSection() {
  pageNextText.innerHTML = `Page ${pageIndex + 1}`;
  pagePrevText.innerHTML = `Page ${pageIndex - 1}`;

  if (bookAvailable) {
    paginationSection.style.visibility = "visible";
  } else {
    paginationSection.style.visibility = "hidden";
  }

  if (pageIndex === 1) {
    pagePrev.style.visibility = "hidden";
  } else {
    pagePrev.style.visibility = "visible";
  }

  if (pageIndex >= maxPages) {
    pageNext.style.visibility = "hidden";
  } else {
    pageNext.style.visibility = "visible";
  }
}

function hidePaginationSection() {
  paginationSection.style.visibility = "hidden";
}

function render(books) {
  if (!books || (Array.isArray(books) && books.length === 0)) {
    bookAvailable = false;
    return renderError();
  }

  bookAvailable = true;

  let markupOfBooks = [];

  books.forEach((book) => {
    const markup = generateMarkup(book);
    markupOfBooks.push(markup);
  });

  const bookListItems = markupOfBooks.join("");

  clear(parentElement);

  parentElement.insertAdjacentHTML("afterbegin", bookListItems);

  const divs = document.querySelectorAll(".book-class");

  // Attach the event listener to each div
  divs.forEach((div) => {
    div.addEventListener("click", handleDivClick);
  });
}

function handleDivClick(event) {
  // Get the id of the clicked div
  const divId = event.target.closest(".book-class").id;
  console.log(`Div with id ${divId} was clicked`);
  navigateById(divId);
}

function generateMarkup(book) {
  // const id = window.location.hash.slice(1);

  return `
    <div id="${book.id}" class="book-class">
  <ul class="books-title-list">
    <li class="books-list">
      <img src="${book.bookCover}" alt="Book image"/>
      
    </li>
  </ul>
</div>
  `;
}

function renderError() {
  console.log(7777);
  let markup;

  if (searchMode) {
    markup = `
    <div class="error">

    <p class="error-message">Book Search Not Found 🔍</p>

</div>
  `;
  } else {
    markup = `
    <div class="error">

    <p class="error-message">An Error Occurred 💥💥💥</p>

</div>
  `;
  }

  clear(parentElement);
  parentElement.insertAdjacentHTML("afterbegin", markup);
}

Main();
