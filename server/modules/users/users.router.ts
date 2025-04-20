export const usersRouter = router({
  getVolunteerProfile: protectedProcedure
    .query(async ({ ctx }) => {
      const userId = ctx.session.user.id;
      return await ctx.prisma.user.findUnique({
        where: { id: userId },
        select: {
          name: true,
          email: true,
          phone_number: true,
          bio: true,
          work_type: true,
          country: true,
          street_address: true,
          abn: true,
        },
      });
    }),

  updateVolunteerProfile: protectedProcedure
    .input(volunteerProfileSchema)
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;
      return await ctx.prisma.user.update({
        where: { id: userId },
        data: input,
      });
    }),
});