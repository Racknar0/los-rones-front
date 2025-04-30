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

    cartItems: [],

    totalCompra: 0,
    totalCompraSinCupon: 0,
    selectedCoupon: null, 

    dineroRecibido: 0,
    cambio: 0,
    tipoPago: '',
    cupones: [],
    
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

     setCartItems: (items) => {
         set({ cartItems: items });
         get().recalcTotals();        // recalcula cada vez que cambie el carrito
     },

    setTotalCompra: (total) => {
      // Si hay un cupón seleccionado, aplica el descuento
      const selectedCoupon = get().selectedCoupon;
      if (selectedCoupon) {
        const discount = (total * selectedCoupon.discount) / 100;
        total -= discount;
      }
      set({ totalCompra: total });
      // set({ totalCompra: total });
    },

    setTotalCompraSinCupon: (total) => {
      set({ totalCompraSinCupon: total });
    },

    setSelectedCoupon: (coupon) => {
        set({ selectedCoupon: coupon });
        get().recalcTotals();        // ¡un solo lugar para el cálculo!
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

    setCupones: (cupones) => {
      set({ cupones: cupones });
    },


    /*───────────  CUPÓN POR ÍTEM  ───────────*/
    applyItemCoupon: (unitId, coupon) => {
      set((state) => {
        const cartItems = state.cartItems.map((u) =>
          u.id === unitId
            ? {
                ...u,
                itemCoupon: coupon,
                priceWithItemCoupon:
                  u.product.salePrice * (1 - coupon.discount / 100),
              }
            : u
        );
        return { cartItems };
      });
      get().recalcTotals();          // ← actualiza totales
    },

    removeItemCoupon: (unitId) => {
      set((state) => {
        const cartItems = state.cartItems.map((u) =>
          u.id === unitId
            ? { ...u, itemCoupon: null, priceWithItemCoupon: u.product.salePrice }
            : u
        );
        return { cartItems };
      });
      get().recalcTotals();
    },

    /*───────────  RECÁLCULO CENTRAL  ───────────*/
    recalcTotals: () => {
      const { cartItems, selectedCoupon } = get();

      // Subtotal después de cupones por ítem
      const base = cartItems.reduce(
        (acc, u) => acc + Number(u.priceWithItemCoupon),
        0
      );

      // Cupón global (si existe)
      const pctGlobal = selectedCoupon?.discount ?? 0;
      const total = base * (1 - pctGlobal / 100);

      set({
        totalCompraSinCupon: base,
        totalCompra: Number(total.toFixed(2)),
      });
    },

    resetFinisedSale: () => {
      set({
        cartItems: [],
        totalCompra: 0,
        totalCompraSinCupon: 0,
        selectedCoupon: null,
        dineroRecibido: 0,
        cambio: 0,
        tipoPago: '',
      });
    }



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
