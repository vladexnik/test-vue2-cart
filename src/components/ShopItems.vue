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
                        <input type="number" v-model.number="cartItem.quantity" min="1" :max="getMaxQuantity(cartItem)" @input="validateQuantity(cartItem)" />
                        <p>₽ {{ (cartItem.priceInUSD * exchangeRate * cartItem.quantity).toFixed(1) }}</p>
                        <button @click="removeFromCart(cartItem.id)">
                            <TrashIcon />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { nextTick } from 'vue';
import { mapActions, mapGetters, mapMutations } from 'vuex';
import TrashIcon from '../assets/TrashIcon.vue';

export default {
    components: {
        TrashIcon
    },
    data() {
        return {
            
        };
    },
    methods: {
        ...mapActions(['addToCart', 'updateCartItem', 'removeFromCart', 'fetchData', 'updateRateCurrency']),
        ...mapMutations(['toggleCategory']), 
        validateQuantity(cartItem) {
            if (cartItem.quantity > this.getMaxQuantity(cartItem)) {
                cartItem.quantity = this.getMaxQuantity(cartItem);
                alert('Cannot add more than available. It will be set the max available quantity.');
            }
        },


        getMaxQuantity(cartItem) {
            const group = this.groupedGoods.find(group => 
                group.items.some(item => item.id === cartItem.id)
            );
            const item = group.items.find(item => item.id === cartItem.id);
            const totalQuantity = item.quantity+cartItem.quantity;
            return item ? totalQuantity : 0;
        }
    },
    mounted() {
        this.fetchData();
        setInterval(() => {
            nextTick(()=>{
                this.updateRateCurrency();
            })
            this.fetchData();
        }, 3000);
    },
    computed: {
        ...mapGetters(['cartItems', 'groupedGoods']),
        priceDynamic() {
            return this.$store.state.priceDynamic;
        },
        exchangeRate() {
            return this.$store.state.exchangeRate;
        }
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
    width: 50vw;
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
    height: 25px;
}

.cart-info {
    display: flex;
    flex-direction: row;
    gap: 25px;
}

.cart-category{
    display: flex;
    align-items: center;
    border: 2px solid orange;
    padding: 4px 10px;
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
    border: 1px solid #e4e4e4;
    width: 50px;
    font-weight: bold;
}

.cart-manage p{
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
