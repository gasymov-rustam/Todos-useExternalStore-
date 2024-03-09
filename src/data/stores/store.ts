import { createAtom, useAtom } from '../atomStore';
import { generateId } from '../helpers';

interface Task {
  id: string;
  title: string;
  createdAt: number;
}

interface ToDoStore {
  tasks: Task[];
  tasksDone: Task[];
  createTask: (title: string) => void;
  updateTask: (id: string, title: string) => void;
  removeTask: (id: string) => void;
  createTaskDone: () => void;
  deleteEverything: () => void;
}

interface InitialState {
  tasks: Task[];
  tasksDone: Task[];
}

const initialState: InitialState = {
  tasks: [],
  tasksDone: [],
};

const todoStore = createAtom(initialState);

export const todoStoreReducers = {
  createTask: (title: string) => {
    const { tasks, tasksDone } = todoStore.get();
    const newTask: Task = {
      id: generateId(),
      title,
      createdAt: Date.now(),
    };

    todoStore.set({
      tasks: [newTask].concat(tasks),
      tasksDone,
    });
  },

  updateTask: (id: string, title: string) => {
    const { tasks, tasksDone } = todoStore.get();
    todoStore.set({
      tasks: tasks.map((task) => ({
        ...task,
        title: task.id === id ? title : task.title,
      })),
      tasksDone,
    });
  },

  createTaskDone: () => {
    const { tasks, tasksDone } = todoStore.get();
    const newTask = {
      id: generateId(),
      title: 'Fake repeated title',
      createdAt: Date.now(),
    };

    todoStore.set({
      tasks,
      tasksDone: [newTask].concat(tasksDone),
    });
  },

  removeTask: (id: string) => {
    const { tasks, tasksDone } = todoStore.get();

    todoStore.set({
      tasks: tasks.filter((task) => task.id !== id),
      tasksDone: [...tasksDone].concat(tasks.filter((task) => task.id === id)),
    });
  },

  deleteEverything: () => {
    todoStore.set({
      tasks: [],
      tasksDone: [],
    });
  },
};

export const useToDoStore = () => {
  const {value} = useAtom(todoStore);

  return { ...value, reducers: todoStoreReducers };
};
