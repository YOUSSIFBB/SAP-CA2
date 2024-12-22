document.addEventListener('DOMContentLoaded', () => {
    //search form validation
    const searchForm = document.querySelector('.search-form');
    const searchInput = document.querySelector('.search-input');

    searchForm.addEventListener('submit', (event) => {
        if (searchInput.value.trim() === '') {
            event.preventDefault(); //prevent form submission for empty input
            alert('Please enter a search term before submitting.');
            searchInput.focus();
        }
    });

    //navigation for registration button
    const registerButton = document.querySelector('#registerButton');
    if (registerButton) {
        registerButton.addEventListener('click', () => {
            window.location.href = 'regestration.html'; // Navigate to registration page
        });
    }
});
