const ENDPOINT = "http://localhost:3000";

const decodeComponent = (component) => {
  while (/\%27/g.test(component)) {
    component = component.replace(/\%27/g, "'");
  }
  return decodeURIComponent(component);
}

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
  responseElement.innerText = `
${decodeComponent(first_name)} @${decodeComponent(username)}

    picture: ${decodeComponent(profile_picture_url)}
    bio: ${decodeComponent(bio)}

    name: ${decodeComponent(first_name)} ${decodeComponent(middle_name)} ${decodeComponent(last_name)}
    gender: ${decodeComponent(gender)}
    country: ${decodeComponent(country)}
    created: ${decodeComponent(created_at.split("T")[0])}

Post:
${decodeComponent(posts.length > 1 ? posts.join("") : posts.toString())}
`;

  document.body.appendChild(responseElement);
});

