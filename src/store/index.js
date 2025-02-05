import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex); 

export default new Vuex.Store({
    state: {
        cart: [], // Stores cart items
    },
    mutations: {
        ADD_TO_CART(state, product) {
            const cartItem = state.cart.find(item => item.id === product.id);
            if (cartItem) {
                cartItem.quantity += 1;
            } else {
                state.cart.push({ ...product, quantity: 1 });
            }
        },
        UPDATE_CART_ITEM(state, { id, quantity }) {
            const cartItem = state.cart.find(item => item.id === id);
            if (cartItem) {
                cartItem.quantity = quantity;
            }
        },
        REMOVE_FROM_CART(state, id) {
            state.cart = state.cart.filter(item => item.id !== id);
        },
    },
    actions: {
        addToCart({ commit }, product) {
            commit('ADD_TO_CART', product);
        },
        updateCartItem({ commit }, payload) {
            commit('UPDATE_CART_ITEM', payload);
        },
        removeFromCart({ commit }, id) {
            commit('REMOVE_FROM_CART', id);
        },
    },
    getters: {
        cartItems: state => state.cart,
    },
});
