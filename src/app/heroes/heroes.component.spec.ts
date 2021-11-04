import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { HeroesComponent } from './heroes.component';
import { By } from '@angular/platform-browser';
import { HeroService } from '../hero.service';
import { HEROES } from '../mock-heroes';
import { of } from 'rxjs';
import { TestScheduler } from 'rxjs/testing';
import { Hero } from '../hero';
import { Component, Directive, Input, NO_ERRORS_SCHEMA } from '@angular/core';
import { HeroComponent } from '../hero/hero.component';


describe('HeroesComponent (Shallow)', () => {
  let component: HeroesComponent;
  let fixture: ComponentFixture<HeroesComponent>;
  let heroServiceSpy: any;
  let heroesNo: number;
  let scheduler: TestScheduler;

  //Mocking child component
  @Component({
    selector: 'app-hero',
    template: '<div></div>',
  })
  class FakeHeroComponent {

    @Input() hero: any;
    //@Output() delete = new EventEmitter();

  }


  beforeEach(async () => {

    heroesNo = HEROES.length;
    heroServiceSpy = jasmine.createSpyObj('HeroService', ['getHeroes', 'addHero', 'deleteHero']);
    heroServiceSpy.getHeroes.and.returnValue(of(HEROES)); //ngOnInit calls getHeroes
    heroServiceSpy.addHero.and.returnValue(of([...HEROES, { id: 21, name: 'TestHero', strength: 30 }]));
    heroServiceSpy.deleteHero.and.returnValue(of(true));
    scheduler = new TestScheduler((actual, expected) => {
      expect(actual).toEqual(expected);
    });

    await TestBed.configureTestingModule({
      declarations: [HeroesComponent, FakeHeroComponent],
      imports: [RouterTestingModule.withRoutes([]), HttpClientTestingModule],
      providers: [
        { provide: HeroService, useValue: heroServiceSpy }]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HeroesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display heroes', () => {
    expect(fixture.nativeElement.querySelectorAll('li').length).toBeGreaterThan(0);
  });

  it('should create one li for each hero', () => {
    expect(fixture.debugElement.queryAll(By.css('li')).length).toBe(HEROES.length);
  })

  it('should add hero using button', () => {

    spyOn(component, 'add').and.callThrough();
    const newHero = 'TestHero';
    const nameInput = fixture.debugElement.query(By.css('#new-hero')).nativeElement;
    nameInput.value = newHero;
    nameInput.dispatchEvent(new Event('input'));

    const button = fixture.debugElement.query(By.css('[data-testid="add-button"]'));
    button.triggerEventHandler('click', { string: newHero });
    fixture.detectChanges();

    expect(component.add).toHaveBeenCalled();

    const heroesList = fixture.debugElement.queryAll(By.css('li'));
    expect(heroesList.length).toBeGreaterThan(heroesNo);

  });


  it('should call delete hero with criteria', () => {
    component.delete(HEROES[1]);

    expect(heroServiceSpy.deleteHero).toHaveBeenCalledWith(HEROES[1].id); // da eroare fara .id ??
  });

  // Testing Observables
  //Subscribe and assert
  it('should get heroes(Observable)', done => {
    heroServiceSpy.getHeroes().subscribe((heroes: Hero[] | any[]) => {
      expect(heroes.length).toBeGreaterThan(0);
      done();
    });
  });

  it('should delete hero(Observable)', done => {
    const testHero = { id: 21, name: 'TestHero', strength: 11 };
    heroServiceSpy.deleteHero.and.returnValue(of(testHero));

    heroServiceSpy.deleteHero(21).subscribe((hero: any) => {
      expect(hero).toEqual(testHero);
      done();//signal done to check assertion - it can be green even if it fails
    });
  });

  it('should add hero(Observable', done => {
    const testHero = { id: 21, name: 'TestHero', strength: 11 };
    const expectedHeroes = [...HEROES, { id: 21, name: 'TestHero', strength: 30 }];

    heroServiceSpy.addHero(testHero).subscribe((heroes: any) => {
      expect(heroes).toEqual(expectedHeroes);
      done();
    });
  });

  //Marble testing
  //it('should delete hero(Observable-Marble)', () => {

  // scheduler.run(({ expectObservable, cold }) => {
  //   //const expectedMarble = '(a|)';
  //   const expectedHero = { id: 21, name: 'TestHero', strength: 11 };
  //   heroServiceSpy.deleteHero.and.returnValue(of(expectedHero));

  //   const hero = of(expectedHero);
  //   cold('-a').subscribe(()=>heroServiceSpy.deleteHero(expectedHero));

  //   expectObservable(hero).toBe('-a', {a: expectedHero});
  // })
  // });

});

@Directive({
  selector: '[routerLink]',
  host: { '(click)': 'onClick()' } //listen to a host event: if click was fired, called onClick method
})
export class RouterLinkDirectiveStub {
  @Input('routerLink') linkParams: any; // primeste: routerLink="/detail/{{hero.id}}
  navigatedTo: any = null;

  onClick() {
    this.navigatedTo = this.linkParams;
  }
}

describe('HeroesComponent (Deep)', () => {
  let component: HeroesComponent;
  let fixture: ComponentFixture<HeroesComponent>;
  let heroServiceSpy: any;
  const testHero: Hero = { id: 21, name: 'TestHero', strength: 30 };

  beforeEach(async () => {

    heroServiceSpy = jasmine.createSpyObj('HeroService', ['getHeroes', 'addHero', 'deleteHero']);
    heroServiceSpy.getHeroes.and.returnValue(of(HEROES));
    heroServiceSpy.addHero.and.returnValue(of(testHero));

    await TestBed.configureTestingModule({
      declarations: [HeroesComponent, HeroComponent, RouterLinkDirectiveStub],
      providers: [
        { provide: HeroService, useValue: heroServiceSpy }],
      //schemas: [NO_ERRORS_SCHEMA]
    })
      .compileComponents();

    fixture = TestBed.createComponent(HeroesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should render each hero as a HeroComponent', () => {
    const heroCompDebEls = fixture.debugElement.queryAll(By.directive(HeroComponent));//all debug el that are attached to a HeroComponent
    expect(heroCompDebEls.length).toEqual(HEROES.length);
    for (let i = 0; i < heroCompDebEls.length; i++)
      expect(heroCompDebEls[i].componentInstance.hero).toEqual(HEROES[i]);
  });

  //Testig iteractions between parent and child component
  //trigger events on elements / trigger events from children / raising events on child directives
  it('should call heroService.deleteHero method when the delete button is clicked', () => {
    spyOn(fixture.componentInstance, 'delete');
    const heroCompDebEls = fixture.debugElement.queryAll(By.directive(HeroComponent));
    //const deleteBtn = heroCompDebEls[0].query(By.css('.delete'));
    //deleteBtn.triggerEventHandler('click', { stopPropagation: () => { } });

    //(<HeroComponent>heroCompDebEls[0].componentInstance).delete.emit(undefined);
    heroCompDebEls[0].triggerEventHandler('delete', null);

    expect(fixture.componentInstance.delete).toHaveBeenCalledOnceWith(HEROES[0]);
  });

  it('should add a new hero to the hero list when the button is clicked', () => {
    const input = fixture.debugElement.query(By.css('input')).nativeElement;
    const addButton = fixture.debugElement.query(By.css('[data-testid="add-button"]'));

    input.value = testHero.name;
    addButton.triggerEventHandler('click', null);
    fixture.detectChanges();

    const heroText = fixture.debugElement.query(By.css('ul')).nativeElement.textContent;
    expect(heroText).toContain(testHero.name);
  });

  //Testing routing components
  it('should have the correct route for the first hero', () => {
    const heroComponents = fixture.debugElement.queryAll(By.directive(HeroComponent));
    let routerLink = heroComponents[0].query(By.directive(RouterLinkDirectiveStub))
      .injector.get(RouterLinkDirectiveStub);//return instance of the router link stub for this specific heroComp[0]

    heroComponents[0].query(By.css('a')).triggerEventHandler('click', null);

    expect(routerLink.navigatedTo).toBe(`/detail/${HEROES[0].id}`);
  });


});


