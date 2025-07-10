# Sushi Web App with Firebase Integration

This is a sushi restaurant web application with full Firebase integration for authentication, database, and storage, implementing a specific database schema for Users and Rewards management.

## Features

- **User Authentication**: Sign up, login, and logout functionality
- **User Profiles**: Edit profile information, manage rewards points, and view favorites
- **Rewards System**: Browse and redeem rewards using points
- **Real-time Data**: Live updates using Firebase Firestore
- **File Storage**: Profile pictures and other assets stored in Firebase Storage

## Firebase Services Used

- **Firebase Authentication**: User management and authentication
- **Firebase Firestore**: NoSQL database for storing user data, rewards, and transactions
- **Firebase Storage**: File storage for images and assets
- **Firebase Analytics**: Usage analytics (configured but optional)

## Project Structure

```
WebApp/
├── JavaScript/
│   ├── firebase-init.js      # Firebase configuration and initialization
│   ├── auth.js              # Authentication logic
│   ├── ProfileSPA.js        # Profile management
│   ├── rewards.js           # Rewards system
│   └── Database.js          # Centralized database services
├── HTML/
│   ├── Login.html           # Login/Register page
│   ├── Home.html            # Main application page
│   ├── Profile.html         # Profile management page
│   ├── rewards.html         # Rewards listing page
│   └── reward_detail.html   # Individual reward details
├── CSS/                     # Stylesheets
├── Assets/                  # Static assets
└── package.json             # Dependencies
```

## Firebase Configuration

The Firebase configuration is set up in `JavaScript/firebase-init.js` with the following services:

- **Authentication**: Email/password authentication
- **Firestore**: Database for user data, rewards, redemptions, and notifications
- **Storage**: File storage for profile pictures and other assets
- **Analytics**: Usage tracking (optional)

## Database Schema

The application implements the following database schema with Firebase Firestore:

### Users Collection
```javascript
{
  id: string,              // INTEGER Primary Key (Firebase UID)
  name: string,            // String
  email: string,           // String Unique
  password: string,        // String (Encrypted in production)
  address: string,         // String (Optional)
  phone: string,           // String (Optional)
  rewardsPoints: number,   // INTEGER
  createdAt: timestamp,
  updatedAt: timestamp
}
```

### Rewards Collection
```javascript
{
  id: string,              // STRING Primary Key
  name: string,            // STRING
  description: string,     // STRING
  points: number,          // INTEGER
  imagePath: string,       // STRING
  validity: number,        // INTEGER
  maxRedemptions: number,  // INTEGER
  createdAt: timestamp
}
```

### userRewardRedemptions Collection
```javascript
{
  id: string,              // STRING Primary Key
  userId: string,          // STRING (Foreign Key → Users.id)
  rewardId: string,        // STRING (Foreign Key → Rewards.id)
  rewardName: string,      // STRING
  pointsSpent: string,     // STRING
  redeemAt: timestamp      // DateTime
}
```

### Notifications Collection
```javascript
{
  id: string,              // INTEGER Primary Key
  userId: string,          // INTEGER Foreign Key → Users(id)
  date: timestamp,         // DATE
  message: string,         // String
  isRead: number           // INTEGER (0 = unread, 1 = read)
}
```

### Favourites Collection
```javascript
{
  id: string,              // INTEGER Primary Key
  userId: string,          // INTEGER Foreign Key → Users(id)
  itemId: string,          // INTEGER Foreign Key → MenuItems(id)
  addedAt: timestamp
}
```

## Database Relationships

- **Users** → **userRewardRedemptions**: One-to-many (A user can have multiple redemptions)
- **Users** → **Notifications**: One-to-many (A user can receive multiple notifications)
- **Users** → **Favourites**: One-to-many (A user can favorite multiple menu items)
- **Rewards** → **userRewardRedemptions**: One-to-many (A reward can have multiple redemption records)

## Getting Started

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Firebase Setup**:
   - Create a Firebase project at [Firebase Console](https://console.firebase.google.com/)
   - Enable Authentication (Email/Password)
   - Create a Firestore database
   - Enable Storage
   - Copy your Firebase config to `JavaScript/firebase-init.js`

3. **Run the Application**:
   - Serve the files using a local web server
   - Open `HTML/Login.html` to start

## Usage

1. **Authentication**: Users can register with email/password or login with existing credentials
2. **Profile Management**: Users can edit their profile, manage rewards points, and view favorites
3. **Rewards System**: Users can browse available rewards and redeem them using points
4. **Real-time Updates**: All data updates are reflected in real-time across the application

## Security Rules

Make sure to set up appropriate Firestore security rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can only access their own data
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Anyone can read rewards
    match /rewards/{rewardId} {
      allow read: if true;
      allow write: if false; // Only admin can modify rewards
    }
    
    // Users can only access their own redemptions
    match /userRewardRedemptions/{redemptionId} {
      allow read, write: if request.auth != null && 
        resource.data.userId == request.auth.uid;
    }
    
    // Users can only access their own notifications
    match /notifications/{notificationId} {
      allow read, write: if request.auth != null && 
        resource.data.userId == request.auth.uid;
    }
    
    // Users can only access their own favourites
    match /favourites/{favouriteId} {
      allow read, write: if request.auth != null && 
        resource.data.userId == request.auth.uid;
    }
  }
}
```

## Database Services

The application provides centralized database services in `JavaScript/Database.js`:

- **UserService**: User management operations
- **RewardsService**: Rewards management operations
- **UserRewardRedemptionsService**: Redemption tracking
- **NotificationsService**: Notification management
- **FavouritesService**: Favourites management
- **StorageService**: File upload/download operations
- **RealtimeService**: Real-time data listeners

## Dependencies

- Firebase v11.10.0
- Modern web browser with ES6 module support

## Browser Support

This application requires a modern browser that supports:
- ES6 Modules
- Async/Await
- Fetch API
- Local Storage

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License. 