<template>
    <ActionBar class="main-view" :title="currentPageTitle">
            <!-- <NavigationButton android.systemIcon="ic_menu_back" tap="onNavBtnTap" @tap="$emit('goPreviousPage')" > -->
                <!-- <Label class="fa action-bar">{{ 'fa-arrow-left' | fonticon }}</Label> -->
            <!-- </NavigationButton> -->
            <ActionItem ios.position="left" @tap="$emit('goPreviousPage')">
                <Label class="fa action-bar">{{ 'fa-arrow-left' | fonticon }}</Label>
            </ActionItem>
    </ActionBar>
</template>

<script>
export default {
    props: ['currentPageTitle'],
    methods: {
    }
}
</script>

<style scoped>

</style>