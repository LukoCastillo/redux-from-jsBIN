
const todos = (state = [], action) => {
    switch (action.type) {
        case 'ADD_TODO':
            return [
                ...state,
                {
                    id: action.id,
                    text: action.text,
                    completed: false
                }
            ];
        case 'TOGGLE_TODO':
            return state.map(todo => {
                if (todo.id != action.id) {
                    return todo;
                } else {
                    return Object.assign({}, todo, { completed: !todo.completed });
                }
            })
        default:
            return state;
    }
};



const visibilityFilter = (state = 'SHOW_ALL', action) => {
    switch (action.type) {
        case 'SET_VISIBILITY_FILTER':
            return action.filter;
        default:
            return state;
    }
};

const { combineReducers } = Redux

const todoApp = combineReducers({
    todos: todos,
    visibilityFilter: visibilityFilter
});

/*Start action section*/
let nextTodoId = 0;

const addTodo = (text) => {
    return {
        type: 'ADD_TODO',
        id: nextTodoId++,
        text: text
    }
};


const setVisibilityFilter = (filter) => {
    return {
        type: 'SET_VISIBILITY_FILTER',
        filter: filter
    }
};

const toggleTodo = (id) => {
    return {
        type: 'TOGGLE_TODO',
        id: id
    };
}

/**  /End Action section **/

//View layer
const { Component } = React;
const { connect, Provider } = ReactRedux;

const Link = ({
    active,
    children,
    onClick
}) => {

    if (active) {
        return <span>{children}</span>
    }

    return (<a href="#"
        onClick={e => {
            e.preventDefault();
            onClick();
        }}>
        {children}
    </a>)
};


const mapStateToLinkProps = (state, ownProps) => {
    return {
        active: ownProps.filter === state.visibilityFilter
    }
}

const mapDispatchToLinkProps = (dispatch, ownProps) => {
    return {
        onClick: () => {
            dispatch(setVisibilityFilter(ownProps.filter));
        }
    };
}

const FilterLink = connect(mapStateToLinkProps, mapDispatchToLinkProps)(Link);


const Footer = ({ visibilityFilter,
    onFilterClick }) => (
        <p>
            Show: {''}
            <FilterLink filter='SHOW_ALL'
                currentFilter={visibilityFilter}
                onClick={onFilterClick}
            >All</FilterLink> {' '}
            <FilterLink filter='SHOW_ACTIVE'
                currentFilter={visibilityFilter}
                onClick={onFilterClick} >Active</FilterLink> {' '}
            <FilterLink filter='SHOW_COMPLETED'
                currentFilter={visibilityFilter}
                onClick={onFilterClick} >Complete</FilterLink>
        </p>

    );

const Todo = ({ onClick, completed, text }) => (
    <li onClick={onClick}
        style={{ textDecoration: completed ? 'line-through' : 'none' }} >
        {text}
    </li>
);


const TodoList = ({ todos, onTodoClick }) => (
    <ul>
        {todos.map(todo =>
            <Todo key={todo.id} {...todo} onClick={() => onTodoClick(todo.id)} />
        )}
    </ul>
);



let AddTodo = ({ dispatch }) => {
    let input;
    return (<div>
        <input ref={node => { input = node }} />
        <button onClick={() => {
            dispatch(addTodo(input.value))
            input.value = '';
        }}>
            Add Todo
              </button>
    </div>);
}

AddTodo = connect()(AddTodo);

const getVisibleTodos = (todos, filter) => {
    switch (filter) {
        case 'SHOW_ALL':
            return todos;
        case 'SHOW_COMPLETED':
            return todos.filter(t => t.completed);
        case 'SHOW_ACTIVE':
            return todos.filter(t => !t.completed);
        default:
            return todos;
    }
}

const mapStateToTodoListProps = (state) => {
    return {
        todos: getVisibleTodos(state.todos, state.visibilityFilter)
    }
};
const mapDispatchToTodoListProps = (dispatch) => {
    return {
        onTodoClick: (id) => {
            dispatch(toggleTodo(id));
        }
    }
};

const VisibleTodoList = connect(
    mapStateToTodoListProps,
    mapDispatchToTodoListProps
)(TodoList);


class TodoApp extends Component {
    render() {
        return (<div>
            <AddTodo />
            <VisibleTodoList />
            <Footer />
        </div>);
    }
}


const { createStore } = Redux;

ReactDOM.render(
    <Provider store={createStore(todoApp)}>
        <TodoApp />
    </Provider>,
    document.getElementById('root'));






