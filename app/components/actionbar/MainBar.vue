<template>
    <ActionBar class="main-view" :title="currentPageTitle">
        <ActionItem @tap="$emit('switchPage', 'chat')">
            <Label class="fa action-bar">{{ 'fa-comment' | fonticon }}</Label>
        </ActionItem>
    </ActionBar>
</template>

<script>
export default {
    props: ['currentPageTitle'],
    methods: {
        // navigate(page) {
        //     this.$emit('navigate', page)
        // }
    }
}
</script>

<style scoped>

</style>