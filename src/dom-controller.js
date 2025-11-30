import { createCardsContainer, createProjectsContainer, createCreateContainer, createExpandContainer } from "./containers.js";

function createScreenController() {
  const contentDiv = document.querySelector("div#content");
  const projectsContainer = createProjectsContainer();
  const createContainer = createCreateContainer();

  contentDiv.appendChild(createContainer);
  contentDiv.appendChild(createCardsContainer());
  contentDiv.appendChild(projectsContainer);

  function replaceWithCardContainer() {
    contentDiv.children[1].dataset.exists = "false";
    contentDiv.children[1].remove();
    const cardsContainer = createCardsContainer();
    contentDiv.insertBefore(cardsContainer, projectsContainer);
  }

  function replaceWithExpandContainer() {
    contentDiv.children[1].dataset.exists = "false";
    contentDiv.children[1].remove();
    const expandContainer = createExpandContainer();

    expandContainer.querySelector(".add-check-btn").addEventListener("click", evt => {
      const text = expandContainer.querySelector("#add-check").value.trim();
      if (text.length > 0) {
        addCheck(text);
        expandContainer.querySelector("#add-check").value = "";
      }
      evt.preventDefault();
    });

    expandContainer.querySelector("#add-check").addEventListener("keydown", evt => {
      if (evt.key == "Enter") {
        evt.preventDefault();
        expandContainer.querySelector(".add-check-btn").dispatchEvent(new Event("click"));
      }
    });

    contentDiv.insertBefore(expandContainer, projectsContainer);

    return expandContainer;
  }

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
    card.dataset.id = item.id;

    const title = document.createElement("h2");
    title.textContent = item.title;
    title.classList.add("title");

    const cross = document.createElement("h2");
    cross.innerHTML = ' <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-x"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>';
    cross.classList.add("cross");

    const description = document.createElement("p");
    description.textContent = item.description;
    description.classList.add("description");

    const expandBtn = document.createElement("button");
    expandBtn.textContent = "Expand";
    expandBtn.classList.add("expand-btn");

    const dueDate = document.createElement("p");
    const date = new Date(Date.parse(item.dueDate))
    const strDate = `${String(date.getDate()).padStart(2, "0")}/${String(date.getMonth() + 1).padStart(2, "0")}/${String(date.getFullYear()).slice(-2).padStart(2, "0")}  ${String(date.getHours()).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}`;
    dueDate.textContent = strDate;
    dueDate.classList.add("due-date");

    const priority = document.createElement("p");
    priority.textContent = item.priority;
    priority.classList.add("priority");

    [title, cross, description, dueDate, expandBtn, priority].forEach(part => {
      card.appendChild(part)
    });

    contentDiv.children[1].appendChild(card);

    return card
  }

  function changeDomSelectedProject(projectNumber) {
    projectsContainer.querySelectorAll(".project").forEach(project => {
      project.classList.remove("selected");
      if (+project.dataset.number === projectNumber) project.classList.add("selected");
    });
  }

  function addCheck(text, done=false) {
    const checklist = document.querySelector(".expand-container .checklist");
    const checkbox = document.createElement("input");
    const id = crypto.randomUUID();
    checkbox.setAttribute("type", "checkbox");
    checkbox.setAttribute("id", id);
    if (done) {
      checkbox.setAttribute("checked", "true");
    }

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

  function fillExpandContainer(item, expandContainer) {
    expandContainer.querySelector("#title").value = item.title;
    expandContainer.querySelector("#description").value = item.description;
    expandContainer.querySelector("#due-date").value = item.dueDate;
    expandContainer.querySelector("#notes").value = item.notes;
    expandContainer.querySelector("#priority").value = item.priority;
    
    for (const check of item.checklist) {
      addCheck(check.name, check.done);
    }
  }

  return { displayDomForItem, displayDomForProject, removeDomForProject, addCheck, replaceWithExpandContainer, fillExpandContainer, replaceWithCardContainer, changeDomSelectedProject }
};

export default createScreenController
