const form = document.querySelector("form");

const ENDPOINT = "http://localhost:3000";

form.addEventListener("submit", async evt => {
try {
  evt.preventDefault();
  const emailOrUsername = document.querySelector("form > input").value;
  const password = document.querySelectorAll("form > input")[1].value;
  let userChosedEmail = false;
  if (/\@/g.test(emailOrUsername)) {
    userChosedEmail = true;
  }
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
} catch(err) {
  alert(err);
}
});


