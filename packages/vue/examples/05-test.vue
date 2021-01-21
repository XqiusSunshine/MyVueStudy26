<template>
    <div>
<div v-for="item in items" :key="item.id">
    {{ item }}
</div>
<input v-model="data" type="text" />
    <button ></button>
    </div>
    
</template>

<script>
export default {
    setup () {
        

        return {}
    }
}
</script>

<style lang="scss" scoped>

</style>