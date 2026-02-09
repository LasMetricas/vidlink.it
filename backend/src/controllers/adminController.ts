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
    // Aggregate by day (30 days)
    const daysMap = new Map<string, number>();
    
    // Initialize all 30 days with 0
    for (let i = 29; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      const dateKey = date.toISOString().split("T")[0];
      daysMap.set(dateKey, 0);
      labels.push(dateKey);
    }

    // Count data points per day
    data.forEach((item) => {
      const itemDate = new Date(item.createdAt);
      if (itemDate >= durationAgo) {
        const dateKey = itemDate.toISOString().split("T")[0];
        // Only include if it's within the last 30 days
        if (daysMap.has(dateKey)) {
          const currentCount = daysMap.get(dateKey) || 0;
          daysMap.set(dateKey, currentCount + 1);
        }
      }
    });

    // Fill values array
    labels.forEach((label) => {
      values.push(daysMap.get(label) || 0);
    });
  } else if (duration === "ever") {
    // Aggregate by day or month - show ALL available data
    if (data.length > 0) {
      // Find the earliest and latest dates in the data
      const dates = data.map((item) => new Date(item.createdAt));
      const earliestDate = new Date(Math.min(...dates.map((d) => d.getTime())));
      const latestDate = new Date(Math.max(...dates.map((d) => d.getTime())));
      
      // Calculate days difference
      const daysDiff = Math.ceil((latestDate.getTime() - earliestDate.getTime()) / (1000 * 60 * 60 * 24));
      
      // If data spans more than 30 days, aggregate by month
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
        
        // Get all unique months from earliest to latest
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
        
        // Count data points per month
        data.forEach((item) => {
          const itemDate = new Date(item.createdAt);
          const monthKey = formatMonthKey(itemDate);
          if (monthsMap.has(monthKey)) {
            const currentCount = monthsMap.get(monthKey) || 0;
            monthsMap.set(monthKey, currentCount + 1);
          }
        });
        
        // Fill values array - map month labels back to month keys
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
        // Aggregate by day if data spans 30 days or less
        const daysMap = new Map<string, number>();
        
        // Show all days from earliest to latest
        for (let d = new Date(earliestDate); d <= latestDate; d.setDate(d.getDate() + 1)) {
          const dateKey = d.toISOString().split("T")[0];
          daysMap.set(dateKey, 0);
          labels.push(dateKey);
        }
        
        // Count data points per day
        data.forEach((item) => {
          const itemDate = new Date(item.createdAt);
          const dateKey = itemDate.toISOString().split("T")[0];
          if (daysMap.has(dateKey)) {
            const currentCount = daysMap.get(dateKey) || 0;
            daysMap.set(dateKey, currentCount + 1);
          }
        });
        
        // Fill values array
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
    // Aggregate by month (12 months)
    const monthsMap = new Map<string, number>();
    const monthNames = ["January", "February", "March", "April", "May", "June", 
                       "July", "August", "September", "October", "November", "December"];
    
    // Helper to format month key (for internal mapping)
    const formatMonthKey = (date: Date): string => {
      const year = date.getFullYear();
      const month = date.getMonth() + 1;
      const monthStr = month < 10 ? `0${month}` : `${month}`;
      return `${year}-${monthStr}`;
    };
    
    // Helper to format month label (for display)
    const formatMonthLabel = (date: Date): string => {
      const year = date.getFullYear();
      const month = date.getMonth();
      return `${monthNames[month]} ${year}`;
    };
    
    // Initialize all 12 months with 0 (from 11 months ago to current month)
    for (let i = 11; i >= 0; i--) {
      const date = new Date(now);
      date.setMonth(date.getMonth() - i);
      // Set to first day of month to ensure consistent month calculation
      date.setDate(1);
      date.setHours(0, 0, 0, 0);
      const monthKey = formatMonthKey(date);
      const monthLabel = formatMonthLabel(date);
      monthsMap.set(monthKey, 0);
      labels.push(monthLabel);
    }

    // Count data points per month - include all data from the months in our map
    data.forEach((item) => {
      const itemDate = new Date(item.createdAt);
      const monthKey = formatMonthKey(itemDate);
      // Include if the month is in our map (last 12 months including current)
      if (monthsMap.has(monthKey)) {
        const currentCount = monthsMap.get(monthKey) || 0;
        monthsMap.set(monthKey, currentCount + 1);
      }
    });

    // Fill values array - map month labels back to month keys
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
          // Get all users with videoViews, cardsClicksViewer, and loginAt for aggregation
          User.find({})
            .select("videoViews cardsClicksViewer createdAt loginAt")
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

      // Aggregate visitors - collect all login dates from all users
      const allLoginDates: Date[] = [];
      allUsers.forEach((user) => {
        if (user.loginAt && Array.isArray(user.loginAt) && user.loginAt.length > 0) {
          user.loginAt.forEach((loginDate) => {
            if (loginDate) {
              const date = loginDate instanceof Date ? loginDate : new Date(loginDate);
              if (!isNaN(date.getTime())) {
                if (duration === "ever" || date > durationAgo) {
                  allLoginDates.push(date);
                }
              }
            }
          });
        }
      });
      const visitorsChartData = aggregateChartData(
        allLoginDates.map((date) => ({ createdAt: date })),
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

      // Map fields to match frontend
      const formattedUsers = users.map((u) => {
        const loginAtArray = (u as any).loginAt;
        const lastLoginAt = loginAtArray && Array.isArray(loginAtArray) && loginAtArray.length > 0
          ? loginAtArray[loginAtArray.length - 1] // Get the most recent login
          : u.createdAt;
        return {
          _id: u._id.toString(),
          email: u.email,
          status: u.status || "active", // Default to "active" if status is missing
          signupAt: u.createdAt,
          lastLoginAt: lastLoginAt instanceof Date ? lastLoginAt : new Date(lastLoginAt),
          videos: u.totalVideos || 0,
          cards: u.totalCards || 0,
        };
      });

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

// Handle user status
export const handleUserStatus = expressAsyncHandler(
  async (req: CustomRequest, res: Response) => {
    if (!req.userId) {
      res.status(400).json({ message: "No provided userId." });
      return;
    }
    const { userId } = req.body;
    try {
      const requester = await User.findById(req.userId).select("role").lean();
      if (requester?.role !== "admin") {
        res.status(400).json({ message: "Not an admin." });
        return;
      }

      const targetUser = await User.findById(userId).select("status").lean();
      if (!targetUser) {
        res.status(404).json({ message: "Target user not found." });
        return;
      }

      const newStatus = targetUser.status === "blocked" ? "active" : "blocked";
      await User.findByIdAndUpdate(userId, { status: newStatus });

      res.status(200).json({
        message: `User status updated to ${newStatus}.`,
        userStatus: newStatus,
      });
    } catch (error: any) {
      console.log("error", error);
      res.status(500).json({ message: error.message });
    }
  }
);
