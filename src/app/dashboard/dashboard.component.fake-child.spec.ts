import { DashboardComponent } from "./dashboard.component";
import { Component, Input, NO_ERRORS_SCHEMA, Output } from "@angular/core";
import { HeroSearchComponent } from "../hero-search/hero-search.component";
import { async, Subject } from "rxjs";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { By } from "@angular/platform-browser";
import { RouterTestingModule } from "@angular/router/testing";
import { HttpClientTestingModule } from "@angular/common/http/testing";


@Component({
    selector: 'app-hero-detail',
    template: '',
})
class FakeHeroSearchComponent implements Partial<HeroSearchComponent>{
    @Input()
    private searchTerms = new Subject<string>();

    @Output()
    search(term: string): void {
        this.searchTerms.next(term);
    }
}

describe('DashboardComponent faking a child component', () => {
    let fixture: ComponentFixture<DashboardComponent>;
    let component: DashboardComponent;
    let search: FakeHeroSearchComponent;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [DashboardComponent, FakeHeroSearchComponent],
            imports: [RouterTestingModule.withRoutes([]), HttpClientTestingModule],
            schemas: [NO_ERRORS_SCHEMA]
        }).compileComponents();

        fixture = TestBed.createComponent(DashboardComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();

        const searchEl = fixture.debugElement.query(By.directive(FakeHeroSearchComponent));
        search = searchEl.componentInstance;
    });

   /* it('renders an independent search', () => {
        expect(search).toBeTruthy();
    })*/
});