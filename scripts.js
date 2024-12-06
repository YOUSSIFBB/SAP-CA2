document.getElementById('registrationForm').addEventListener('submit', function (e) {
    let valid = true;


    // Phone Validation
    const phone = document.getElementById('phone'); // phone number must be 7 to 15 digits
    const phonePattern = /^[0-9]{7,15}$/;
    if (!phonePattern.test(phone.value.trim())) {
        document.getElementById('phoneError').innerText = "Please enter a valid phone number";
        valid = false;
    } else {
        document.getElementById('phoneError').innerText = "";
    }

    // Get the country code and phone number fields
    const countryCode = document.getElementById('country-code').value;
    const phoneNumber = document.getElementById('phone').value;

    // Combine the country code and phone number
    const fullPhoneNumber = `${countryCode}${phoneNumber}`;

    // Update the phone input with the combined value
    document.getElementById('phone').value = fullPhoneNumber;

    // Prevent form submission if validation fails
    if (!valid) {
        e.preventDefault();
    }

});
