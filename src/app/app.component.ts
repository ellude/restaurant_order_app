import { Component, OnInit, ViewChild } from '@angular/core';
import { DayTimeConstant } from 'src/model/daytime.constant';
import { DataService } from 'src/service/data.service';
import { Menu, Meal } from 'src/model/menu.model';
import { OrderHistory } from 'src/model/history.model';
import { MatTable, MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  constructor (
    private dataService: DataService,
  ) { }

  @ViewChild(MatTable) orderHistoryTable: MatTable<any>;

  output: string;
  menu: any;
  order: string;

  // Angular Material
  orderHistoryItems: OrderHistory[] = [];
  orderHistoryDatasource = new MatTableDataSource([]);
  displayedColumns = [];

  ngOnInit(): void {
    this.dataService.getDishes().subscribe((menu => {
      this.menu = menu;
    }))
  }  

  processOrder(order: string): void {
    this.output = '';    

    // If the input is empty
    if (!order) {
      return;
    }
    const orderSplitted: string[] = order.split(',');

    if (orderSplitted.length) {
      const time: string = orderSplitted[0].toLowerCase();

      if (time === DayTimeConstant.MORNING || time === DayTimeConstant.NIGHT) {
        // Get ordered meals
        const meals = this.getDayTimeMeals(orderSplitted, time);
        // Sorting by meal order
        meals.sort((a,b) => {return a.key - b.key});
        // Counting meals
        const countedMeals = this.countMeals(meals);
        // Generating output
        this.output = this.generateOutput(countedMeals, time);
      } else {
        this.output = 'error';
      }
    }

    const orderHistoryItem: OrderHistory = {
      date: new Date().toLocaleString(),
      input: order,
      output: this.output
    }    
    this.addToOrderHistory(orderHistoryItem);
  }

  showHistoryTable() {
    return this.orderHistoryItems.length;
  }

  generateOutput(countedMeals: any, time: string): string {
    const mealsKeys: string[] = Object.keys(countedMeals);
    let output: string = '';

    mealsKeys.every((key, index) => {
      if (countedMeals[key] > 1) {
        // Only coffee and potato can be more than 1
        if (time === DayTimeConstant.MORNING && key === 'coffee' || 
          time === DayTimeConstant.NIGHT && key === 'potato') {
          output += key + '(x' + countedMeals[key] + ')';
        } else {
          output += key;
          output += ', error';
          return false;
        }
      } else {
        output += key;
      }
      if(index !== mealsKeys.length - 1) {
        output += ', ';
        return true;
      }
    });

    return output;
  }

  addToOrderHistory(orderHistoryItem: OrderHistory): void {    
    // Initializing table
    if (!this.orderHistoryItems.length) {
      this.orderHistoryItems.push(orderHistoryItem);
      this.orderHistoryDatasource = new MatTableDataSource(this.orderHistoryItems);
      this.displayedColumns = ['date', 'input', 'output']; 
    } else {
      this.orderHistoryItems.push(orderHistoryItem);
    }

    this.orderHistoryTable.renderRows();
  }

  getDayTimeMeals(orderSplitted: string[], time: string): Meal[] {
    const currentMenu: Menu = this.menu.find((dayTimeMenu: Menu) => {
      return dayTimeMenu.time === time;
    });
    const meals: Meal[] = [];

    orderSplitted.forEach((orderItem, index) => {
      orderItem = orderItem.trim();
      if (index >= 1) {
        const meal = currentMenu.dishes.find((meal: Meal) => meal.key === Number(orderItem));
        meals.push(meal);
      }
    });

    return meals;   
  }

  countMeals(meals: Meal[]): any {
    return meals.reduce((accMeals, meal: Meal) => {
      if (!meal) {
        accMeals['error'] = 1;
        return accMeals;
      }
      if(meal.description in accMeals) {
        accMeals[meal.description]++;
      } else {
        accMeals[meal.description] = 1;
      }
      return accMeals;
    }, {});
  }
}
