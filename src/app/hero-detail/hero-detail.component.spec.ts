import { ComponentFixture, fakeAsync, flush, TestBed, tick, waitForAsync } from '@angular/core/testing';
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
  let heroServiceSpy: any;
  let locationSpy;
  let mockActivatedRoute;
  const testHero: Hero = { id: 1, name: 'HeroName', strength: 10 };

  beforeEach(async () => {

    heroServiceSpy = jasmine.createSpyObj(['getHero', 'updateHero']);
    locationSpy = jasmine.createSpyObj(['back']);
    mockActivatedRoute = {
      snapshot: { paramMap: { get: () => { return '1'; } } }
    }

    heroServiceSpy.getHero.and.returnValue(of(testHero));
    heroServiceSpy.updateHero.and.returnValue(of({}));

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

  //Asynch testing
  /* it('should call updateHero when save is called', (done) => { // pt testele asincrone se foloseste done
     component.save();
     setTimeout(()=>{
       expect(heroServiceSpy.updateHero).toHaveBeenCalled();
       done(); // altfel nu asteapta pana se termimn testul, ci trece la urmat
     }, 300);
   })*/

  //Fake asynch helper function (ca sa nu asteptam x secunde after each test if we have more than 1)
  it('should call updateHero when save is called', fakeAsync(() => { //makes the test synchronous
    component.save();
    //tick(250);
    flush();//tells fakeasynch to work with zone.js and fast forward time to execute waiting tasks

    expect(heroServiceSpy.updateHero).toHaveBeenCalled();
  }));

  //waitforasynch helper method ( used for scenarios where u use promises)
  // it('should call updateHero when save is called', waitForAsync(() => {
  //   component.save();

  //   //wait for any promises to be resolved before executing
  //   fixture.whenStable().then(() => {
  //     expect(heroServiceSpy.updateHero).toHaveBeenCalled();
  //   })
  // }));

});
