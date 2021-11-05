import { Component, OnInit, Input } from '@angular/core';
import { Hero } from '../hero';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { HeroService } from '../hero.service';

@Component({
  selector: 'app-hero-detail',
  templateUrl: './hero-detail.component.html',
  styleUrls: ['./hero-detail.component.css']
})
export class HeroDetailComponent implements OnInit {
  @Input() hero?: Hero;

  constructor(
    private route: ActivatedRoute,
    private heroService: HeroService,
    private location: Location
  ) { }

  ngOnInit(): void {
    this.getHero();
  }

  getHero(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.heroService.getHero(id)
      .subscribe(hero => this.hero = hero);
  }

  goBack(): void {
    this.location.back();
  }

  save(): void {
    debounce(() => {
      if (this.hero) {
        this.heroService.updateHero(this.hero)
          .subscribe(() => this.goBack());
      }
    }, 250, false)();
  }

  // save(): void {
  //   someThirdPartyPromise().then(()=>{
  //     if (this.hero) {
  //       this.heroService.updateHero(this.hero)
  //         .subscribe(() => this.goBack());
  //     }
  //   })
  // };

}

function someThirdPartyPromise() {
  return new Promise((resolve) => {
    resolve(null);
  })
}

function debounce(func: any, wait: any, immediate: any) {
  var timeout: any;
  return function () {
    var context = HeroDetailComponent; //this - ce e this
    var args = arguments;
    var later = function () {
      timeout = null;
      if (!immediate)
        func.apply(context, args);
    };
    var callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow)
      func.apply(context, args);
  }
};
