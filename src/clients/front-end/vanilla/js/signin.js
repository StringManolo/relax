const form = document.querySelector("form");

const ENDPOINT = "http://localhost:3000";

form.addEventListener("submit", async evt => {
  evt.preventDefault();
  const formData = new FormData(form);
  const response = await fetch(`${ENDPOINT}/signin`, {
    body: new URLSearchParams(Object.fromEntries(formData)).toString(),
    method: "POST",
    headers: {
      "content-type": "application/x-www-form-urlencoded"
    }
  });
  const data = await response.json();
  alert(data);
  alert(JSON.stringify(data));
  if (data?.status === "Email send") {
    location = "../send.html";
  }
});

