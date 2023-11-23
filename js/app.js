function toggleForm(formId) {
    document.getElementById('login-form').style.display = 'none';
    document.getElementById('register-form').style.display = 'none';
    
    document.getElementById(formId).style.display = 'block';
}

function showFlashMessage(message, isSuccess) {
    var flashMessage = document.createElement('div');
    flashMessage.className = isSuccess ? 'flash-success' : 'flash-fail';
    flashMessage.innerHTML = message;

    var closeButton = document.createElement('span');
    closeButton.className = 'close-button';
    closeButton.innerHTML = '&times;';

    closeButton.onclick = function () {
        flashMessage.style.display = 'none';
    };

    flashMessage.appendChild(closeButton);
    document.body.appendChild(flashMessage);

    flashMessage.style.top = window.innerHeight / 2 - flashMessage.offsetHeight / 2 + 'px';
    flashMessage.style.left = window.innerWidth / 2 - flashMessage.offsetWidth / 2 + 'px';

    setTimeout(function () {
        flashMessage.style.display = 'none';
    }, 2000);
}

function login() {
    var username = document.getElementById("login-username").value;
    var password = document.getElementById("login-password").value;

    var xhr = new XMLHttpRequest();
    xhr.open("POST", "../php/login.php", true);
    xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");

    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4) {
            if (xhr.status == 200) {
                if (xhr.responseText === 'Login successful') {
                    showFlashMessage('Login Successful', true);
                    setTimeout(function () {
                        window.location.href = 'voting-page.html';
                    }, 2000);
                } else {
                    showFlashMessage('Login Failed !!', false);
                    console.log('Login failed! Please check your credentials.');
                }
            }
        }
    };

    xhr.send("username=" + username + "&password=" + password);
}

function register() {
    var username = document.getElementById("register-username").value;
    var password = document.getElementById("register-password").value;

    var xhr = new XMLHttpRequest();
    xhr.open("POST", "../php/register.php", true);
    xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");

    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4) {
            if (xhr.status == 200) {
                if (xhr.responseText === 'Registration successful') {
                    showFlashMessage('Registration Successful. Please login.', true);
                    toggleForm('login-form');
                } else {
                    showFlashMessage('Registration Failed !! Try again', false);
                    console.log('Registration failed! Please choose a different username.');
                }
            }
        }
    };

    xhr.send("username=" + username + "&password=" + password);
}