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

interface InitialTasksState {
  tasks: Task[];
}

interface InitialTasksDoneState {
  tasksDone: Task[];
}

const initialState: InitialTasksState = {
  tasks: [],
};

const initialTasksDoneState: InitialTasksDoneState = {
  tasksDone: [],
};

const tasksDoneStore = createAtom(initialTasksDoneState);

const tasksStore = createAtom(initialState);


export const tasksDoneReducers = {
  removeTask: (id: string) => {
    const { tasksDone } = tasksDoneStore.get();
    tasksDoneStore.set({
      tasksDone: tasksDone.filter((task) => task.id !== id),
    });
  },

  
  createTaskDone: () => {
    const { tasksDone } = tasksDoneStore.get();
    const newTask = {
      id: generateId(),
      title: 'Fake repeated title',
      createdAt: Date.now(),
    };

    tasksDoneStore.set({
      tasksDone: [newTask].concat(tasksDone),
    });
  },
};

export const todoStoreReducers = {
  createTask: (title: string) => {
    const { tasks } = tasksStore.get();
    const newTask: Task = {
      id: generateId(),
      title,
      createdAt: Date.now(),
    };

    tasksStore.set({
      tasks: [newTask].concat(tasks),
    });
  },

  updateTask: (id: string, title: string) => {
    const { tasks } = tasksStore.get();
    tasksStore.set({
      tasks: tasks.map((task) => ({
        ...task,
        title: task.id === id ? title : task.title,
      })),
    });
  },

  removeTask: (id: string) => {
    const { tasks } = tasksStore.get();

    const { tasksDone } = tasksDoneStore.get();

    tasksDoneStore.set({
      tasksDone:  [...tasksDone].concat(tasks.filter((task) => task.id === id)),
    });

    tasksStore.set({
      tasks: tasks.filter((task) => task.id !== id),
    });
  },

  deleteEverything: () => {
    tasksStore.set({
      tasks: [],
    });
    tasksDoneStore.set({ tasksDone: [] })
  },
};


export const useToDoStore = () => {
  const {value} = useAtom(tasksStore);

  return { ...value, reducers: todoStoreReducers };
};

export const useTasksDoneStore = () => {
  const {value} = useAtom(tasksDoneStore);

  return { ...value, reducers: tasksDoneReducers };
};
