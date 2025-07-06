"use client"

import type { UserStats } from "@/lib/types"
import { Card, CardContent } from "@/components/ui/card"
import { Trophy, Zap, Target } from "lucide-react"

interface StatsBannerProps {
  stats: UserStats
}

export default function StatsBanner({ stats }: StatsBannerProps) {
  return (
    <Card className="mb-6 bg-gradient-to-r from-teal-500 to-cyan-500 text-white shadow-lg">
      <CardContent className="p-4">
        <div className="grid grid-cols-3 gap-4 text-center" role="region" aria-label="User statistics">
          <div className="flex flex-col items-center">
            <Trophy className="w-6 h-6 mb-1" aria-hidden="true" />
            <div className="text-xl font-bold" aria-label={`Current level: ${stats.level}`}>
              Level {stats.level}
            </div>
            <div className="text-sm opacity-90">Current Level</div>
          </div>
          <div className="flex flex-col items-center">
            <Zap className="w-6 h-6 mb-1" aria-hidden="true" />
            <div className="text-xl font-bold" aria-label={`Total experience points: ${stats.totalXP}`}>
              {stats.totalXP}
            </div>
            <div className="text-sm opacity-90">Total XP</div>
          </div>
          <div className="flex flex-col items-center">
            <Target className="w-6 h-6 mb-1" aria-hidden="true" />
            <div className="text-xl font-bold" aria-label={`Total streaks: ${stats.totalStreaks}`}>
              {stats.totalStreaks}
            </div>
            <div className="text-sm opacity-90">Total Streaks</div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
