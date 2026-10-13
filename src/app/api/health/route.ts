import {NextResponse} from "next/server";
import {db} from "@/src/lib/db";
export const dynamic = "force-dynamic";
export async function GET(){
 const started=Date.now();
 try{
  await db.$queryRaw`SELECT 1`;
  return NextResponse.json({ok:true,version:"6.1.1",environment:process.env.NODE_ENV||"unknown",database:"ok",latencyMs:Date.now()-started});
 }catch(e:any){
  return NextResponse.json({ok:false,version:"6.1.1",environment:process.env.NODE_ENV||"unknown",database:"error",error:e?.message||"Database unavailable",latencyMs:Date.now()-started},{status:503});
 }
}
