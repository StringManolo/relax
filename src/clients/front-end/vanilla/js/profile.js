import { decodeComponent, encodeComponent, htmlEntities } from "./utils.js";

const ENDPOINT = "http://localhost:3000";

window.addEventListener("load", async evt => {
  const response = await fetch(`${ENDPOINT}/profile`, {
    method: "GET",
    credentials: "include"
  });
  const data = await response.json();

  const {
    id, phone, rol, email, username, first_name, last_name, middle_name, gender,
    country, profile_picture_url, is_reported, is_blocked, bio, created_at
  } = data;

  if (!username) {
    if (data?.error) {
      alert("\nError: " + data.error);
      return;
    } else {
      alert("\nError: Unable to retrieve user data");
      return;
    }
  }

  const responsePosts = await fetch(`${ENDPOINT}/posts`, {
    method: "GET",
    credentials: "include"
  });

  const parsedPosts = await responsePosts.json();

  let posts = [];
  for (let i = 0; i < parsedPosts.length; ++i) {
    const { title, post, timestamp } = parsedPosts[i];
    posts.push(`    ${decodeComponent(title)}
      ${decodeComponent(post)}

      published: ${timestamp.replace("T", " ").substr(0, timestamp.length - 5)}

`);
  }

  const responseElement = document.createElement("pre");
  responseElement.innerHTML = `
${htmlEntities(decodeComponent(first_name))} @${htmlEntities(decodeComponent(username))}

    picture: ${htmlEntities(decodeComponent(profile_picture_url))}
    bio: <input type="text" id="editableBio" value="${htmlEntities(decodeComponent(bio))}"/> <a href="${ENDPOINT}/users/bio" id="setBioUrl">Change</a>

    name: ${htmlEntities(decodeComponent(first_name))} ${htmlEntities(decodeComponent(middle_name))} ${htmlEntities(decodeComponent(last_name))}
    gender: ${htmlEntities(decodeComponent(gender))}
    country: ${htmlEntities(decodeComponent(country))}
    created: ${htmlEntities(decodeComponent(created_at.split("T")[0]))}

Post:
${htmlEntities(decodeComponent(posts.length > 1 ? posts.join("") : posts.toString()))}
`;

  document.body.appendChild(responseElement);

  const editableBio = document.querySelector("#editableBio");

  editableBio.onblur = async () => {
    try {
      const response = await fetch(`${ENDPOINT}/users/bio`, {
        method: "POST",
        credentials: "include",
        body: `bio=${encodeComponent(editableBio.value)}`
      });

      const parsed = await response.json();


      if (parsed?.status) {
        alert(parsed.status);
      } else if (parsed?.error) {
        alert(parsed.error);
      } else {
        alert(parsed);
      }

    } catch(err) {
      alert(err);
    }
  }


  document.querySelector("#setBioUrl").addEventListener("click", evnt => {
    evnt.preventDefault();
    editableBio.focus();
  });
});

