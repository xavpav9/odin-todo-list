export default class {
  constructor(title, description, dueDate, priority, notes, project, checklist) {
    this.title = title;
    this.description = description;
    this.dueDate = dueDate;
    this.priority = priority;
    this.notes = notes;
    this.project = project;
    this.checklist = [];
    for (const item of checklist) {
      this.checklist.push({name: item[0], done: item[1]});
    }
    this.id = crypto.randomUUID();
  }
}
