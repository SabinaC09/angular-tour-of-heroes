import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HeroDetailComponent } from './hero-detail.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { By } from '@angular/platform-browser';
import { Hero } from '../hero';
import { ActivatedRoute } from '@angular/router';
import { HeroService } from '../hero.service';
import { of } from 'rxjs';
import { Location } from '@angular/common'
import { FormsModule } from '@angular/forms';

describe('HeroDetailComponent', () => {
  let component: HeroDetailComponent;
  let fixture: ComponentFixture<HeroDetailComponent>;
  let heroServiceSpy, locationSpy;
  let mockActivatedRoute;
  const testHero: Hero = { id: 1, name: 'HeroName', strength: 10 };

  beforeEach(async () => {

    heroServiceSpy = jasmine.createSpyObj(['getHero', 'save']);
    locationSpy = jasmine.createSpyObj(['back']);
    mockActivatedRoute = {
      snapshot: { paramMap: { get: () => { return '1'; } } }
    }

    heroServiceSpy.getHero.and.returnValue(of(testHero));

    await TestBed.configureTestingModule({
      declarations: [HeroDetailComponent],
      imports: [FormsModule],
      providers: [
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
        { provide: HeroService, useValue: heroServiceSpy },
        { provide: Location, useValue: locationSpy }
      ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(HeroDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

  });


  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have hero input', () => {
    expect(component.hero).toEqual(testHero);
  });

  it('should render hero name in h2 tag', () => {
    expect(fixture.nativeElement.querySelector('h2').textContent).toContain('HERONAME');
  });

  it('should display hero input', () => {

    const id = fixture.debugElement.query(By.css('[data-testid="hero-id"]')).nativeElement;
    id.value = testHero.id;
    const name = fixture.debugElement.query(By.css('input')).nativeElement;
    name.value = testHero.name;
    name.dispatchEvent(new Event(testHero.name));

    expect(name.value).toEqual(testHero.name);
    expect(id.value).toEqual(testHero.id);
  });




});
