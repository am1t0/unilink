import React from "react";
import './profilePosts.css'

export default function ProfilePosts() {
  const posts = [
    {
      _id: 1,
      description: "Exploring the beauty of the Himalayas! 🏔️✨",
      likeCount: 245,
      media: ["https://static.vecteezy.com/system/resources/previews/012/318/301/non_2x/cute-astronaut-with-peaceful-hands-sitting-on-rocket-astronaut-icon-concept-flat-cartoon-style-suitable-for-web-landing-page-banner-flyer-sticker-card-vector.jpg"],
      share: 34,
      tag: "Travel",
      user: {
        name: "Amit Pandey",
        profilePic: "https://i.imgur.com/8Q4eJL5.jpg",
      },
    },
    {
      _id: 2,
      description: "Completed my React project today! Feeling proud! 🚀🎉",
      likeCount: 180,
      media: ["https://static.vecteezy.com/system/resources/previews/012/318/301/non_2x/cute-astronaut-with-peaceful-hands-sitting-on-rocket-astronaut-icon-concept-flat-cartoon-style-suitable-for-web-landing-page-banner-flyer-sticker-card-vector.jpg"],
      share: 22,
      tag: "Tech",
      user: {
        name: "Sakshi Verma",
        profilePic: "https://i.imgur.com/1t4DlaP.jpg",
      },
    },
    {
      _id: 3,
      description: "Delicious homemade pizza 🍕. Anyone up for a slice?",
      likeCount: 130,
      media: ["https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQr1Bd7-fuenmrLFu2S7exfcg0f1pGOe-Q79A&s"],
      share: 18,
      tag: "Food",
      user: {
        name: "Rahul Singh",
        profilePic: "https://i.imgur.com/B6qRAsr.jpg",
      },
    },
    {
      _id: 4,
      description: "Had a great time with friends at the beach today! 🌊☀️",
      likeCount: 312,
      media: ["https://static.vecteezy.com/system/resources/previews/012/318/301/non_2x/cute-astronaut-with-peaceful-hands-sitting-on-rocket-astronaut-icon-concept-flat-cartoon-style-suitable-for-web-landing-page-banner-flyer-sticker-card-vector.jpg"],
      share: 45,
      tag: "Friends",
      user: {
        name: "Pooja Sharma",
        profilePic: "https://i.imgur.com/1FPtU7N.jpg",
      },
    },
    {
      _id: 5,
      description:
        "Just finished reading 'Atomic Habits' by James Clear 📚. Highly recommended!",
      likeCount: 98,
      media: [],
      share: 10,
      tag: "Books",
      user: {
        name: "Vikram Joshi",
        profilePic: "https://i.imgur.com/5bPvFev.jpg",
      },
    },
  ];

  return (
    <div>
      <div className="posts-grid">
        {posts.map((post) => (

          <div key={post._id} className="post-card">
            <div className="post-user">
              <img
                src={post.user.profilePic}
                alt={post.user.name}
                className="user-pic"
              />
              <div className="user-info">
                <h4>{post.user.name}</h4>
                <span className="post-tag">{post.tag}</span>
              </div>
            </div>

            {post.media.length > 0 && (
              <img
                src={post.media[0]}
                alt="Post media"
                className="post-media"
              />
            )}

            <p className="post-description">{post.description?.slice(0,50)+"..."}</p>

            <div className="post-stats">
              <span>👍 {post.likeCount}</span>
              <span>🔄 {post.share}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
