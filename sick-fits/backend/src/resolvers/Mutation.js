const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const Mutations = {
  // createDog(parent, args, ctx, info) {
  //   global.dogs = global.dogs || [];
  //   console.log('args: ', args)

  //   // create a new dog
  //   const newDog = { name: args.name };
  //   global.dogs.push(newDog);
  //   return newDog;
  // }

  async createItem(parent, args, ctx, info) {
    // TODO: check if they are logged in
    const item = await ctx.db.mutation.createItem({
      data: {
         ...args 
      },
    }, info);

    return item;
  },

  updateItem(parent, args, ctx, info) {
    // first take a copy of the updates
    const updates = { ...args };
    // remove the id key:value pair from the updates object
    delete updates.id;
    // run the update method
    return ctx.db.mutation.updateItem({
      data: updates,
      where: { 
        id: args.id 
      }
    },
    info
    );
  },

  async deleteItem(parent, args, ctx, info) {
    const where = { id: args.id };
    // find the item
    const item = await ctx.db.query.item({ where }, `{id title}`);
    // check if they own the item or have permissions to delete this item
    // TODO
    // delete the item
    return ctx.db.mutation.deleteItem({ where }, info);
  },

  async signup(parent, args, ctx, info) {
    args.email = args.email.toLowerCase();
    // hash the password
    const password = await bcrypt.hash(args.password, 10) // Password, Salt
    // create the user in the database
    const user = await ctx.db.mutation.createUser({data: {
      ...args,
      password,
      permissions: { set: ['USER'] }
    }}, info)
    // create the JWT token for the user
    const token = jwt.sign({ userId: user.id}, process.env.APP_SECRET);
    // Set the JWT as a cookie on the response
    ctx.response.cookie('token', token, {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 * 365 // 1 year cookie 
    })
    // return the user as response
    return user
  },

  async signin(parent, { email, password }, ctx, info) {
    // check if there is a matching user with that email
    const user = await ctx.db.query.user({ where: { email }});
    if(!user) {
      throw new Error(`No such user found for email ${email}`);
    }
    // check if the provided password is correct
    const valid = await bcrypt.compare(password, user.password);
    if(!valid) {
      throw new Error("Invalid password");
    }
    // generate the JWT token
    const token = jwt.sign({ userId: user.id}, process.env.APP_SECRET);
    // Set the cookie with the token
    ctx.response.cookie('token', token, {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 * 365,
    })
    // return the user
    return user
  },
};

module.exports = Mutations;
