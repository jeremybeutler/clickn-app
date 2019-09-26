import Vue from 'nativescript-vue';
import VueDevtools from 'nativescript-vue-devtools'

Vue.use(VueDevtools)

import Home from './components/Home';

// Uncommment the following to see NativeScript-Vue output logs
Vue.config.silent = false;

import { TNSFontIcon, fonticon } from './nativescript-fonticon';
TNSFontIcon.debug = true;

//TNSFontIcon.debug = true;

TNSFontIcon.paths = {
    fa: './assets/font-awesome.css',
};
TNSFontIcon.loadCss();

import { ModalStack, overrideModalViewMethod } from "./nativescript-windowed-modal";

overrideModalViewMethod();
Vue.registerElement("ModalStack", () => ModalStack);
Vue.registerElement("Mapbox", () => require("nativescript-mapbox").MapboxView)

Vue.filter('fonticon', fonticon);

new Vue({

    render: h => h('frame', [h(Home)])

}).$start();
