import expressAsyncHandler from "express-async-handler";
import { CustomRequest } from "../middleware/authMiddleware";
import { Response } from "express";
import Video from "../models/videoModel";
import Card from "../models/cardModel";
import User from "../models/userModel";

const getPastDate = (duration: string) => {
  const date = new Date();
  switch (duration) {
    case "year":
      // 12 months ago
      date.setMonth(date.getMonth() - 12);
      break;
    case "month":
      // 30 days ago
      date.setDate(date.getDate() - 30);
      break;
    case "week":
      date.setDate(date.getDate() - 7);
      break;
    case "ever":
      // Very old date to get all data
      date.setFullYear(2000);
      break;
  }
  return date;
};

// Aggregate data by day or month for charts
const aggregateChartData = (
  data: { createdAt: Date }[],
  duration: string,
  durationAgo: Date
): { labels: string[]; values: number[] } => {
  const now = new Date();
  const labels: string[] = [];
  const values: number[] = [];

  if (duration === "month") {
    // Aggregate by day
    const daysMap = new Map<string, number>();
    
    // Init 30 days with 0
    for (let i = 29; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      const dateKey = date.toISOString().split("T")[0];
      daysMap.set(dateKey, 0);
      labels.push(dateKey);
    }

    // Count per day
    data.forEach((item) => {
      const itemDate = new Date(item.createdAt);
      if (itemDate >= durationAgo) {
        const dateKey = itemDate.toISOString().split("T")[0];
        // Only include last 30 days
        if (daysMap.has(dateKey)) {
          const currentCount = daysMap.get(dateKey) || 0;
          daysMap.set(dateKey, currentCount + 1);
        }
      }
    });

    // Fill values
    labels.forEach((label) => {
      values.push(daysMap.get(label) || 0);
    });
  } else if (duration === "ever") {
    // Aggregate by day or month - show all available data
    if (data.length > 0) {
      // Find earliest and latest dates
      const dates = data.map((item) => new Date(item.createdAt));
      const earliestDate = new Date(Math.min(...dates.map((d) => d.getTime())));
      const latestDate = new Date(Math.max(...dates.map((d) => d.getTime())));
      
      // Calculate days difference
      const daysDiff = Math.ceil((latestDate.getTime() - earliestDate.getTime()) / (1000 * 60 * 60 * 24));
      
      // If more than 30 days, aggregate by month
      if (daysDiff > 30) {
        const monthsMap = new Map<string, number>();
        const monthNames = ["January", "February", "March", "April", "May", "June", 
                           "July", "August", "September", "October", "November", "December"];
        
        const formatMonthKey = (date: Date): string => {
          const year = date.getFullYear();
          const month = date.getMonth() + 1;
          const monthStr = month < 10 ? `0${month}` : `${month}`;
          return `${year}-${monthStr}`;
        };
        
        const formatMonthLabel = (date: Date): string => {
          const year = date.getFullYear();
          const month = date.getMonth();
          return `${monthNames[month]} ${year}`;
        };
        
        // Get all months from earliest to latest
        const currentMonth = new Date(earliestDate);
        currentMonth.setDate(1);
        currentMonth.setHours(0, 0, 0, 0);
        
        const endMonth = new Date(latestDate);
        endMonth.setDate(1);
        endMonth.setHours(0, 0, 0, 0);
        
        while (currentMonth <= endMonth) {
          const monthKey = formatMonthKey(currentMonth);
          const monthLabel = formatMonthLabel(currentMonth);
          monthsMap.set(monthKey, 0);
          labels.push(monthLabel);
          currentMonth.setMonth(currentMonth.getMonth() + 1);
        }
        
        // Count per month
        data.forEach((item) => {
          const itemDate = new Date(item.createdAt);
          const monthKey = formatMonthKey(itemDate);
          if (monthsMap.has(monthKey)) {
            const currentCount = monthsMap.get(monthKey) || 0;
            monthsMap.set(monthKey, currentCount + 1);
          }
        });
        
        // Fill values - map month labels back to keys
        let monthIndex = 0;
        const tempDate = new Date(earliestDate);
        tempDate.setDate(1);
        tempDate.setHours(0, 0, 0, 0);
        
        labels.forEach((label) => {
          const monthKey = formatMonthKey(tempDate);
          values.push(monthsMap.get(monthKey) || 0);
          tempDate.setMonth(tempDate.getMonth() + 1);
        });
      } else {
        // Aggregate by day if 30 days or less
        const daysMap = new Map<string, number>();
        
        // Show all days from earliest to latest
        for (let d = new Date(earliestDate); d <= latestDate; d.setDate(d.getDate() + 1)) {
          const dateKey = d.toISOString().split("T")[0];
          daysMap.set(dateKey, 0);
          labels.push(dateKey);
        }
        
        // Count per day
        data.forEach((item) => {
          const itemDate = new Date(item.createdAt);
          const dateKey = itemDate.toISOString().split("T")[0];
          if (daysMap.has(dateKey)) {
            const currentCount = daysMap.get(dateKey) || 0;
            daysMap.set(dateKey, currentCount + 1);
          }
        });
        
        // Fill values
        labels.forEach((label) => {
          values.push(daysMap.get(label) || 0);
        });
      }
    } else {
      // No data - show last 30 days with zeros
      const daysMap = new Map<string, number>();
      for (let i = 29; i >= 0; i--) {
        const date = new Date(now);
        date.setDate(date.getDate() - i);
        const dateKey = date.toISOString().split("T")[0];
        daysMap.set(dateKey, 0);
        labels.push(dateKey);
      }
      labels.forEach((label) => {
        values.push(0);
      });
    }
  } else if (duration === "year") {
    // Aggregate by month
    const monthsMap = new Map<string, number>();
    const monthNames = ["January", "February", "March", "April", "May", "June", 
                       "July", "August", "September", "October", "November", "December"];
    
    // Format month key for internal mapping
    const formatMonthKey = (date: Date): string => {
      const year = date.getFullYear();
      const month = date.getMonth() + 1;
      const monthStr = month < 10 ? `0${month}` : `${month}`;
      return `${year}-${monthStr}`;
    };
    
    // Format month label for display
    const formatMonthLabel = (date: Date): string => {
      const year = date.getFullYear();
      const month = date.getMonth();
      return `${monthNames[month]} ${year}`;
    };
    
    // Init 12 months with 0 (from 11 months ago to current)
    for (let i = 11; i >= 0; i--) {
      const date = new Date(now);
      date.setMonth(date.getMonth() - i);
      // Set to first day for consistent month calculation
      date.setDate(1);
      date.setHours(0, 0, 0, 0);
      const monthKey = formatMonthKey(date);
      const monthLabel = formatMonthLabel(date);
      monthsMap.set(monthKey, 0);
      labels.push(monthLabel);
    }

    // Count per month - include all data from months in map
    data.forEach((item) => {
      const itemDate = new Date(item.createdAt);
      const monthKey = formatMonthKey(itemDate);
      // Include if month is in map (last 12 months including current)
      if (monthsMap.has(monthKey)) {
        const currentCount = monthsMap.get(monthKey) || 0;
        monthsMap.set(monthKey, currentCount + 1);
      }
    });

    // Fill values - map month labels back to keys
    labels.forEach((label, index) => {
      const date = new Date(now);
      date.setMonth(date.getMonth() - (11 - index));
      date.setDate(1);
      date.setHours(0, 0, 0, 0);
      const monthKey = formatMonthKey(date);
      values.push(monthsMap.get(monthKey) || 0);
    });
  }

  return { labels, values };
};

