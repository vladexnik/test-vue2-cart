<template>
    <div>
      <ShopItems/>
    </div>
</template>
<script>
import ShopItems from '../components/ShopItems.vue';

export default {
  name: 'MainPage',
  components: {
    ShopItems
  }
  // props: {
  //   msg: String
  // }
}
</script>