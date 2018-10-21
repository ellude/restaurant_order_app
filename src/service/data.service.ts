import { of, Observable } from "rxjs";
import { menuMock } from "src/mock/menu.mock";
import { Menu } from "src/model/menu.model";

export class DataService {
    constructor () {}

    getDishes(): Observable<Menu[]> {
        // Mocked backend call
        return of(menuMock);
    }
}