// Get data as creator
export const getDataCreator = expressAsyncHandler(
  async (req: CustomRequest, res: Response) => {
    const duration = req.header("x-duration");
    if (!req.userId) {
      res.status(400).json({ message: "No provided userId." });
      return;
    }
    if (!duration) {
      res.status(400).json({ message: "No provided duration." });
      return;
    }
    try {
      let userInfo;
      let videos;
      let cards;
      let gainedFollowers;
      let lostFollowers;

      const durationAgo = getPastDate(duration);
      [videos, cards, userInfo] = await Promise.all([
        Video.find({
          userId: req.userId,
          createdAt: { $gte: durationAgo },
        })
          .select("title videoLink info views likes card watchTime createdAt")
          .sort({ views: -1 })
          .lean(),
        Card.find({
          userId: req.userId,
          createdAt: { $gte: durationAgo },
        })
          .select("title name clicks saved link no createdAt")
          .sort({ clicks: -1 })
          .lean(),
        User.findById(req.userId)
          .select(
            "followers profileViews savedCardsCreator cardsClicksCreator videoViews picture userName role"
          )
          .lean(),
      ]);
      if (userInfo?.followers) {
        userInfo.followers = userInfo.followers.filter(
          (follower) => follower.time > durationAgo
        );
        gainedFollowers = userInfo?.followers.filter(
          (key) => key.create || 0
        ).length;
        lostFollowers = userInfo?.followers.filter(
          (key) => !key.create || 0
        ).length;
      }
      if (userInfo?.savedCardsCreator) {
        userInfo.savedCardsCreator = userInfo.savedCardsCreator.filter(
          (card) => card.time > durationAgo
        );
      }
      if (userInfo?.cardsClicksCreator) {
        userInfo.cardsClicksCreator = userInfo.cardsClicksCreator.filter(
          (card) => card > durationAgo
        );
      }

      // Filter video views by duration
      let filteredVideoViews: Date[] = [];
      if (userInfo?.videoViews) {
        filteredVideoViews = userInfo.videoViews.filter(
          (viewDate) => viewDate > durationAgo
        );
      }

      // Aggregate video views
      const videoViewsChartData = aggregateChartData(
        filteredVideoViews.map((date) => ({ createdAt: date })),
        duration,
        durationAgo
      );

      // Aggregate card clicks
      const cardClicksChartData = aggregateChartData(
        (userInfo?.cardsClicksCreator || []).map((date) => ({ createdAt: date })),
        duration,
        durationAgo
      );

      res.status(200).json({
        message: "Data found.",
        videos,
        cards,
        chartData: {
          labels: videoViewsChartData.labels,
          values: videoViewsChartData.values,
        },
        videoViewsChartData: {
          labels: videoViewsChartData.labels,
          values: videoViewsChartData.values,
        },
        cardClicksChartData: {
          labels: cardClicksChartData.labels,
          values: cardClicksChartData.values,
        },
        userInfo: {
          ...userInfo,
          gainedFollowers,
          lostFollowers,
          followers: [],
          savedCards: userInfo?.savedCardsCreator?.length || 0,
          cardsClicks: userInfo?.cardsClicksCreator?.length || 0,
          isAdmin: userInfo?.role === "admin",
        },
      });
    } catch (error: any) {
      console.log("error", error);
      res.status(500).json({ message: error.message });
    }
  }
);

