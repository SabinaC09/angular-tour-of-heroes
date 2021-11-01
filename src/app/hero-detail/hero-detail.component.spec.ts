import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HeroDetailComponent } from './hero-detail.component';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { By } from '@angular/platform-browser';
import { Hero } from '../hero';

describe('HeroDetailComponent', () => {
  let component: HeroDetailComponent;
  let fixture: ComponentFixture<HeroDetailComponent>;
  let heroServiceSpy;
  const hero: Hero = { id: 1, name: 'HeroName' };

  beforeEach(async () => {

    heroServiceSpy = jasmine.createSpyObj('HeroService', ['getHeroes', 'addHero']);

    //getHeroesSpy = heroServiceSpy.getHeroes.and.returnValue(of(HEROES));

    await TestBed.configureTestingModule({
      declarations: [HeroDetailComponent],
      imports: [RouterTestingModule.withRoutes([]), HttpClientTestingModule]
    })
      .compileComponents();

    fixture = TestBed.createComponent(HeroDetailComponent);
    component = fixture.componentInstance;
    component.hero = hero;
    fixture.detectChanges();

  });


  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have hero input', () => {
    expect(component.hero).toEqual(hero);
  });

  it('should display hero input', () => {

    const id = fixture.debugElement.query(By.css('[data-testid="hero-id"]')).nativeElement;
    id.value = hero.id;
    const name = fixture.debugElement.query(By.css('input')).nativeElement;
    name.value = hero.name;
    name.dispatchEvent(new Event(hero.name)); 

    expect(name.value).toEqual(hero.name);
    expect(id.value).toEqual(hero.id);
  });

  /*it('should convert hero name to Title Case', () => {
    // get the name's input and display elements from the DOM
    const hostElement: HTMLElement = fixture.nativeElement;
    const nameInput: HTMLInputElement = hostElement.querySelector('input')!;
    const nameDisplay: HTMLElement = hostElement.querySelector('span')!;
  
    // simulate user entering a new name into the input box
    nameInput.value = 'quick BROWN  fOx';
  
    // Dispatch a DOM event so that Angular learns of input value change.
    // In older browsers, such as IE, you might need a CustomEvent instead. See
    // https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent/CustomEvent#Polyfill
    nameInput.dispatchEvent(new Event('input'));
  
    // Tell Angular to update the display binding through the title pipe
    fixture.detectChanges();
  
    expect(nameDisplay.textContent).toBe('Quick Brown  Fox');
  });*/


});
