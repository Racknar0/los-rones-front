import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';
import { decodeToken } from '../helpers/jwtHelper'; // Ajusta la ruta según tu estructura

// Recupera el token y decodifica la data inicial
const initialToken = localStorage.getItem('token') || null;
const initialJwtData = initialToken ? decodeToken(initialToken) : null;

// Inicializa selectedStore desde localStorage
const initialSelectedStore = localStorage.getItem('selectedStore') || null;

const useStore = create(
  subscribeWithSelector((set, get) => ({
    // Estado inicial
    loading: false,
    token: initialToken,
    jwtData: initialJwtData,
    selectedStore: initialSelectedStore,

    totalCompra: 100,
    dineroRecibido: 0,
    cambio: 0,
    tipoPago: '',
    
    // Funciones
    setLoading: (value) => set({ loading: value }),

    login: async (token) => {
      set({ loading: true });
      try {
        localStorage.setItem('token', token);
        const jwtData = decodeToken(token);
        set({ token, jwtData });
      } catch (error) {
        console.error('Error al iniciar sesión:', error);
      } finally {
        set({ loading: false });
      }
    },

    logout: async () => {
      set({ loading: true });
      try {
        localStorage.removeItem('token');
        localStorage.removeItem('selectedStore');
        set({ token: null, jwtData: null, selectedStore: null });
      } catch (error) {
        console.error('Error al cerrar sesión:', error);
      } finally {
        set({ loading: false });
      }
    },

    setSelectedStore: (store) => {
      localStorage.setItem('selectedStore', store);
      set({ selectedStore: store });
    },

    setTotalCompra: (total) => {
      set({ totalCompra: total });
    },

    setDineroRecibido: (dinero) => {
      set({ dineroRecibido: dinero });
    },

    setCambio: (cambio) => {
      set({ cambio: cambio });
    },

    setTipoPago: (tipo) => {
      set({ tipoPago: tipo });
    },

  }))
);

export default useStore;

export const getState = useStore.getState;

// Suscribirte a todos los cambios de estado
useStore.subscribe(
    (state) => state, // Selector: monitorea todo el estado
    (state) => {
        // console.log('Estado actualizado-------------------->:')
        // console.log(state);
    } // Callback ejecutado cada vez que el estado cambia
);
