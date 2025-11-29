const cardsContainer = document.createElement("div");
cardsContainer.classList.add("cards-container");

const projectsContainer = document.createElement("div");
const projectsHeader = document.createElement("h2");
projectsHeader.textContent = "Projects";
projectsContainer.classList.add("projects-container");
projectsContainer.appendChild(projectsHeader)

const createContainer = document.createElement("div");

const addProjectDiv = document.createElement("div");
const addProjectBtn = document.createElement("button");
const addProjectHeader = document.createElement("h4");
const addProjectInput = document.createElement("input");
const addProjectSubmitBtn = document.createElement("button");
addProjectBtn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="white" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path><line x1="12" y1="11" x2="12" y2="17"></line><line x1="9" y1="14" x2="15" y2="14"></line></svg>'
addProjectBtn.classList.add("add-project-btn");
addProjectHeader.textContent = "Add project";
addProjectInput.setAttribute("id", "add-project-input");
addProjectInput.setAttribute("type", "text");
addProjectInput.setAttribute("placeholder", "Project name");
addProjectInput.setAttribute("maxlength", "32");
addProjectSubmitBtn.classList.add("add-project-submit-btn");
addProjectSubmitBtn.textContent = "S";
addProjectDiv.classList.add("add-project");
addProjectDiv.appendChild(addProjectHeader);
addProjectDiv.appendChild(addProjectBtn);
addProjectDiv.appendChild(addProjectInput);
addProjectDiv.appendChild(addProjectSubmitBtn);

const addItemDiv = document.createElement("div");
const addItemBtn = document.createElement("button");
const addItemHeader = document.createElement("h4");
addItemBtn.innerHTML = ' <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="white" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-plus-square"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="12" y1="8" x2="12" y2="16"></line><line x1="8" y1="12" x2="16" y2="12"></line></svg>'
addItemBtn.classList.add("add-item-btn");
addItemHeader.textContent = "Add TODO Item";
addItemDiv.classList.add("add-item");
addItemDiv.appendChild(addItemHeader);
addItemDiv.appendChild(addItemBtn);

createContainer.classList.add("create-container");
createContainer.appendChild(addItemDiv);
createContainer.appendChild(addProjectDiv);

export { cardsContainer, projectsContainer, createContainer };
