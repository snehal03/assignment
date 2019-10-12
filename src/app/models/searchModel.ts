export class SearchModel {
    "currency":string =  "USD";
    "posId":string =  "hbg3h7rf28";
    "orderBy":string =  "price asc, rating desc";
    "roomOccupancies": Array<any>;
    "stayPeriod": StayPeriod;
    "bounds":any;
}

export class StayPeriod {
    "start": string;
    "end": string;
}