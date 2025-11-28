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
  }

  return { displayDomForItem }
})();

for (let i = 0; i < 13; ++i) {
  const item = new Item("Eating", "I need to eat", "12th March", "1", "I am just really hungry");
  screenController.displayDomForItem(item);
}
