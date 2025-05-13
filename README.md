# Tick

Tick is a powerful and intuitive application built with Next.js 14, MongoDB, and TypeScript, designed to help you effortlessly manage all your subscriptions in one place. Say goodbye to unexpected charges and hello to a clear overview of your recurring expenses!

## ✨ Features

- **📝 Add & Track Subscriptions:** Easily add subscriptions from various platforms, specifying different durations (monthly, yearly, etc.) and plans.
- **📊 Unified Dashboard:** Get a comprehensive overview of your finances with a dashboard displaying:
  - Total monthly expenses.
  - Upcoming subscription renewal dates.
  - Total number of active subscriptions.
  - A list of your most recently added subscriptions.
- **📄 Detailed Subscription View:** A dedicated page to view all your subscriptions in detail.
- **✏️ Edit & Delete:** Modify subscription details or delete them as needed with ease.
- **🔍 Robust Search & Sort:** Quickly find subscriptions using powerful search functionality. Sort your subscriptions by:
  - Date added
  - Price
  - Subscription category
  - And more!
- **⚙️ Bulk Actions:**
  - **Delete All:** Option to delete all your subscriptions at once.
  - **Export to Excel:** Export your subscription data into an Excel format for offline access or further analysis.
- **📈 Insightful Analytics:** A unique analytics page providing visual insights into your spending habits:
  - View subscriptions grouped by categories.
  - Identify the categories you spend the most on.
- **👤 Beautiful Profile Page:**
  - View your user data.
  - Update your profile picture.
  - Modify other personal details.

## 🚀 Tech Stack

- **Frontend:** Next.js 14, React, Tailwind CSS
- **Backend:** Next.js API Routes
- **Database:** MongoDB (with Mongoose ODM)
- **Language:** TypeScript
- **Authentication:** NextAuth.js
- **Image Management:** Cloudinary (for profile pictures)

## Screenshots 📸

_Dashboard View:_
![Dashboard Screenshot](/public/tick-dashboard.png)

_Analytics View:_
![Analytics Screenshot](/public/tick-analytics.png)

## Getting Started 🏁

Follow these instructions to set up Tick locally for development or personal use.

### Prerequisites

- Node.js (v18 or later recommended)
- npm, yarn, or pnpm
- MongoDB (either a local instance or a cloud-hosted version like MongoDB Atlas)

### Installation & Setup

1. **Clone the repository:**

    ```bash
    git clone [https://github.com/Shubbu03/tick.git](https://github.com/Shubbu03/tick.git)
    cd tick
    ```

2. **Install dependencies:**

    ```bash
    npm install
    # or
    yarn install
    # or
    pnpm install
    ```

3. **Set up Environment Variables:**
    Create a `.env.local` file in the root of your project and add the following environment variables. Obtain these keys from your Supabase dashboard, Google Cloud Console, and a secure secret generator.

    ```env
    #Connection string to mongodb
    MONGODB_URI="your_mongodb_connection_string"

    # A secret key for NextAuth.js (generate a strong random string)
    # You can generate one here: [https://generate-secret.vercel.app/32](https://generate-secret.vercel.app/32)
    NEXTAUTH_SECRET=your_nextauth_secret

    #Cloudinary required variables
    CLOUDINARY_CLOUD_NAME="your_cloudinary_cloud_name"

    CLOUDINARY_API_KEY="your_cloudinary_api_key"

    CLOUDINARY_API_SECRET="your_cloudinary_api_secret"
    ```

## Contributing 🤝

Contributions are what make the open-source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

If you have a suggestion that would make this better, please fork the repo and create a pull request. You can also simply open an issue with the tag "enhancement".
Don't forget to give the project a star! Thanks again!

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

peace✌️

---
