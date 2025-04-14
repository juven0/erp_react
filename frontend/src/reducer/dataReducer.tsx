import { createContext, useContext, useReducer, ReactNode } from 'react';
import { UserData } from '@/types/user';

// État initial
interface EmployeeState {
  employees: UserData[];
  loading: boolean;
  error: string | null;
}

const initialState: EmployeeState = {
  employees: [],
  loading: false,
  error: null
};

// Types d'actions
export enum ActionType {
  FETCH_START = 'FETCH_START',
  FETCH_SUCCESS = 'FETCH_SUCCESS',
  FETCH_ERROR = 'FETCH_ERROR',
  ADD_EMPLOYEE = 'ADD_EMPLOYEE',
  UPDATE_EMPLOYEE = 'UPDATE_EMPLOYEE',
  DELETE_EMPLOYEE = 'DELETE_EMPLOYEE'
}

type Action =
  | { type: ActionType.FETCH_START }
  | { type: ActionType.FETCH_SUCCESS; payload: UserData[] }
  | { type: ActionType.FETCH_ERROR; payload: string }
  | { type: ActionType.ADD_EMPLOYEE; payload: UserData }
  | { type: ActionType.UPDATE_EMPLOYEE; payload: UserData }
  | { type: ActionType.DELETE_EMPLOYEE; payload: string };

const employeeReducer = (state: EmployeeState, action: Action): EmployeeState => {
  switch (action.type) {
    case ActionType.FETCH_START:
      return {
        ...state,
        loading: true,
        error: null
      };
      
    case ActionType.FETCH_SUCCESS:
      return {
        ...state,
        loading: false,
        employees: action.payload,
        error: null
      };
      
    case ActionType.FETCH_ERROR:
      return {
        ...state,
        loading: false,
        error: action.payload
      };
      
    case ActionType.ADD_EMPLOYEE:
      return {
        ...state,
        employees: [...state.employees, action.payload]
      };
      
    case ActionType.UPDATE_EMPLOYEE:
      return {
        ...state,
        employees: state.employees.map(employee => 
          employee.id === action.payload.id ? action.payload : employee
        )
      };
      
    case ActionType.DELETE_EMPLOYEE:
      return {
        ...state,
        employees: state.employees.filter(employee => employee.id !== action.payload)
      };
      
    default:
      return state;
  }
};

interface EmployeeContextType {
  state: EmployeeState;
  dispatch: React.Dispatch<Action>;
}

const EmployeeContext = createContext<EmployeeContextType | undefined>(undefined);

interface EmployeeProviderProps {
  children: ReactNode;
}

export const EmployeeProvider = ({ children }: EmployeeProviderProps) => {
  const [state, dispatch] = useReducer(employeeReducer, initialState);
  
  return (
    <EmployeeContext.Provider value={{ state, dispatch }}>
      {children}
    </EmployeeContext.Provider>
  );
};

export const useEmployeeContext = () => {
  const context = useContext(EmployeeContext);
  
  if (context === undefined) {
    throw new Error('useEmployeeContext must be used within an EmployeeProvider');
  }
  
  return context;
};