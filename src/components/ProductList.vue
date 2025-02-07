<template>
    <section class="product-list-container">
        <p>
            Курс: ₽ <input class="currency-input" type="number" v-model.number="exchangeRate" min="20" max="80" />
        </p>
        <div class="product-list">
            <div class="accordion-group" v-for="(group, index) in groupedGoods" :key="index">
                <button class="accordion-header" @click="toggleCategory(group.category)">
                    {{ group.category }}
                </button>
                <Transition name="accordion">
                    <div class="accordion-body" v-if="group.isOpen">
                        <div class="product-card" v-for="item in group.items" :key="item.id">
                            <p class="product-name">{{ item.name }} ({{ item.quantity }}шт.) </p>
                            <div class="product-price-btn">
                                <p class="product-price" :class="priceDynamic">
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
    </section>
</template>

<script>
import { mapActions, mapMutations, mapGetters } from 'vuex';
import { getPriceDynamic } from '../utils/priceUtils';

export default {
    computed: {
        ...mapGetters(['groupedGoods', 'getExchangeRate']),
        priceDynamic() {
            return this.$store.state.priceDynamic;
        },
        exchangeRate: {
            get() {
                return this.getExchangeRate;
            },
            set(value) { // change exchangeRate in input via setter
                if (value > 80) {
                    alert("The maximum allowed exchange rate is 80.");
                    value = 80;
                } else if (value < 0) {
                    alert("The minimum allowed exchange rate is higher.");
                    value = 20;
                }
                const priceDynamic = getPriceDynamic(value, this.getExchangeRate);
                    
                this.SET_EXCHANGE_RATE({
                    updatedRate: value,
                    priceDynamic: priceDynamic
                });
            }
        }
    },
    methods: {
        ...mapActions(['addToCart', 'updateRateCurrency', 'fetchData']),
        ...mapMutations(['toggleCategory', "SET_EXCHANGE_RATE"])
    },
    mounted() {
        this.fetchData();
    }
};
</script>

<style scoped>
.product-list-container, .product-list {
    max-width: 50vw;
    width: 100%;
}

.product-list {
    margin: 20px 10px;
}

.currency-input {
    padding: 8px 5px;
    border-radius: 6px;
    border: 1px solid #e4e4e4;
    width: 50px;
    font-weight: bold;
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

.add-to-cart:disabled{
    cursor: not-allowed;
    background-color: #e4e4e4;
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
</style>
