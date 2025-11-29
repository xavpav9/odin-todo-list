import "./font-styles.css";
import "./style.css";
import Item from "./todo-item.js";
import { cardsContainer, projectsContainer, createContainer } from "./containers.js"

const screenController = (function() {
  const contentDiv = document.querySelector("div#content");

  contentDiv.appendChild(createContainer);
  contentDiv.appendChild(cardsContainer);
  contentDiv.appendChild(projectsContainer);

  function displayDomForProject(name, number) {
    const project = document.createElement("button");
    project.dataset.number = number;
    project.textContent = name;
    project.classList.add("project");
    projectsContainer.appendChild(project);
    return project
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
      if (project.dataset.number === projectNumber) project.classList.add("selected");
    });
  }

  return { displayDomForItem, displayDomForProject, refillCards }
})();

const notesController = (function() {
  let currentProject = 0;
  const items = [];
  const projects = [];
  const addProjectInput = document.querySelector("#add-project-input");
  const addProjectSubmitBtn = document.querySelector(".add-project-submit-btn");

  function addItem(title, description, date, priority, notes, projectNumber) {
    const item = new Item(title, description, date, priority, notes, projectNumber);
    projects[projectNumber].items.push(item);
    if (currentProject == projectNumber || currentProject == 0) {
      screenController.displayDomForItem(item);
    }
  }

  function addProject(name) {
    const project = screenController.displayDomForProject(name, projects.length);
    projects.push({name, items: []});

    project.addEventListener("click", () => {changeToProject(project.dataset.number)});
    if (projects.length === 1) project.dispatchEvent(new Event("click")); // for default project
  }

  function changeToProject(projectNumber) {
    if (projectNumber == 0) {
      screenController.refillCards(projectNumber, projects.reduce((acc, project) => acc.concat(project.items), []));
    } else {
      screenController.refillCards(projectNumber, projects[projectNumber].items);
    }
    currentProject = projectNumber;
  }

  addProject("All");

  document.querySelector(".create-container .add-project-btn").addEventListener("click", evt => {
    addProjectInput.style.display = "block";
    addProjectSubmitBtn.style.display = "block";
    addProjectInput.focus();
  });

  addProjectInput.addEventListener("keydown", evt => {
    if (evt.key === "Enter") {
      evt.preventDefault();
      addProjectSubmitBtn.dispatchEvent(new Event("click"));
    }
  });

  document.querySelector(".add-project-submit-btn").addEventListener("click", evt => {
    const text = addProjectInput.value;
    if (text.length > 0 && !projects.map(project => project.name.toUpperCase()).includes(text.toUpperCase())) {
      addProjectInput.style.display = "none";
      addProjectSubmitBtn.style.display = "none";
      addProjectInput.value = "";
      addProject(text);
    }
  });

  return { addItem, addProject, changeToProject };
})()

notesController.addProject("Cool")
notesController.addProject("Bad")

for (let i = 0; i < 13; ++i) {
  notesController.addItem("Eating", "I need to eat", "12th March", "1", "I am just really hungry", 1);
}

for (let i = 0; i < 13; ++i) {
  notesController.addItem("Eating", "I need to eat", "12th March", "1", "I am just really hungry", 2);
}
