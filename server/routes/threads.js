router.get("/", async (req, res, next) => {
  try {
    const pageSize = 10;
    const page = Number(req.query.page) || 1;
    const skip = (page - 1) * pageSize;

    const [threads, total] = await Promise.all([
      prisma.thread.findMany({
        skip,
        take: pageSize,
        orderBy: { createdAt: "desc" },
        include: {
          author: {
            select: {
              name: true,
              avatarUrl: true,
            },
          },
          _count: {
            select: {
              comments: true,
            },
          },
        },
      }),
      prisma.thread.count(),
    ]);

    const hasMore = total > page * pageSize;

    res.json({
      threads,
      total,
      hasMore,
    });
  } catch (error) {
    next(error);
  }
});