const BOOK = {
    editingBook: false,
    editedBookId: null,
};
const RENDER_EVENT = 'render-book';
const RENDER_SEARCH_RESULT = 'render-search-result';
const RENDER_ACTIVITY = 'render-activity';
const SAVED_EVENT = 'saved-book';
const books = [];
let bookActivities = [];
let filteredBooks = [];


function generateId() {
    return +new Date();
}

function setBackDefault() {
    BOOK.editingBook = false;
    BOOK.editedBookId = null;
    document.querySelector('.modal-header').innerText = 'Add Book';
    document.getElementById('submit-btn').innerText = 'Add Book';
}

function showDialog(message, action/*<string> success/danger*/) {
    const customDialogContainer = document.querySelector('.custom-dialog-container');
    const customDialog = document.querySelector('.custom-dialog');
    
    customDialogContainer.classList.add('show-dialog');
    customDialog.innerText = message;
    customDialog.classList.add(`dialog-${action}`);
    
    setTimeout(function() {
        customDialogContainer.classList.remove('show-dialog');
        customDialog.innerText = '';
        customDialog.classList.remove(`dialog-${action}`);
    }, 1000)
}

function findBook(id) {
    for (const book of books) {
        if (book.id == id) return book;
    }

    return null;
}

function findBookIndex(id) {
    for(let index=0; index<books.length; index++) {
        if(books[index].id == id) {
            return index;
        }
    }

    return -1;
}

function putDataBookItemToForm(bookItemId) {
    const modalHeader = document.querySelector('.modal-header');
    const submitBtn = document.getElementById('submit-btn');
    const title = document.getElementById('title');
    const author = document.getElementById('author');
    const year = document.getElementById('year');
    const bookCovers = document.querySelectorAll(`input[name='book-cover']`);
    const isReaded = document.getElementById('isReaded'); /* <boolean> */

    modalHeader.innerText = 'Edit Book';
    submitBtn.innerText = 'Edit Book';

    const bookItemTarget = findBook(bookItemId); /* object */
    if (bookItemTarget === null) return;
    title.value = bookItemTarget.title;
    author.value = bookItemTarget.author;
    year.value = bookItemTarget.year;
    isReaded.checked = bookItemTarget.isComplete;

    for (const bookCover of bookCovers) {
        if (bookCover.value == bookItemTarget.bookCover) {
            bookCover.checked = true;
        }
    }
}

function createActivityItem(activity) {
    const activityItem = document.createElement('div');
    activityItem.classList.add('activity-item');

    activityItem.innerHTML = `
        <div class="stick">
            <span class="stick-color ${activity.action}-item-color"></span>
        </div>
        <div class="activity-content">
            <p class="action">${activity.action} Book</p>
            <div class="book-record">
                <div class="record-title">
                    ${activity.title}
                </div>
                <div class="record-author">
                ${activity.author}
                </div>
            </div>
        </div>
    `;

    return activityItem;
}

function addBookActivity(title, author, action) {
    const activityObject = {
        title,
        author,
        action,
    };

    bookActivities.unshift(activityObject);
    document.dispatchEvent(new Event(RENDER_ACTIVITY));
}

function editBook() {
    const bookObject = {
        id: BOOK.editedBookId,
        title: document.getElementById('title').value,
        author: document.getElementById('author').value,
        year: document.getElementById('year').value,
        isComplete: document.getElementById('isReaded').checked,
        bookCover: document.querySelector(`input[name='book-cover']:checked`).value,
    }

    const bookIndex = findBookIndex(bookObject.id);
    if (bookIndex === -1) return;
    books[bookIndex] = bookObject;

    document.dispatchEvent(new Event(RENDER_EVENT));
    
    addBookActivity(bookObject.title, bookObject.author, 'edit');
    saveData(DATA_BOOKS, books);
    saveData(DATA_ACTIVITY, bookActivities);
    showDialog('book edit successful', 'success');
    setBackDefault();
}

