const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { randomBytes } = require('crypto');
const { promisify } = require('util');

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

  signout(parent, args, ctx, info) {
    // clearCookie comes from the express package
    ctx.response.clearCookie('token');
    return { message: 'Goodbye' }
  },

  async requestReset(parent, args, ctx, info) {
    // Check if this is a real user
    const user = await ctx.db.query.user({ where: { email: args.email } })
    if(!user) {
      throw new Error(`No such user found for email ${args.email}`);
    }
    // Set a reset token and expiry on that user
    const randomBytesPromiseified = promisify(randomBytes);
    const resetToken = (await randomBytesPromiseified(20)).toString('hex');
    const resetTokenExpiry = Date.now() + ( 1000 * 60 * 60) // An hour from now
    const resp = await ctx.db.mutation.updateUser({
      where: {
        email: args.email
      },
      data: {
        resetToken,
        resetTokenExpiry
      }
    })
    
    return { message: 'Thanks!' }
    // Email the user the reset token
  },

  async resetPassword(parent, args, ctx, info) {
    // Check if the passwords match
    if(args.password !== args.confirmPassword) {
      throw new Error('Yo! Passwords don\'t match!')
    }
    // Check if it is a legit reset token and
    // Check if the token has expired
    const [user] = await ctx.db.query.users({
      where: {
        resetToken: args.resetToken,
        resetTokenExpiry_gte: Date.now() - ( 1000 * 60 * 60) // An hour from now
      }
    })
    if(!user) {
      throw new Error('This token is either invalid or expired');
    }
    // Hash the users new password
    const password = await bcrypt.hash(args.password, 10);
    // Save the new hashed password to the user and remove the old reset token field
    const updatedUser = await ctx.db.mutation.updateUser({
      where: {
        email: user.email
      },
      data: {
        password,
        resetToken: null,
        resetTokenExpiry: null
      }
    })
    
    // Generate the JWT
    const token = jwt.sign({ userId: updatedUser.id}, process.env.APP_SECRET)
    // Set the JWT cookie
    ctx.response.cookie('token', token, {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 * 365
    })
    

    // Return the user
    return updatedUser
  }
};

module.exports = Mutations;
