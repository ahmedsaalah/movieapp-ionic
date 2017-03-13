﻿import { Component, OnInit, OnDestroy } from '@angular/core';

import { ViewController, NavController } from 'ionic-angular';

import { MovieService } from './shared/movie.service';
import { Movie, MovieScreening } from './shared/movie.model';

import * as _ from 'lodash';
import moment from 'moment';

@Component({
    selector: 'page-movies',
    templateUrl: 'movies.html',
})
export class MoviesPage implements OnInit, OnDestroy {

    private subs: any[] = [];

    public movies: Movie[];

    constructor(
        private viewCtrl: ViewController,
        private navCtrl: NavController,
        private movieService: MovieService) {
    }

    ngOnInit() {
        var sub = this.viewCtrl.didEnter.subscribe(() => {

            this.movies = this.movieService.getMovies();

        });

        this.subs.push(sub);
        var sub2 = this.viewCtrl.didLeave.subscribe(() => {
            console.log('MoviesPage: didLeave');
        });
        this.subs.push(sub2);
    }

    ngOnDestroy() {
        this.subs.forEach(sub => {
            sub.unsubscribe();
        });
    }

    uniqueTimes(screening: MovieScreening[]): any[] {

        if (screening == null || screening.length == 0)
            return [];

        var now = moment();
        var times = _.chain(screening)
            .map(s => {
                var time = moment(s.time);
                return {
                    time: time.format("HH:mm"),
                    active: time.isSame(now, 'day') && time.isAfter(now)
                }
            })
            .uniqBy(t => t.time)
            .value();

        return times;
    }


}