function addEventHandlerToBookActions(bookItemElement) {
    const bookActionsBtn = bookItemElement.querySelector(".book-actions-btn");
    const bookActions = bookItemElement.querySelector('.book-actions');
    const editBookBtn = bookItemElement.querySelector('.edit');
    const changeBookStatusBtn = bookItemElement.querySelector('.change-book-status');
    const deleteBookBtn = bookItemElement.querySelector('.delete');

    const bookItemId = bookItemElement.getAttribute('id');

    bookActionsBtn.addEventListener('click', function() {
        bookActions.classList.toggle('show-actions');
    });

    editBookBtn.addEventListener('click', function() {
        BOOK.editingBook = true;
        document.querySelector('.modal').classList.add('modal-open');

        putDataBookItemToForm(bookItemId);
        BOOK.editedBookId = bookItemId;
    });

    changeBookStatusBtn.addEventListener('click', function() {
        const bookItemTarget = findBook(bookItemId);
        if (bookItemTarget === null) return;

        if (bookItemTarget.isComplete) {
            bookItemTarget.isComplete = false;
        } else {
            bookItemTarget.isComplete = true;
        }
        document.dispatchEvent(new Event(RENDER_EVENT));
        saveData(DATA_BOOKS, books);
    });

    deleteBookBtn.addEventListener('click', function() {
        const bookIndex = findBookIndex(bookItemId);
        const book = findBook(bookItemId);
        if (bookIndex === -1) return;

        addBookActivity(book.title, book.author, 'delete');
        books.splice(bookIndex, 1);
        document.dispatchEvent(new Event(RENDER_EVENT));

        saveData(DATA_BOOKS, books);
        saveData(DATA_ACTIVITY, bookActivities);
        showDialog('book deleted successfully', 'danger');
    });
}

function createBookElement(book) {
    const bookItem = document.createElement('div');
    bookItem.classList.add('book-item');
    bookItem.setAttribute('id', `${book.id}`);

    let templateHTML = `
        <div class="book-actions-btn">
            <i class="fa-solid fa-ellipsis-vertical"></i>
        </div>
        <div class="book-actions">
            <div class="edit">
                <i class="fa-solid fa-pencil"></i>
                <span>Edit</span>
            </div>
            <div class="change-book-status">
                ${book.isComplete ? '<i class="fa-solid fa-rectangle-xmark"></i>' : '<i class="fa-solid fa-square-check"></i>'}
                <span>${book.isComplete ? "Unread" : "Readed"}</span>
            </div>
            <div class="delete">
                <i class="fa-solid fa-trash"></i>
                <span>delete</span>
            </div>
        </div>
        <div class="img-container">
            <img 
            src="${book.bookCover}" 
            alt="book-img" 
            class="book-cover"
            >
        </div>
        <p class="book-title">${book.title}</p>
        <p class="book-author">${book.author}</p>
        <p class="book-year">${book.year}</p>
    `;

    bookItem.innerHTML = templateHTML;
    addEventHandlerToBookActions(bookItem);
    return bookItem;
}

function addBook() {    
    const title = document.getElementById('title').value;
    const author = document.getElementById('author').value;
    const year = document.getElementById('year').value;
    const bookCover = document.querySelector(`input[name='book-cover']:checked`).value;
    const isReaded = document.getElementById('isReaded').checked; /* <boolean> */

    const generatedId = generateId();
    const bookObject = {
        id: generatedId,
        title,
        author,
        year,
        isComplete: isReaded,
        bookCover,
    };

    books.unshift(bookObject);
    document.dispatchEvent(new Event(RENDER_EVENT));

    addBookActivity(bookObject.title, bookObject.author, 'add');
    saveData(DATA_BOOKS, books);
    saveData(DATA_ACTIVITY, bookActivities);
    showDialog('successfully added new book', 'success');
}

