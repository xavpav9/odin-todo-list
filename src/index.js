import "./font-styles.css";
import "./style.css";
import Item from "./todo-item.js";

const screenController = (function() {
  const contentDiv = document.querySelector("div#content");

  const cardsContainer = document.createElement("div");
  cardsContainer.classList.add("cards-container");
  const projectsContainer = document.createElement("div");
  projectsContainer.classList.add("projects-container");

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

  function addItem(title, description, date, priority, notes, projectNumber) {
    const item = new Item(title, description, date, priority, notes, projectNumber);
    projects[projectNumber].items.push(item);
    if (currentProject == projectNumber) {
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
    screenController.refillCards(projectNumber, projects[projectNumber].items);
    currentProject = projectNumber;
  }

  addProject("Default");

  return { addItem, addProject, changeToProject };
})()

notesController.addProject("Cool")
notesController.addProject("Bad")

for (let i = 0; i < 13; ++i) {
  notesController.addItem("Eating", "I need to eat", "12th March", "1", "I am just really hungry", 1);
}
