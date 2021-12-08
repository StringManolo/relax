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
    credentials: "include", // allows to set-cookie from response headers */
    headers: {
      "content-type": "application/x-www-form-urlencoded"
    }
  });
  const data = await response.json();
  if (data?.token) {
    // localStorage.token = data.token; // using cookies instead of localStorage
    location = "../profile.html";
  } else if (data?.error) {
    alert("Error: " + data.error);
  } else if (data?.missing) {
    alert("Missing " + data.missing);
  } else {
    alert(JSON.stringify(data));
  }
} catch(err) {
  alert(err);
}
});