function searchBook(value) {
    filteredBooks = books.filter(function(book) {
        return book.title.toLowerCase().includes(value);
    });

    document.dispatchEvent(new Event(RENDER_SEARCH_RESULT));
    console.log(filteredBooks);
}

function bookDataMonitoring() {
    const totalBookEl = document.querySelector('.total-books-count');
    const readedBookEl = document.querySelector('.readed-books-count');
    const unreadBookEl = document.querySelector('.unreaded-books-count');

    let totalBook = books.length;
    let readedBook = 0, unreadBook = 0;

    for (const book of books) {
        if (book.isComplete) {
            readedBook++;
        } else {
            unreadBook++;
        }
    }

    totalBookEl.innerText = totalBook;
    readedBookEl.innerText = readedBook;
    unreadBookEl.innerText = unreadBook;
}

document.addEventListener('DOMContentLoaded', function() {
    const addBookForm = document.getElementById('add-book');
    const readedBookList = document.getElementById('readed-book-list');
    const unreadBookList = document.getElementById('unread-book-list');

    addBookForm.addEventListener('submit', function(event) {
        event.preventDefault();
        if (!BOOK.editingBook) {
            addBook();
        } else {
            editBook();
        }
        
        document.querySelector('.modal').classList.remove('modal-open');
        addBookForm.reset();
    });
    
    document.addEventListener(RENDER_EVENT, function() {
        readedBookList.innerHTML = '';
        unreadBookList.innerHTML = '';

        for (const book of books) {
            const bookElement = createBookElement(book); /* HTML Element */
            
            if (book.isComplete) {
                readedBookList.appendChild(bookElement);
            } else {
                unreadBookList.appendChild(bookElement);
            }
        }

        if (readedBookList.children.length < 1) {
            readedBookList.innerHTML = `<h3 class="text-muted">No Books</h3>`;
        } else if (unreadBookList.children.length < 1) {
            unreadBookList.innerHTML = `<h3 class="text-muted">No Books</h3>`;
        }

        bookDataMonitoring();
    });
    
    const activityList = document.querySelector('.activity-list');
    const activityCount = document.querySelector('.activity-count');
    document.addEventListener(RENDER_ACTIVITY, function() {

        activityList.innerHTML = '';
        activityCount.innerText = bookActivities.length;
        console.log(bookActivities)
        if (bookActivities.length < 1) {
            activityList.innerHTML = `<h3 class="text-muted">No activity</h3>`;
        } else {
            for (const activity of bookActivities) {
                const activityElement = createActivityItem(activity);
    
                activityList.appendChild(activityElement);
            }
        }
    });

    const clearActivityBtn = document.querySelector('.activity-list-clear-btn');
    clearActivityBtn.addEventListener('click', function() {
        bookActivities = [];
        clearData(DATA_ACTIVITY);
        
        const activityDialog = document.querySelector('.activity-dialog');
        activityDialog.classList.add('show-clear-dialog');
        
        document.dispatchEvent(new Event(RENDER_ACTIVITY));
        setTimeout(function() {
            activityDialog.classList.remove('show-clear-dialog');
        }, 1000);
    });

    const searchForm = document.getElementById('search-form');
    searchForm.addEventListener('keyup', function() {
        const searchValue = document.getElementById('search').value;
        
        if (searchValue == '') {
            document.dispatchEvent(new Event(RENDER_EVENT));
        } else {
            searchBook(searchValue);
        }
    });

    document.addEventListener(RENDER_SEARCH_RESULT, function() {
        readedBookList.innerHTML = '';
        unreadBookList.innerHTML = '';
        
        for (const book of filteredBooks) {
            const bookElement = createBookElement(book); /* HTML Element */
            
            if (book.isComplete) {
                readedBookList.appendChild(bookElement);
            } else {
                unreadBookList.appendChild(bookElement);
            }
        }
    });

    if (isStorageExist()) {
        loadDataFromStorage();
    }
});