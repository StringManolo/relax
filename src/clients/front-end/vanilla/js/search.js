import { encodeComponent, decodeComponent, htmlEntities } from "./utils.js";

const ENDPOINT = "http://localhost:3000";
const form = document.querySelector("form");

form.addEventListener("submit", async evt => {
  evt.preventDefault();
  const response = await fetch(`${ENDPOINT}/search/${encodeComponent(document.querySelectorAll("form > input")[0].value)}`, {
    method: "GET",
    credentials: "include", 
  }); 
  const parsed = await response.json();
  
  if (parsed?.error) {
    alert("\nError: " + parsed.error);
    return undefined;
  } else {
    let aux = "Results:";
    if (parsed?.users) {
      if (Array.isArray(parsed.users)) {
        for (let i = 0; i < parsed.users.length; ++i) {
          aux += `\n + ${htmlEntities(decodeComponent(parsed.users[i]?.first_name))} <a href="${ENDPOINT}/users/username/${htmlEntities(decodeComponent(parsed.users[i]?.username))}" class="searchProfileLink">@${htmlEntities(decodeComponent(parsed.users[i]?.username))}</a>`;
	}
      } else {
        aux += `\n + ${htmlEntities(decodeComponent(parsed.users?.first_name))} @${htmlEntities(decodeComponent(parsed.users?.username))}`
      }

      if (parsed?.posts) {
        if (Array.isArray(parsed.posts)) {
          for (let i = 0; i < parsed.posts.length; ++i) {
	    aux += `\n + ( ${htmlEntities(decodeComponent(parsed.posts[i]?.title))} ) `;
	  }
	} else {
          aux += `\n + ( ${htmlEntities(decodeComponent(parsed.posts?.title))} ) `;
	}
      }

      if (parsed?.groups) {
	if (Array.isArray(parsed.groups)) {
	  for (let i = 0; i < parsed.groups.length; ++i) {
            aux += `\n + ${htmlEntities(decodeComponent(parsed.groups[i]?.title))}: ${htmlEntities(decodeComponent(parsed.groups[i]?.bio.substr(0, 20)))}... `;
	  }
	} else {
          aux += `\n + ${htmlEntities(decodeComponent(parsed.groups?.title))}: ${htmlEntities(decodeComponent(parsed.groups?.title.substr(0, 20)))}... `;
	}
      }

      if (aux.length > 9) {
	// TODO: Remove old results if found
        const responseElement = document.createElement("pre");
	responseElement.innerHTML += aux;
        document.body.appendChild(responseElement);

	const profileLinks = document.querySelectorAll(".searchProfileLink");
        profileLinks.forEach(link => {
          link.addEventListener("click", async (evt) => {
            evt.preventDefault();
	    const responseProfile = await fetch(link.href, { credentials: "include" });
            const parsed = await responseProfile.json();

            const {
	      id, phone, rol, email, username, first_name, last_name, middle_name, gender,
	      country, profile_picture_url, is_reported, is_blocked, bio, created_at
	    } = parsed;

            if (!username) {
              if (parsed?.error) {
                alert("Error: " + parsed.error);
		return;
	      } else {
                alert("Error: Unable to retrieve user data");
		return;
	      }
	    }

            const responsePosts = await fetch(`${ENDPOINT}/posts/username/${encodeComponent(username)}`, { credentials: "include" });
	    const parsedPosts = await responsePosts.json();

	    let posts = [];
	    for (let i = 0; i < parsedPosts.length; ++i) {
              const { title, post, timestamp } = parsedPosts[i];
	      posts.push(`    ${decodeComponent(title)}
	        ${decodeComponent(post)}

		published: ${timestamp.replace("T", " ").substr(0, timestamp.length - 5)}

`);

	    }



	    const responseIsFriend = await fetch(`${ENDPOINT}/isFriend/${decodeComponent(username)}`, {
              method: "GET",
	      credentials: "include"
	    });

	    const parsedIsFriend = await responseIsFriend.json();
	    

	    const responseElement = document.createElement("pre");
	    responseElement.innerHTML = `

${htmlEntities(decodeComponent(first_name))} @${htmlEntities(decodeComponent(username))} <a href="${ENDPOINT}/friends/username" id="addAsFriendFromProfile">${parsedIsFriend?.exists === true ? "Friend" : "Add as friend"}</a>

    picture: ${htmlEntities(decodeComponent(profile_picture_url))}
    bio: ${htmlEntities(decodeComponent(bio))}

    name: ${htmlEntities(decodeComponent(first_name))} ${htmlEntities(decodeComponent(middle_name))} ${htmlEntities(decodeComponent(last_name))}
    gender: ${htmlEntities(decodeComponent(gender))}
    country: ${htmlEntities(decodeComponent(country))}
    created: ${htmlEntities(decodeComponent(created_at.split("T")[0]))}

Posts:
${htmlEntities(decodeComponent(posts.length > 1 ? posts.join("") : posts.toString()))}
`;

	    document.body.appendChild(responseElement);

            const addFriend = document.querySelector("#addAsFriendFromProfile");
            addFriend.addEventListener("click", async (evnt) => {
              evnt.preventDefault();
	      if (parsedIsFriend?.exists === true) {
                return;
	      }
	      const response = await fetch(`${ENDPOINT}/friends/username`, {
                method: "POST",
                credentials: "include",
		headers: {
		  "content-type": "application/x-www-form-urlencoded"
		},
		body: `username=${username}` 
	      });


	      const parsed = await response.json();
	      if (parsed?.error) {
		alert("\nError: " + parsed.error);
		return undefined;
	      } else {
                alert(parsed.status);
              }
	    });
	  });
	});
      }
    }
  }
});

