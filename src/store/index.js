import Vue from 'vue';
import Vuex from 'vuex';
import { getPriceDynamic, getRandomCurrencyRate } from '../utils/priceUtils';

Vue.use(Vuex); 

export default new Vuex.Store({
    state: {
        // Store main info in global store
        cart: [], 
        goods: [],
        names: [],
        exchangeRate: 75,
        priceDynamic: '',
        categoryState: JSON.parse(localStorage.getItem('categoryState')) || {}, 
        // Stores category states (open/closed) in localStorage for page reload 
    },
    mutations: { 
        SET_GOODS(state, goods) {
            state.goods = goods;
        },
        SET_NAMES(state, names) {
            state.names = names;
        },
        SET_EXCHANGE_RATE(state, { updatedRate, priceDynamic }) {
            state.exchangeRate = updatedRate;
            Vue.set(state, 'priceDynamic', priceDynamic);
        },
        toggleCategory(state, category) {
            state.categoryState[category] = !state.categoryState[category];
            localStorage.setItem('categoryState', JSON.stringify(state.categoryState));
        },
        ADD_TO_CART(state, product) {
            const cartItem = state.cart.find(item => item.id === product.id);
            const price = (product.C * state.exchangeRate).toFixed(2);
            if (cartItem) {
                cartItem.quantity += 1;
                cartItem.price = price;
            } else {
                state.cart.push({ ...product, quantity: 1, price });
            }
        },
        UPDATE_CART_ITEM(state, { id, quantity }) {
            const cartItem = state.cart.find(item => item.id === id);
            if (cartItem) {
                cartItem.quantity = quantity;
                cartItem.price = (cartItem.C * state.exchangeRate).toFixed(2);
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

        updateRateCurrency({ commit, state }) {
            const updatedRate = getRandomCurrencyRate();
            const priceDynamic = getPriceDynamic(updatedRate, state.exchangeRate);
            
            commit('SET_EXCHANGE_RATE', { updatedRate, priceDynamic });
        },

        async fetchData({ commit }) {
            try {
                const goodsResponse = await fetch('/public/data/data.json');
                const namesResponse = await fetch('/public/data/names.json');
                const goods = (await goodsResponse.json()).Value.Goods;
                const names = await namesResponse.json();
                commit('SET_GOODS', goods);
                commit('SET_NAMES', names);
            } catch (error) {
                alert('Ошибка загрузки данных:', error);
            }
        },
    },
    getters: {
        cartItems: state => state.cart, // store state for cart
        groupedGoods: (state) => { // mapping of fetched data
            const grouped = state.goods.reduce((acc, item) => {
                const categoryName = state.names[item.G]?.G;
                const productName = state.names[item.G]?.B[item.T]?.N;
                const cartItem = state.cart.find(cart => cart.id === item.T);

                const mappedItem = {
                    id: item.T,
                    name: productName,
                    category: categoryName,
                    price: (item.C * state.exchangeRate).toFixed(1),
                    priceInUSD: item.C,
                    quantity: cartItem ? item.P - cartItem.quantity : item.P,
                };

                if (!acc[categoryName]) {
                    acc[categoryName] = {
                        category: categoryName,
                        isOpen: state.categoryState[categoryName] || false,
                        items: [],
                    };
                }

                acc[categoryName].items.push(mappedItem);
                return acc;
            }, {});

            return Object.values(grouped);
        },
        getExchangeRate: state => state.exchangeRate 
    },
});
