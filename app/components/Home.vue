<template>
    <Page class="page" actionBarHidden="false">
        <!-- <component v-show="currentPage.showActionBar === true" :is="currentPage.actionBar" :currentPageTitle="currentPage.title" v-on:switchPage="switchPageFunction" v-on:goPreviousPage="goPreviousPageFunction" /> -->
        <MainBar v-if="useMainBar" :currentPageTitle="currentPage.title" v-on:switchPage="switchPageFunction" />
        <LayerBar v-else-if="useLayerBar" :currentPageTitle="currentPage.title" v-on:goPreviousPage="goPreviousPageFunction" />

        <GridLayout rows="auto, *, auto" columns="*, *, *, *">        
            <component :is="currentPage.name" row="1" col="0" colSpan="4" />
            

        <template v-if="currentPage.showNavBar === true">
            <Button :class="navigationButtonClasses('CreateEvent')" @tap="switchPageFunction('create_event')"
                :text="'fa-plus-circle' | fonticon" row="2" col="0" />
            <Button :class="navigationButtonClasses('EventMap')" @tap="switchPageFunction('event_map')"
                :text="'fa-map' | fonticon" row="2" col="1" />
            <Button :class="navigationButtonClasses('Events')" @tap="switchPageFunction('events')"
                :text="'fa-calendar' | fonticon" row="2" col="2" />
            <Button :class="navigationButtonClasses('Clicks')" @tap="switchPageFunction('clicks')"
                :text="'fa-magnet' | fonticon" row="2" col="3" />
        </template>
        </GridLayout>
    </Page>
</template>

<script>
    import CreateEvent from "../components/CreateEvent";
    import EventMap from "../components/EventMap";
    import Events from "../components/Events";
    import Clicks from "../components/Clicks";
    import Chat from "../components/Chat";
    import MainBar from "../components/actionbar/MainBar";
    import LayerBar from "../components/actionbar/LayerBar";

    export default {
        data() {
            return {
                pages: ["CreateEvent", "EventMap", "Events", "Clicks", "Chat"],
                previousPage: null,
                currentPage: {
                    name: "CreateEvent",
                    title: "Create an Event",
                    actionBar: "MainBar",
                    showActionBar: true,
                    showNavBar: true
                },
                pagesData: {
                    create_event: {
                        name: "CreateEvent",
                        title: "Create an Event",
                        actionBar: "MainBar",
                        showActionBar: true,
                        showNavBar: true
                    },
                    event_map: { 
                        name: "EventMap",
                        title: "Map",
                        actionBar: "MainBar",
                        showActionBar: false,
                        showNavBar: true
                    },
                    events: {
                        name: "Events",
                        title: "Events",
                        actionBar: "MainBar",
                        showActionBar: true,
                        showNavBar: true
                    },
                    clicks: {
                        name: "Clicks",
                        title: "Clicks",
                        actionBar: "MainBar",
                        showActionBar: true,
                        showNavBar: true
                    },
                    chat: {
                        name: "Chat",
                        title: "Chat",
                        actionBar: "LayerBar",
                        showActionBar: true,
                        showNavBar: false
                    },
                },
                actionBars: ["MainBar", "LayerBar"]
            };
        },
        methods: {
            switchPageFunction(page) {
                let x = this.currentPage.name
                console.log(x)
                this.$set(this.previousPage, 'name', this.currentPage.name)
                this.$set(this.previousPage, 'title', this.currentPage.title)
                this.$set(this.previousPage, 'actionBar', this.currentPage.actionBar)
                this.$set(this.previousPage, 'showActionBar', this.currentPage.showActionBar)
                this.$set(this.previousPage, 'showNavBar', this.currentPage.showNavBar)

                this.$set(this.currentPage, 'name', this.pagesData[page].name)
                this.$set(this.currentPage, 'title', this.pagesData[page].title)
                this.$set(this.currentPage, 'actionBar', this.pagesData[page].actionBar)
                this.$set(this.currentPage, 'showActionBar', this.pagesData[page].showActionBar)
                this.$set(this.currentPage, 'showNavBar', this.pagesData[page].showNavBar)

                // this.updatePageKeys('previousPage', this.currentPage);
                // let newPage = this.pagesData[page];
                // this.updatePageKeys('currentPage', this.pagesData[page]);
                // this.previousPage = this.currentPage;
                // this.currentPage = this.pagesData[page];
                // console.log('switch page', page)
                // this.$forceUpdate();
            },
            goPreviousPageFunction() {
                // this.$set(this.currentPage, 'name', this.previousPage.name)
                // this.$set(this.currentPage, 'title', this.previousPage.title)
                // this.$set(this.currentPage, 'actionBar', this.previousPage.actionBar)
                // this.$set(this.currentPage, 'showActionBar', this.previousPage.showActionBar)
                // this.$set(this.currentPage, 'showNavBar', this.previousPage.showNavBar)
                // this.updatePageKeys('currentPage', this.previousPage);
                // this.currentPage = this.previousPage;
                // console.log('go previous', this.currentPage.name)
                // this.$forceUpdate();
            },
            updatePageKeys(page1_name, page2) {
                // this.$set(this[page1_name], 'name', page2.name)
                // this.$set(this[page1_name], 'title', page2.title)
                // this.$set(this[page1_name], 'actionBar', page2.actionBar)
                // this.$set(this[page1_name], 'showActionBar', page2.showActionBar)
                // this.$set(this[page1_name], 'showNavBar', page2.showNavBar)
            }

            // navigate(page) {
            //     console.log(page)
            //     this.currentPage = this.pagesData.page
            //     // console.log(this.pagesData)
            // }
        },
        computed: {
            navigationButtonClasses() {
                return page => ({
                    fa: true,
                    "nav-btn": true,
                    purple: page === this.currentPage.name
                });
            },
            useLayerBar() {
                console.log(this.currentPage.actionBar)
                return this.currentPage.showActionBar === true && this.currentPage.actionBar === 'LayerBar'
            },
            useMainBar() {
                console.log(this.currentPage.actionBar)
                return this.currentPage.showActionBar === true && this.currentPage.actionBar === 'MainBar'
            },

        },
        components: {
            CreateEvent,
            EventMap,
            Events,
            Clicks,
            Chat,
            MainBar,
            LayerBar
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