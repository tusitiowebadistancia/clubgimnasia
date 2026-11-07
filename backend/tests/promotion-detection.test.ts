import { Prisma } from "@prisma/client";
import { describe, expect, it } from "vitest";
import { detectReduction, isPromotionStillValid } from "../src/modules/promotions/service.js";
const d=(value:number)=>new Prisma.Decimal(value); const now=new Date("2026-01-10T12:00:00Z");
const product=(price:number,history:any[]=[],active=true,branchId=5)=>({id:"p",branchId,active,price:d(price),history});
const h=(price:number,hours=1,branchId=5)=>({price:d(price),observedAt:new Date(now.getTime()-hours*3600000),branchId});
describe("promotion detection",()=>{
 it("detects a real reduction with decimal math",()=>expect(detectReduction(product(80,[h(100)]),72,now)?.reductionPercent.toString()).toBe("20"));
 it("rejects zero, negative, unchanged and increased prices",()=>{for(const x of [product(0,[h(10)]),product(-1,[h(10)]),product(100,[h(100)]),product(120,[h(100)]),product(80,[h(0)])])expect(detectReduction(x,72,now)).toBeNull();});
 it("rejects inactive, old, foreign and duplicate non-evidence history",()=>{expect(detectReduction(product(80,[h(100)],false),72,now)).toBeNull();expect(detectReduction(product(80,[h(100,73)]),72,now)).toBeNull();expect(detectReduction(product(80,[h(100,1,6)]),72,now)).toBeNull();});
 it("uses the newest valid reference",()=>expect(detectReduction(product(80,[h(120,3),h(100,1)]),72,now)?.previousPrice.toString()).toBe("100"));
 it("revalidates official price, expiry and exact age boundary",()=>{const base={active:true,officialPrice:d(80),approvedPrice:d(80),previousObservedAt:new Date(now.getTime()-72*3600000),maxAgeHours:72};expect(isPromotionStillValid(base,now)).toBe(true);expect(isPromotionStillValid({...base,officialPrice:d(81)},now)).toBe(false);expect(isPromotionStillValid({...base,expiresAt:now},now)).toBe(false);});
});
