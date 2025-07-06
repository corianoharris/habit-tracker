# 🏆 Habit Tracker App

A comprehensive Next.js habit tracking application with gamification, motivational quotes, and health resources. Track your daily habits across Body, Mind, Work, Meals, and Recovery with XP rewards, streaks, and Kobe Bryant's wisdom.

## ✨ Features

### 🎯 Core Functionality
- **Full CRUD Operations**: Create, read, update, and delete habits, tasks, and meals
- **5 Organized Sections**: Body, Mind, Work, Meals, Recovery
- **Accordion UI**: Clean, mobile-first collapsible sections
- **XP System**: Earn experience points and level up
- **Streak Tracking**: Build consistency with streak counters
- **Time Slots**: Schedule items for Morning, Afternoon, Evening, or Custom times
- **LocalStorage Persistence**: No backend required - all data saved locally

### 🧠 Motivational System
- **Kobe Bryant Quotes**: Categorized motivational quotes (fitness, fear, mamba mentality, etc.)
- **Smart Quote Selection**: Context-aware quotes based on activity type
- **Achievement Celebrations**: Visual feedback for completed tasks

### 🍎 Health & Wellness
- **Anti-Inflammatory Food Tracker**: Interactive checklist of healthy foods
- **Body Metrics Calculator**: BMI and other health metrics
- **Nutrition Guidance**: Evidence-based food recommendations

### 🎮 Gamification
- **Level System**: Progress through levels based on XP earned
- **Visual Progress**: Stats dashboard with current level and achievements
- **Streak Rewards**: Bonus XP for maintaining consistency

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm, yarn, or pnpm

### Installation

1. **Download the code** from v0 using the "Download Code" button
2. **Install dependencies**:
   \`\`\`bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   \`\`\`

3. **Run the development server**:
   \`\`\`bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   \`\`\`

4. **Open your browser** and navigate to [http://localhost:3000](http://localhost:3000)

## 📱 Usage

### Adding Habits
1. Click the **+** button in any section (Body, Mind, Work, Meals, Recovery)
2. Fill out the form with habit details:
   - **Name**: What you want to track
   - **Type**: Habit, Task, or Meal
   - **Sets/Reps**: For fitness activities
   - **Quantity**: For meals and portions
   - **Time Slot**: When you plan to do it
   - **XP Reward**: Points earned when completed
   - **Notes**: Additional details

### Completing Habits
- Click the **✓** button to mark items as complete
- Earn XP and build streaks
- Get motivational Kobe quotes after completions
- Watch your level increase over time

### Tracking Progress
- View your stats in the top banner (Level, Total XP, Total Streaks)
- Monitor daily completion counts
- Build consistency with the streak system

### Health Resources
- Visit the **Anti-Inflammatory Food Guide** for nutrition tracking
- Use the **Body Metrics** calculator for health monitoring
- Check off foods you've consumed to track anti-inflammatory eating

## 🏗️ Project Structure

\`\`\`
habit-tracker-app/
├── app/
│   ├── page.tsx                 # Main dashboard
│   ├── resources/
│   │   └── page.tsx            # Food tracker & body metrics
│   └── globals.css             # Global styles
├── components/
│   ├── item-card.tsx           # Individual habit display
│   ├── item-form.tsx           # Add/edit habit form
│   ├── quote-banner.tsx        # Motivational quotes
│   ├── section-accordion.tsx   # Collapsible sections
│   └── stats-banner.tsx        # Progress dashboard
├── lib/
│   ├── quotes.ts               # Kobe Bryant quotes by category
│   ├── storage.ts              # LocalStorage utilities
│   └── types.ts                # TypeScript definitions
└── README.md
\`\`\`

## 🎨 Customization

### Adding New Quotes
Edit \`lib/quotes.ts\` to add quotes to existing categories or create new ones:

\`\`\`typescript
export const kobeBryantQuotes = {
  yourCategory: [
    "Your custom quote here",
    "Another inspiring quote"
  ]
}
\`\`\`

### Modifying Sections
Update the \`sections\` array in \`app/page.tsx\` to add or remove tracking categories.

### Styling
- Built with **Tailwind CSS** for easy customization
- Uses **shadcn/ui** components for consistent design
- Responsive design works on mobile and desktop

## 💾 Data Storage

All data is stored locally in your browser using LocalStorage:
- **Habits & Tasks**: \`trackerItems\`
- **User Stats**: \`userStats\`
- **Food Tracking**: \`foodTracking\`

**Note**: Data persists between sessions but is tied to your browser. Clear browser data will reset the app.

## 🔧 Technical Details

### Built With
- **Next.js 15**: React framework with App Router
- **TypeScript**: Type-safe development
- **Tailwind CSS**: Utility-first styling
- **shadcn/ui**: High-quality component library
- **Lucide React**: Beautiful icons

### Key Features
- **Server & Client Components**: Optimized rendering
- **LocalStorage Integration**: No backend required
- **Responsive Design**: Mobile-first approach
- **Type Safety**: Full TypeScript coverage
- **Modern React**: Hooks, Context, and best practices

## 🤝 Contributing

This is a personal habit tracker, but feel free to:
1. Fork the project
2. Create feature branches
3. Add new quote categories
4. Enhance the UI/UX
5. Add new tracking metrics

## 📄 License

This project is open source and available under the MIT License.

## 🙏 Acknowledgments

- **Kobe Bryant**: For the inspirational quotes and Mamba Mentality
- **shadcn**: For the beautiful UI components
- **Next.js Team**: For the amazing framework
- **Tailwind CSS**: For the utility-first styling approach

---

**Start tracking your habits today and unlock your potential! 🚀**

*"Great things come from hard work and perseverance. No excuses." - Kobe Bryant*
\`\`\`
\`\`\`

Now let's update the quotes system with your categorized structure:
