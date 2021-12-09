const ENDPOINT = "http://localhost:3000";
const form = document.querySelector("form");

const encodeComponent = (component) => {
  while (/\'/g.test(component)) {
    component = component.replace(/\'/g, "%27");
  }                                                                                                  
  return encodeURIComponent(component);
}

const decodeComponent = (component) => {
  while (/\%27/g.test(component)) {
    component = component.replace(/\%27/g, "'");
  }
  return decodeURIComponent(component);
}

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
          aux += `\n + ${decodeComponent(parsed.users[i]?.first_name)} @${decodeComponent(parsed.users[i]?.username)}`;
	}
      } else {
        aux += `\n + ${decodeComponent(parsed.users?.first_name)} @${decodeComponent(parsed.users?.username)}`
      }

      if (parsed?.posts) {
        if (Array.isArray(parsed.posts)) {
          for (let i = 0; i < parsed.posts.length; ++i) {
	    aux += `\n + ( ${decodeComponent(parsed.posts[i]?.title)} ) `;
	  }
	} else {
          aux += `\n + ( ${decodeComponent(parsed.posts?.title)} ) `;
	}
      }

      if (parsed?.groups) {
	if (Array.isArray(parsed.groups)) {
	  for (let i = 0; i < parsed.groups.length; ++i) {
            aux += `\n + ${decodeComponent(parsed.groups[i]?.title)}: ${decodeComponent(parsed.groups[i]?.bio.substr(0, 20))}... `;
	  }
	} else {
          aux += `\n + ${decodeComponent(parsed.groups?.title)}: ${decodeComponent(parsed.groups?.title.substr(0, 20))}... `;
	}
      }

      if (aux.length > 9) {
        const responseElement = document.createElement("pre");
	responseElement.innerText += aux;
        document.body.appendChild(responseElement);
	return undefined;
      }


    }
  }

  console.log(decodeComponent(response));

});
