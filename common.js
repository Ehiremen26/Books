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
    subjects: data.subject,
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
