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

  private submitHandler(event: Event) {
    event.preventDefault();
    console.log(this.titleInputElement.value);
  }

  private configure() {
    this.form.addEventListener("submit", this.submitHandler.bind(this));
  }
}

const prj = new ProjectInput();
