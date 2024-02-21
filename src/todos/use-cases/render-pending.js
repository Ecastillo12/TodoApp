import todoStore, { Filters } from "../../store/todo.store";

let element;

/**
 * 
 * @param {String} elementId 
 */
export const renderPendingTodos = ( elementId ) => {

    console.log('Renderizando pendientes', elementId);

    if (!element)
        element = document.querySelector( elementId );
    
    if (!element)
        throw new Error(`Elemento  ${ elementId } not found`);

    element.innerHTML = todoStore.getTodos( Filters.Pending ).length;

}