const titleField = document.querySelector("#title");
const authorField = document.querySelector("#author");
const isbnField = document.querySelector("#isbn");
const submit = document.querySelector("button[type=submit]");
const table = document.querySelector("tbody");
const close = document.querySelectorAll(".close");

let booksArray = [];

let existing = JSON.parse(localStorage.getItem('booksArray'));


if(existing) {
  booksArray = booksArray.concat(existing);
}





function resetForm() {
  authorField.value = "";
  titleField.value = "";
  isbnField.value = "";
}

function renderBookList(array) {

    table.innerHTML = ''

    array.forEach((item,index) => {
      const tr = document.createElement("tr");
      tr.setAttribute('data-index', index)
      tr.innerHTML = `
                  <td >${item.title}</td>
                  <td>${item.author}</td>
                  <td>${item.ISBN}</td>
                  <td ><i  class="fa-solid fa-square-xmark close"></i></td>
           `;
  
      table.appendChild(tr);
    });

    UpdateDOMPointer()

  }
    
  


renderBookList(JSON.parse(localStorage.getItem('booksArray')));



function getValue(e) {
  e.preventDefault()
 
  if (titleField.value && authorField.value && isbnField.value) {
    
    booksArray.unshift({
      title: titleField.value,
      author: authorField.value,
      ISBN: isbnField.value,
    });

  

   localStorage.setItem('booksArray', JSON.stringify(booksArray));



    resetForm();
    renderBookList( booksArray);
   
  } else {
    alert("Oops! Looks like you missed a field. Please complete all fields.");
  }
  
}

submit.addEventListener("click", getValue);



function clickHandler() {
  console.log("clicking close")
   
 let index = +this.parentNode.parentNode.getAttribute('data-index');
 booksArray = booksArray.filter(el => {
  if(el !== booksArray[index]) {
    return el
  }
 })

 localStorage.setItem('booksArray', JSON.stringify(booksArray));

renderBookList(JSON.parse(localStorage.getItem('booksArray')));
UpdateDOMPointer()
}



function UpdateDOMPointer() {
  document.querySelectorAll(".close").forEach((el)=> {
    console.log(el)
    el.addEventListener("click", clickHandler)
  })

}

UpdateDOMPointer()



