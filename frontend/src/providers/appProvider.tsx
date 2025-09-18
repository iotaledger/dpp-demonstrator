import React, { PropsWithChildren } from 'react';
import { type Notification } from '@/components/Toast';

interface AppState {
  isHierarchySent: boolean;
  isNotarizationSent: boolean;
  hierarchySent: { key: string }[];
  notarizationSent: { key: string }[],
  notifications: Notification[],
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
  handleNotificationSent: (notification: Notification) => void;
  handleNotificationRemoved: (id: string) => void;
}

const actionTypes = {
  hierarchySentSuccess: 'hierarchySentSuccess',
  notarizationSentSuccess: 'notarizationSentSuccess',
  notificationSent: 'notificationSent',
  notificationRemoved: 'notificationRemoved',
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
  notificationSent: {
    type: actionTypes.notificationSent,
    action: function(notification: Notification): AppReducerAction {
      return { type: actionTypes.notificationSent, payload: notification };
    },
    reduce: function(prevState: AppState, action: AppReducerAction): AppState {
      return {
        ...prevState,
        notifications: [...prevState.notifications, action.payload as Notification],
      }
    }
  },
  notificationRemoved: {
    type: actionTypes.notificationRemoved,
    action: function(id: string): AppReducerAction {
      return { type: actionTypes.notificationRemoved, payload: id };
    },
    reduce: function(prevState: AppState, action: AppReducerAction): AppState {
      return {
        ...prevState,
        notifications: prevState.notifications.filter((each) => each.id !== action.payload),
      };
    },
  },
};

const initialState: AppState = {
  isHierarchySent: false,
  isNotarizationSent: false,
  hierarchySent: [],
  notarizationSent: [],
  notifications: [],
};

function reducer(state: AppState, action: AppReducerAction): AppState {
  switch (action.type) {
    case actions.hierarchySentSuccess.type: {
      return actions.hierarchySentSuccess.reduce(state);
    }
    case actions.notarizationSentSuccess.type: {
      return actions.notarizationSentSuccess.reduce(state);
    }
    case actions.notificationSent.type: {
      return actions.notificationSent.reduce(state, action);
    }
    case actions.notificationRemoved.type: {
      return actions.notificationRemoved.reduce(state, action);
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

  const handleNotificationSent = (notification: Notification) => {
    dispatch(actions.notificationSent.action(notification));
  }

  const handleNotificationRemoved = (id: string) => {
    dispatch(actions.notificationRemoved.action(id));
  }

  return (
    <AppContext value={{
      state,
      dispatch,
      handleHierarchySentSuccess,
      handleNotarizationSentSuccess,
      handleNotificationSent,
      handleNotificationRemoved,
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

export const useNotification = () => {
  const value: AppContextValue | null = React.useContext(AppContext);

  if (value === null) {
    return {
      notifications: [],
    }
  }

  const { state: { notifications }, handleNotificationSent, handleNotificationRemoved } = value;
  return {
    notifications,
    handleNotificationSent,
    handleNotificationRemoved,
  }
}
