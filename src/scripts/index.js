
document.addEventListener('DOMContentLoaded', function() {
    /* Hamburger button */
    const hamburgerBtn = document.querySelector('.hamburger-btn');
    const hamburgerCloseBtn = document.querySelector('.hamburger-close-btn');
    const asideNav = document.querySelector('.aside-nav');
    
    hamburgerBtn.addEventListener('click', function() {
        asideNav.classList.toggle('show-aside');
    });
    
    hamburgerCloseBtn.addEventListener('click', function() {
        asideNav.classList.remove('show-aside');
    });
    
    /* Aside nav & section tab-link */
    const links = document.querySelectorAll('.link');
    const linkContainer = document.querySelector('.links');
    const sections = document.querySelectorAll('.content section');
    
    for (const link of links) {
        link.addEventListener('click', function(event) {
            const idSectionInLink = event.currentTarget.dataset.idSection;
            
            if (idSectionInLink) {
                const currentLinkActive = linkContainer.querySelector('.active');
                
                currentLinkActive.classList.remove('active');
                link.classList.add('active');
    
                for (const section of sections) {
                    section.classList.remove('open-section');
                }
    
                // get element with idSection(id-section) in document
                const sectionTargetElement = document.getElementById(idSectionInLink);
    
                sectionTargetElement.classList.add('open-section');
                hamburgerCloseBtn.click();
            }
        })
    };
    
    /* search form in my-books section */
    const searchFormOpenBtn = document.querySelector('.search-form-open-btn');
    const searchFormCloseBtn = document.querySelector('.search-form-close-btn');
    const headerContent = document.querySelector('.header-content');
    
    searchFormOpenBtn.addEventListener('click', function() {
        headerContent.classList.add('open-form');
    });
    
    searchFormCloseBtn.addEventListener('click', function() {
        headerContent.classList.remove('open-form');
    });
    
    /* tab-link & book-list in my-books section */
    const tabLinkContainer = document.querySelector('.tab-links');
    const tabLinks = document.querySelectorAll('[data-id-booklist]');
    const bookslist = document.querySelectorAll('[data-booklist]');
    
    console.log(tabLinks)
    console.log(bookslist)
    
    tabLinkContainer.addEventListener('click', function(event) {
        const idBooklist = event.target.dataset.idBooklist;
        const currentElementTarget = event.target;
    
        if (idBooklist) {
            for (const tabLink of tabLinks) {
                tabLink.classList.remove('active');
            }
    
            currentElementTarget.classList.add('active');
    
            for (const booklist of bookslist) {
                booklist.classList.remove('show-booklist');
            }
    
            // get element with idBooklist(id-booklist) in document
            const booklistTargetElement = document.getElementById(idBooklist);
    
            booklistTargetElement.classList.add('show-booklist');
        }
    });
    
    /* add book button */
    const addBookBtn = document.querySelector('.add-book-btn');
    const closeModalBtn = document.getElementById('close-modal-btn');
    const modal = document.querySelector('.modal');
    
    addBookBtn.addEventListener('click', function() {
        modal.classList.add('modal-open');
        document.getElementById('title').focus();
    });
    
    closeModalBtn.addEventListener('click', function() {
        modal.classList.remove('modal-open');
        BOOK.editingBook = false;
    });
});