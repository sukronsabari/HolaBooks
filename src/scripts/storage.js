const DATA_BOOKS = 'books-data';
const DATA_ACTIVITY = 'activity-data';

function isStorageExist() {
    return typeof(Storage) !== 'undefined';
}

function getDataFromLocalStorage(STORAGE_KEY) {
    return localStorage.getItem(STORAGE_KEY) ? JSON.parse(localStorage.getItem(STORAGE_KEY)) : [];
}

function saveData(STORAGE_KEY, value) {
    if(isStorageExist()) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(value));
    }
}

function clearData(STORAGE_KEY) {
    localStorage.removeItem(STORAGE_KEY);
}

function loadDataFromStorage() {
    const dataBooks = getDataFromLocalStorage(DATA_BOOKS);
    const dataActivities = getDataFromLocalStorage(DATA_ACTIVITY);

    for (const book of dataBooks) {
        books.unshift(book);
    }

    for (const activity of dataActivities) {
        bookActivities.unshift(activity);
    }
    
    document.dispatchEvent(new Event(RENDER_EVENT));
    document.dispatchEvent(new Event(RENDER_ACTIVITY));
}