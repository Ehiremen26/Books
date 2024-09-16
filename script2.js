import {
  get,
  createBookObject,
  renderSpinner,
  clear,
  removeSpinner,
  navigateById,
} from "./common.js";

const parentElement = document.querySelector(".book-info");
const spinnerParent = document.querySelector(".spinner-parent");

function main() {
  renderSpinner(spinnerParent);
  const queryParams = getQueryParams();
  if (queryParams.bookId) {
    getBook(`https://gutendex.com/books/${queryParams.bookId}`).then((_) => {
      removeSpinner(spinnerParent);
    });
  } else {
    parentElement.textContent = "No Book ID provided.";
  }
}
// Function to get query parameters

function getQueryParams() {
  const params = new URLSearchParams(window.location.search);
  return {
    bookId: params.get("bookId"),
  };
}

// Use the query parameters

function render(book) {
  if (!book) return renderError();

  const markup = generateMarkup(book);

  clear(parentElement);
  parentElement.insertAdjacentHTML("afterbegin", markup);
}

function generateMarkup(book) {
  // const id = window.location.hash.slice(1);
  console.log(book.authors);
  console.log(book.bookshelves);

  return `
    <div class="book-info">
    <div class="book-div">
    <div class="book-img">
        <img src="${book.bookCover}" alt="Book image" />
      </div>


      <div class="book-flex">

      <div class="book-row">
      <div class="book-first-column"><p>Title</p></div>
      <div><p>${book.title}</p></div>
      </div>
      <div class="book-row">
      <div class="book-first-column"><span>Authors</span></div>
      <div><p>  ${book.authors
        .map((author) => `<span>${author}</span>`)
        .join("")}</p></div>
      </div>
      <div class="book-row">
      <div class="book-first-column"><p>Genre</p></div>
      <div><p>${book.bookshelves}</p></div>
      </div>

      <div class="book-row">
      <div class="book-first-column"><p>Subjects</p></div>
      <div>
          
            ${book.subjects.map((subject) => `<div>${subject}</div>`).join("")}
          
        </div>
      </div>
        
      </div>

      </div>
      
      
      <div class="book-download-class">
      <button class="book-download-btn">
        <a href="${book.downloadEpub}" class="btn-link">Download EPUB</a>
        </button>
        </div>
    </div>
  `;
}

const getBook = async function (url) {
  const data = await get(url);

  const bookLists = processBookData(data);
  render(bookLists);
};

const processBookData = function (data) {
  if (data === null) {
    alert("invalid data");
    return null;
  }

  let book = createBookObject(data);
  return book;
};

main();
