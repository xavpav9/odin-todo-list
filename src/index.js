import "./font-styles.css";
import "./style.css";
import Item from "./todo-item.js";
import { cardsContainer, projectsContainer, createContainer } from "./containers.js"

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

  return { displayDomForItem, displayDomForProject, refillCards, removeDomForProject, addCheck }
})();

const notesController = (function() {
  let currentProject = 0;
  const items = [];
  const projects = [];
  const addProjectInput = document.querySelector("#add-project-input");
  const addProjectSubmitBtn = document.querySelector(".add-project-submit-btn");

  function addItem(title, description, date, priority, notes, projectNumber, checklist) {
    const item = new Item(title, description, date, priority, notes, projectNumber, checklist);
    projects[projectNumber].items.push(item);
    if (currentProject == projectNumber || currentProject == 0) {
      screenController.displayDomForItem(item);
    }
    console.log(item);
  }

  function addProject(name, removable=true) {
    const [project, removeBtn] = screenController.displayDomForProject(name, projects.length, removable);
    projects.push({name, items: []});

    project.addEventListener("click", evt => {
      changeToProject(+project.dataset.number)
    });

    if (removeBtn !== null) {
      removeBtn.addEventListener("click", evt => {
        evt.stopPropagation();
        const projectNumber = +removeBtn.parentNode.dataset.number;
        removeProject(projectNumber);
      });
    }

    if (projects.length === 1) project.dispatchEvent(new Event("click")); // for default project
  }

  function removeProject(projectNumber) {
    screenController.removeDomForProject(projectNumber);
    projects.splice(projectNumber, 1);
    if (currentProject === projectNumber || currentProject === 0) {
      changeToProject(0);
      currentProject = 0;
    }
    for (let i = 0; i < document.querySelectorAll(".project").length; ++i) {
      document.querySelectorAll(".project")[i].dataset.number = i;
    }
  }

  function changeToProject(projectNumber) {
    if (projectNumber === 0) {
      screenController.refillCards(projectNumber, projects.reduce((acc, project) => acc.concat(project.items), []));
    } else {
      screenController.refillCards(projectNumber, projects[projectNumber].items);
    }
    currentProject = projectNumber;
  }

  addProject("All", false);

  document.querySelector(".create-container .add-project-btn").addEventListener("click", evt => {
    addProjectInput.style.display = "block";
    addProjectSubmitBtn.style.display = "block";
    addProjectInput.focus();
  });

  document.querySelector(".create-container .add-item-btn").addEventListener("click", evt => {
    document.querySelector(".expand-dialog #title").value = "";
    document.querySelector(".expand-dialog #description").value = "";
    document.querySelector(".expand-dialog #due-date").value = "";
    document.querySelector(".expand-dialog #notes").value = "";
    document.querySelector(".expand-dialog .checklist").textContent = "";
    document.querySelector(".expand-dialog #add-check").value = "";
    document.querySelector(".expand-dialog #priority").value = "";
    document.querySelector("dialog.expand-dialog").showModal();
  });

  addProjectInput.addEventListener("keydown", evt => {
    if (evt.key === "Enter") {
      evt.preventDefault();
      addProjectSubmitBtn.dispatchEvent(new Event("click"));
    }
  });

  document.querySelector(".add-project-submit-btn").addEventListener("click", evt => {
    const text = addProjectInput.value.trim();
    if (text.length > 0 && !projects.map(project => project.name.toUpperCase()).includes(text.toUpperCase())) {
      addProjectInput.style.display = "none";
      addProjectSubmitBtn.style.display = "none";
      addProjectInput.value = "";
      addProject(text);
    }
  });

  document.querySelector(".expand-dialog .add-check-btn").addEventListener("click", evt => {
    const text = document.querySelector(".expand-dialog #add-check").value.trim();
    if (text.length > 0) {
      screenController.addCheck(text);
      document.querySelector(".expand-dialog #add-check").value = "";
    }
    evt.preventDefault();
  });

  document.querySelector(".expand-dialog #add-check").addEventListener("keydown", evt => {
    if (evt.key == "Enter") {
      evt.preventDefault();
      document.querySelector(".expand-dialog .add-check-btn").dispatchEvent(new Event("click"));
    }
  });

  document.querySelector(".expand-dialog .save").addEventListener("click", evt => {
    evt.preventDefault();
    const projectNumber = currentProject;
    const titleInput = document.querySelector(".expand-dialog #title").value;
    const descriptionInput = document.querySelector(".expand-dialog #description").value;
    const dueDateInput = document.querySelector(".expand-dialog #due-date").value;
    const notesInput = document.querySelector(".expand-dialog #notes").value;
    const checklistInputs = [...document.querySelectorAll(".expand-dialog .checklist label")].map(node => [node.textContent, node.previousElementSibling.checked]);
    console.log(checklistInputs);
    const priorityInput = +document.querySelector(".expand-dialog #priority").value;
    if (titleInput.length > 0 && descriptionInput.length > 0 && dueDateInput !== "" && priorityInput > 0) {
      addItem(titleInput, descriptionInput, dueDateInput, priorityInput, notesInput, projectNumber, checklistInputs)
      document.querySelector("dialog.expand-dialog").close();
    }

  });

  document.querySelector(".expand-dialog .exit").addEventListener("click", evt => {
    evt.preventDefault();
    document.querySelector("dialog.expand-dialog").close();
  });

  return { addItem, addProject, changeToProject };
})()

notesController.addProject("Cool")
notesController.addProject("Bad")

for (let i = 0; i < 4; ++i) {
  notesController.addItem("Eating", "I need to eat", "12th March", "1", "I am just really hungry", 1, [["apple", false], ["orange", true]]);
}

for (let i = 0; i < 4; ++i) {
  notesController.addItem("Eating", "I need to eat", "12th March", "1", "I am just really hungry", 2, [["apple", false], ["orange", true]]);
}
