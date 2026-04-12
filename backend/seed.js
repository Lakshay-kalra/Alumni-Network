const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const Event = require('./models/Event');
const Announcement = require('./models/Announcement');
const bcrypt = require('bcryptjs');

dotenv.config();

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB Connected for Seeding');

    // Clear existing data (optional, but good for a fresh start)
    await User.deleteMany();
    await Event.deleteMany();
    await Announcement.deleteMany();

    // Create Admin User
    const salt = await bcrypt.genSalt(10);
    const adminHashedPassword = await bcrypt.hash('admin@123', salt);
    const hashedPassword = await bcrypt.hash('password123', salt);

    const adminUser = await User.create({
      name: 'Admin User',
      email: 'lakshay@admin.in',
      password: adminHashedPassword,
      role: 'admin',
      profilePicture: 'https://ui-avatars.com/api/?name=Admin+User&background=0D8ABC&color=fff',
      bio: 'System Administrator for CampusConnect',
    });

    // Create Dummy Students & Alumni
    const dummyUsers = [
      {
        name: 'Lakshay Kumar',
        email: 'lakshay@college.edu',
        password: hashedPassword,
        role: 'student',
        branch: 'Computer Science',
        graduationYear: 2026,
        profilePicture: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Lakshay',
        bio: 'Passionate about full-stack development and open source.',
        skills: ['React', 'Node.js', 'MongoDB'],
        socialLinks: { github: 'https://github.com', linkedin: 'https://linkedin.com' }
      },
      {
        name: 'Priya Sharma',
        email: 'priya@college.edu',
        password: hashedPassword,
        role: 'alumni',
        branch: 'Information Technology',
        graduationYear: 2022,
        profilePicture: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Priya',
        bio: 'Software Engineer at Google. Always happy to mentor juniors!',
        skills: ['System Design', 'Python', 'Go'],
        socialLinks: { linkedin: 'https://linkedin.com', twitter: 'https://twitter.com' }
      },
      {
        name: 'Rahul Roy',
        email: 'rahul@college.edu',
        password: hashedPassword,
        role: 'student',
        branch: 'Electronics',
        graduationYear: 2025,
        profilePicture: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Rahul',
        bio: 'Hardware enthusiast diving into IoT and robotics.',
        skills: ['C++', 'Arduino', 'IoT'],
      },
      {
        name: 'Ananya Gupta',
        email: 'ananya@college.edu',
        password: hashedPassword,
        role: 'alumni',
        branch: 'Computer Science',
        graduationYear: 2020,
        profilePicture: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Ananya',
        bio: 'Startup Founder. Building the next big thing in EduTech.',
        skills: ['Leadership', 'JavaScript', 'AWS'],
        socialLinks: { linkedin: 'https://linkedin.com', github: 'https://github.com' }
      }
    ];

    const users = await User.insertMany(dummyUsers);

    // Create Dummy Announcements
    const dummyAnnouncements = [
      {
        title: 'Alumni Meet 2026 Registration Open!',
        message: 'We are thrilled to announce the upcoming Alumni Meet. Reconnect with your batchmates, network with seniors, and enjoy a day filled with nostalgia. Register now on the events page to secure your spot!',
        imageUrl: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&q=80',
        author: adminUser._id
      },
      {
        title: 'New Campus Placement Drive - Tech Giants',
        message: 'Top tech companies including Microsoft and Amazon are visiting campus next month for the 2025 batch. Ensure your profiles are updated and resumes are ready. A prep session will be held this weekend.',
        imageUrl: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=800&q=80',
        author: adminUser._id
      },
      {
        title: 'Campus Hackathon: CodeFest 2026',
        message: 'Gear up for the biggest 48-hour coding marathon of the year! Form your teams of 4 and start brainstorming. Prizes worth $5000 up for grabs.',
        imageUrl: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800&q=80',
        author: adminUser._id
      }
    ];

    await Announcement.insertMany(dummyAnnouncements);

    // Create Dummy Events
    const dummyEvents = [
      {
        title: 'Tech Talk: The Future of AI',
        description: 'Join us for an insightful session with our distinguished alumni, Priya Sharma (Google), discussing the latest trends in Generative AI and how to prepare for an AI-driven industry.',
        date: new Date(new Date().getTime() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
        location: 'Main Auditorium',
        imageUrl: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800&q=80',
        creator: adminUser._id,
        attendees: [users[0]._id, users[2]._id]
      },
      {
        title: 'Resume Review Workshop',
        description: 'Get your resume reviewed by industry experts and HR professionals. This interactive workshop will help you highlight your strengths effectively for upcoming placement drives.',
        date: new Date(new Date().getTime() + 3 * 24 * 60 * 60 * 1000), // 3 days from now
        location: 'Virtual (Zoom Link)',
        imageUrl: 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=800&q=80',
        creator: users[3]._id, // Ananya
        attendees: [users[0]._id]
      },
      {
        title: 'Annual Sports Day 2026',
        description: 'Cheer for your department in the Annual Sports Day! Events include Athletics, Football, Basketball, and Tug of War. Let the best team win.',
        date: new Date(new Date().getTime() + 14 * 24 * 60 * 60 * 1000), // 14 days from now
        location: 'College Sports Ground',
        imageUrl: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=800&q=80',
        creator: adminUser._id,
        attendees: [users[0]._id, users[1]._id, users[2]._id, users[3]._id]
      }
    ];

    await Event.insertMany(dummyEvents);

    console.log('Database successfully seeded with Announcements, Events, and dummy Users!');
    process.exit();
  } catch (error) {
    console.error('Seeding Error:', error);
    process.exit(1);
  }
};

seedData();
