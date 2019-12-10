

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
  }
};

module.exports = Mutations;
