const form = document.querySelector("form");

const ENDPOINT = "http://localhost:3000";

form.addEventListener("submit", async evt => {
  const response = await fetch(`${ENDPOINT}/profile`, {
    body: (userChosedEmail ? "email=" : "username=") + emailOrUsername + "&password=" + password,
    method: "GET",
    headers: {
      "Authorization: 
    }
  });
  const data = await response.json();
  alert(JSON.stringify(data, null, 2));
});


/*
const getProfile = (token: string) => {
  const responseProfile = run(`curl --silent http://localhost:3000/profile -H 'Authorization: ${token}'`);

  const {
    id, phone, rol, email, username, first_name, last_name, middle_name, gender,
    country, profile_picture_url, is_reported, is_blocked, bio, created_at
  } = JSON.parse(responseProfile);

  if (!username) {
    const aux = JSON.parse(responseProfile);
    if (aux?.error) {
      console.log("\nError: " + aux.error);
      return;
    } else {
      console.log("\nError: Unable to retrieve user data");
      return;
    }
  }

  const responsePosts = run(`curl --silent http://localhost:3000/posts -H 'Authorization: ${token}'`);

  const parsedPosts = JSON.parse(responsePosts);
  let posts = [];
  for (let i = 0; i < parsedPosts.length; ++i) {
    const { title, post, timestamp } = parsedPosts[i];
    posts.push(`    ${decodeComponent(title)}
      ${decodeComponent(post)}

      published: ${timestamp.replace("T", " ").substr(0, timestamp.length - 5)}

`);
  }

  console.log(`

${decodeComponent(first_name)} @${decodeComponent(username)}

    picture: ${decodeComponent(profile_picture_url)}
    bio: ${decodeComponent(bio)}

    name: ${decodeComponent(first_name)} ${decodeComponent(middle_name)} ${decodeComponent(last_name)}
    gender: ${decodeComponent(gender)}
    country: ${decodeComponent(country)}
    created: ${decodeComponent(created_at.split("T")[0])}

Posts:
${decodeComponent(posts.length > 1 ? posts.join("") : posts.toString())}
`);

}
*/
