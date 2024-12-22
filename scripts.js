document.addEventListener('DOMContentLoaded', () => {
    // Search form validation
    const searchForm = document.querySelector('.search-form');
    const searchInput = document.querySelector('.search-input');

    searchForm.addEventListener('submit', (event) => {
        if (searchInput.value.trim() === '') {
            event.preventDefault(); // prevent user form submission
            alert('Please enter a search term before submitting.');
            searchInput.focus();
        }
    });

    // Registration button navigation
    const registerButton = document.querySelector('#registerButton');
    if (registerButton) {
        registerButton.addEventListener('click', () => {
            window.location.href = 'regestration.html';
        });
    }
});
