// Dropdown
const topic = document.getElementById("topic");
const topicMessage = document.getElementById("topicMessage");

topic.addEventListener("change", function () {
    if (topic.value === "") {
        topicMessage.textContent = "Your choice will appear here.";
    } else {
        topicMessage.textContent = "You selected " + topic.value + ".";
    }
});

// Counter
const count = document.getElementById("count");
let clicks = 0;

document.getElementById("countButton").addEventListener("click", function () {
    clicks++;
    count.textContent = clicks;
});

document.getElementById("resetButton").addEventListener("click", function () {
    clicks = 0;
    count.textContent = clicks;
});

// Modal
const modal = document.getElementById("modal");

document.getElementById("openModal").addEventListener("click", function () {
    modal.style.display = "flex";
});

document.getElementById("closeModal").addEventListener("click", function () {
    modal.style.display = "none";
});

modal.addEventListener("click", function (event) {
    if (event.target === modal) {
        modal.style.display = "none";
    }
});

// Form validation
const form = document.getElementById("contactForm");

form.addEventListener("submit", function (event) {
    event.preventDefault();

    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const message = document.getElementById("messageInput").value.trim();

    const nameError = document.getElementById("nameError");
    const emailError = document.getElementById("emailError");
    const messageError = document.getElementById("messageError");
    const formMessage = document.getElementById("formMessage");

    nameError.textContent = "";
    emailError.textContent = "";
    messageError.textContent = "";
    formMessage.textContent = "";

    let valid = true;

    if (name.length < 2) {
        nameError.textContent = "Please enter at least 2 characters.";
        valid = false;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(email)) {
        emailError.textContent = "Please enter a valid email address.";
        valid = false;
    }

    if (message.length < 5) {
        messageError.textContent = "Message must contain at least 5 characters.";
        valid = false;
    }

    if (valid) {
        formMessage.textContent = "Form validated successfully!";
        formMessage.style.color = "#0f766e";
        form.reset();
    }
});
