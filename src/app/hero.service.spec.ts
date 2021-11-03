import { TestBed, inject } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HeroService } from './hero.service';
import { MessageService } from './message.service';
import { Hero } from './hero';

const mockData = [
  { id: 1, name: 'TestHero1', strength: 13 },
  { id: 2, name: 'TestHero2', strength: 20 },
  { id: 3, name: 'TestHero3', strength: 30 },
] as Hero[];

describe('HeroService', () => {
  let heroService: any;
  let httpTestingController: HttpTestingController;
  let mockHeroes: any;
  let mockHero: any; //infer parameter types on usage
  let mockId: number;
  let messageServiceSpy;

  beforeEach(() => {
    messageServiceSpy = jasmine.createSpyObj(['add']);
    mockHeroes = [...mockData];
    mockHero = mockHeroes[0];
    mockId = mockHero.id;

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [HeroService, MessageService]
      //{ provide: MessageService, useValue: messageServiceSpy }]
    });

    heroService = TestBed.inject(HeroService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });


  const apiUrl = (id: number) => {
    return `${heroService.heroesUrl}/${mockId}`;
  }

  afterEach(() => {
    httpTestingController.verify();
  })

  it('should be created', () => {
    expect(heroService).toBeTruthy();
  });

  describe('getHeroes', () => {

    it('should return mock heroes', () => {
      spyOn(heroService, 'handleError').and.callThrough();
      spyOn(heroService, 'log').and.callThrough();
      heroService.getHeroes().subscribe(
        (heroes: string | any[]) => expect(heroes.length).toEqual(mockHeroes.length),
        fail
      );

      const req = httpTestingController.expectOne(heroService.heroesUrl);
      expect(req.request.method).toEqual('GET');
      req.flush(mockHeroes);

      expect(heroService.log).toHaveBeenCalledTimes(1);
      expect(heroService.messageService.messages[0]).toEqual('HeroService: fetched heroes');
    });
  });

  describe('getHero', () => {
    it('should return a single mock hero', () => {
      spyOn(heroService, 'handleError').and.callThrough();
      spyOn(heroService, 'log').and.callThrough();

      heroService.getHero(mockHero.id).subscribe(
        (response: any) => expect(response).toEqual(mockHero),
        fail
      );

      const req = httpTestingController.expectOne(`${heroService.heroesUrl}/${mockHero.id}`);
      expect(req.request.method).toEqual('GET');
      req.flush(mockHero);

      expect(heroService.log).toHaveBeenCalledTimes(1);
      //expect(heroService.messageService.message[0]).toContain(`fetched hero id=${mockHero.id}`);
    });
  });

  describe('addHero', () => {
    it('should add a single hero', () => {
      spyOn(heroService, 'handleError').and.callThrough();
      spyOn(heroService, 'log').and.callThrough();

      heroService.addHero(mockHero).subscribe(
        (response: any) => expect(response).toEqual(mockHero),
        fail
      );

      const req = httpTestingController.expectOne(`${heroService.heroesUrl}`);
      expect(req.request.method).toEqual('POST');
      req.flush(mockHero);

      expect(heroService.log).toHaveBeenCalledTimes(1);
      expect(heroService.messageService.messages[0]).toEqual(`HeroService: added hero w/ id=${mockHero.id}`);
    });
  });

  describe('updateHero', () => {

    it('should update hero', () => {
      heroService.updateHero(mockHero).subscribe(
        (response: any) => expect(response).toEqual(mockHero),
        fail
      );

      const req = httpTestingController.expectOne(heroService.heroesUrl);
      expect(req.request.method).toEqual('PUT');
      req.flush(mockHero);
    });
  });

  describe('deleteHero', () => {

    it('should delete hero using id', () => {
      const mockUrl = apiUrl(mockId);
      heroService.deleteHero(mockId).subscribe(
        (response: any) => expect(response).toEqual(mockId),
        fail
      );

      const req = httpTestingController.expectOne(mockUrl);
      expect(req.request.method).toEqual('DELETE');
      req.flush(mockId);
    });
  });

});