//project type
enum ProjectStatus {
  Active,
  Finished,
}

class Project {
  constructor(
    public id: string,
    public title: string,
    public description: string,
    public people: number,
    public status: ProjectStatus
  ) {}
}

// State Management
type Listener = (items: Project[]) => void;

class ProjectState {
  private listeners: Listener[] = [];
  private projects: Project[] = [];
  private static instance: ProjectState;

  private constructor() {}

  static getInstance = () => {
    if (!this.instance) {
      this.instance = new ProjectState();
    }
    return this.instance;
  };

  addlistener = (listenerFn: Listener) => {
    this.listeners.push(listenerFn);
  };

  addProject = (title: string, description: string, numOfPeople: number) => {
    const project = new Project(
      Math.random().toString(),
      title,
      description,
      numOfPeople,
      ProjectStatus.Active
    );

    this.projects.push(project);

    for (const listenerFn of this.listeners) {
      listenerFn([...this.projects]);
    }
  };
}

const projectState = ProjectState.getInstance();

// validation
interface Validatable {
  value: string | number;
  required?: boolean;
  minlength?: number;
  maxlength?: number;
  min?: number;
  max?: number;
}

const validate = (input: Validatable) => {
  let isValid = true;

  if (input.required) {
    isValid = isValid && input.value.toString().trim().length !== 0;
  }
  if (input.minlength != null && typeof input.value === "string") {
    isValid = isValid && input.value.length >= input.minlength;
  }
  if (input.maxlength && typeof input.value === "string") {
    isValid = isValid && input.value.length <= input.maxlength;
  }
  if (input.min != null && typeof input.value === "number") {
    isValid = isValid && input.value >= input.min;
  }
  if (input.max && typeof input.value === "number") {
    isValid = isValid && input.value <= input.max;
  }

  return isValid;
};

// autobind decorator
const autoBind = (_: any, _2: string, descriptor: PropertyDescriptor) => {
  const originalMethod = descriptor.value;
  const adjDescriptor: PropertyDescriptor = {
    get() {
      const boundfn = originalMethod.bind(this);
      return boundfn;
    },
  };
  return adjDescriptor;
};

//project input class
class ProjectInput {
  template: HTMLTemplateElement;
  host: HTMLDivElement;
  form: HTMLFormElement;
  titleInputElement: HTMLInputElement;
  descriptionInputElement: HTMLInputElement;
  peopleInputElement: HTMLInputElement;

  constructor() {
    this.template = document.getElementById(
      "project-input"
    )! as HTMLTemplateElement;
    this.host = document.getElementById("app")! as HTMLDivElement;

    const importedNode = document.importNode(this.template.content, true);
    this.form = importedNode.firstElementChild as HTMLFormElement;
    this.form.id = "user-input";

    this.titleInputElement = this.form.querySelector(
      "#title"
    )! as HTMLInputElement;
    this.descriptionInputElement = this.form.querySelector(
      "#description"
    )! as HTMLInputElement;
    this.peopleInputElement = this.form.querySelector(
      "#people"
    )! as HTMLInputElement;

    this.configure();
    this.attatch();
  }

  private attatch() {
    this.host.insertAdjacentElement("afterbegin", this.form);
  }

  private gatherUserInput = (): [string, string, number] | void => {
    const enteredTitle = this.titleInputElement.value;
    const enteredDescription = this.descriptionInputElement.value;
    const enteredPeople = this.peopleInputElement.value;

    const titleValidation: Validatable = {
      value: enteredTitle,
      required: true,
    };

    const descriptionValidation: Validatable = {
      value: enteredDescription,
      required: true,
      minlength: 5,
      maxlength: 200,
    };
    const PeopleValidation: Validatable = {
      value: +enteredPeople,
      required: true,
      min: 1,
      max: 10,
    };
    if (
      !validate(titleValidation) ||
      !validate(descriptionValidation) ||
      !validate(PeopleValidation)
    ) {
      alert("Invalid input, Please try again!");
      return;
    } else {
      return [enteredTitle, enteredDescription, +enteredPeople];
    }
  };

  private clearInputs = (): void => {
    this.titleInputElement.value = "";
    this.descriptionInputElement.value = "";
    this.peopleInputElement.value = "";
  };

  @autoBind
  private submitHandler(event: Event) {
    event.preventDefault();
    const userInput = this.gatherUserInput();
    if (Array.isArray(userInput)) {
      const [title, desc, people] = userInput;
      projectState.addProject(title, desc, people);
      this.clearInputs();
    }
  }

  private configure() {
    this.form.addEventListener("submit", this.submitHandler);
  }
}

//project list class
class ProjectList {
  template: HTMLTemplateElement;
  host: HTMLDivElement;
  section: HTMLElement;
  assignedProjects: Project[];

  constructor(private type: "active" | "finished") {
    this.template = document.getElementById(
      "project-list"
    )! as HTMLTemplateElement;
    this.host = document.getElementById("app")! as HTMLDivElement;

    const importedNode = document.importNode(this.template.content, true);
    this.section = importedNode.firstElementChild as HTMLElement;
    this.section.id = `${this.type}-projects`;

    projectState.addlistener((projects: Project[]) => {
      const releventProjects = projects.filter((prj) => {
        if (this.type === "active") {
          return prj.status === ProjectStatus.Active;
        } else {
          return prj.status === ProjectStatus.Finished;
        }
      });
      this.assignedProjects = releventProjects;
      this.renderProjects();
    });

    this.assignedProjects = [];

    this.attach();
    this.renderContent();
  }

  private attach = () => {
    this.host.insertAdjacentElement("beforeend", this.section);
  };

  private renderProjects = () => {
    const listElement = document.getElementById(
      `${this.type}-projects-list`
    )! as HTMLUListElement;
    listElement.innerHTML = "";
    for (const prj of this.assignedProjects) {
      const listItem = document.createElement("li");
      listItem.innerText = prj.title;
      listElement.appendChild(listItem);
    }
  };

  private renderContent = () => {
    const listId = `${this.type}-projects-list`;
    this.section.querySelector("ul")!.id = listId;
    this.section.querySelector("h2")!.innerText =
      this.type.toUpperCase() + " PROJECTS";
  };
}

const prj = new ProjectInput();
const active = new ProjectList("active");
const finished = new ProjectList("finished");
