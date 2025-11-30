function createCardsContainer() {
  const cardsContainer = document.createElement("div");
  cardsContainer.classList.add("cards-container");
  return cardsContainer;
}

function createExpandContainer() {
  const expandContainer = document.createElement("div");
  expandContainer.classList.add("expand-container");

  const form = document.createElement("form");
  const topDiv = document.createElement("div");
  const leftDiv = document.createElement("div");
  const rightDiv = document.createElement("div");
  topDiv.classList.add("top");
  leftDiv.classList.add("left");
  rightDiv.classList.add("right");

  const titleLabel = document.createElement("label");
  titleLabel.setAttribute("for", "title");
  titleLabel.textContent = "Title";
  const titleInput = document.createElement("input");
  titleInput.setAttribute("required", true);
  titleInput.setAttribute("maxlength", "32");
  titleInput.setAttribute("type", "text");
  titleInput.setAttribute("id", "title");
  topDiv.appendChild(titleLabel);
  topDiv.appendChild(titleInput);

  const descriptionLabel = document.createElement("label");
  descriptionLabel.setAttribute("for", "description");
  descriptionLabel.textContent = "Description";
  const descriptionInput = document.createElement("textarea");
  descriptionInput.setAttribute("required", true);
  descriptionInput.setAttribute("id", "description");
  leftDiv.appendChild(descriptionLabel);
  leftDiv.appendChild(descriptionInput);

  const dueDateLabel = document.createElement("label");
  dueDateLabel.setAttribute("for", "due-date");
  dueDateLabel.textContent = "Due Date";
  const dueDateInput = document.createElement("input");
  const now = new Date();
  dueDateInput.setAttribute("required", true);
  dueDateInput.setAttribute("type", "datetime-local");
  dueDateInput.setAttribute("id", "due-date");
  dueDateInput.setAttribute("max",`${String(now.getFullYear() + 10).padStart(4, "0")}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}T00:00:00`);
  dueDateInput.setAttribute("min",`${String(now.getFullYear() - 1).padStart(4, "0")}-${String(now.getMonth()).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}T00:00:00`);
  const timeUntil = document.createElement("p");
  timeUntil.classList.add("time-until");

  function updateDateValue() {
    setTimeout(() => {
      if (dueDateInput.checkValidity()) {
        const dateInput = new Date(Date.parse(dueDateInput.value));
        const dateDiff = dateInput - Date.now();
        const minutes = (dateDiff / (1000 * 60)) % 60;
        const hours = (dateDiff / (1000 * 60 * 60)) % 24;
        const days = dateDiff / (1000 * 60 * 60 * 24);
        if (Math.abs(days) > 7) {
          timeUntil.textContent = `${Math.round(days)}d`;
        } else if (Math.floor(Math.abs(days)) === 0) {
          timeUntil.textContent = `${hours < 0 ? -Math.floor(Math.abs(hours)) : Math.floor(hours)}h ${Math.round(minutes)}m`;
        } else {
          timeUntil.textContent = `${days < 0 ? -Math.floor(Math.abs(days)) : Math.floor(days)}d ${Math.round(hours)}h`;
        }
      } else {
        timeUntil.textContent = "";
      }

      if ([...document.querySelectorAll(".expand-container")].includes(expandContainer)) updateDateValue();
    }, 500);
  }

  updateDateValue();

  leftDiv.appendChild(dueDateLabel);
  leftDiv.appendChild(dueDateInput);
  leftDiv.appendChild(timeUntil);

  const notesLabel = document.createElement("label");
  notesLabel.setAttribute("for", "notes");
  notesLabel.textContent = "Notes";
  const notesInput = document.createElement("textarea");
  notesInput.setAttribute("id", "notes");
  leftDiv.appendChild(notesLabel);
  leftDiv.appendChild(notesInput);

  const priorityLabel = document.createElement("label");
  priorityLabel.setAttribute("for", "priority");
  priorityLabel.textContent = "Priority";
  const priorityInput = document.createElement("input");
  priorityInput.setAttribute("required", true);
  priorityInput.setAttribute("min", "1");
  priorityInput.setAttribute("type", "number");
  priorityInput.setAttribute("id", "priority");
  leftDiv.appendChild(priorityLabel);
  leftDiv.appendChild(priorityInput);

  const checklistDiv = document.createElement("div");
  checklistDiv.classList.add("checklist");
  rightDiv.appendChild(checklistDiv);

  const addCheckDiv = document.createElement("div");
  addCheckDiv.classList.add("add-check-div");
  const addCheckLabel = document.createElement("label");
  addCheckLabel.setAttribute("for", "add-check");
  addCheckLabel.textContent = "Add check";
  const addCheckBtn = document.createElement("button");
  addCheckBtn.classList.add("add-check-btn");
  addCheckBtn.textContent = "Add";
  const addCheckInput = document.createElement("textarea");
  addCheckInput.setAttribute("id", "add-check");
  addCheckDiv.appendChild(addCheckLabel);
  addCheckDiv.appendChild(addCheckBtn);
  addCheckDiv.appendChild(addCheckInput);
  rightDiv.appendChild(addCheckDiv);

  const saveBtn = document.createElement("button");
  const exitBtn = document.createElement("button");
  saveBtn.classList.add("save");
  exitBtn.classList.add("exit");
  saveBtn.textContent = "Save";
  exitBtn.textContent = "Exit";
  rightDiv.appendChild(saveBtn);
  rightDiv.appendChild(exitBtn);

  form.appendChild(topDiv);
  form.appendChild(leftDiv);
  form.appendChild(rightDiv);

  expandContainer.appendChild(form);

  return expandContainer;
}

function createProjectsContainer() {
  const projectsContainer = document.createElement("div");
  const projectsHeader = document.createElement("h2");
  projectsHeader.textContent = "Projects";
  projectsContainer.classList.add("projects-container");
  projectsContainer.appendChild(projectsHeader)

  return projectsContainer;
}

function createCreateContainer() {
  const createContainer = document.createElement("div");

  const addItemDiv = document.createElement("div");
  const addItemBtn = document.createElement("button");
  const addItemHeader = document.createElement("h4");
  addItemBtn.innerHTML = ' <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="white" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-plus-square"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="12" y1="8" x2="12" y2="16"></line><line x1="8" y1="12" x2="16" y2="12"></line></svg>'
  addItemBtn.classList.add("add-item-btn");
  addItemHeader.textContent = "Add TODO Item";
  addItemDiv.classList.add("add-item");
  addItemDiv.appendChild(addItemHeader);
  addItemDiv.appendChild(addItemBtn);

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
  addProjectSubmitBtn.innerHTML = ' <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-check"><polyline points="20 6 9 17 4 12"></polyline></svg> ';
  addProjectDiv.classList.add("add-project");
  addProjectDiv.appendChild(addProjectHeader);
  addProjectDiv.appendChild(addProjectBtn);
  addProjectDiv.appendChild(addProjectInput);
  addProjectDiv.appendChild(addProjectSubmitBtn);

  createContainer.classList.add("create-container");
  createContainer.appendChild(addItemDiv);
  createContainer.appendChild(addProjectDiv);

  return createContainer;
}

export { createCardsContainer, createProjectsContainer, createCreateContainer, createExpandContainer };
