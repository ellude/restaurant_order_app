import { TestBed, async, ComponentFixture } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { FormsModule } from '@angular/forms';
import { DataService } from 'src/service/data.service';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { historyMock } from 'src/mock/history.mock';
import { menuMock } from 'src/mock/menu.mock';

describe('AppComponent', () => {
  let comp: AppComponent;
  let fixture: ComponentFixture<AppComponent>;
  const orderHistoryMock = historyMock;
  const splittedOrderMock = ["morning", " 1", " 2", "3"];

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        FormsModule,
        MatInputModule,
        MatButtonModule,
        MatTableModule
      ],
      declarations: [
        AppComponent
      ],
      providers: [
        DataService
      ]
    }).compileComponents().then(() => {
      fixture = TestBed.createComponent(AppComponent);
      comp = fixture.componentInstance;
      comp.menu = menuMock;
    });
  }));

  it('should create the component', () => {
    expect(comp).toBeTruthy();
  });

  it('should show table if history array is not empty', () => {
    comp.orderHistoryItems = orderHistoryMock;
    expect(comp.showHistoryTable()).toBeTruthy();
  });

  it('should return meals from time of the day', () => {
    const mockMeals = [
      {key: 1, description: "eggs"},
      {key: 2, description: "toast"},
      {key: 3, description: "coffee"}
    ];
    expect(comp.getDayTimeMeals(splittedOrderMock, 'morning')).toEqual(mockMeals);
  });

  it('should return meals counted', () => {
    const mockMeals = [
      {key: 1, description: "eggs"},
      {key: 2, description: "toast"},
      {key: 3, description: "coffee"},
      {key: 3, description: "coffee"}
    ];
    const mockResponse = {eggs: 1, toast: 1, coffee: 2};
    expect(comp.countMeals(mockMeals)).toEqual(mockResponse);
  });

  it('should generate output', () => {
    const mockCountedMeals = {eggs: 1, toast: 1, coffee: 2};
    const mockOutput = 'eggs, toast, coffee(x2)';
    expect(comp.generateOutput(mockCountedMeals, 'morning')).toEqual(mockOutput);
  })
});
