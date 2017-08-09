import {Image} from "./image";
import {Rating} from "./rating";

export class Sale {

  // constructor(
  //   id: number,
  //   image: string,
  //   body: string,
  //   item: string, // item name ie: Gtx 1080 etc
  //   category: string, // item type ie: Video Card
  //   quality: string,
  //   manufacturer: string,
  //   price: number,
  //   location: string,
  //   latitude: number,
  //   longitude: number,
  //   owner_id: number,
  //   buyer_id: number,
  //   date_created: string,
  //   date_modified: string
  // ) { }
    id: number;
    image: Image[];
    title: string;
    body: string;
    item: string; // item name ie: Gtx 1080 etc
    category: string; // item type ie: Video Card
    quality: string;
    manufacturer: string;
    price: number;
    location: string;
    latitude: number;
    longitude: number;
    owner_id: number;
    buyer_id: number;
    date_created: string;
    date_modified: string;
    seller_ratings: Rating[];
}


