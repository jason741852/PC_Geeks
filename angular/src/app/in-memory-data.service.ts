import { InMemoryDbService } from 'angular-in-memory-web-api';
export class InMemoryDataService implements InMemoryDbService {
  createDb() {
    const sales = [
  { id: 1, item: 'GTX 750', category: 'Video Card',
   price: 300.00, quality: 'Perfect Condition', manufacturer: 'Evga'},
  { id: 2, item: 'GTX 760', category: 'Video Card', 
  price: 500.00, quality: 'Poor Condition', manufacturer: 'AMD'},
  { id: 3, item: 'GTX 780', category: 'Video Card',
   price: 400.00, quality: 'Okay Condition', manufacturer: 'AMD'},
  { id: 4, item: 'GTX 970', category: 'Video Card',
   price: 200.00, quality: 'Poor Condition', manufacturer: 'Gigabyte'},
  { id: 5, item: 'GTX 980', category: 'Video Card',
   price: 100.00, quality: 'Perfect Condition', manufacturer: 'AMD'},
  { id: 6, item: 'GTX 950', category: 'Video Card',
   price: 600.00, quality: 'Perfect Condition', manufacturer: 'Gigabyte'},
  { id: 7, item: 'GTX 1050', category: 'Video Card',
   price: 700.00, quality: 'Perfect Condition', manufacturer: 'Evga'},
  { id: 8, item: 'GTX 1060', category: 'Video Card',
   price: 600.00, quality: 'Perfect Condition', manufacturer: 'AMD'},
  { id: 9, item: 'GTX 1070', category: 'Video Card',
   price: 900.00, quality: 'Perfect Condition', manufacturer: 'Gigabyte'},
  { id: 10, item: 'GTX 1080', category: 'Video Card',
   price: 800.00, quality: 'Perfect Condition', manufacturer: 'Evga'},
    ];
    return {sales};
  }
}
