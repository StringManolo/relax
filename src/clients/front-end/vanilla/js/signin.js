const form = document.querySelector("form");

const ENDPOINT = "http://localhost:3000";

const usernameInput = document.querySelector("#username");

usernameInput.addEventListener("input", async evt => {
  const response = await fetch(`${ENDPOINT}/exists/${usernameInput.value}`, {
    method: "GET"
  });

  const data = await response.json();
  let aux;
  let color="black";
  if (data?.exists === true) {
    aux = "already taken";
    color = "red";
  } else if (data?.exists === false) {
    aux = "available";
    color = "green";
  } else {
    // alert(JSON.stringify(data, null, 2));
    return undefined;
  }

  const responseElement = document.querySelector("#usernameFeedback");
  responseElement.style.color = color;
  responseElement.innerText = aux;
});

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

