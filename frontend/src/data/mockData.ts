import { Video, User } from "@/types/video";

// Mock data for the application
export const mockVideos: Video[] = [
  {
    id: "1",
    title: "Building a Modern Web Application with React and TypeScript",
    description: "Learn how to build scalable web applications using React, TypeScript, and modern best practices. This comprehensive tutorial covers everything from setup to deployment.",
    thumbnailUrl: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&q=80",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
    channelName: "Tech Academy",
    channelAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=TechAcademy",
    viewCount: 125000,
    likeCount: 8500,
    uploadDate: "2024-01-15",
    userId: "user1"
  },
  {
    id: "2",
    title: "Complete Guide to Tailwind CSS - From Beginner to Pro",
    description: "Master Tailwind CSS with this complete guide. Learn utility-first CSS, responsive design, and how to build beautiful interfaces quickly.",
    thumbnailUrl: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&q=80",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
    channelName: "CSS Masters",
    channelAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=CSSMasters",
    viewCount: 89000,
    likeCount: 6200,
    uploadDate: "2024-01-20",
    userId: "user2"
  },
  {
    id: "3",
    title: "JavaScript ES6+ Features You Must Know",
    description: "Explore the latest JavaScript features including arrow functions, destructuring, async/await, and more. Perfect for modern web development.",
    thumbnailUrl: "https://images.unsplash.com/photo-1579468118864-1b9ea3c0db4a?w=800&q=80",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    channelName: "JavaScript Pro",
    channelAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=JSPro",
    viewCount: 234000,
    likeCount: 15000,
    uploadDate: "2024-01-10",
    userId: "user1"
  },
  {
    id: "4",
    title: "UI/UX Design Principles for Developers",
    description: "Learn essential UI/UX design principles that every developer should know. Create beautiful and user-friendly interfaces.",
    thumbnailUrl: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&q=80",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
    channelName: "Design Hub",
    channelAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=DesignHub",
    viewCount: 67000,
    likeCount: 4800,
    uploadDate: "2024-01-25",
    userId: "user2"
  },
  {
    id: "5",
    title: "Git and GitHub Workflow for Teams",
    description: "Master Git and GitHub for team collaboration. Learn branching strategies, pull requests, code reviews, and best practices.",
    thumbnailUrl: "https://images.unsplash.com/photo-1556075798-4825dfaaf498?w=800&q=80",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
    channelName: "Dev Tools",
    channelAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=DevTools",
    viewCount: 156000,
    likeCount: 11000,
    uploadDate: "2024-01-18",
    userId: "user1"
  },
  {
    id: "6",
    title: "Building RESTful APIs with Node.js and Express",
    description: "Create robust RESTful APIs using Node.js and Express. Learn routing, middleware, authentication, and database integration.",
    thumbnailUrl: "https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=800&q=80",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4",
    channelName: "Backend Masters",
    channelAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=BackendMasters",
    viewCount: 198000,
    likeCount: 13500,
    uploadDate: "2024-01-12",
    userId: "user2"
  },
  {
    id: "7",
    title: "React Hooks Deep Dive - useState, useEffect, and More",
    description: "Deep dive into React Hooks. Understand useState, useEffect, useContext, and custom hooks with practical examples.",
    thumbnailUrl: "https://images.unsplash.com/photo-1633356122102-3fe601e05bd2?w=800&q=80",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4",
    channelName: "React Experts",
    channelAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=ReactExperts",
    viewCount: 312000,
    likeCount: 22000,
    uploadDate: "2024-01-08",
    userId: "user1"
  },
  {
    id: "8",
    title: "Responsive Web Design with CSS Grid and Flexbox",
    description: "Master responsive web design using CSS Grid and Flexbox. Build layouts that work perfectly on all devices.",
    thumbnailUrl: "https://images.unsplash.com/photo-1547658719-da2b51169166?w=800&q=80",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4",
    channelName: "CSS Masters",
    channelAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=CSSMasters",
    viewCount: 145000,
    likeCount: 9800,
    uploadDate: "2024-01-22",
    userId: "user2"
  }
];

export const mockUsers: User[] = [
  {
    id: "user1",
    name: "Tech Academy",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=TechAcademy",
    email: "tech@academy.com",
    description: "Teaching modern web development and programming"
  },
  {
    id: "user2",
    name: "CSS Masters",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=CSSMasters",
    email: "css@masters.com",
    description: "Expert CSS tutorials and design tips"
  }
];

export let currentUser: User | null = null;

export const setCurrentUser = (user: User | null) => {
  currentUser = user;
};