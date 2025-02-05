<template>
    <div class="container">
        <div class="product-list">
            <div class="accordion-group" v-for="(group, index) in groupedGoods" :key="index" >
                <button class="accordion-header" @click="toggleCategory(group.category)">
                    {{ group.category }}
                </button>
                <Transition name="accordion">
                    <div class="accordion-body" v-if="group.isOpen">
                        <div class="product-card" v-for="item in group.items" :key="item.id">
                            <p class="product-name">{{ item.name }} ({{ item.quantity }}шт.) </p>
                            <div class="product-price-btn">
                                <p class="product-price" :class="priceDynamic" >
                                ₽ {{ item.price }}
                                </p>
                                <button class="add-to-cart" :disabled="item.quantity <= 0" @click="addToCart(item)">
                                        Купить
                                </button>
                            </div>
                        </div>
                    </div>
                </Transition>
            </div>
        </div>
        <div class="cart">
            <h3>Корзина</h3>
            <div class="empty-cart" v-if="cartItems.length === 0" >Корзина пуста</div>
            <div v-else>
                <div class="cart-item" v-for="cartItem in cartItems" :key="cartItem.id">
                    <div class="cart-info">
                        <p class="cart-category">{{ cartItem.category }}</p>
                        <p><strong> {{ cartItem.name }}</strong></p>
                    </div>
                    <div class="cart-manage">
                        <input type="number" v-model.number="cartItem.quantity" min="1" @input="updateQuantity(cartItem)" />
                        <p>₽ {{ (cartItem.price * cartItem.quantity).toFixed(2) }}</p>
                        <button @click="removeFromCart(cartItem.id)">
                            <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="15" height="15" viewBox="0 0 50 50">
                                <path d="M 21 0 C 19.355469 0 18 1.355469 18 3 L 18 5 L 10.1875 5 C 10.0625 4.976563 9.9375 4.976563 9.8125 5 L 8 5 C 7.96875 5 7.9375 5 7.90625 5 C 7.355469 5.027344 6.925781 5.496094 6.953125 6.046875 C 6.980469 6.597656 7.449219 7.027344 8 7 L 9.09375 7 L 12.6875 47.5 C 12.8125 48.898438 14.003906 50 15.40625 50 L 34.59375 50 C 35.996094 50 37.1875 48.898438 37.3125 47.5 L 40.90625 7 L 42 7 C 42.359375 7.003906 42.695313 6.816406 42.878906 6.503906 C 43.058594 6.191406 43.058594 5.808594 42.878906 5.496094 C 42.695313 5.183594 42.359375 4.996094 42 5 L 32 5 L 32 3 C 32 1.355469 30.644531 0 29 0 Z M 21 2 L 29 2 C 29.5625 2 30 2.4375 30 3 L 30 5 L 20 5 L 20 3 C 20 2.4375 20.4375 2 21 2 Z M 11.09375 7 L 38.90625 7 L 35.3125 47.34375 C 35.28125 47.691406 34.910156 48 34.59375 48 L 15.40625 48 C 15.089844 48 14.71875 47.691406 14.6875 47.34375 Z M 18.90625 9.96875 C 18.863281 9.976563 18.820313 9.988281 18.78125 10 C 18.316406 10.105469 17.988281 10.523438 18 11 L 18 44 C 17.996094 44.359375 18.183594 44.695313 18.496094 44.878906 C 18.808594 45.058594 19.191406 45.058594 19.503906 44.878906 C 19.816406 44.695313 20.003906 44.359375 20 44 L 20 11 C 20.011719 10.710938 19.894531 10.433594 19.6875 10.238281 C 19.476563 10.039063 19.191406 9.941406 18.90625 9.96875 Z M 24.90625 9.96875 C 24.863281 9.976563 24.820313 9.988281 24.78125 10 C 24.316406 10.105469 23.988281 10.523438 24 11 L 24 44 C 23.996094 44.359375 24.183594 44.695313 24.496094 44.878906 C 24.808594 45.058594 25.191406 45.058594 25.503906 44.878906 C 25.816406 44.695313 26.003906 44.359375 26 44 L 26 11 C 26.011719 10.710938 25.894531 10.433594 25.6875 10.238281 C 25.476563 10.039063 25.191406 9.941406 24.90625 9.96875 Z M 30.90625 9.96875 C 30.863281 9.976563 30.820313 9.988281 30.78125 10 C 30.316406 10.105469 29.988281 10.523438 30 11 L 30 44 C 29.996094 44.359375 30.183594 44.695313 30.496094 44.878906 C 30.808594 45.058594 31.191406 45.058594 31.503906 44.878906 C 31.816406 44.695313 32.003906 44.359375 32 44 L 32 11 C 32.011719 10.710938 31.894531 10.433594 31.6875 10.238281 C 31.476563 10.039063 31.191406 9.941406 30.90625 9.96875 Z"></path>
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';

