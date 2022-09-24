namespace App {
  //project input class
  export class ProjectInput extends component<HTMLDivElement, HTMLFormElement> {
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
}
