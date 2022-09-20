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

    if (
      enteredTitle.trim().length === 0 ||
      enteredDescription.trim().length === 0 ||
      enteredPeople.trim().length === 0
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

  private submitHandler(event: Event) {
    event.preventDefault();
    const userInput = this.gatherUserInput();
    if (Array.isArray(userInput)) {
      const [title, desc, people] = userInput;
      console.log(title, desc, people);
      this.clearInputs();
    }
  }

  private configure() {
    this.form.addEventListener("submit", this.submitHandler);
  }
}

const prj = new ProjectInput();
