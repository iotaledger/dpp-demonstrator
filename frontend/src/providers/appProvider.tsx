import React, { PropsWithChildren } from 'react';

interface AppState {
  isHierarchySent: boolean;
  isNotarizationSent: boolean;
  hierarchySent: { key: string }[];
  notarizationSent: { key: string }[],
}

interface AppReducerAction {
  type: string;
  payload?: unknown;
}

interface AppContextValue {
  state: AppState;
  dispatch: React.ActionDispatch<[AppReducerAction]>;
  handleHierarchySentSuccess: (requestId: string) => void,
  handleNotarizationSentSuccess: (requestId: string) => void,
}

const actionTypes = {
  hierarchySentSuccess: 'hierarchySentSuccess',
  notarizationSentSuccess: 'notarizationSentSuccess',
}

const actions = {
  hierarchySentSuccess: {
    type: actionTypes.hierarchySentSuccess,
    action: function(requestId: string): AppReducerAction {
      return { type: actionTypes.hierarchySentSuccess, payload: requestId };
    },
    reduce: function(prevState: AppState): AppState {
      // TODO: push the payload to hierarchySent list
      return {
        ...prevState,
        isHierarchySent: true,
      }
    },
  },
  notarizationSentSuccess: {
    type: actionTypes.notarizationSentSuccess,
    action: function(requestId: string): AppReducerAction {
      return { type: actionTypes.notarizationSentSuccess, payload: requestId };
    },
    reduce: function(prevState: AppState): AppState {
      // TODO: push the payload to notarizationSent list
      return {
        ...prevState,
        isNotarizationSent: true,
      };
    }
  },
};

const initialState: AppState = {
  isHierarchySent: false,
  isNotarizationSent: false,
  hierarchySent: [],
  notarizationSent: [],
};

function reducer(state: AppState, action: AppReducerAction): AppState {
  switch (action.type) {
    case actions.hierarchySentSuccess.type: {
      return actions.hierarchySentSuccess.reduce(state);
    }
    case actions.notarizationSentSuccess.type: {
      return actions.notarizationSentSuccess.reduce(state);
    }
    default: {
      throw new Error('Could not find action');
    }
  }
}

const AppContext: React.Context<AppContextValue | null> = React.createContext<AppContextValue | null>(null);

export const AppProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const [state, dispatch] = React.useReducer(reducer, initialState);

  const handleHierarchySentSuccess = (requestId: string) => {
    dispatch(actions.hierarchySentSuccess.action(requestId));
  };

  const handleNotarizationSentSuccess = (requestId: string) => {
    dispatch(actions.notarizationSentSuccess.action(requestId));
  }

  return (
    <AppContext value={{
      state,
      dispatch,
      handleHierarchySentSuccess,
      handleNotarizationSentSuccess,
    }}>
      {children}
    </AppContext>
  );
}

export const useAppProvider = () => {
  // TODO: Throw if value is undefined
  const value = React.useContext(AppContext);

  if (value == null) {
    return {
      state: initialState,
    } as AppContextValue;
  }

  return value;
};

export const useHierarchySent = () => {
  // TODO: Throw if value is undefined
  const value: AppContextValue | null = React.useContext(AppContext);

  if (value == null) {
    return {
      isHierarchySent: false,
      hierarchySent: [],
    };
  }

  const { state: { isHierarchySent, hierarchySent } } = value;
  return {
    isHierarchySent,
    hierarchySent,
  }
}

export const useNotarizationSent = () => {
  // TODO: Throw if value is undefined
  const value: AppContextValue | null = React.useContext(AppContext);

  if (value == null) {
    return {
      isNotarizationSent: false,
      notarizationSent: [],
    };
  }

  const { state: { isNotarizationSent, notarizationSent } } = value;
  return {
    isNotarizationSent,
    notarizationSent,
  }
}
