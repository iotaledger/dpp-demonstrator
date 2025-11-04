import React from 'react';

import { type Notification } from '@/components/Toast';

interface AppState {
  isWalletConnected: boolean;
  currentAccountAddress: string | null;
  currentAccountNetwork: string | null;
  isHierarchySent: boolean;
  isNotarizationSent: boolean;
  hierarchySent: { key: string }[];
  notarizationSent: { key: string }[];
  notifications: Notification[];
}

interface AppReducerAction {
  type: string;
  payload?: unknown;
}

interface AppContextValue {
  state: AppState;
  dispatch: React.ActionDispatch<[AppReducerAction]>;
  handleWalletConnected: () => void;
  handleWalletDisconnected: () => void;
  handleCurrentAccountAddressChanged: (currentAccountAddress: string | null) => void;
  handleCurrentAccountNetworkChanged: (currentAccountNetwork: string | null) => void;
  handleHierarchySentSuccess: (requestId: string) => void;
  handleNotarizationSentSuccess: (requestId: string) => void;
  handleNotificationSent: (notification: Notification) => void;
  handleNotificationRemoved: (id: string) => void;
  inNightlyWallet: boolean;
}

const actionTypes = {
  walletConnected: 'walletConnected',
  walletDisconnected: 'walletDisconnected',
  currentAccountAddressChanged: 'currentAccountAddressChanged',
  currentAccountNetworkChanged: 'currentAccountNetworkChanged',
  hierarchySentSuccess: 'hierarchySentSuccess',
  notarizationSentSuccess: 'notarizationSentSuccess',
  notificationSent: 'notificationSent',
  notificationRemoved: 'notificationRemoved',
};

const actions = {
  walletConnected: {
    type: actionTypes.walletConnected,
    action: function (): AppReducerAction {
      return { type: actionTypes.walletConnected };
    },
    reduce: function (prevState: AppState): AppState {
      return {
        ...prevState,
        isWalletConnected: true,
      };
    },
  },
  walletDisconnected: {
    type: actionTypes.walletDisconnected,
    action: function (): AppReducerAction {
      return { type: actionTypes.walletDisconnected };
    },
    reduce: function (prevState: AppState): AppState {
      return {
        ...prevState,
        isWalletConnected: false,
        isHierarchySent: false,
        isNotarizationSent: false,
      };
    },
  },
  currentAccountAddressChanged: {
    type: actionTypes.currentAccountAddressChanged,
    action: function (currentAccountAddress: string | null): AppReducerAction {
      return { type: actionTypes.currentAccountAddressChanged, payload: currentAccountAddress };
    },
    reduce: function (prevState: AppState, action: AppReducerAction): AppState {
      return {
        ...prevState,
        currentAccountAddress: action.payload as string | null,
        isHierarchySent: false,
        isNotarizationSent: false,
      };
    },
  },
  currentAccountNetworkChanged: {
    type: actionTypes.currentAccountNetworkChanged,
    action: function (currentAccountNetwork: string | null): AppReducerAction {
      return { type: actionTypes.currentAccountNetworkChanged, payload: currentAccountNetwork };
    },
    reduce: function (prevState: AppState, action: AppReducerAction): AppState {
      return {
        ...prevState,
        currentAccountNetwork: action.payload as string | null,
      };
    },
  },
  hierarchySentSuccess: {
    type: actionTypes.hierarchySentSuccess,
    action: function (requestId: string): AppReducerAction {
      return { type: actionTypes.hierarchySentSuccess, payload: requestId };
    },
    reduce: function (prevState: AppState): AppState {
      return {
        ...prevState,
        isHierarchySent: true,
      };
    },
  },
  notarizationSentSuccess: {
    type: actionTypes.notarizationSentSuccess,
    action: function (requestId: string): AppReducerAction {
      return { type: actionTypes.notarizationSentSuccess, payload: requestId };
    },
    reduce: function (prevState: AppState): AppState {
      return {
        ...prevState,
        isNotarizationSent: true,
      };
    },
  },
  notificationSent: {
    type: actionTypes.notificationSent,
    action: function (notification: Notification): AppReducerAction {
      return { type: actionTypes.notificationSent, payload: notification };
    },
    reduce: function (prevState: AppState, action: AppReducerAction): AppState {
      // notification ID set as facility
      const notificationIdSet = new Set(prevState.notifications.map((each) => each.id));
      // if notification is already registered, do nothing
      if (notificationIdSet.has((action.payload as Notification).id)) {
        return prevState;
      }
      // otherwise, add notification
      return {
        ...prevState,
        notifications: [...prevState.notifications, action.payload as Notification],
      };
    },
  },
  notificationRemoved: {
    type: actionTypes.notificationRemoved,
    action: function (id: string): AppReducerAction {
      return { type: actionTypes.notificationRemoved, payload: id };
    },
    reduce: function (prevState: AppState, action: AppReducerAction): AppState {
      return {
        ...prevState,
        notifications: prevState.notifications.filter((each) => each.id !== action.payload),
      };
    },
  },
};

