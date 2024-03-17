import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import { Hono } from "hono";
import { fetchUser } from "../middlewares/fetchUser";

export const accountRouter = new Hono<{
    Bindings:{
        DATABASE_URL: string,
        JWT_SECRET: string
    }
}>();

accountRouter.use(fetchUser);

const generateString = (length: number) => {
    let result = ""
    for(let i = 0; i < length; i++){
        const randomInt = Math.floor(Math.random() * 10);
        result += randomInt
    }
    return result;
}

accountRouter.post('/createAccount', async(c) => {
    const body = await c.req.json();
    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL
    }).$extends(withAccelerate());

    let success = false;
    try {
        const bank = await prisma.$transaction(async(tx) => {
            const bank = await prisma.account.create({
                data: {
                    accNumber: generateString(16),
                    amount: 1500,
                    cvv: generateString(3),
                    pin: body.pin,
                    userId: c.res.headers.get("id") || ""
                }
            });
            return bank;
        })

        success = true;
        return c.json({success, bank});
        
    } catch (error) {
        success = false;
        c.status(403);
        c.json({success, error: "Internal server error..."})
        
    }
});

accountRouter.get('/fetchAccount', async(c) => {
    const userId = c.res.headers.get("id") || "";
    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL
    }).$extends(withAccelerate());

    const account = await prisma.account.findFirst({
        where: {
            userId: userId
        },
        select: {
            accNumber: true,
            amount: true,
            cvv: true,
            pin: true
        }
    })
    let success = false;
    
    if(!account){
        c.status(403);
        return c.json({success, error:"No bank account..."})
    }
    success = true;
    return c.json({success, account});

})

accountRouter.get('/fetchBalance', async(c) => {
    const userId = c.res.headers.get("id") || "";
    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL
    }).$extends(withAccelerate());

    const balance = await prisma.$transaction(async(tx) => {
         const balance = await tx.account.findFirst({
            where:{
                userId:userId
            },
            select:{
                amount: true
            }
         })
         return balance
    })
    return c.json({success: true, balance})
});