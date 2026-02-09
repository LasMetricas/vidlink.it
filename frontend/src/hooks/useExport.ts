import { useState } from "react";

interface UserData {
  [key: string]: string | number; // Flexible structure to handle dynamic user data
}

interface VideoData {
  Title: string;
  Views: number;
  Likes: number;
  Cards: number;
}

interface CardData {
  Name: string;
  "Video Title": string;
  Clicks: number;
  Saved: number;
  Link: string;
}

interface ChartData {
  labels: string[];
  values: number[];
}

interface ErrorData {
  [key: string]: string | number | boolean | undefined;
}

type HandleCSV = (
  userData: UserData,
  videoData: VideoData[],
  cardData: CardData[],
  filename?: string,
  chartData?: {
    videoViews?: ChartData;
    cardClicks?: ChartData;
  }
) => void;

type HandleAdminCSV = (
  analyticsData: UserData,
  chartData: {
    signups?: ChartData;
    visitors?: ChartData;
    videoViews?: ChartData;
    cardClicks?: ChartData;
  },
  userData: Array<Record<string, string | number>>,
  errorData: ErrorData[],
  filename?: string
) => void;

const useExpert = () => {
  const [loading, setLoading] = useState<boolean>(false);

  const handleCSV: HandleCSV = (
    userData,
    videoData,
    cardData,
    filename = "export",
    chartData
  ) => {
    if (!userData && !videoData.length && !cardData.length) return;
    setLoading(true);

    let csvContent = "";

    // User summary
    csvContent += "User Summary\n";
    csvContent += Object.keys(userData).join(",") + "\n";
    csvContent += Object.values(userData).join(",") + "\n\n";

    // Video views chart data
    if (chartData?.videoViews && chartData.videoViews.labels.length > 0) {
      csvContent += "Video Views Chart Data\n";
      csvContent += "Period,Count\n";
      for (let i = 0; i < chartData.videoViews.labels.length; i++) {
        csvContent += `${chartData.videoViews.labels[i]},${chartData.videoViews.values[i]}\n`;
      }
      csvContent += "\n";
    }

    // Card clicks chart data
    if (chartData?.cardClicks && chartData.cardClicks.labels.length > 0) {
      csvContent += "Card Clicks Chart Data\n";
      csvContent += "Period,Count\n";
      for (let i = 0; i < chartData.cardClicks.labels.length; i++) {
        csvContent += `${chartData.cardClicks.labels[i]},${chartData.cardClicks.values[i]}\n`;
      }
      csvContent += "\n";
    }

    // Video data
    if (videoData.length) {
      csvContent += "Video Data\n";
      csvContent += Object.keys(videoData[0]).join(",") + "\n";
      csvContent +=
        videoData.map((video) => Object.values(video).join(",")).join("\n") +
        "\n\n";
    }

    // Card data
    if (cardData.length) {
      csvContent += "Card Data\n";
      csvContent += Object.keys(cardData[0]).join(",") + "\n";
      csvContent +=
        cardData.map((card) => Object.values(card).join(",")).join("\n") + "\n";
    }

    // Create blob and download
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = filename + ".csv";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setLoading(false);
  };

  const handleAdminCSV: HandleAdminCSV = (
    analyticsData,
    chartData,
    userData,
    errorData,
    filename = "admin_data"
  ) => {
    setLoading(true);

    let csvContent = "";

    // Total analytics
    csvContent += "Total Analytics Data\n";
    csvContent += Object.keys(analyticsData).join(",") + "\n";
    csvContent += Object.values(analyticsData).join(",") + "\n\n";

    // Signups chart data
    if (chartData.signups && chartData.signups.labels.length > 0) {
      csvContent += "Signups Chart Data\n";
      csvContent += "Period,Count\n";
      for (let i = 0; i < chartData.signups.labels.length; i++) {
        csvContent += `${chartData.signups.labels[i]},${chartData.signups.values[i]}\n`;
      }
      csvContent += "\n";
    }

    // Visitors chart data
    if (chartData.visitors && chartData.visitors.labels.length > 0) {
      csvContent += "Visitors Chart Data\n";
      csvContent += "Period,Count\n";
      for (let i = 0; i < chartData.visitors.labels.length; i++) {
        csvContent += `${chartData.visitors.labels[i]},${chartData.visitors.values[i]}\n`;
      }
      csvContent += "\n";
    }

    // Video views chart data
    if (chartData.videoViews && chartData.videoViews.labels.length > 0) {
      csvContent += "Video Views Chart Data\n";
      csvContent += "Period,Count\n";
      for (let i = 0; i < chartData.videoViews.labels.length; i++) {
        csvContent += `${chartData.videoViews.labels[i]},${chartData.videoViews.values[i]}\n`;
      }
      csvContent += "\n";
    }

    // Card clicks chart data
    if (chartData.cardClicks && chartData.cardClicks.labels.length > 0) {
      csvContent += "Card Clicks Chart Data\n";
      csvContent += "Period,Count\n";
      for (let i = 0; i < chartData.cardClicks.labels.length; i++) {
        csvContent += `${chartData.cardClicks.labels[i]},${chartData.cardClicks.values[i]}\n`;
      }
      csvContent += "\n";
    }

    // User data
    if (userData.length > 0) {
      csvContent += "User Data\n";
      csvContent += Object.keys(userData[0]).join(",") + "\n";
      csvContent +=
        userData.map((user) => Object.values(user).join(",")).join("\n") +
        "\n\n";
    }

    // Error data
    if (errorData.length > 0) {
      csvContent += "Error Data\n";
      csvContent += Object.keys(errorData[0]).join(",") + "\n";
      csvContent +=
        errorData
          .map((error) =>
            Object.values(error)
              .map((val) => {
                // Escape commas and newlines in strings
                if (typeof val === "string" && (val.includes(",") || val.includes("\n"))) {
                  return `"${val.replace(/"/g, '""')}"`;
                }
                return val ?? "";
              })
              .join(",")
          )
          .join("\n") + "\n";
    }

    // Create blob and download
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = filename + ".csv";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setLoading(false);
  };

  return { handleCSV, handleAdminCSV, loading };
};

export default useExpert;
