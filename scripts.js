
// Add validation for the search form
document.addEventListener('DOMContentLoaded', () => {
    const searchForm = document.querySelector('.search-form');
    const searchInput = document.querySelector('.search-input');

    searchForm.addEventListener('submit', (event) => {
        if (searchInput.value.trim() === '') {
            event.preventDefault(); // Prevent form submission
            alert('Please enter a search term before submitting.');
            searchInput.focus(); // Highlight the input field
        }
    });
});


document.getElementById('registrationForm').addEventListener('submit', function (e) {
    let valid = true;

    //phone Validation staments
    const phone = document.getElementById('phone'); // phone number must be 7 to 15 digits
    const phonePattern = /^[0-9]{7,15}$/;
    if (!phonePattern.test(phone.value.trim())) {
        document.getElementById('phoneError').innerText = "Please enter a valid phone number";
        valid = false;
    } else {
        document.getElementById('phoneError').innerText = "";
    }

    //fetch the country code and phone number fields
    const countryCode = document.getElementById('country-code').value;
    const phoneNumber = document.getElementById('phone').value;

    //combine the country code and phone number together 
    const fullPhoneNumber = `${countryCode}${phoneNumber}`;

    //update the phone input with the combined value
    document.getElementById('phone').value = fullPhoneNumber;

    // Prevent form submission if validation fails
    if (!valid) {
        e.preventDefault();
    }

});
