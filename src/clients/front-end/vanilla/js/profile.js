const form = document.querySelector("form");

const ENDPOINT = "http://localhost:3000";

form.addEventListener("submit", async evt => {
  const response = await fetch(`${ENDPOINT}/auth`, {
    body: (userChosedEmail ? "email=" : "username=") + emailOrUsername + "&password=" + password,
    method: "POST",
    headers: {
      "content-type": "application/x-www-form-urlencoded"
    }
  });
  const data = await response.json();
  if (data?.token) {
    localStorage.token = data.token;
    location = "../profile.html";
  }
});


