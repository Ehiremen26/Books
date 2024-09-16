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

  return `
    <div class="book-info">
      <div class="book-img">
        <img src="${book.bookCover}" alt="Book image" />
      </div>
      <div class="book-flex">
      <div class="book-description">
      <p>Title</p>
      <p>Author</p>
      <p>Genre</p>
      <p>Subjects</p>
      </div>
      <div class="book-details">
        <p>${book.title}</p>
        <p>${book.authors}</p>
        <p>${book.bookshelves}</p>
         <p> 
          <ul>
            ${book.subjects.map((subject) => `<li>${subject}</li>`).join("")}
          </ul>
        </p>
      </div>
      </div>
      <div>
      
      <button class="book-btn">
        <a href="${book.downloadEpub}" class="btn-link">Download Epub</a>
        </button></div>
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
