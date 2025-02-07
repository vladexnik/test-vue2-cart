<template>
    <div class="cart">
        <div class="timer">
            <p>Следующее обновление курса через: {{ timer }} сек.</p>
        </div>
        <h3>Корзина</h3>
        <div class="empty-cart" v-if="cartItems.length === 0">Корзина пуста</div>
        <div v-else>
            <div class="cart-item" v-for="cartItem in cartItems" :key="cartItem.id">
                <div class="cart-info">
                    <p class="cart-category">{{ cartItem.category }}</p>
                    <p><strong>{{ cartItem.name }}</strong></p>
                </div>
                <div class="cart-manage">
                    <input type="number" v-model.number="cartItem.quantity" min="1" :max="getMaxQuantity(cartItem)" @input="validateQuantity(cartItem)" />
                    <p>₽ {{ (cartItem.priceInUSD * exchangeRate * cartItem.quantity).toFixed(1) }}</p>
                    <button @click="removeFromCart(cartItem.id)">
                        <TrashIcon />
                    </button>
                </div>
            </div>
            <p class="total-amount">
                <strong>Общая сумма покупок: {{ totalPriceAmount }} ₽</strong>
            </p>
        </div>
    </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import TrashIcon from '../assets/TrashIcon.vue';

export default {
    components: {
        TrashIcon
    },
    data() {
        return {
            timer: 20, 
            intervalId: null
        };
    },
    methods: {
        ...mapActions(['removeFromCart', 'updateRateCurrency', 'fetchData']),
        validateQuantity(cartItem) {
            if (cartItem.quantity > this.getMaxQuantity(cartItem)) {
                cartItem.quantity = this.getMaxQuantity(cartItem);
                alert('Cannot add more than available. It will be set to the max available quantity.');
            }
        },
        getMaxQuantity(cartItem) {
            const group = this.groupedGoods.find(group => 
                group.items.some(item => item.id === cartItem.id)
            );
            const item = group.items.find(item => item.id === cartItem.id);
            const totalQuantity = item.quantity + cartItem.quantity;
            return item ? totalQuantity : 0;
        },
        startTimer() {
            if (this.intervalId) clearInterval(this.intervalId); // Clear previous timer
            this.timer = 20; // Reset timer
            this.intervalId = setInterval(() => {
                if (this.timer > 0) {
                    this.timer--;
                } else {
                    this.updateRateCurrency(); 
                    this.startTimer(); 
                    this.fetchData();
                }
            }, 1000);
        }
    },
    computed: {
        ...mapGetters(['cartItems', 'groupedGoods', 'getExchangeRate']),
        totalPriceAmount() {
            const amount = this.cartItems.reduce((acc, item) => acc += item.priceInUSD * this.getExchangeRate * item.quantity, 0);
            return amount.toFixed(2);
        },
        exchangeRate: {
            get() {
                return this.getExchangeRate; 
            }
        }
    },
    mounted() {
        this.startTimer();
    }
};
</script>
<style scoped>
.cart {
    margin: 0 auto;
    width: 50vw;
}

.timer {
    margin-bottom: 20px;
}

.cart-info {
    display: flex;
    flex-direction: row;
    gap: 25px;
}

.cart-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 5px 10px;
    gap: 20px;
    border-bottom: 2px solid #e4e4e4;
}

.cart-category {
    display: flex;
    align-items: center;
    border: 2px solid orange;
    padding: 4px 10px;
    color: orange;
    border-radius: 6px;
    background-color: rgb(255, 235, 209);
}

.cart-manage {
    display: flex;
    flex-direction: row;
    gap: 10px;
    align-items: center;
}

.cart-manage input {
    padding: 8px 5px;
    border-radius: 6px;
    border: 1px solid #e4e4e4;
    width: 50px;
    font-weight: bold;
}

.cart-manage p {
    font-size: 14px;
    width: 80px;
    white-space: nowrap;
    border: 1px solid black;
    border-radius: 6px;
    padding: 5px 6px;
}

.cart-manage button {
    background-color: red;
    border: 0;
    border-radius: 6px;
    padding: 5px;
    cursor: pointer;
}

button:disabled, button:disabled:hover {
    background-color: #e4e4e4;
    cursor: not-allowed;
}
</style>