// Get data as viewer
export const getDataViewer = expressAsyncHandler(
  async (req: CustomRequest, res: Response) => {
    const duration = req.header("x-duration");
    if (!req.userId) {
      res.status(400).json({ message: "No provided userId." });
      return;
    }
    if (!duration) {
      res.status(400).json({ message: "No provided duration." });
      return;
    }
    try {
      let data;
      data = await User.findById(req.userId)
        .select("likeVideosViewer cardsClicksViewer savedCardsViewer")
        .lean();
      if (duration !== "ever") {
        const durationAgo = getPastDate(duration);
        data = await User.findById(req.userId)
          .select("likeVideosViewer cardsClicksViewer savedCardsViewer ")
          .lean();
        if (data?.likeVideosViewer) {
          data.likeVideosViewer = data.likeVideosViewer.filter(
            (key) => key.time > durationAgo
          );
        }
        if (data?.cardsClicksViewer) {
          data.cardsClicksViewer = data.cardsClicksViewer.filter(
            (key) => key > durationAgo
          );
        }
        if (data?.savedCardsViewer) {
          data.savedCardsViewer = data.savedCardsViewer.filter(
            (key) => key.time > durationAgo
          );
        }
      }
      res.status(200).json({
        message: "Data found.",
        userInfo: {
          likeVideos: data?.likeVideosViewer?.length || 0,
          cardsClicks: data?.cardsClicksViewer?.length || 0,
          savedCards: data?.savedCardsViewer?.length || 0,
        },
      });
    } catch (error: any) {
      console.log("error", error);
      res.status(500).json({ message: error.message });
    }
  }
);

