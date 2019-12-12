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
};

module.exports = Query;
