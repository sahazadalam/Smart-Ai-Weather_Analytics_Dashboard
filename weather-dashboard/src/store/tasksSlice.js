import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  tasks: JSON.parse(localStorage.getItem('userTasks') || '[]'),
};

const tasksSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    addTask: (state, action) => {
      const newTask = {
        id: Date.now(),
        ...action.payload,
        completed: false,
        createdAt: new Date().toISOString(),
      };
      state.tasks.push(newTask);
      localStorage.setItem('userTasks', JSON.stringify(state.tasks));
    },
    updateTask: (state, action) => {
      const index = state.tasks.findIndex(task => task.id === action.payload.id);
      if (index !== -1) {
        state.tasks[index] = { ...state.tasks[index], ...action.payload };
        localStorage.setItem('userTasks', JSON.stringify(state.tasks));
      }
    },
    deleteTask: (state, action) => {
      state.tasks = state.tasks.filter(task => task.id !== action.payload);
      localStorage.setItem('userTasks', JSON.stringify(state.tasks));
    },
    toggleTask: (state, action) => {
      const task = state.tasks.find(task => task.id === action.payload);
      if (task) {
        task.completed = !task.completed;
        localStorage.setItem('userTasks', JSON.stringify(state.tasks));
      }
    },
  },
});

export const { addTask, updateTask, deleteTask, toggleTask } = tasksSlice.actions;
export default tasksSlice.reducer;