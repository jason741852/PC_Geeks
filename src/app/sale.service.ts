import { Injectable } from '@angular/core';
import { Sale } from './sale';
import { SALES } from './mock-sales';
@Injectable()
export class SaleService {
    getSales(): Promise<Sale[]> {
        return Promise.resolve(SALES);
    }
    getHeroesSlowly(): Promise<Sale[]> {
        return new Promise(resolve => {
        // Simulate server latency with 2 second delay
        setTimeout(() => resolve(this.getSales()), 2000);
    });
  }
  getSale(id: number): Promise<Sale> {
    return this.getSales()
               .then(sales => sales.find(sale => sale.id === id));
  }

}
