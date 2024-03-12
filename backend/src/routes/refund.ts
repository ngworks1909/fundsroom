import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import { Hono } from "hono";
import { fetchUser } from "../middlewares/fetchUser";


export const refundRouter = new Hono<{
    Bindings: {
        DATABASE_URL: string;
        JWT_SECRET: string;
    }
}>();

refundRouter.use(fetchUser)

refundRouter.get("/fetchRefunds", async(c) => {
    const senderUserId = c.res.headers.get("id") || "";
    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL
    }).$extends(withAccelerate());
    let success = false
    try {
        const accId: any = await prisma.account.findFirst({
            where:{
                userId: senderUserId
            },
            select: {
              accId: true
            }
        })

        const refunds = await prisma.account.findMany({
            where: {
                accId: accId
            }
        })
        success = true;
        return c.json({success, refunds});

    } catch (error) {
        success = false;
        c.status(403);
        return c.json({success, error: "Internal server error..."});
        
    }
});

refundRouter.put('/processRefunds', async(c) => {
    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL
    }).$extends(withAccelerate());

    let success = true;
    try {
        const refunds = await prisma.refund.findMany({});
        return c.json({success, message: "All refunds processed..."})
        
    } catch (error) {
        success = false;
        c.status(500);
        c.json({success, error: "Internal server error..."})
        
    }

    
})