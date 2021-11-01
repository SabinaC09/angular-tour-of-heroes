import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { HeroesComponent } from './heroes.component';
import { By } from '@angular/platform-browser';
import { HeroService } from '../hero.service';
import { HEROES } from '../mock-heroes';
import { of } from 'rxjs';


describe('HeroesComponent', () => {
  let component: HeroesComponent;
  let fixture: ComponentFixture<HeroesComponent>;
  let heroServiceSpy: any;
  let getHeroesSpy: any;
  let addHeroSpy: any;
  let heroesNo: number;


  beforeEach(async () => {

    heroesNo = HEROES.length;
    heroServiceSpy = jasmine.createSpyObj('HeroService', ['getHeroes', 'addHero']);
    getHeroesSpy = heroServiceSpy.getHeroes.and.returnValue(of(HEROES));
    addHeroSpy = heroServiceSpy.addHero.and.returnValue(of([...HEROES, { id: 21, name: 'TestHero' }]));

    await TestBed.configureTestingModule({
      declarations: [HeroesComponent],
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

  it('should add hero', () => {

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

  it('should delete a hero', () => {
    const deleteButton = fixture.debugElement.query(By.css('.delete'));
    const deleteHero = component.heroes[0];
    deleteButton.triggerEventHandler('click', deleteHero);
    fixture.detectChanges();

    const heroesList = fixture.debugElement.queryAll(By.css('li'));
    expect(heroesList.length).toBeLessThan(heroesNo);
  });

});
