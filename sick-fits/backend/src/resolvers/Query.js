const { forwardTo } = require('prisma-binding');
const { hasPermission } = require('../utils');

const Query = {
  items: forwardTo('db'),
  // async items(parent, args, ctx, info) {
  //   const items = await ctx.db.query.items();
  //  
  //  return items;
  // }
  item: forwardTo('db'),
  itemsConnection: forwardTo('db'),

  me(parent, args, ctx, info) {
    // Check if there is a current user ID
    if(!ctx.request.userId) {
      return null; 
    }
    return ctx.db.query.user({
      where: {
        id: ctx.request.userId
      }
    }, info);
  },

  async users(parent, args, ctx, info) {
    // Check if they are logged in
    if(!ctx.request.userId) {
      throw new Error('You must be logged in!'); 
    }
    // Check if the user has permissions to query all the users
    hasPermission(ctx.request.user, ['ADMIN', 'PERMISSIONUPDATE']);
    
    // if they do, then query all the users
    return ctx.db.query.users({}, info)
  },
  async order(parent, args, ctx, info) {
    // Check if they are logged in
    if(!ctx.request.userId) {
      throw new Error('You must be logged in!'); 
    }
    // query the current order
    const order = await ctx.db.query.order({
      where: {
        id: args.id
      }
    }, info)
    
    if(!order) {
      throw new Error('No order found')
    }

    // check if they have the permissions to see this order
    let ownsOrder = false // default to false 
    if(ctx.request.userId) {
      ownsOrder = order.user.id === ctx.request.userId
    }
    
    let hasPermissionToSeeOrder = false // default to false
    if(ctx.request.user) {
      hasPermissionToSeeOrder = ctx.request.user.permissions.includes('ADMIN');  
    }
    console.log('ownsOrder: ', ownsOrder)
    console.log('hasPermissionToSeeOrder: ', hasPermissionToSeeOrder)
    if(!ownsOrder && !hasPermissionToSeeOrder) {
      throw new Error('You cant see this, not your order or not admin')
    }
    // return the order
    return order
  },
  // Return the orders of a provided user
  async orders(parent, args, ctx, info) {
    // Check if they are logged in
    if(!ctx.request.userId) {
      throw new Error('You must be logged in!'); 
    }
    
    // query orders
    const orders = await ctx.db.query.orders({
      where: {
        user: {
          id: ctx.request.userId
        }
      }}, info)
    return orders
  }
};

module.exports = Query;