const initialState: AppState = {
  isWalletConnected: false,
  currentAccountAddress: null,
  currentAccountNetwork: null,
  isHierarchySent: false,
  isNotarizationSent: false,
  hierarchySent: [],
  notarizationSent: [],
  notifications: [],
};

function reducer(state: AppState, action: AppReducerAction): AppState {
  switch (action.type) {
    case actions.walletConnected.type: {
      return actions.walletConnected.reduce(state);
    }
    case actions.walletDisconnected.type: {
      return actions.walletDisconnected.reduce(state);
    }
    case actions.currentAccountAddressChanged.type: {
      return actions.currentAccountAddressChanged.reduce(state, action);
    }
    case actions.currentAccountNetworkChanged.type: {
      return actions.currentAccountNetworkChanged.reduce(state, action);
    }
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

// TODO: Find a better alternative to `null` because the initiaal context state is never null
const AppContext: React.Context<AppContextValue | null> =
  React.createContext<AppContextValue | null>(null);

interface AppProviderProps {
  children: React.ReactNode;
  inNightlyWallet?: boolean;
}

export const AppProvider: React.FC<AppProviderProps> = ({ children, inNightlyWallet = false }) => {
  const [state, dispatch] = React.useReducer(reducer, initialState);

  const handleWalletConnected = () => {
    dispatch(actions.walletConnected.action());
  };

  const handleWalletDisconnected = () => {
    dispatch(actions.walletDisconnected.action());
  };

  const handleHierarchySentSuccess = (requestId: string) => {
    dispatch(actions.hierarchySentSuccess.action(requestId));
  };

  const handleNotarizationSentSuccess = (requestId: string) => {
    dispatch(actions.notarizationSentSuccess.action(requestId));
  };

  const handleNotificationSent = (notification: Notification) => {
    dispatch(actions.notificationSent.action(notification));
  };

  const handleNotificationRemoved = (id: string) => {
    dispatch(actions.notificationRemoved.action(id));
  };

  const handleCurrentAccountAddressChanged = (currentAccountAddress: string | null) => {
    dispatch(actions.currentAccountAddressChanged.action(currentAccountAddress));
  };

  const handleCurrentAccountNetworkChanged = (currentAccountNetwork: string | null) => {
    dispatch(actions.currentAccountNetworkChanged.action(currentAccountNetwork));
  };

  return (
    <AppContext
      value={{
        state,
        dispatch,
        handleWalletConnected,
        handleWalletDisconnected,
        handleCurrentAccountAddressChanged,
        handleCurrentAccountNetworkChanged,
        handleHierarchySentSuccess,
        handleNotarizationSentSuccess,
        handleNotificationSent,
        handleNotificationRemoved,
        inNightlyWallet,
      }}
    >
      {children}
    </AppContext>
  );
};

export const useAppProvider = () => {
  const value = React.useContext(AppContext);

  if (value == null) {
    throw new Error('It must be used within a AppProvider');
  }

  return value;
};

export const useWalletConnected = () => {
  const value: AppContextValue | null = React.useContext(AppContext);

  if (value == null) {
    throw new Error('It must be used within a AppProvider');
  }

  const {
    state: { isWalletConnected },
    handleWalletConnected,
    handleWalletDisconnected,
  } = value;
  return {
    isWalletConnected,
    handleWalletConnected,
    handleWalletDisconnected,
  };
};

export const useHierarchySent = () => {
  const value: AppContextValue | null = React.useContext(AppContext);

  if (value == null) {
    throw new Error('It must be used within a AppProvider');
  }

  const {
    state: { isHierarchySent, hierarchySent },
  } = value;
  return {
    isHierarchySent,
    hierarchySent,
  };
};

export const useNotarizationSent = () => {
  const value: AppContextValue | null = React.useContext(AppContext);

  if (value == null) {
    throw new Error('It must be used within a AppProvider');
  }

  const {
    state: { isNotarizationSent, notarizationSent },
  } = value;
  return {
    isNotarizationSent,
    notarizationSent,
  };
};

export const useNotification = () => {
  const value: AppContextValue | null = React.useContext(AppContext);

  if (value == null) {
    throw new Error('It must be used within a AppProvider');
  }

  const {
    state: { notifications },
    handleNotificationSent,
    handleNotificationRemoved,
  } = value;
  return {
    notifications,
    handleNotificationSent,
    handleNotificationRemoved,
  };
};

export const useCurrentNetwork = () => {
  const value: AppContextValue | null = React.useContext(AppContext);

  if (value == null) {
    throw new Error('It must be used within a AppProvider');
  }

  const {
    state: { isWalletConnected, currentAccountNetwork },
  } = value;

  return {
    notTestnet: isWalletConnected && currentAccountNetwork !== 'iota:testnet',
    isTestnet: isWalletConnected && currentAccountNetwork === 'iota:testnet',
    currentNetwork: currentAccountNetwork,
  };
};

export const useNightlyWallet = () => {
  const value: AppContextValue | null = React.useContext(AppContext);

  if (value == null) {
    throw new Error('It must be used within a AppProvider');
  }

  const { inNightlyWallet } = value;

  return {
    inNightlyWallet,
  };
};
