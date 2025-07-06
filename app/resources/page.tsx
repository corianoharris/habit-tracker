"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  ArrowLeft,
  Calculator,
  TrendingUp,
  Target,
  Scale,
  Activity,
  Heart,
  Shield,
  Zap,
  Info,
  BarChart3,
  Apple,
  Fish,
  Leaf,
  Pill,
  Coffee,
  Beef,
  Egg,
  ChevronDown,
  ChevronRight,
} from "lucide-react"
import Link from "next/link"

interface FoodItem {
  id: string
  name: string
  category: string
  checked: boolean
}

interface BodyMetrics {
  height: string
  weight: string
  age: string
  gender: "male" | "female" | ""
  weightUnit: "kg" | "lbs"
  heightUnit: "cm" | "ft"
}

const antiInflammatoryFoods: Omit<FoodItem, "checked">[] = [
  // Leafy Greens
  { id: "spinach", name: "Spinach", category: "Leafy Greens" },
  { id: "kale", name: "Kale", category: "Leafy Greens" },
  { id: "arugula", name: "Arugula", category: "Leafy Greens" },
  { id: "swiss-chard", name: "Swiss Chard", category: "Leafy Greens" },

  // Berries
  { id: "blueberries", name: "Blueberries", category: "Berries" },
  { id: "strawberries", name: "Strawberries", category: "Berries" },
  { id: "blackberries", name: "Blackberries", category: "Berries" },
  { id: "cherries", name: "Cherries", category: "Berries" },

  // Fatty Fish
  { id: "salmon", name: "Salmon", category: "Fatty Fish" },
  { id: "mackerel", name: "Mackerel", category: "Fatty Fish" },
  { id: "sardines", name: "Sardines", category: "Fatty Fish" },
  { id: "anchovies", name: "Anchovies", category: "Fatty Fish" },

  // Nuts & Seeds
  { id: "walnuts", name: "Walnuts", category: "Nuts & Seeds" },
  { id: "almonds", name: "Almonds", category: "Nuts & Seeds" },
  { id: "chia-seeds", name: "Chia Seeds", category: "Nuts & Seeds" },
  { id: "flaxseeds", name: "Flaxseeds", category: "Nuts & Seeds" },

  // Spices & Herbs
  { id: "turmeric", name: "Turmeric", category: "Spices & Herbs" },
  { id: "ginger", name: "Ginger", category: "Spices & Herbs" },
  { id: "garlic", name: "Garlic", category: "Spices & Herbs" },
  { id: "cinnamon", name: "Cinnamon", category: "Spices & Herbs" },

  // Healthy Fats
  { id: "olive-oil", name: "Extra Virgin Olive Oil", category: "Healthy Fats" },
  { id: "avocados", name: "Avocados", category: "Healthy Fats" },
  { id: "coconut-oil", name: "Coconut Oil", category: "Healthy Fats" },

  // Lean Poultry
  { id: "skinless-chicken-breast", name: "Skinless Chicken Breast", category: "Lean Poultry" },
  { id: "turkey-white-meat", name: "Turkey (white meat)", category: "Lean Poultry" },

  // Eggs
  { id: "pasture-raised-eggs", name: "Pasture-raised eggs", category: "Eggs" },
  { id: "omega-3-eggs", name: "Omega-3 enriched eggs", category: "Eggs" },

  // Plant-Based Proteins
  { id: "lentils", name: "Lentils", category: "Plant-Based Proteins" },
  { id: "chickpeas", name: "Chickpeas", category: "Plant-Based Proteins" },
  { id: "black-beans", name: "Black Beans", category: "Plant-Based Proteins" },
  { id: "hemp-seeds", name: "Hemp seeds", category: "Plant-Based Proteins" },
  { id: "chia-seeds-protein", name: "Chia seeds", category: "Plant-Based Proteins" },
  { id: "quinoa", name: "Quinoa", category: "Plant-Based Proteins" },
  { id: "tempeh", name: "Tempeh", category: "Plant-Based Proteins" },
  { id: "tofu-organic", name: "Tofu (organic)", category: "Plant-Based Proteins" },

  // Drinks
  { id: "baking-soda-water", name: "Baking Soda and Water", category: "Drinks" },
  { id: "parsley-ginger-juice", name: "Parsley and Ginger Green Juice", category: "Drinks" },
  { id: "lemon-turmeric-tonic", name: "Lemon and Turmeric Tonic", category: "Drinks" },
  { id: "bone-broth", name: "Bone Broth", category: "Drinks" },
  { id: "functional-smoothie", name: "Functional Food Smoothie", category: "Drinks" },
  { id: "matcha-tea", name: "Matcha Tea", category: "Drinks" },
  { id: "greens-berry-smoothie", name: "Greens and Berry Smoothie", category: "Drinks" },
]

