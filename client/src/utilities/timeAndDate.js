const mp = {
    "1": "Jan",
    "2": "Feb",
    "3": "Mar",
    "4": "Apr",
    "5": "May",
    "6": "Jun",
    "7": "Jul",
    "8": "Aug",
    "9": "Sep",
    "10": "Oct",
    "11": "Nov",
    "12": "Dec"
  };

export function formatDate(dateString) {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = mp[date.getMonth() + 1];
    const year = date.getFullYear();
  
    return `${day} ${month} ${year}`;
}

export function getTimeAgo(dateString) {
    const now = new Date();
    const past = new Date(dateString);
    const diffInSeconds = Math.floor((now - past) / 1000);
  
    if (diffInSeconds < 60) {
      return `${diffInSeconds}s`;
    }
  
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) {
      return `${diffInMinutes}m`;
    }
  
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) {
      return `${diffInHours}h`;
    }
  
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) {
      return `${diffInDays}d`;
    }
  
    // Beyond a week, show actual date
    return formatDate(dateString); // e.g., "4/20/2025"
  }


  