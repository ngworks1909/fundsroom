import { PrismaClient } from '@prisma/client/edge';
import { withAccelerate } from '@prisma/extension-accelerate';
import { Hono } from "hono";
import { sign } from 'hono/jwt';
import { fetchUser } from '../middlewares/fetchUser';

export const userRouter = new Hono<{
    Bindings: {
        DATABASE_URL: string;
        JWT_SECRET: string;
    }
}>();

userRouter.post('/createUser', async (c) => {
    const body = await c.req.json();
    const prisma = new PrismaClient({
      datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate())
    let success = false;
    try {
      const [existingUser] = await prisma.$transaction([
        prisma.user.findUnique({
          where:{
            email: body.email
          }
        })
      ])

      if(existingUser){
        c.status(400);
        success = false
        return c.json({success, error: "User already exists..."})
      }
      const [user] = await prisma.$transaction([
        prisma.user.create({
            data: {
                email: body.email,
                password: body.password,
                username: body.username,
                mobile: body.mobile
              }
        })
      ])
      const token = await sign({
        id: user.userId
      }, c.env.JWT_SECRET);
      success = true;
      return c.json({success, token});
    } catch(e) {
        success = false
        c.status(500);
        return c.json({success, error: "Internal server error..."})
    }
  })


userRouter.post('/login', async(c) => {
  const body = await c.req.json();
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL
  }).$extends(withAccelerate());

  let success = false;
  try {
    const [user] = await prisma.$transaction([
      prisma.user.findFirst({
        where: {
          email: body.email,
          password: body.password
        }
      })
    ])
  
    if (!user) {
      c.status(403);
      return c.json({
        error: "Incorrect email or password"
      })
    }
  
    const token = await sign({
      id: user.userId
    }, c.env.JWT_SECRET);
    success = true;
    return c.json({success, token, username:user.username});

  } catch (error) {
    success = false;
    c.status(500);
    c.json({success, error: "Internal server error..."});
  }
});

userRouter.get('/getUsers',fetchUser, async(c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL
  }).$extends(withAccelerate());
  const id = c.res.headers.get("id") || "";
  let success = true;
  try {
    const userslist = await prisma.user.findMany({
      where: {
        NOT: {
          userId: id
        }
      },
      select: {
        userId: true,
        username: true,
        mobile: true
      }
    });
  
  
    return c.json({success, userslist});
  } catch (error) {
     success = false;
     c.status(500);
     return c.json({success, error: "Internal server error..."})
  }
});