/*
  测试接口，复制测试接口的数据
  {
    "records": [
      {
        "id": 1,
        "tmName": "小米",
        "logoUrl": "http://47.93.148.192:8080/group1/M00/03/D9/rBHu8mHmKC6AQ-j2AAAb72A3EO0942.jpg"
      }
    ],
    "total": 30,
    "size": 1,
    "current": 1,
    "searchCount": true,
    "pages": 30
  }
*/
export interface TrademarkItem {
  id: number;
  tmName: string;
  logoUrl: string;
}

export type TrademarkList = TrademarkItem[];

export interface GetTrademarkListResponse {
  records: TrademarkList;
  total: number;
  size: number;
  current: number;
  searchCount: boolean;
  pages: number;
}
