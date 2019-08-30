<template>
    <Page class="page" actionBarHidden="true">
        <GridLayout rows="auto, *, auto" columns="*, *, *, *">
            <!-- <Image src="~/assets/logo.png" width="195" marginTop="20" row="0"
                col="0" colSpan="4" /> -->

            <!-- main components all on top of each other, since only 1 will be visible at any given time -->
            <component v-for="component in componentsArray" 
                v-show="component === currentComponent"
                :is="component" row="1" col="0" colSpan="4" />

            <!-- Bottom navigation -->
            <Button :class="navigationButtonClasses('CreateEvent')" @tap="currentComponent = 'CreateEvent'"
                :text="'fa-plus-circle' | fonticon" row="2" col="0" />
            <Button :class="navigationButtonClasses('EventMap')" @tap="currentComponent = 'EventMap'"
                :text="'fa-map' | fonticon" row="2" col="1" />
            <Button :class="navigationButtonClasses('Events')" @tap="currentComponent = 'Events'"
                :text="'fa-calendar' | fonticon" row="2" col="2" />
            <Button :class="navigationButtonClasses('Clicks')" @tap="currentComponent = 'Clicks'"
                :text="'fa-magnet' | fonticon" row="2" col="3" />
        </GridLayout>
    </Page>
</template>

<script>
    import CreateEvent from "../components/CreateEvent";
    import EventMap from "../components/EventMap";
    import Events from "../components/Events";
    import Clicks from "../components/Clicks";
    export default {
        data() {
            return {
                currentComponent: "CreateEvent",
                componentsArray: ["CreateEvent", "EventMap", "Events", "Clicks"]
            };
        },
        computed: {
            navigationButtonClasses() {
                return component => ({
                    fa: true,
                    "nav-btn": true,
                    purple: component === this.currentComponent
                });
            }
        },
        components: {
            CreateEvent,
            EventMap,
            Events,
            Clicks
        }
    };
</script>

<style>
    .nav-btn {
        color: #9D95B4;
        margin: 20;
        font-size: 24;
        padding: 10;
    }

    .purple {
        background-color: #5326BF;
        color: white;
        font-size: 24;
        border-radius: 10;
    }

    Button {
        background-color: rgba(255, 0, 0, 0.0);
        border-color: rgba(255, 0, 0, 0.0);
        border-width: 1;
    }
</style>