import "./font-styles.css";
import "./style.css";
import Item from "./todo-item.js";
import createScreenController from "./dom-controller";

const screenController = createScreenController();

const notesController = (function() {
  let currentProject = 0;
  const items = [];
  const projects = [];
  const addProjectInput = document.querySelector("#add-project-input");
  const addProjectSubmitBtn = document.querySelector(".add-project-submit-btn");

  function addItem(title, description, date, priority, notes, projectNumber, checklist) {
    const item = new Item(title, description, date, priority, notes, projectNumber, checklist);
    projects[projectNumber].items.push(item);
    changeToProject(projectNumber);
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
    if (document.querySelector(".cards-container") !== null) {
      if (projectNumber === 0) {
        refillCards(projectNumber, projects.reduce((acc, project) => acc.concat(project.items), []));
      } else {
        refillCards(projectNumber, projects[projectNumber].items);
      }
    }
    screenController.changeDomSelectedProject(projectNumber);
    currentProject = projectNumber;
  }


  function addSaveNotesEvent(expandContainer) {
    expandContainer.querySelector(".save").addEventListener("click", evt => {
      evt.preventDefault();
      const projectNumber = currentProject;
      const titleInput = expandContainer.querySelector("#title").value;
      const descriptionInput = expandContainer.querySelector("#description").value;
      const dueDateInput = expandContainer.querySelector("#due-date").value;
      const notesInput = expandContainer.querySelector("#notes").value;
      const checklistInputs = [...expandContainer.querySelectorAll(".checklist label")].map(node => [node.textContent, node.previousElementSibling.checked]);
      const priorityInput = +expandContainer.querySelector("#priority").value;

      if (titleInput.length > 0 && descriptionInput.length > 0 && dueDateInput !== "" && priorityInput > 0) {
        removeItemByID(expandContainer.dataset.id);
        screenController.replaceWithCardContainer();
        addItem(titleInput, descriptionInput, dueDateInput, priorityInput, notesInput, projectNumber, checklistInputs)
      } else {
        const invalids = document.querySelectorAll(".expand-container *:invalid");
        console.log(invalids);
        if (invalids !== null) {
          invalids.forEach(invalid => {
            if (invalid.nodeName !== "FORM") invalid.classList.add("current-invalid");
          });
        }
      }
    });
  }

  function removeItemByID(id) {
    if (currentProject === 0) {
      outer: for (let o = 0; o < projects.length; ++o) {
        for (let i = 0; i < projects[o].items.length; ++i) {
          if (projects[o].items[i].id === id) {
            projects[o].items.splice(i, 1);
            break outer;
          }
        }
      }
    } else {
      for (let i = 0; i < projects[currentProject].items.length; ++i) {
        if (projects[currentProject].items[i].id === id) {
          projects[currentProject].items.splice(i, 1);
          break;
        }
      }
    }
  }

  function addExitEvent(expandContainer) {
    expandContainer.querySelector(".exit").addEventListener("click", evt => {
      evt.preventDefault();
      screenController.replaceWithCardContainer();
      changeToProject(currentProject);
    });
  }

  function refillCards(projectNumber, items) {
    document.querySelector("#content").children[1].textContent = ""
    for (let item of items) {
      const card = screenController.displayDomForItem(item);
      card.querySelector(".expand-btn").addEventListener("click", evt => {
        const expandContainer = screenController.replaceWithExpandContainer();
        addSaveNotesEvent(expandContainer);
        addExitEvent(expandContainer);
        expandContainer.dataset.id = item.id;
        screenController.fillExpandContainer(item, expandContainer);
      });
      card.querySelector(".cross svg").addEventListener("click", evt => {
        const id = card.dataset.id;
        removeItemByID(id);
        changeToProject(currentProject);
      });
    }
  }

  document.querySelector(".create-container .add-project-btn").addEventListener("click", evt => {
    addProjectInput.style.display = "block";
    addProjectSubmitBtn.style.display = "block";
    addProjectInput.focus();
  });

  document.querySelector(".create-container .add-item-btn").addEventListener("click", evt => {
    const expandContainer = screenController.replaceWithExpandContainer();
    addSaveNotesEvent(expandContainer);
    addExitEvent(expandContainer);
    expandContainer.dataset.id = "";
  });

  addProjectInput.addEventListener("keydown", evt => {
    if (evt.key === "Enter") {
      evt.preventDefault();
      addProjectSubmitBtn.dispatchEvent(new Event("click"));
    }
  });

  addProjectSubmitBtn.addEventListener("click", evt => {
    const text = addProjectInput.value.trim();
    if (text === "") {
      addProjectInput.style.display = "none";
      addProjectSubmitBtn.style.display = "none";
      addProjectInput.value = "";
    } else if (!projects.map(project => project.name.toUpperCase()).includes(text.toUpperCase())) {
      addProjectInput.style.display = "none";
      addProjectSubmitBtn.style.display = "none";
      addProjectInput.value = "";
      addProject(text);
    }
  });

  addProject("All", false);
  addProject("Default");

  return { addItem, addProject, changeToProject };
})()

notesController.addProject("Cool")
notesController.addProject("Bad")

for (let i = 0; i < 4; ++i) {
  notesController.addItem("Eating", "I need to eat", "2025-11-12T19:25", "1", "I am just really hungry", 1, [["apple", false], ["orange", true]]);
}

for (let i = 0; i < 4; ++i) {
  notesController.addItem("Eating", "I need to eat", "2025-11-12T19:35", "1", "I am just really hungry", 2, [["apple", false], ["orange", true]]);
}

notesController.changeToProject(1);