export default {
    data() {
        return {
        goods: [],
        names: {},
        exchangeRate: 75, // Курс доллара к рублю
        priceDynamic: {},
        groupedGoods: [],
        categoryState: JSON.parse(localStorage.getItem('categoryState')) || {},
        };
    },
    methods: {
        ...mapActions(['addToCart', 'updateCartItem', 'removeFromCart']),
        async fetchData(){
            try {
                const goodsResponse = await fetch('/public/data/data.json');
                const namesResponse = await fetch('/public/data/names.json');
                this.goods = (await goodsResponse.json()).Value.Goods;
                this.names = await namesResponse.json();
                this.groupGoodsByCategory();
                console.log(this.goods, 'goods');
                console.log(this.names, 'names');
            } catch (error) {
                console.error('Ошибка загрузки данных:', error);
            }
        },
        updateRateCurrency(){
            const updatedRate = Math.floor(Math.random() * (80 - 20 + 1)) + 20;
            // 82
            if(updatedRate > this.exchangeRate){
                this.priceDynamic = 'price-up';
            } else if(updatedRate < this.exchangeRate){
                this.priceDynamic = 'price-down'
            } else {
                this.priceDynamic = ''
            }
            this.exchangeRate = updatedRate;
        },
        groupGoodsByCategory() {
            const grouped = this.goods.reduce((acc, item) => {
                const categoryName = this.names[item.G]?.G;
                const productName = this.names[item.G]?.B[item.T]?.N;
                const mappedItem = {
                    id: item.T,
                    name: productName,
                    category: categoryName,
                    price: (item.C * this.exchangeRate).toFixed(2),
                    quantity: item.P,
                };

                if (!acc[categoryName]) {
                    console.log(this.groupedGoods,'!!!!!!!')
                    acc[categoryName] = {
                        category: categoryName,
                        isOpen: this.categoryState[categoryName] || false, 
                        items: [],
                    };
                }

                acc[categoryName].items.push(mappedItem);
                return acc;
            }, {});
            console.log(this.groupedGoods, 'grrrrrr')
            this.groupedGoods = Object.values(grouped);
        },
        toggleCategory(category) {
            this.categoryState[category] = !this.categoryState[category];
            localStorage.setItem('categoryState', JSON.stringify(this.categoryState));
            this.groupGoodsByCategory();
        },
    },
    async mounted() {
        await this.fetchData();
        setInterval(() => {
            this.updateRateCurrency();
            console.log(this.exchangeRate);
            this.fetchData();
        }, 15000);
    },
    computed: {
        ...mapGetters(['cartItems']),
        mappedGoods() {
            return this.goods.map((item) => {
                const categoryName = this.names[item.G]?.G;
                const productName = this.names[item.G]?.B[item.T]?.N;
                const mappedItem = {
                id: item.T,
                name: productName,
                category: categoryName,
                price: (item.C * this.exchangeRate).toFixed(2),
                quantity: item.P,
                };
                return mappedItem;
            });
        },
    },
  
};

</script>
<style scoped>
.container {
    display: flex;
    flex-direction: row;
    gap: 30px;
}
.product-list {
    max-width: 40vw;
    width: 100%;
    margin: 20px 10px;
}

.accordion-group {
    border: 1px solid #6f9dff;
}

.accordion-header {
    width: 100%;
    padding: 10px 15px;
    font-size: 16px;
    font-weight: bold;
    background-color: #d3eaff;
    color: black;
    border: none;
    text-align: left;
    cursor: pointer;
    transition: background 0.5s ease-in-out;
}

.accordion-header:hover {
    background-color: #6f9dff;
}

.product-card {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 10px;
    border: 1px solid #e4e4e4;
    background-color: white;
    padding: 10px;
    box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.3);
    transition: transform 0.5s ease-in-out;
}

.product-price-btn {
    display: flex;
    gap: 10px;
    align-items: center;
    
}
.product-name {
    font-size: 16px;
    font-weight: bold;
    text-align: left;
    max-width: 500px;
}

.product-price {
    font-size: 14px;
    white-space: nowrap;
    font-weight: bold;
    padding: 5px;
    border: 2px solid #e4e4e4;
    border-radius: 6px;
}

.price-up {
    color: rgb(255, 139, 139);
    font-weight: bold;
}

.price-down {
    color: rgb(154, 235, 154);
    font-weight: bold;
}

.add-to-cart {
    background-color: rgb(104, 185, 232);
    color: white;
    padding: 10px 30px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    transition: background 0.5s ease-in-out;
}

.add-to-cart:hover {
    background-color: rgb(37, 133, 189);
}

.accordion-enter-active, .accordion-leave-active {
    transition: max-height 0.5s ease-in-out;
    overflow: hidden;
}

.accordion-enter, .accordion-leave-to {
    max-height: 0;
}

.accordion-enter-to, .accordion-leave {
    max-height: 500px; 
}

.cart {
    margin: 0 auto;
}

.cart-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 5px 10px;
    gap: 20px;
    border: 2px solid black;
    border-radius: 8px;
}

.cart-info {
    display: flex;
    flex-direction: row;
    gap: 10px;
}

.cart-category{
    border: 2px solid orange;
    padding: 4px 6px;
    color: orange;
    border-radius: 6px;
    background-color: rgb(255, 235, 209);
}

.cart-manage{
    display: flex;
    flex-direction: row;
    gap: 10px;
    align-items: center;
}

.cart-manage input {
    padding: 8px 5px;
    border-radius: 6px;
    width: 50px;
}

.cart-manage p{
    font-size: 14px;
    width: 80px;
    white-space: nowrap;
    border: 2px solid black;
    padding: 3px 5px;
}

.cart-manage button {
    background-color: red;
    border: 0;
    border-radius: 6px;
    padding: 5px;
    cursor: pointer;
}
</style>
