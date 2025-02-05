import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex); 

export default new Vuex.Store({
    state: {
        cart: [], // Stores cart items
        goods: [],
        names: {},
        exchangeRate: 75,
        priceDynamic: '',
        categoryState: JSON.parse(localStorage.getItem('categoryState')) || {},
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
            state.priceDynamic = priceDynamic;
        },
        toggleCategory(state, category) {
            state.categoryState[category] = !state.categoryState[category];
            localStorage.setItem('categoryState', JSON.stringify(state.categoryState));
        },

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

        updateRateCurrency({ commit, state }) {
            const updatedRate = Math.floor(Math.random() * (80 - 20 + 1)) + 20;
            let priceDynamic = '';

            if (updatedRate > state.exchangeRate) {
                priceDynamic = 'price-up';
            } else if (updatedRate < state.exchangeRate) {
                priceDynamic = 'price-down';
            }

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
                console.error('Ошибка загрузки данных:', error);
            }
        },
    },
    getters: {
        cartItems: state => state.cart,
        groupedGoods: (state) => {
            const grouped = state.goods.reduce((acc, item) => {
                const categoryName = state.names[item.G]?.G;
                const productName = state.names[item.G]?.B[item.T]?.N;
                const mappedItem = {
                    id: item.T,
                    name: productName,
                    category: categoryName,
                    price: (item.C * state.exchangeRate).toFixed(2),
                    quantity: item.P,
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
    },
});
