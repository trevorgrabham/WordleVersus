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
