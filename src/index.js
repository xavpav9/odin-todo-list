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
    updateLocalStorage();
    changeToProject(projectNumber);
  }

  function updateLocalStorage() {
    localStorage.removeItem("projects");
    localStorage.setItem("projects", JSON.stringify(projects));
  }

  function getFromLocalStorage() {
    const projectsFromLS = JSON.parse(localStorage.getItem("projects"));
    const currentProjectFromLS = localStorage.getItem("currentProject");
    console.log(projectsFromLS);
    if (projectsFromLS === null) {
      return false;
    } else {
      for (const project of projectsFromLS) {
        const newProject = addProject(project.name, project.removable);
        newProject.items = project.items;
      }
    }

    changeToProject(currentProjectFromLS === null ? 0 : +currentProjectFromLS);
    return true;
  }

  function addProject(name, removable=true) {
    const [projectDom, removeBtn] = screenController.displayDomForProject(name, projects.length, removable);
    const project = {name, items: [], removable};
    projects.push(project);

    projectDom.addEventListener("click", evt => {
      changeToProject(+projectDom.dataset.number)
    });

    if (removeBtn !== null) {
      removeBtn.addEventListener("click", evt => {
        evt.stopPropagation();
        const projectNumber = +removeBtn.parentNode.dataset.number;
        removeProject(projectNumber);
      });
    }

    updateLocalStorage();
    return project
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
    updateLocalStorage();
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
    localStorage.setItem("currentProject", currentProject);
  }


  function addSaveNotesEvent(expandContainer) {
    expandContainer.querySelector(".save").addEventListener("click", evt => {
      evt.preventDefault();
      const projectNumber = currentProject;
      const titleInput = expandContainer.querySelector("#title");
      const descriptionInput = expandContainer.querySelector("#description");
      const dueDateInput = expandContainer.querySelector("#due-date");
      const notesInput = expandContainer.querySelector("#notes");
      const checklistInputs = [...expandContainer.querySelectorAll(".checklist label")].map(node => [node.textContent, node.previousElementSibling.checked]);
      const priorityInput = expandContainer.querySelector("#priority");

      if (titleInput.checkValidity() && descriptionInput.checkValidity() && dueDateInput.checkValidity() && priorityInput.checkValidity()) {
        removeItemByID(expandContainer.dataset.id);
        screenController.replaceWithCardContainer();
        addItem(titleInput.value, descriptionInput.value, dueDateInput.value, +priorityInput.value, notesInput.value, projectNumber, checklistInputs)
      } else {
        [...document.querySelectorAll(".expand-container *:invalid")].forEach(invalid => {
          if (invalid.nodeName !== "FORM") invalid.classList.add("current-invalid");
        });
      }
    });
  }

  function removeItemByID(id) {
    outer: for (let o = 0; o < projects.length; ++o) {
      for (let i = 0; i < projects[o].items.length; ++i) {
        if (projects[o].items[i].id === id) {
          projects[o].items.splice(i, 1);
          break outer;
        }
      }
    }
    updateLocalStorage();
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
    items.sort((a, b) => a.priority - b.priority)
    for (let item of items) {
      const card = screenController.displayDomForItem(item);
      card.querySelector(".expand-btn").addEventListener("click", evt => {
        const expandContainer = createExpandContainer();
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

  function createExpandContainer() {
    const expandContainer = screenController.replaceWithExpandContainer();
    addSaveNotesEvent(expandContainer);
    addExitEvent(expandContainer);
    return expandContainer;
  }

  document.querySelector(".create-container .add-project-btn").addEventListener("click", evt => {
    addProjectInput.style.display = "block";
    addProjectSubmitBtn.style.display = "block";
    addProjectInput.focus();
  });

  document.querySelector(".create-container .add-item-btn").addEventListener("click", evt => {
    const expandContainer = createExpandContainer();
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

  if (!getFromLocalStorage()) {
    addProject("All", false);
    addProject("Default");
    changeToProject(1);
  }

  return { addItem, addProject, changeToProject };
})()
