export async function get(url) {
  // make GET req to the given url
  try {
    const data = await axios.get(url);
    return data.data;
  } catch (err) {
    console.log(`${err}`);
    return null;
  }
}

export function createBookObject(data) {
  return {
    id: data.id,
    title: data.title,
    authors: processAuthors(data.authors),
    subjects: data.subjects,
    bookCover: data.formats["image/jpeg"],
    downloadEpub: data.formats["application/epub+zip"],
    bookshelves: processBookShelves(data.bookshelves),
  };
}

function processAuthors(authors) {
  let processedAuthors = [];
  authors.forEach((author) => {
    processedAuthors.push(author.name);
  });

  return processedAuthors;
}

// function processSubjects(subject) {
//   let processedSubjects = [];
//   const booksubject = subject.splice(2, 0, undefined);
//   processedSubjects.push(booksubject);

//   return processedSubjects;
// }

function processBookShelves(shelves) {
  const processBookShelves = [];
  shelves.forEach((shelf) => {
    const parts = shelf.split(": ");
    const genre = parts[1];
    processBookShelves.push(genre);
  });
  return processBookShelves;
}

export function renderSpinner(spinnerParent) {
  const markup = `
    <div class="spinner">
      <svg>
        <use href="img/icons.svg#icon-loader"></use>
      </svg>
    </div>
  `;
  clear(spinnerParent);
  spinnerParent.insertAdjacentHTML("afterbegin", markup);
}

export function removeSpinner(spinnerParent) {
  clear(spinnerParent);
}

export function clear(spinnerParent) {
  spinnerParent.innerHTML = "";
}

export function navigateById(id) {
  window.location.href = `hello.html?bookId=${id}`;
}

let booksPerPage = 20;

export async function pageUpdate(pageNo, searchMode, searchValue) {
  let temp = pageNo * booksPerPage;
  const pageAPI = Math.floor(temp / 32) + 1;
  const startPage = ((pageNo - 1) * booksPerPage) % 32;
  const endPage = (temp - 1) % 32;
  let bookList;
  let maxPages;

  let prefixURL = "https://gutendex.com/books/?";

  if (searchMode) {
    prefixURL += `search=${searchValue}&`;
  }

  console.log(pageAPI, startPage, endPage);

  if (startPage < endPage) {
    const url = `${prefixURL}page=${pageAPI}`;
    console.log(url);

    const data = await get(url);
    maxPages = Math.ceil(data.count / booksPerPage);

    bookList = processBookData(data, startPage, endPage);
  } else {
    const url1 = `${prefixURL}page=${pageAPI - 1}`;
    const url2 = `${prefixURL}page=${pageAPI}`;
    const data1 = await get(url1);
    const data2 = await get(url2);

    // maxPages = Math.ceil(data.count / booksPerPage);

    bookList = processBookData2(data1, data2, startPage, endPage);
  }
  console.log(maxPages);

  return [bookList, maxPages];
}

const processBookData2 = function (data1, data2, start, end) {
  if (data1 === null || data2 === null) {
    alert("invalid data");
    return [];
  }
  const processedBooksResults = [];
  const results1 = data1.results;
  const results2 = data2.results;
  for (let i = start; i < results1.length; i++) {
    let temp = createBookObject(results1[i]);
    processedBooksResults.push(temp);
  }
  end = Math.min(end, results2.length - 1);
  for (let i = 0; i <= end; i++) {
    let temp = createBookObject(results2[i]);
    processedBooksResults.push(temp);
  }

  return processedBooksResults;
};

const processBookData = function (data, start, end) {
  if (data === null) {
    alert("invalid data");
    return [];
  }

  const { results } = data;
  const processedBooksResults = [];
  end = Math.min(end, results.length - 1);
  for (let i = start; i <= end; i++) {
    let temp = createBookObject(results[i]);
    processedBooksResults.push(temp);
  }
  return processedBooksResults;
};
