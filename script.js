// const axios = require("axios");
import {
  get,
  createBookObject,
  removeSpinner,
  renderSpinner,
  clear,
  navigateById,
} from "./common.js";

// console.log(axios.isCancel("something"));
const searchButton = document.querySelector(".btn");
const searchTextField = document.querySelector(".search-bar");
const parentElement = document.querySelector(".books-tile");
const spinnerParent = document.querySelector(".spinner-parent");
const pagePrev = document.querySelector(".page-prev");
const pageNext = document.querySelector(".page-next");

searchButton.addEventListener("click", function () {
  clear(parentElement);

  renderSpinner(spinnerParent);
  searchForBooks(searchTextField.value).then((_) => {
    removeSpinner(spinnerParent);
  });
  // clearInput(searchTextField);
});

pagePrev.addEventListener("click", function () {
  paginationPrevious();
});

pageNext.addEventListener("click", function () {
  paginationNext();
});

let pageIndex = 1;

async function Main() {
  // setup
  displayBooks(pageIndex);

  // listeners
}

async function displayBooks(index) {
  const url = `https://gutendex.com/books/?page=${index}`;
  clear(parentElement);
  renderSpinner(spinnerParent);
  await getBooks(url);
  removeSpinner(spinnerParent);
}

const getBooks = async function (url) {
  const data = await get(url);

  const bookLists = processBookData(data);
  render(bookLists);
};

const searchForBooks = async function (search) {
  const searchUrl = `https://gutendex.com/books/?search=${search}`;
  getBooks(searchUrl);
};

const processBookData = function (data) {
  if (data === null) {
    alert("invalid data");
    return [];
  }

  const { results } = data;
  const processedBooksResults = [];

  results.forEach((data) => {
    let temp = createBookObject(data);
    processedBooksResults.push(temp);
  });
  return processedBooksResults;
};

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

// Configuration
const itemsPerPage = 16;
let currentPage = 1;

// Render items for the current page
function renderItems(items, page, itemsPerPage) {
  const container = document.getElementById("items-container");
  container.innerHTML = ""; // Clear existing content

  const start = (page - 1) * itemsPerPage;
  const end = Math.min(start + itemsPerPage - 1, items.length);

  for (let i = start; i <= end; i++) {
    const itemElement = document.createElement("div");
    itemElement.textContent = items[i].title;
    container.appendChild(itemElement);
  }
}

// function processSubjects(subjects) {
//   let processedSubjects = [];
//   subjects.forEach((subject) => {
//     processedSubjects.push(subjects).join("");
//   });

//   return processedSubjects;
// }

function render(books) {
  if (!books || (Array.isArray(books) && books.length === 0))
    return renderError();

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

  // You can also perform other actions here based on the clicked div
  // For example, showing an alert or changing the content
}

function generateMarkup(book) {
  // const id = window.location.hash.slice(1);

  return `
    <div id="${book.id}" class="book-class">
  <ul class="books-title-list">
    <li class="books-list">
      <img src="${book.bookCover}" alt="Book image"/>
      <p>${book.title}</p>
      <p>By: ${book.authors}</p>
    </li>
  </ul>
</div>
  `;
}

// function clearInput() {
//   searchTextField.querySelector(".search").value = "";
// }

Main();

// Render pagination controls
// function renderPaginationControls(items, itemsPerPage) {
//   const controls = document.getElementById('pagination-controls');
//   controls.innerHTML = ''; // Clear existing content

//   const totalPages = Math.ceil(items.length / itemsPerPage);

//   // Previous button
//   if (currentPage > 1) {
//       const prevButton = document.createElement('button');
//       prevButton.textContent = 'Previous';
//       prevButton.addEventListener('click', () => {
//           currentPage--;
//           updatePage();
//       });
//       controls.appendChild(prevButton);
//   }

//   // Page numbers
//   for (let i = 1; i <= totalPages; i++) {
//       const pageButton = document.createElement('button');
//       pageButton.textContent = i;
//       pageButton.disabled = (i === currentPage);
//       pageButton.addEventListener('click', () => {
//           currentPage = i;
//           updatePage();
//       });
//       controls.appendChild(pageButton);
//   }

//   // Next button
//   if (currentPage < totalPages) {
//       const nextButton = document.createElement('button');
//       nextButton.textContent = 'Next';
//       nextButton.addEventListener('click', () => {
//           currentPage++;
//           updatePage();
//       });
//       controls.appendChild(nextButton);
//   }
// }

// // Update page content and controls
// function updatePage() {
//   renderItems(items, currentPage, itemsPerPage);
//   renderPaginationControls(items, itemsPerPage);
// }

// // Initial render
// updatePage()
