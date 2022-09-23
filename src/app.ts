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

// base component class
abstract class component<T extends HTMLElement, U extends HTMLElement> {
  template: HTMLTemplateElement;
  host: T;
  element: U;

  constructor(
    templateId: string,
    hostId: string,
    insertAtStart: boolean,
    newElementId?: string
  ) {
    this.template = document.getElementById(templateId)! as HTMLTemplateElement;
    this.host = document.getElementById(hostId)! as T;

    const importedNode = document.importNode(this.template.content, true);
    this.element = importedNode.firstElementChild as U;
    if (newElementId) {
      this.element.id = newElementId;
    }

    this.attach(insertAtStart);
  }

  private attach = (atStart: boolean) => {
    this.host.insertAdjacentElement(
      atStart ? "afterbegin" : "beforeend",
      this.element
    );
  };

  abstract configure(): void;
  abstract renderContent(): void;
}

//project input class
class ProjectInput extends component<HTMLDivElement, HTMLFormElement> {
  titleInputElement: HTMLInputElement;
  descriptionInputElement: HTMLInputElement;
  peopleInputElement: HTMLInputElement;

  constructor() {
    super("project-input", "app", true, "user-input");

    this.titleInputElement = this.element.querySelector(
      "#title"
    )! as HTMLInputElement;
    this.descriptionInputElement = this.element.querySelector(
      "#description"
    )! as HTMLInputElement;
    this.peopleInputElement = this.element.querySelector(
      "#people"
    )! as HTMLInputElement;

    this.configure();
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

  configure() {
    this.element.addEventListener("submit", this.submitHandler);
  }

  renderContent() {}
}

//project list class
class ProjectList extends component<HTMLDivElement, HTMLElement> {
  assignedProjects: Project[];

  constructor(private type: "active" | "finished") {
    super("project-list", "app", false, `${type}-projects`);
    this.assignedProjects = [];

    this.configure();
    this.renderContent();
  }

  configure = () => {
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
  };

  renderContent = () => {
    const listId = `${this.type}-projects-list`;
    this.element.querySelector("ul")!.id = listId;
    this.element.querySelector("h2")!.innerText =
      this.type.toUpperCase() + " PROJECTS";
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
}

const prj = new ProjectInput();
const active = new ProjectList("active");
const finished = new ProjectList("finished");
