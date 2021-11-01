import { async, ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { of } from 'rxjs';
import { HeroSearchComponent } from '../hero-search/hero-search.component';
import { HeroService } from '../hero.service';
import { HEROES } from '../mock-heroes';
import { RouterTestingModule } from '@angular/router/testing';
import { DashboardComponent } from './dashboard.component';
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';

describe('DashboardComponent', () => {
  let component: DashboardComponent;
  let fixture: ComponentFixture<DashboardComponent>;
  let heroServiceSpy;
  let getHeroesSpy: any; //infer param type on usage
  let debugElement: DebugElement;
  let routerSpy;

  beforeEach(async () => {

    heroServiceSpy = jasmine.createSpyObj('HeroService', ['getHeroes']);
    getHeroesSpy = heroServiceSpy.getHeroes.and.returnValue(of(HEROES));
    routerSpy = jasmine.createSpyObj('Router', ['navigateByUrl']);

    await TestBed.configureTestingModule({
      declarations: [DashboardComponent, HeroSearchComponent],
      imports: [RouterTestingModule.withRoutes([])],
      providers: [
        { provide: HeroService, useValue: heroServiceSpy },
        //{ provide: Router, useValue: routerSpy }
      ]
    }).compileComponents()

    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    debugElement = fixture.nativeElement;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display "Top Heroes" as headline', () => {
    expect(fixture.nativeElement.querySelector('h2').textContent).toEqual('Top Heroes');
  });

  it('should call heroService', async(() => {
    expect(getHeroesSpy.calls.any()).toBe(true);
  }));

  it('should display at least one hero', async(() => {
    expect(fixture.nativeElement.querySelectorAll('a').length).toBeGreaterThan(0);
  }));

  it('should display 4 heroes links', async(() => {
    expect(fixture.nativeElement.querySelectorAll('a').length).toEqual(4);
  }));

  //testing nested components (shallow)
  it('renders an independent search component', () => {
    const { debugElement } = fixture;
    const search = debugElement.query(By.css('app-hero-search'));
    expect(search).toBeTruthy();
  });


});










