// const axios = require("axios");

// console.log(axios.isCancel("something"));
const searchButton = document.querySelector(".btn");
const searchTextField = document.querySelector(".search-bar");

function Main() {}

async function get(url) {
  // make GET req to the given url
  try {
    const data = await axios.get(url);
    return data.data;
  } catch (err) {
    console.log(`${err}`);
    return null;
  }
}

const getBooks = async function () {
  const url = "https://gutendex.com/books/?page=2";
  const data = await get(url);

  const bookLists = processBookData(data);
  render(bookLists);
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

const createBookObject = function (data) {
  return {
    id: data.id,
    title: data.title,
    authors: processAuthors(data.authors),
    subjects: data.subjects,
    bookCover: data.formats["image/jpeg"],
  };
};

const searchForBooks = async function (search) {
  try {
    const searchData = await axios.get(
      `https://gutendex.com/books/?search=${search}`
    );
    return searchData.data;
  } catch (err) {
    console.log(`${err}`);
    return null;
  }
};

searchButton.addEventListener("click", function () {
  const h = searchForBooks(searchTextField.value);
  h.then((data) => {
    const bookResults = processBookData(data);
    console.log(bookResults);

    render(bookResults);
  });
});

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

function processAuthors(authors) {
  let processedAuthors = [];
  authors.forEach((author) => {
    processedAuthors.push(author.name);
  });

  return processedAuthors;
}

function render(books) {
  if (!books || (Array.isArray(books) && books.length === 0))
    return renderError();

  const parentElement = document.querySelector(".books-tile");

  let markupOfBooks = [];
  books.forEach((book) => {
    const markup = generateMarkup(book);
    markupOfBooks.push(markup);
  });
  const bookListItems = markupOfBooks.join("");

  clear(parentElement);
  parentElement.insertAdjacentHTML("afterbegin", bookListItems);
}

function generateMarkup(book) {
  // const id = window.location.hash.slice(1);

  return `
    <div>
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

function renderSpinner() {
  const parentElement = document.querySelector(".spinner-parent");
  const markup = `
    <div class="spinner">
      <svg>
        <use href="img/icons.svg#icon-loader"></use>
      </svg>
    </div>
  `;
  clear(parentElement);
  parentElement.insertAdjacentHTML("afterbegin", markup);
}

function removeSpinner() {
  const parentElement = document.querySelector(".spinner-parent");
  clear(parentElement);
}

function clear(parentElement) {
  parentElement.innerHTML = "";
}

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
