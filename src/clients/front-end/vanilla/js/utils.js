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

const htmlEntities = (markup) => {
  const p = document.createElement("p");
  p.textContent = markup
  return p.innerHTML;
}

export {
  encodeComponent,
  decodeComponent,
  htmlEntities
}