// Get data as admin
export const getDataAdmin = expressAsyncHandler(
  async (req: CustomRequest, res: Response) => {
    const duration = req.header("x-duration");
    if (!req.userId) {
      res.status(400).json({ message: "No provided userId." });
      return;
    }
    if (!duration) {
      res.status(400).json({ message: "No provided duration." });
      return;
    }

    try {
      const user = await User.findById(req.userId).select("role").lean();
      if (user?.role !== "admin") {
        res.status(400).json({ message: "Not an admin." });
        return;
      }

      const durationAgo = getPastDate(duration);

      const [users, signupUsers, signinUsers, videos, cards, allUsers] =
        await Promise.all([
          User.find({
            $or: [
              { createdAt: { $gt: durationAgo } },
              { loginAt: { $elemMatch: { $gt: durationAgo } } },
            ],
          })
            .select(
              "email status signupAt loginAt totalVideos totalCards videoViews cardsClicksViewer createdAt"
            )
            .lean(),
          User.find({ createdAt: { $gt: durationAgo } })
            .select(
              "email status signupAt loginAt totalVideos totalCards videoViews cardsClicksViewer createdAt"
            )
            .lean(),
          User.find({ loginAt: { $elemMatch: { $gt: durationAgo } } })
            .select(
              "email status signupAt loginAt totalVideos totalCards videoViews cardsClicksViewer createdAt"
            )
            .lean(),
          Video.find({ createdAt: { $gt: durationAgo } }).lean(),
          Card.find({ createdAt: { $gt: durationAgo } }).lean(),
          // Get all users with videoViews and cardsClicksViewer for aggregation
          User.find({})
            .select("videoViews cardsClicksViewer createdAt lastLoginAt")
            .lean(),
        ]);

      const visitors = signinUsers.length;
      const videoss = videos.length;
      const cardss = cards.length;

      const videoViews = videos.reduce((sum, v) => sum + (v.views || 0), 0);
      const cardClicks = cards.reduce((sum, c) => sum + (c.clicks || 0), 0);
      const signups = signupUsers.length;

      // Aggregate signups
      const signupsChartData = aggregateChartData(
        signupUsers.map((u) => ({ createdAt: (u as any).createdAt })),
        duration,
        durationAgo
      );

      // Aggregate visitors - filter out null/undefined
      const visitorsWithLogin = signinUsers.filter((u) => (u as any).lastLoginAt);
      const visitorsChartData = aggregateChartData(
        visitorsWithLogin.map((u) => {
          const loginDate = (u as any).lastLoginAt;
          return { createdAt: loginDate instanceof Date ? loginDate : new Date(loginDate) };
        }),
        duration,
        durationAgo
      );

      // Aggregate video views from all users
      const allVideoViews: Date[] = [];
      allUsers.forEach((user) => {
        if (user.videoViews && Array.isArray(user.videoViews) && user.videoViews.length > 0) {
          user.videoViews.forEach((viewDate) => {
            if (viewDate) {
              const date = viewDate instanceof Date ? viewDate : new Date(viewDate);
              if (!isNaN(date.getTime())) {
                if (duration === "ever" || date > durationAgo) {
                  allVideoViews.push(date);
                }
              }
            }
          });
        }
      });
      const videoViewsChartData = aggregateChartData(
        allVideoViews.map((date) => ({ createdAt: date })),
        duration,
        durationAgo
      );

      // Aggregate card clicks from all users
      const allCardClicks: Date[] = [];
      allUsers.forEach((user) => {
        if (user.cardsClicksViewer && Array.isArray(user.cardsClicksViewer) && user.cardsClicksViewer.length > 0) {
          user.cardsClicksViewer.forEach((clickDate) => {
            if (clickDate) {
              const date = clickDate instanceof Date ? clickDate : new Date(clickDate);
              if (!isNaN(date.getTime())) {
                if (duration === "ever" || date > durationAgo) {
                  allCardClicks.push(date);
                }
              }
            }
          });
        }
      });
      const cardClicksChartData = aggregateChartData(
        allCardClicks.map((date) => ({ createdAt: date })),
        duration,
        durationAgo
      );

      // Debug logging
      console.log("Admin Chart Data:", {
        signups: signupsChartData.labels.length,
        visitors: visitorsChartData.labels.length,
        videoViews: videoViewsChartData.labels.length,
        cardClicks: cardClicksChartData.labels.length,
        allVideoViewsCount: allVideoViews.length,
        allCardClicksCount: allCardClicks.length,
      });

      // Map fields to match frontend
      const formattedUsers = users.map((u) => ({
        _id: u._id.toString(),
        email: u.email,
        status: u.status,
        signupAt: u.createdAt,
        lastLoginAt: u.loginAt[0] || u.createdAt,
        videos: u.totalVideos || 0,
        cards: u.totalCards || 0,
      }));

      res.status(200).json({
        status: 200,
        message: "All Found",
        users: formattedUsers,
        chartData: {
          labels: signupsChartData.labels,
          values: signupsChartData.values,
        },
        signupsChartData: {
          labels: signupsChartData.labels,
          values: signupsChartData.values,
        },
        visitorsChartData: {
          labels: visitorsChartData.labels,
          values: visitorsChartData.values,
        },
        videoViewsChartData: {
          labels: videoViewsChartData.labels,
          values: videoViewsChartData.values,
        },
        cardClicksChartData: {
          labels: cardClicksChartData.labels,
          values: cardClicksChartData.values,
        },
        totalInfo: {
          visitors,
          videos: videoss,
          cards: cardss,
          videoViews,
          cardClicks,
          signups,
          usersAvgTime: 0,
          visitorsAvgTime: 0,
        },
      });
    } catch (error: any) {
      console.log("error", error);
      res.status(500).json({ message: error.message });
    }
  }
);
