//classe Book: representa um livro
class Book {
    constructor(title, author, isbn){
        this.title = title;
        this.author = author;
        this.isbn = isbn;
    }
}

//classe UI: lida com tarefas na UI
class UI {
    //pega os livros salvos na localStorage e exibe na UI
    static displayBooks() {
        const books = Store.getBooks();
        
        books.forEach((book) => UI.addBookToList(book));
    }
    
    //adiciona livro à UI (cria elementos HTML)
    static addBookToList(book) {
        const list = document.querySelector('#book-list');
        
        const row = document.createElement('tr');
        
        row.innerHTML = `
        <td>${book.title}</td>
        <td>${book.author}</td>
        <td>${book.isbn}</td>
        <td><a href="#" class="btn btn-danger btn-sm delete">x</a></td>
        `;
        
        list.appendChild(row);
    }
    
    //deletar livro
    static deleteBook(el) {
        if (el.classList.contains('delete')) {
            el.parentElement.parentElement.remove();
        }
    }
    
    //mostrar alerta
    static showAlert(message, className = 'warning') {
        const div = document.createElement('div');
        div.className = `mt-4 alert alert-${className}`;
        div.appendChild(document.createTextNode(message));
        const container = document.querySelector('.container');
        const form = document.querySelector('#book-form');
        const alert = document.querySelector('.alert');
        if(container.contains(alert)){
            return;
        } else {
            container.insertBefore(div, form);
        }
        
        //desaparecer depois de 3s
        setTimeout(() => div.remove(), 2000);
    }
    
    //limpa os campos do form após o submit
    static clearFields(){
        document.querySelector('#title').value = '';
        document.querySelector('#author').value = '';
        document.querySelector('#isbn').value = '';
    }
}

//classe Store: lida com a localStorage
class Store {
    static getBooks() {
        let books;
        if (localStorage.getItem('books') === null) {
            books = [];
        } else {
            books = JSON.parse(localStorage.getItem('books'));
        }

        return books;
    }
    
    static addBook(book) {
        const books = Store.getBooks();

        books.push(book);

        localStorage.setItem('books', JSON.stringify(books));
    }
    
    static removeBook(isbn) {
        const books = Store.getBooks();

        books.forEach((book, index) => {
            if(book.isbn === isbn) {
                books.splice(index, 1);
            }
        });

        localStorage.setItem('books', JSON.stringify(books));
    }
}


//evento: mostrar livros
document.addEventListener('DOMContentLoaded', UI.displayBooks);

//evento: adicionar livros
document.querySelector('#book-form').addEventListener('submit', (e) => {
    //não enviar no submit
    e.preventDefault();
    
    //pegar valores do form
    const title = document.querySelector('#title').value;
    const author = document.querySelector('#author').value;
    const isbn = document.querySelector('#isbn').value;
    
    // validação
    if (title === '' || author === '' || isbn === ''){
        UI.showAlert('Por favor, preencha todos os campos.', 'danger');
    } else {
        //instanciar o livro
        const book = new Book(title, author, isbn);
        
        //adicionar à UI
        UI.addBookToList(book);

        //adicionar à localStorage
        Store.addBook(book);
        
        //mostrar mensagem de sucesso
        UI.showAlert('Livro adicionado com sucesso!', 'success');
        
        //limpar os campos após submeter
        UI.clearFields();
    }
});

//evento: remover livros
document.querySelector('#book-list').addEventListener('click', (e) => {
    //remover livro da UI
    UI.deleteBook(e.target);
    
    //remover livro da localStorage
    Store.removeBook(e.target.parentElement.previousElementSibling.textContent);

    //mostrar mensagem de sucesso
    UI.showAlert('Livro removido.', 'success');
});