import { cardsContainer, projectsContainer, createContainer } from "./containers.js";

const screenController = (function() {
  const contentDiv = document.querySelector("div#content");

  contentDiv.appendChild(createContainer);
  contentDiv.appendChild(cardsContainer);
  contentDiv.appendChild(projectsContainer);

  function displayDomForProject(name, number, removable) {
    const project = document.createElement("button");
    const projectName = document.createElement("span");
    project.dataset.number = number;
    projectName.textContent = name;
    project.classList.add("project");

    project.appendChild(projectName);
    projectsContainer.appendChild(project);

    if (removable) {
      const removeBtn = document.createElement("button");
      removeBtn.classList.add("remove-project-btn");
      removeBtn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-x-circle"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>';
      project.appendChild(removeBtn);
      return [project, removeBtn];
    }

    return [project, null];
  }

  function removeDomForProject(projectNumber) {
    for (const project of document.querySelectorAll(".project")) {
      if (+project.dataset.number === projectNumber) {
        project.remove();
        return
      }
    }
  }

  function displayDomForItem(item) {
    const card = document.createElement("div");
    card.classList.add("card");

    const title = document.createElement("h2");
    title.textContent = item.title;
    title.classList.add("title");

    const description = document.createElement("p");
    description.textContent = item.description;
    description.classList.add("description");

    const dueDate = document.createElement("p");
    dueDate.textContent = item.dueDate;
    dueDate.classList.add("due-date");

    const priority = document.createElement("p");
    priority.textContent = item.priority;
    priority.classList.add("priority");

    const notes = document.createElement("p");
    notes.textContent = item.notes;
    notes.classList.add("notes");

    [title, description, dueDate, priority, notes].forEach(part => {
      card.appendChild(part)
    });

    cardsContainer.appendChild(card);

    return card
  }

  function refillCards(projectNumber, cards) {
    cardsContainer.textContent = ""
    for (let card of cards) {
      displayDomForItem(card);
    }
    projectsContainer.querySelectorAll(".project").forEach(project => {
      project.classList.remove("selected");
      if (+project.dataset.number === projectNumber) project.classList.add("selected");
    });
  }

  function addCheck(text) {
    const checklist = document.querySelector(".expand-dialog .checklist");
    const checkbox = document.createElement("input");
    const id = crypto.randomUUID();
    checkbox.setAttribute("type", "checkbox");
    checkbox.setAttribute("id", id);

    const label = document.createElement("label");
    label.setAttribute("for", id);
    label.setAttribute("class", "check-label");
    label.textContent = text;

    const removeBtn = document.createElement("button");
    removeBtn.classList.add("remove-check-btn");
    removeBtn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-x-circle"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>';

    removeBtn.addEventListener("click", evt => {
      evt.preventDefault();
      removeBtn.previousElementSibling.remove();
      removeBtn.previousElementSibling.remove();
      removeBtn.remove();
    });

    checklist.appendChild(checkbox);
    checklist.appendChild(label);
    checklist.appendChild(removeBtn);

    return removeBtn
  }

  function clearExpandItemDialog() {
    document.querySelector(".expand-dialog #title").value = "";
    document.querySelector(".expand-dialog #description").value = "";
    document.querySelector(".expand-dialog #due-date").value = "";
    document.querySelector(".expand-dialog #notes").value = "";
    document.querySelector(".expand-dialog .checklist").textContent = "";
    document.querySelector(".expand-dialog #add-check").value = "";
    document.querySelector(".expand-dialog #priority").value = "";
  }

  return { displayDomForItem, displayDomForProject, refillCards, removeDomForProject, addCheck, clearExpandItemDialog }
})();

export default screenController
