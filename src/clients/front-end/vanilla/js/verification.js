const ENDPOINT = "http://localhost:3000";

const form = document.querySelector("form");

form.addEventListener("submit", async evt => {
  evt.preventDefault();
  const response = await fetch(`${ENDPOINT}/verification`, {
    body: `verificationCode=${document.querySelectorAll("form > input")[0].value}`,
    method: "POST",
    headers: {
      "content-type": "application/x-www-form-urlencoded"
    }
  }); 
  const data = await response.json();

  if (data?.error) {
    alert(data.error);
  }

  if (data?.status === "Account Activated") {
    alert("Account Activated");
    location = "../login.html";
  }
  
});
