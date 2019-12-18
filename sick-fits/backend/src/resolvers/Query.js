const { forwardTo } = require('prisma-binding')

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
    console.log('Me gets called?????????')
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
};

module.exports = Query;