const categoryIcons = {
  "Leafy Greens": Leaf,
  Berries: Apple,
  "Fatty Fish": Fish,
  "Nuts & Seeds": Apple,
  "Spices & Herbs": Pill,
  "Healthy Fats": Apple,
  "Lean Poultry": Beef,
  Eggs: Egg,
  "Plant-Based Proteins": Leaf,
  Drinks: Coffee,
}

export default function ResourcesPage() {
  const [foodItems, setFoodItems] = useState<FoodItem[]>([])
  const [bodyMetrics, setBodyMetrics] = useState<BodyMetrics>({
    height: "",
    weight: "",
    age: "",
    gender: "",
    weightUnit: "kg",
    heightUnit: "cm",
  })
  const [bmi, setBmi] = useState<number | null>(null)
  const [bmiCategory, setBmiCategory] = useState<string>("")
  const [isFoodTrackerOpen, setIsFoodTrackerOpen] = useState(false) // Add collapsible state

  useEffect(() => {
    // Load food tracking data from localStorage
    const savedFoods = localStorage.getItem("foodTracking")
    let existingFoods: FoodItem[] = []

    if (savedFoods) {
      existingFoods = JSON.parse(savedFoods)
    }

    // Create a map of existing foods by ID for quick lookup
    const existingFoodsMap = new Map(existingFoods.map((food) => [food.id, food]))

    // Merge existing foods with the complete list, preserving checked status
    const mergedFoods = antiInflammatoryFoods.map((food) => {
      const existingFood = existingFoodsMap.get(food.id)
      return {
        ...food,
        checked: existingFood ? existingFood.checked : false,
      }
    })

    setFoodItems(mergedFoods)

    // Save the merged list back to localStorage to include new items
    localStorage.setItem("foodTracking", JSON.stringify(mergedFoods))

    // Load body metrics
    const savedMetrics = localStorage.getItem("bodyMetrics")
    if (savedMetrics) {
      const parsed = JSON.parse(savedMetrics)
      setBodyMetrics({
        ...parsed,
        weightUnit: parsed.weightUnit || "kg",
        heightUnit: parsed.heightUnit || "cm",
      })
    }
  }, [])

  const saveFoodItems = (items: FoodItem[]) => {
    setFoodItems(items)
    localStorage.setItem("foodTracking", JSON.stringify(items))
  }

  const saveBodyMetrics = (metrics: BodyMetrics) => {
    setBodyMetrics(metrics)
    localStorage.setItem("bodyMetrics", JSON.stringify(metrics))
  }

  const handleFoodToggle = (id: string) => {
    const updatedItems = foodItems.map((item) => (item.id === id ? { ...item, checked: !item.checked } : item))
    saveFoodItems(updatedItems)
  }

  // Convert weight to kg for calculations
  const getWeightInKg = () => {
    const weight = Number.parseFloat(bodyMetrics.weight)
    if (bodyMetrics.weightUnit === "lbs") {
      return weight * 0.453592 // lbs to kg
    }
    return weight
  }

  // Convert height to cm for calculations
  const getHeightInCm = () => {
    const height = Number.parseFloat(bodyMetrics.height)
    if (bodyMetrics.heightUnit === "ft") {
      return height * 30.48 // ft to cm
    }
    return height
  }

  // Convert kg to display unit
  const convertKgToDisplayUnit = (kg: number) => {
    if (bodyMetrics.weightUnit === "lbs") {
      return Math.round(kg * 2.20462 * 10) / 10 // kg to lbs
    }
    return Math.round(kg * 10) / 10
  }

  const calculateBMI = () => {
    const heightInM = getHeightInCm() / 100 // Convert cm to m
    const weightInKg = getWeightInKg()

    if (heightInM > 0 && weightInKg > 0) {
      const bmiValue = weightInKg / (heightInM * heightInM)
      setBmi(Math.round(bmiValue * 10) / 10)

      if (bmiValue < 18.5) setBmiCategory("Underweight")
      else if (bmiValue < 25) setBmiCategory("Normal weight")
      else if (bmiValue < 30) setBmiCategory("Overweight")
      else setBmiCategory("Obese")
    }
  }

  // Updated helper function to show progress comparison for any height
  const getProgressComparison = () => {
    if (!bmi || !bodyMetrics.height || !bodyMetrics.weight) return null

    const targetBMI = 22 // Optimal BMI for reference
    const currentHeightInM = getHeightInCm() / 100 // Convert cm to meters
    const targetWeightInKg = targetBMI * currentHeightInM * currentHeightInM // kg
    const currentWeightInKg = getWeightInKg()

    if (currentHeightInM > 0 && currentWeightInKg > 0) {
      const weightDiffInKg = currentWeightInKg - targetWeightInKg
      return {
        targetWeight: convertKgToDisplayUnit(targetWeightInKg),
        weightDiff: convertKgToDisplayUnit(Math.abs(weightDiffInKg)),
        isAboveTarget: weightDiffInKg > 0,
        unit: bodyMetrics.weightUnit,
      }
    }
    return null
  }

  const resetFoodTracking = () => {
    const resetItems = foodItems.map((item) => ({ ...item, checked: false }))
    saveFoodItems(resetItems)
  }

  const groupedFoods = foodItems.reduce(
    (acc, food) => {
      if (!acc[food.category]) acc[food.category] = []
      acc[food.category].push(food)
      return acc
    },
    {} as Record<string, FoodItem[]>,
  )

  const checkedCount = foodItems.filter((item) => item.checked).length
  const completionPercentage = Math.round((checkedCount / foodItems.length) * 100)

  const progressComparison = getProgressComparison()

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-6 max-w-4xl">
        <header className="mb-6">
          <Link href="/">
            <Button
              variant="outline"
              className="mb-4 bg-transparent border-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:ring-offset-2"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Tracker
            </Button>
          </Link>
          <h1 className="text-3xl font-bold mb-2 flex items-center gap-2">
            <Activity className="w-8 h-8 text-red-500" />
            Health & Wellness Hub
          </h1>
          <p className="text-gray-600">Track anti-inflammatory foods and monitor your body metrics</p>
        </header>

        {/* Food Tracking Progress */}
        <Card className="mb-6 shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-green-600" />
                Today's Progress
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={resetFoodTracking}
                className="border-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:ring-offset-2 bg-transparent"
              >
                Reset Day
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">
                {checkedCount}/{foodItems.length}
              </div>
              <div className="text-lg mb-4">Anti-Inflammatory Foods & Drinks Consumed</div>
              <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
                <div
                  className="bg-green-500 h-3 rounded-full transition-all duration-300"
                  style={{ width: `${completionPercentage}%` }}
                ></div>
              </div>
              <div className="text-sm text-gray-600">{completionPercentage}% Complete</div>
            </div>
          </CardContent>
        </Card>

        {/* Anti-Inflammatory Food Tracker - Now Collapsible */}
        <Card className="mb-6 shadow-sm">
          <CardHeader className="p-0">
            <button
              className="w-full p-4 text-left hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:ring-offset-2 transition-colors rounded-t-lg"
              onClick={() => setIsFoodTrackerOpen(!isFoodTrackerOpen)}
              aria-expanded={isFoodTrackerOpen}
              aria-controls="food-tracker-content"
            >
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <Apple className="w-5 h-5 text-green-600" />
                  Anti-Inflammatory Food & Drink Tracker
                </span>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-500 font-normal">
                    {checkedCount}/{foodItems.length} consumed
                  </span>
                  {isFoodTrackerOpen ? (
                    <ChevronDown className="w-5 h-5" aria-hidden="true" />
                  ) : (
                    <ChevronRight className="w-5 h-5" aria-hidden="true" />
                  )}
                </div>
              </CardTitle>
            </button>
          </CardHeader>

          {isFoodTrackerOpen && (
            <CardContent id="food-tracker-content" role="region" aria-labelledby="food-tracker-header">
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {Object.entries(groupedFoods).map(([category, foods]) => {
                  const IconComponent = categoryIcons[category as keyof typeof categoryIcons] || Apple
                  return (
                    <div key={category}>
                      <h3
                        className={`font-semibold mb-3 flex items-center gap-2 ${
                          category === "Drinks"
                            ? "text-teal-600"
                            : category === "Lean Poultry"
                              ? "text-orange-600"
                              : category === "Eggs"
                                ? "text-yellow-600"
                                : category === "Plant-Based Proteins"
                                  ? "text-purple-600"
                                  : "text-green-600"
                        }`}
                      >
                        <IconComponent className="w-4 h-4" />
                        {category}
                      </h3>
                      <div className="space-y-2">
                        {foods.map((food) => (
                          <div key={food.id} className="flex items-center space-x-2">
                            <Checkbox
                              id={food.id}
                              checked={food.checked}
                              onCheckedChange={() => handleFoodToggle(food.id)}
                            />
                            <Label
                              htmlFor={food.id}
                              className={`cursor-pointer ${food.checked ? "line-through text-gray-500" : ""}`}
                            >
                              {food.name}
                            </Label>
                          </div>
                        ))}
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          )}
        </Card>

        {/* Body Metrics Calculator */}
        <Card className="mb-6 shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calculator className="w-5 h-5" />
              <Scale className="w-5 h-5" />
              Body Metrics Calculator
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <Label htmlFor="height">Height</Label>
                    <Input
                      id="height"
                      type="number"
                      value={bodyMetrics.height}
                      onChange={(e) => {
                        const newMetrics = { ...bodyMetrics, height: e.target.value }
                        saveBodyMetrics(newMetrics)
                      }}
                      placeholder={bodyMetrics.heightUnit === "cm" ? "175" : "5.8"}
                      step={bodyMetrics.heightUnit === "cm" ? "1" : "0.1"}
                    />
                  </div>
                  <div>
                    <Label htmlFor="heightUnit">Unit</Label>
                    <Select
                      value={bodyMetrics.heightUnit}
                      onValueChange={(value: "cm" | "ft") => {
                        const newMetrics = { ...bodyMetrics, heightUnit: value, height: "" }
                        saveBodyMetrics(newMetrics)
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="cm">cm</SelectItem>
                        <SelectItem value="ft">ft</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <Label htmlFor="weight">Weight</Label>
                    <Input
                      id="weight"
                      type="number"
                      value={bodyMetrics.weight}
                      onChange={(e) => {
                        const newMetrics = { ...bodyMetrics, weight: e.target.value }
                        saveBodyMetrics(newMetrics)
                      }}
                      placeholder={bodyMetrics.weightUnit === "kg" ? "70" : "154"}
                      step={bodyMetrics.weightUnit === "kg" ? "0.1" : "0.5"}
                    />
                  </div>
                  <div>
                    <Label htmlFor="weightUnit">Unit</Label>
                    <Select
                      value={bodyMetrics.weightUnit}
                      onValueChange={(value: "kg" | "lbs") => {
                        const newMetrics = { ...bodyMetrics, weightUnit: value, weight: "" }
                        saveBodyMetrics(newMetrics)
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="kg">kg</SelectItem>
                        <SelectItem value="lbs">lbs</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label htmlFor="age">Age</Label>
                  <Input
                    id="age"
                    type="number"
                    value={bodyMetrics.age}
                    onChange={(e) => {
                      const newMetrics = { ...bodyMetrics, age: e.target.value }
                      saveBodyMetrics(newMetrics)
                    }}
                    placeholder="30"
                  />
                </div>
                <Button
                  onClick={calculateBMI}
                  className="w-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:ring-offset-2"
                >
                  <Calculator className="w-4 h-4 mr-2" />
                  Calculate BMI
                </Button>
              </div>

              {bmi && (
                <div className="flex flex-col justify-center">
                  <div className="text-center p-6 bg-blue-50 rounded-lg">
                    <div className="text-3xl font-bold text-blue-600 mb-2">{bmi}</div>
                    <div className="text-lg font-semibold mb-2">BMI</div>
                    <div
                      className={`text-sm px-3 py-1 rounded-full inline-block ${
                        bmiCategory === "Normal weight"
                          ? "bg-green-100 text-green-800"
                          : bmiCategory === "Underweight"
                            ? "bg-yellow-100 text-yellow-800"
                            : bmiCategory === "Overweight"
                              ? "bg-orange-100 text-orange-800"
                              : "bg-red-100 text-red-800"
                      }`}
                    >
                      {bmiCategory}
                    </div>
                  </div>
                </div>
              )}

              {progressComparison && (
                <div className="col-span-full mt-4 p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg">
                  <div className="text-center">
                    <div className="text-sm font-semibold text-gray-700 mb-2 flex items-center justify-center gap-2">
                      <Target className="w-4 h-4" />
                      Progress to Target Weight (BMI 22)
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="text-center">
                        <div className="text-lg font-bold text-blue-600">
                          {progressComparison.targetWeight} {progressComparison.unit}
                        </div>
                        <div className="text-xs text-gray-600">Target Weight</div>
                      </div>

                      <div className="text-center">
                        <div
                          className={`text-lg font-bold ${progressComparison.isAboveTarget ? "text-orange-600" : "text-green-600"}`}
                        >
                          {progressComparison.isAboveTarget ? "-" : "+"}
                          {progressComparison.weightDiff} {progressComparison.unit}
                        </div>
                        <div className="text-xs text-gray-600">
                          {progressComparison.isAboveTarget ? "To Lose" : "Below Target"}
                        </div>
                      </div>
                    </div>

                    <div className="mt-3 text-xs text-gray-600">
                      {progressComparison.isAboveTarget
                        ? `You're ${progressComparison.weightDiff} ${progressComparison.unit} above your target weight`
                        : progressComparison.weightDiff > 0
                          ? `You're ${progressComparison.weightDiff} ${progressComparison.unit} below your target weight`
                          : "You're at your target weight!"}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Healthy BMI Reference for 46-year-old Black man 5'8" */}
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <h3 className="font-semibold mb-3 text-gray-800 flex items-center gap-2">
            <BarChart3 className="w-5 h-5" />
            Healthy BMI Reference
          </h3>
          <div className="text-sm text-gray-600 mb-3 flex items-center gap-1">
            <Info className="w-4 h-4" />
            For a 46-year-old Black man, 5'8" (173 cm):
          </div>

          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Healthy Weight Range:</span>
                <span className="font-semibold text-green-600">122-164 lbs</span>
              </div>
              <div className="flex justify-between">
                <span>Optimal BMI Range:</span>
                <span className="font-semibold text-green-600">18.5-24.9</span>
              </div>
              <div className="flex justify-between">
                <span>Target Weight (BMI 22):</span>
                <span className="font-semibold text-blue-600">145 lbs</span>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Lower Healthy (BMI 18.5):</span>
                <span className="text-yellow-600">122 lbs</span>
              </div>
              <div className="flex justify-between">
                <span>Upper Healthy (BMI 24.9):</span>
                <span className="text-yellow-600">164 lbs</span>
              </div>
              <div className="flex justify-between">
                <span>Height:</span>
                <span className="text-gray-600">5'8" (173 cm)</span>
              </div>
            </div>
          </div>

          <div className="mt-3 p-3 bg-blue-50 rounded text-xs text-blue-800 flex items-start gap-2">
            <Info className="w-4 h-4 mt-0.5 flex-shrink-0" />
            <div>
              <strong>Note:</strong> BMI ranges may vary for different ethnicities and body compositions. For Black men,
              muscle mass and bone density can affect BMI interpretation. Consult with a healthcare provider for
              personalized health goals.
            </div>
          </div>
        </div>

        {/* Health Tips */}
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Heart className="w-5 h-5 text-red-500" />
              Health Tips
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <h3 className="font-semibold mb-2 text-green-600 flex items-center gap-2">
                  <Shield className="w-4 h-4" />
                  Anti-Inflammatory Benefits
                </h3>
                <ul className="text-sm space-y-1">
                  <li className="flex items-center gap-2">
                    <Activity className="w-3 h-3" />
                    Reduces chronic inflammation
                  </li>
                  <li className="flex items-center gap-2">
                    <Shield className="w-3 h-3" />
                    Supports immune system
                  </li>
                  <li className="flex items-center gap-2">
                    <Heart className="w-3 h-3" />
                    Improves heart health
                  </li>
                  <li className="flex items-center gap-2">
                    <TrendingUp className="w-3 h-3" />
                    Enhances recovery
                  </li>
                  <li className="flex items-center gap-2">
                    <Zap className="w-3 h-3" />
                    Boosts energy levels
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-2 text-blue-600 flex items-center gap-2">
                  <BarChart3 className="w-4 h-4" />
                  BMI Guidelines
                </h3>
                <ul className="text-sm space-y-1">
                  <li>• Under 18.5: Underweight</li>
                  <li>• 18.5-24.9: Normal weight</li>
                  <li>• 25-29.9: Overweight</li>
                  <li>• 30+: Obese</li>
                  <li>• Consult healthcare provider for personalized advice</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="mt-8 text-center">
          <p className="text-gray-600 flex items-center justify-center gap-2">
            <TrendingUp className="w-4 h-4" />
            Track your nutrition daily and monitor your health metrics for optimal wellness!
          </p>
        </div>
      </div>
    </div>
  )
}
