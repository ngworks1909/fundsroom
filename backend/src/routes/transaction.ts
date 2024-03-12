import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import { Hono } from "hono";
import { fetchUser } from "../middlewares/fetchUser";

export const tsxnRouter = new Hono<{
  Bindings: {
    DATABASE_URL: string;
    JWT_SECRET: string;
  };
}>();

tsxnRouter.use(fetchUser);

// tsxnRouter.put('/makePayment', async(c) => {
//     const body = await c.req.json();
// const senderUserId = c.res.headers.get("id") || "";
//     const receiverUserId = body.receiverUserId;
// const prisma = new PrismaClient({
//     datasourceUrl: c.env.DATABASE_URL
// }).$extends(withAccelerate());

//     //create transaction
//     let success = false;
//     let status = 0;
//     try {
        // const sender: any = await prisma.account.findFirst({
        //     where:{
        //         userId: senderUserId
        //     },
        //     select: {
        //       accId: true
        //     }
        // })
        // const receiver: any = await prisma.account.findFirst({
        //     where: {
        //         userId: receiverUserId
        //     },
        //     select: {
        //       accId: true
        //     }
        // })
        // if(!sender){
        //   throw new Error('Invlid user...');
        // }
        // if(!receiver){
        //   throw new Error('Invlid receiver...');
        // }
        // const senderAcc = await prisma.account.update({
        //     data: {
        //       amount: {
        //         decrement: body.tsxnAmount,
        //       },
        //     },
        //     where: {
        //       accId: sender,
        //     },
        //   })
          // status = 1
          // if (senderAcc.amount < body.tsxnAmount) {
          //   status = 2
          //   throw new Error(`Insufficient funds...`)
          // }
          //  await prisma.account.update({
          //   data: {
          //     amount: {
          //       increment: body.tsxnAmount,
          //     },
          //   },
          //   where: {
          //     accId: receiver,
          //   },
          // })
          // status = 3;
          // success = true;
          // return c.json({success, message: "Transaction successful..."});

//     } catch (error) {
//         success = false;
//         if(status === 1){
//           const sender: any = await prisma.account.findFirst({
//             where:{
//                 userId: senderUserId
//             },
//             select: {
//               accId: true
//             }
//         })
//           //refund
//           await prisma.refund.create({
//              data: {
//                accId: sender,
//                amount: body.tsxnAmount
//              }
//           });

//         }
//         c.status(403);
//         return c.json({success, status, error: "Transaction failed..."})

//     }
// })

tsxnRouter.put("/makePayment", async (c, next) => {
  const body = await c.req.json();
  const senderUserId = c.res.headers.get("id") || "";
  const receiverUserId = body.receiverUserId;
  const tsxnAmount = parseFloat(body.tsxnAmount);
  const pin = body.pin;
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());
  let success = false;
  let status = 0
  try {
    const sender: any = await prisma.account.findFirst({
      where:{
          userId: senderUserId
      },
      select: {
        accId: true
      }
  })
  const fetchPin = await prisma.account.findUnique({
    where: {
      accId: sender.accId,
    },
    select: {
      pin: true
    }
  })
  const receiver: any = await prisma.account.findFirst({
      where: {
          userId: receiverUserId
      },
      select: {
        accId: true
      }
  });
  console.log(sender, receiver)
  if(!sender.accId){
    throw new Error('Invlid user...');
  }
  if(!receiver.accId){
    throw new Error('Invlid receiver...');
  }
  

  const senderBalance = await prisma.account.findUnique({
    where: {
      accId: sender.accId,
    },
    select:{
      amount: true
    }
  })

  if ( senderBalance && senderBalance.amount < body.tsxnAmount) {
    status = 1
    throw new Error(`Insufficient funds...`)
  }

  await prisma.account.update({
    data: {
      amount: {
        decrement: tsxnAmount,
      },
    },
    where: {
      accId: sender.accId,
    },
  })
  status = 2;

  await prisma.account.update({
    data: {
      amount: {
        increment: tsxnAmount,
      },
    },
    where: {
      accId: receiver.accId,
    },
  })
  console.log("added");
  status = 3;
  success = true;
  return c.json({success, message: "Transaction successful..."});

  } catch (error) {
        success = false;
        if(status === -1){
          c.status(400);
          c.json({success, error: "Invalid pin..."})
        }
        if(status ===1){
          c.status(400);
          c.json({success, error: "Insufficient funds..."})
        }
        if(status === 2 || status === 3){
          const sender: any = await prisma.account.findFirst({
            where:{
                userId: senderUserId
            },
            select: {
              accId: true
            }
        })
          //refund
          await prisma.refund.create({
             data: {
               accId: sender.accId,
               amount: tsxnAmount
             }
          });

        }
        c.status(500);
        return c.json({success, error: "Transaction failed..."})
  }
});
