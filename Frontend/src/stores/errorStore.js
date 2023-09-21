import { create } from 'zustand';

/* 
  target {
    message:
    component:
  }
*/

const useErrorStore = create((set) => ({
  globalTarget: [],
  loginTarget: [],
  signupTarget: [],
  guessInputTarget: [],
  guessListTarget: [],
  gamePageTarget: [],
  roomTarget: [],
  addError: (newError) =>
    set((state) => ({
      ...state,
      [newError.target]: [
        ...state[newError.target],
        {
          component: newError.component,
          message: newError.message,
        },
      ],
    })),
  getErrorMessage: ({ target, component }) => {
    const state = useErrorStore.getState();
    for (var i = state[target].length - 1; i >= 0; --i) {
      if (state[target][i].component === component)
        return state[target][i].message;
    }
    return '';
  },
  clearErrors: ({ target, component }) =>
    set((state) => {
      let targetErrors = state[target];
      let errorIndex = targetErrors.findIndex(
        (error) => error.component === component,
      );
      while (errorIndex !== -1) {
        targetErrors.splice(errorIndex);
        errorIndex = targetErrors.findIndex(
          (error) => error.component === component,
        );
      }
      return {
        ...state,
        [target]: targetErrors,
      };
    }),
}));

export default useErrorStore;
