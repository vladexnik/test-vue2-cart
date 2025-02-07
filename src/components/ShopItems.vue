<template>
    <div class="container">
        <ProductList />
        <CartList />
    </div>
</template>

<script>
import ProductList from './ProductList.vue';
import CartList from './CartList.vue';

export default {
    components: {
        ProductList,
        CartList
    }
};
</script>

<style scoped>
.container {
    display: flex;
    flex-direction: row;
    gap: 30px;
}
</style>
