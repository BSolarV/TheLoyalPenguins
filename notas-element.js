import { html, css, LitElement, property } from 'lit-element';

import '@kor-ui/kor/components/menu-item';
import '@kor-ui/kor/components/input';
import '@kor-ui/kor/components/button';


import '@vaadin/vaadin-text-field';
import '@vaadin/vaadin-button';
import '@vaadin/vaadin-checkbox';
import '@vaadin/vaadin-radio-button/vaadin-radio-button';
import '@vaadin/vaadin-radio-button/vaadin-radio-group';

const VisibilityFilters = { 
  SHOW_ALL: 'Todas',
  SHOW_ACTIVE: 'Activas',
  SHOW_COMPLETED: 'Completadas'
};

class NotasElement extends LitElement {

  static get properties() {
    return {
      todos: { type: Array },
      filter: { type: String },
      task: { type: String }
    };
  }

  constructor() {
    super();
    this.todos = [];
    this.filter = VisibilityFilters.SHOW_ALL;
    this.task = '';
  }

  render() {
    return html`
        <div style="height: 90%; text-align: center;">
            <div class="todos-list" style="top: 0; text-align: center; height: 90%;">
                ${
                this.applyFilter(this.todos).map(
                    todo => html`
                        <div class="todo-item">
                            <vaadin-text-area
                            theme="error primary"
                            value="${todo.task}"
                            @change="${this.updateTask}"
                            ></vaadin-text-area>
                            <vaadin-checkbox
                            theme="error primary"
                            ?checked="${todo.complete}"
                            @change="${
                                e => this.updateTodoStatus(todo, e.target.checked)
                            }"
                            >
                            </vaadin-checkbox>
                        </div>
                    `
                )
                }
            </div>
            <div class="input-layout" @keyup="${this.shortcutListener}">
                <vaadin-text-area 
                theme="error primary"
                placeholder="Write something"
                value="${this.task}"
                @change="${this.updateTask}"
                ></vaadin-text-area>
                <vaadin-button theme="error primary" @click="${this.addTodo}"  >
                Add Note
                </vaadin-button>
            </div>
        </div>
    `;
  }

  addTodo() {
    if (this.task) {
      this.todos = [
        ...this.todos,
        {
          task: this.task,
          complete: false,
          tiempo: 3
        }
      ];
      this.task = '';
    }
  }

  shortcutListener(e) {
    if (e.key === 'Enter') {
      this.addTodo();
    }
  }

  updateTask(e) {
    this.task = e.target.value;
  }

  updateTodoStatus(updatedTodo, complete) {
    this.todos = this.todos.map(todo =>
      updatedTodo === todo ? { ...updatedTodo, complete } : todo
    );
  }

  filterChanged(e) {
    this.filter = e.target.value;
  }

  clearCompleted() {
    this.todos = this.todos.filter(todo => !todo.complete);
  }

  applyFilter(todos) {
    switch (this.filter) {
      case VisibilityFilters.SHOW_ACTIVE:
        return todos.filter(todo => !todo.complete);
      case VisibilityFilters.SHOW_COMPLETED:
        return todos.filter(todo => todo.complete);
      default:
        return todos;
    }
  }
}
window.customElements.define("notas-element", NotasElement);
