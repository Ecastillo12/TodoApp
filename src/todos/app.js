import html from './app.html?raw';

import todoStore, { Filters } from '../store/todo.store';
import { renderTodos, renderPendingTodos } from './use-cases';

const ElementIDs = {
    TodoList: '.todo-list',
    NewTodoInput: '#new-todo-input',
    ClearCompleted: '.clear-completed',
    TodoFilters: '.filtro',
    PendingCountLabel: '#pending-count',
}

/**
 * 
 * @param {String} elementId 
 */
export const App = ( elementId ) => {

    const displayToDos = () => {
        const todos = todoStore.getTodos( todoStore.getCurrentFilter() );
        renderTodos( ElementIDs.TodoList, todos );
        updatePendingCount();
    }


    const updatePendingCount = () => {
        renderPendingTodos( ElementIDs.PendingCountLabel );
    } 

    //Función anónima autoinvocada
    //Se ejecuta cuando la función App() se llama, desde el main.js
    (() => {
        const app = document.createElement('div');
        app.innerHTML = html;
        document.querySelector(elementId).append( app );
        displayToDos();
    })();

    //Referencias HTML
    const newDescriptionInput = document.querySelector ( ElementIDs.NewTodoInput );
    const todoListUL = document.querySelector( ElementIDs.TodoList );
    const clearCompletedButton = document.querySelector( ElementIDs.ClearCompleted );
    const filtersLIs = document.querySelectorAll( ElementIDs.TodoFilters );

    //Listeners
    newDescriptionInput.addEventListener('keyup', ( event ) => {
        if ( event.keyCode !== 13 ) return;

        if ( event.target.value.trim().length === 0 ) return;

        todoStore.addTodo( event.target.value );
        displayToDos();
        event.target.value = '';
    });

    todoListUL.addEventListener('click', ( event ) =>{
        const element = event.target.closest('[data-id]');
        todoStore.toggleTodo(element.getAttribute('data-id'));
        displayToDos();
    });

    todoListUL.addEventListener('click', ( event ) =>{
        if (event.target.getAttribute('class') !== 'destroy') return;
        const element = event.target.closest('[data-id]');
        todoStore.deleteTodo(element.getAttribute('data-id'));
        displayToDos();
    });

    clearCompletedButton.addEventListener('click', ( ) =>{
        todoStore.deleteCompleted();
        displayToDos();
    })

    filtersLIs.forEach( element => {
        element.addEventListener('click', ( element ) => {
            filtersLIs.forEach( el => el.classList.remove('selected'));
            element.target.classList.add('selected');

            switch (element.target.text) {
                case 'Todos':
                    todoStore.setFilter( Filters.All )
                    break;
                case 'Pendientes':
                    todoStore.setFilter( Filters.Pending )
                    break;
                case 'Completados':
                    todoStore.setFilter( Filters.Completed )
                    break;
            }

            displayToDos();
        });
    });

}