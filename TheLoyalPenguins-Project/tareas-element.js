import { html, css, LitElement, property } from 'lit-element';

import '@kor-ui/kor/components/menu-item';
import '@kor-ui/kor/components/input';
import '@kor-ui/kor/components/button';



import '@vaadin/vaadin-text-field';
import '@vaadin/vaadin-button';
import '@vaadin/vaadin-checkbox';
import '@vaadin/vaadin';

import '@vaadin/vaadin-radio-button/vaadin-radio-button';
import '@vaadin/vaadin-radio-button/vaadin-radio-group';
import { IntegerFieldElement } from '@vaadin/vaadin-text-field/vaadin-integer-field';

const VisibilityFilters = { 
  SHOW_ALL: 'All',
  SHOW_ACTIVE: 'Active',
  SHOW_COMPLETED: 'Completed'
};


class TareasElement extends LitElement {

  static get properties() {
    return {
      todos: { type: Array },
      name: { type: String},
      done: { type: Boolean },

      actualTask: {type: Object},

      filter: { type: String },
      task: { type: String },
      ciclos: { type: Number },
    };
  }

  constructor() {
    super();

    this.actualTask = 0;
    this.todos = [{
        id: 0,
        task: "Activity 1",
        complete: false,
        ciclos: 4,
    }, ];
    this.filter = VisibilityFilters.SHOW_ALL;
    this.task = ''; 
    this.ciclos = 3; 
  }

    checkPropsUpdate() {
        if ( this.todos[this.actualTask].task != this.name ){
            this.todos[this.actualTask] = Object.assign({}, this.todos[this.actualTask], {task: this.name});
            console.log(this.todos[this.actualTask].task)
        }
        if ( this.done ) {
            this.todos[this.actualTask] = Object.assign({}, this.todos[this.actualTask], {complete: true});
            this.actualTask++;
            if ( this.todos.length <= this.actualTask ){
                this.todos[this.actualTask] = { 
                        id: this.actualTask,
                        task: "Activity "+(this.actualTask+1),
                        complete: false,
                        ciclos: 4,
                    };
            }
            var event = new CustomEvent('update-current-task', { detail: { name: this.todos[this.actualTask].task, duration: this.todos[this.actualTask].ciclos } });
            this.dispatchEvent(event);
        }
    }


  render() {
      this.checkPropsUpdate();
    return html`
    <div>
      <style>
        todo-view {
          display: block;
          max-width: 800px;
          margin: 0 auto;
        }
        todo-view .input-layout {
          width: 100%;
          display: flex;
        }
        todo-view .input-layout vaadin-text-field {
          flex: 1;
          margin-right: var(--spacing);
        }
        todo-view .todos-list {
          margin-top: var(--spacing);
        }
        todo-view .visibility-filters {
          margin-top: calc(4 * var(--spacing));
        }
      </style>
      <div class="input-layout" @keyup="${this.shortcutListener}">
        <vaadin-text-field
          placeholder="New Activity"
          value="${this.task}"
          @change="${this.updateTask}"
          
        ></vaadin-text-field>
        <vaadin-number-field
         value="${this.ciclos}"
         @change="${this.updateCiclo}"
         min="1" max="10" has-controls @click="${this.updateCiclo}">
        </vaadin-number-field>

        <vaadin-button theme="primary" @click="${this.addTodo}">
          Add Activity
        </vaadin-button>
      
      </div>
      <vaadin-radio-group
        class="visibility-filters"
        value="${this.filter}"
        @value-changed="${this.filterChanged}"
      >
        ${
          Object.values(VisibilityFilters).map(
            filter => html`
              <vaadin-radio-button value="${filter}"
                >${filter}</vaadin-radio-button
              >
            `
          )
        }
      </vaadin-radio-group>
      <vaadin-button @click="${this.clearCompleted}">
        Clear Completed
      </vaadin-button>
      
      <div class="todos-list">
        ${
          this.applyFilter(this.todos).map(
            todo => html`
                <vaadin-text-field 
                    style="width: 90%;"
                    value="${todo.task}"
                    @change="${
                                e => this.updateTodoName(todo, e.target.value)
                            }"
                >
                    <div slot="prefix">
                        <vaadin-checkbox
                            ?checked="${todo.complete}"
                            disabled
                        ></vaadin-checkbox>
                    </div>
                    <div style="margin: 0px" slot="suffix">
                        <vaadin-number-field
                            value="${todo.ciclos}"
                            @change="${(e) => {e.cancelBubble=true; this.updateTodoCiclos(todo, e.target.value)}}"
                            min="1" max="10" has-controls>
                        </vaadin-number-field>
                    </div>
                </vaadin-text-field>
            `
          )
        }
      </div>
      </div>
    `;
  }

  addTodo() {
    console.log(this.ciclos)
    if (this.task) {
      this.todos = [
        ...this.todos,
        {
          task: this.task,
          complete: false,
          ciclos: this.ciclos,

        }
      ];
      console.log(this.ciclos)
      this.task = "";
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
  updateCiclo(e) {
    this.ciclos = e.target.value;
  }

  updateTodoName(updatedTodo, task) {
    this.todos = this.todos.map(todo =>
      updatedTodo === todo ? { ...updatedTodo, task } : todo
    );
    if ( updatedTodo.id == this.actualTask ){
        var event = new CustomEvent('update-current-name', { detail: { newName: task } });
        this.dispatchEvent(event);
    }
  }

  updateTodoCiclos(updatedTodo, cilcos) {
    this.todos = this.todos.map(todo =>
      updatedTodo === todo ? { ...updatedTodo, cilcos } : todo
    );
    if ( updatedTodo.id == this.actualTask ){
        var event = new CustomEvent('update-current-time', { detail: { newTime: cilcos } });
        this.dispatchEvent(event);
    }
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
window.customElements.define("tareas-element", TareasElement);
