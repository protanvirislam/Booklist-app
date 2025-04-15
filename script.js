// Table Js

// const btn = document.querySelector(".delete");
// const table = document.querySelector("table");

// function clickHandler(e) {
//   setTimeout(() => {
//     table.classList.toggle("threeDMode");
//   }, 1000);
//   table.classList.toggle("threeDMode");
// }

// btn.addEventListener("click", clickHandler);

//main Js
// ______________________________________________________________

class Book {
  constructor(title, author, isbn) {
    this.title = title;
    this.author = author;
    this.isbn = isbn;
  }
}

class UI {
  // Static DOM NODE
  static list_container = document.querySelector("#books-container");
  static form = document.querySelector("#books-form");
  static title = document.querySelector("#title");
  static author = document.querySelector("#author");
  static isbn = document.querySelector("#isbn");
  static body = document.querySelector("body");
  static del = document.querySelector(".delete");

  // Static DOM NODE

  static displayBooks() {
    console.log(Storage.getBooks());
    const books = Storage.getBooks();
    books.forEach((book) => UI.addBookToList(book));
  }

  static addBookToList(book) {
    console.log("rendering");

    const row = document.createElement("tr");
    row.innerHTML = `
          <td>${book.title}</td>
          <td>${book.author}</td>
          <td>${book.isbn}</td>
          <td><i class="fa-solid fa-square-xmark close"></i></td>
   `;

    UI.list_container.insertAdjacentElement("afterbegin", row);
  }

  static clearFormValue() {
    UI.title.value = "";
    UI.author.value = "";
    UI.isbn.value = "";
  }

  static deleteBook(e) {
    if (e.target.classList.contains("close")) {
      e.target.parentNode.parentNode.remove();
      //Also remove book from Storage
      let isbn = e.target.parentNode.previousElementSibling.textContent;
      Storage.removeBook(isbn);

      //Show Success Alert for Delete from List
      UI.showAlert(" Removed From The List", "success");
    }
  }

  static showAlert(message, className) {
    const alertDiv = document.createElement("div");
    alertDiv.className = `alert alert-dismissible alert-${className} fade-out-box`;
    const messageNode = document.createTextNode(message);
    alertDiv.appendChild(messageNode);
    UI.body.insertBefore(alertDiv, UI.form);

    //Vanish after 5 sec
    setTimeout(() => {
      document.querySelector(".alert").classList.add("fade-out");
      document.querySelector(".alert").addEventListener("transitionend", () => {
        document.querySelector(".alert").remove();
      });
    }, 1500);
  }
}

class Storage {
  static getBooks() {
    let books;
    if (typeof localStorage !== undefined) {
      if (localStorage.getItem("books") === null) {
        books = [];
      } else {
        books = JSON.parse(localStorage.getItem("books"));
      }

      return books;
    } else {
      const warnDiv = document.createElement("div");
      warnDiv.className = `alert alert-dismissible alert-warning`;
      warnDiv.innerHTML = `Your Browser Doesn't Support localStorage :( unable to save the book on list"`;
      UI.body.insertBefore(warnDiv, UI.form);
    }
  }

  static addBook(book) {
    let books = Storage.getBooks();
    books.push(book);
    localStorage.setItem("books", JSON.stringify(books));
  }

  static removeBook(isbn) {
    console.log(isbn);
    let books = Storage.getBooks();
    books.forEach((book, index) => {
      if (book.isbn === isbn) {
        books.splice(index, 1);
      }
    });

    localStorage.setItem("books", JSON.stringify(books));
  }

  static deleteAll() {
    let allItems = [...UI.list_container.children];
    allItems.forEach((item) => item.remove());
    localStorage.removeItem("books");

    UI.showAlert("Deleted All Item From The List!", "danger");
  }
}

//Renderign Book
document.addEventListener("DOMContentLoaded", UI.displayBooks);

//Add Book to List
UI.form.addEventListener("submit", (e) => {
  e.preventDefault();
  const title = UI.title.value;
  const author = UI.author.value;
  const isbn = UI.isbn.value;

  //Form Validation
  if (title && author && isbn) {
    //Instantiate book Object from "Book" class;
    let book = new Book(title, author, isbn);

    // add book to UI
    UI.addBookToList(book);

    //add book to Storage
    Storage.addBook(book);

    //Clear The Form Value
    UI.clearFormValue();
    //Show Success Alert
    UI.showAlert("Successfully Added To List", "success");
  } else {
    //Show Failed Alert
    UI.showAlert("please fill in the field", "danger");
  }
});

//Event: Remove Book From List
UI.list_container.addEventListener("click", UI.deleteBook);

//Event: Delete all from localStorate

UI.del.addEventListener("click", Storage.deleteAll);
