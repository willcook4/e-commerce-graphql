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
    // check if they have the permissions to see this order
    const ownsOrder = order.user.id === ctx.request.userId
    const hasPermissionToSeeOrder = ctx.request.user.permissions.includes('ADMIN');
    if(!ownsOrder || !hasPermissionToSeeOrder) {
      throw new Error('You cant see this, not your order or not admin')
    }
    // return the order
    return order
  }
};

module.exports = Query;
