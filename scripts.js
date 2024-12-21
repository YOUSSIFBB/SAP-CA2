
//add validation for the search form
document.addEventListener('DOMContentLoaded', () => {
    const searchForm = document.querySelector('.search-form');
    const searchInput = document.querySelector('.search-input');

    searchForm.addEventListener('submit', (event) => {
        if (searchInput.value.trim() === '') {
            event.preventDefault(); // prevent user form submission
            alert('Please enter a search term before submitting.');
            searchInput.focus();
        }
    });
});


document.getElementById('registrationForm').addEventListener('submit', function (e) {
    let valid = true;

    //fetch the country code and phone number fields
    const countryCode = document.getElementById('country-code').value;
    const phoneNumber = document.getElementById('phone').value;

    //combine the country code and phone number together 
    const fullPhoneNumber = `${countryCode}${phoneNumber}`;

    //update the phone input with the combined value
    document.getElementById('phone').value = fullPhoneNumber;

    //check if validation fails
    if (!valid) {
        e.preventDefault();  //prevent the user from submitting
    }

});
