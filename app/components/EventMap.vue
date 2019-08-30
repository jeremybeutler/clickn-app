<template>
    <GridLayout rows="auto" verticalAlignment="top">
        <!-- <Label row="0" text="Event Map" class="title med" /> -->
        <GridLayout row="0" class="card">
            <Mapbox
                accessToken="pk.eyJ1IjoiY2xpY2tuIiwiYSI6ImNqdzhyZWZhazF5ZWMzenMwM200d2YzYnEifQ.AJs2nD_1XKA288fboJuFSw"
                mapStyle="light"
                hideCompass="true"
                zoomLevel="10"
                showUserLocation="true"
                disableZoom="false"
                disableRotation="false"
                disableScroll="false"
                disableTilt="false"
                @mapReady="onMapReady($event)"
                ref="map"
            >
            </Mapbox>
        </GridLayout>
    </GridLayout>
</template>

<script>
import * as http from "http";
import axios from 'axios';
import { constants } from 'fs';
const geolocation = require("nativescript-geolocation");
const { Accuracy } = require("tns-core-modules/ui/enums");
var mapbox = require("nativescript-mapbox");
    export default {
        data() {
            return {
                scrollTimer: null,
                mapCenter: {
                    latitude: null,
                    longitude: null
                },
                mapRadius: null,
                markers: [],
                markerIDs: []
            };
        },
        methods: {
            async onMapReady(args) {
                // if no permission was granted previously this will open a user consent screen
                // await this.$refs.map.nativeView.requestFineLocationPermission();
                await this.getLocation();
                await args.map.setCenter({
                    lat: this.mapCenter.latitude,
                    lng: this.mapCenter.longitude,
                    animated: true
                })
                let viewport = await args.map.getViewport()
                this.mapRadius = this.calculateViewportRadius(viewport)
                let nearby_events = await axios.post('http://10.0.2.2:3000/events/search', {
                    latitude: this.mapCenter.latitude,
                    longitude: this.mapCenter.longitude,
                    search_radius: this.mapRadius
                })
                console.log(nearby_events)

                for (let key in nearby_events.data.events) {
                    let event = nearby_events.data.events[key]
                    let marker = {
                        id: event._id,
                        lat: event.location.coordinates[1],
                        lng: event.location.coordinates[0],
                        title: event.title,
                        subtitle: event.description
                    }
                    this.markers.push(marker)
                    this.markerIDs.push(marker.id)
                }
                await args.map.addMarkers(this.markers)
                this.setOnScrollListener();
            },
            async setOnScrollListener() {
                let self = this
                this.$refs.map.nativeView.setOnScrollListener((point) => {                    
                    if(self.scrollTimer !== null) {
                        clearTimeout(self.scrollTimer);        
                    }
                    self.scrollTimer = setTimeout(async function() {
                        let center = await self.$refs.map.nativeView.getCenter();
                        self.mapCenter.latitude = center.lat;
                        self.mapCenter.longitude = center.lng;
                        self.getNearbyEvents();
                    }, 1500);
                });
            },
            async getNearbyEvents() {
                let new_markers = []
                let nearby_events = await axios.post('http://10.0.2.2:3000/events/search', {
                    latitude: this.mapCenter.latitude,
                    longitude: this.mapCenter.longitude,
                    search_radius: this.mapRadius
                })
                // console.log(nearby_events)

                for (let key in nearby_events.data.events) {
                    let event = nearby_events.data.events[key]
                    if (this.markerIDs.includes(event._id) === true) continue;

                    let marker = {
                        id: event._id,
                        lat: event.location.coordinates[1],
                        lng: event.location.coordinates[0],
                        title: event.title,
                        subtitle: event.description
                    }
                    console.log(marker)
                    new_markers.push(marker)
                    this.markers.push(marker)
                    this.markerIDs.push(marker.id)
                }
                await this.$refs.map.nativeView.addMarkers(new_markers)
            },
            async getLocation() {
                return new Promise(resolve => {
                    geolocation.enableLocationRequest();
                    geolocation
                    .getCurrentLocation({
                        desiredAccuracy: Accuracy.high,
                        maximumAge: 5000,
                        timeout: 20000
                    })
                    .then(res => {
                        this.mapCenter.latitude = res.latitude
                        this.mapCenter.longitude = res.longitude
                        // console.log(res)
                        resolve(res)
                        // this.speed = res.speed;
                    });
                })
            },
            calculateViewportRadius(viewport) {
                var R = 6371e3; // metres
                var φ1 = this.toRadians(viewport.bounds.south);
                var φ2 = this.toRadians(viewport.bounds.north);
                var Δφ = this.toRadians(viewport.bounds.north - viewport.bounds.south);
                var Δλ = this.toRadians(viewport.bounds.east - viewport.bounds.west);

                var a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
                        Math.cos(φ1) * Math.cos(φ2) *
                        Math.sin(Δλ/2) * Math.sin(Δλ/2);
                var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
                var d = R * c;
                return (d / 2);
            },
            toRadians(degrees) {
                var pi = Math.PI;
                return degrees * (pi/180);
            }
        }
    };
</script>

<style scoped>
</style>