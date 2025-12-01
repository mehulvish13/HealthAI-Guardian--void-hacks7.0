import { useState } from 'react';
import { Utensils, Dumbbell, Calendar, Clock, Flame, CheckCircle, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { dietPlans, exerciseRoutines } from '@/lib/mockData';
import { cn } from '@/lib/utils';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function HealthPlans() {
  const [selectedPlan, setSelectedPlan] = useState<'lowRisk' | 'mediumRisk' | 'highRisk'>('lowRisk');
  const [completedExercises, setCompletedExercises] = useState<string[]>([]);

  const toggleExercise = (day: string) => {
    setCompletedExercises(prev => 
      prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day]
    );
  };

  const currentDiet = dietPlans[selectedPlan];
  const totalCalories = currentDiet.reduce((sum, meal) => sum + meal.calories, 0);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
          <Utensils className="w-8 h-8 text-primary" />
        </div>
        <h1 className="text-2xl lg:text-3xl font-bold text-foreground">Personalized Health Plans</h1>
        <p className="text-muted-foreground mt-2">
          Customized diet and exercise routines for university students
        </p>
      </div>

      <Tabs defaultValue="diet" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="diet" className="gap-2">
            <Utensils className="w-4 h-4" />
            Diet Plan
          </TabsTrigger>
          <TabsTrigger value="exercise" className="gap-2">
            <Dumbbell className="w-4 h-4" />
            Exercise Routine
          </TabsTrigger>
        </TabsList>

        {/* Diet Plan Tab */}
        <TabsContent value="diet" className="space-y-6">
          {/* Plan Selector */}
          <div className="bg-card rounded-2xl p-4 border border-border">
            <p className="text-sm font-medium text-foreground mb-3">Select Your Risk Profile:</p>
            <div className="flex flex-wrap gap-2">
              <Button
                variant={selectedPlan === 'lowRisk' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedPlan('lowRisk')}
                className={cn(selectedPlan === 'lowRisk' && "bg-success hover:bg-success/90")}
              >
                Low Risk
              </Button>
              <Button
                variant={selectedPlan === 'mediumRisk' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedPlan('mediumRisk')}
                className={cn(selectedPlan === 'mediumRisk' && "bg-warning hover:bg-warning/90")}
              >
                Medium Risk
              </Button>
              <Button
                variant={selectedPlan === 'highRisk' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedPlan('highRisk')}
                className={cn(selectedPlan === 'highRisk' && "bg-destructive hover:bg-destructive/90")}
              >
                High Risk
              </Button>
            </div>
          </div>

          {/* Calorie Summary */}
          <div className="bg-primary/5 rounded-2xl p-4 border border-primary/20 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Flame className="w-6 h-6 text-primary" />
              <div>
                <p className="text-sm text-muted-foreground">Daily Target</p>
                <p className="text-xl font-bold text-foreground">{totalCalories} kcal</p>
              </div>
            </div>
            <p className="text-xs text-muted-foreground">
              Quick meals for busy students
            </p>
          </div>

          {/* Meal Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {currentDiet.map((meal, index) => (
              <div key={index} className="bg-card rounded-2xl p-5 border border-border">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-foreground">{meal.meal}</h3>
                  <span className="text-sm text-muted-foreground">{meal.calories} kcal</span>
                </div>
                <ul className="space-y-2">
                  {meal.items.map((item, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Tips */}
          <div className="bg-secondary/50 rounded-xl p-4">
            <h4 className="font-medium text-foreground mb-2">💡 Student-Friendly Tips</h4>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-muted-foreground">
              <li>• Prep meals on weekends</li>
              <li>• Keep healthy snacks in your dorm</li>
              <li>• Use the campus microwave for quick meals</li>
              <li>• Stay hydrated with a reusable bottle</li>
            </ul>
          </div>
        </TabsContent>

        {/* Exercise Tab */}
        <TabsContent value="exercise" className="space-y-6">
          {/* Progress */}
          <div className="bg-card rounded-2xl p-4 border border-border">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-medium text-foreground">Weekly Progress</h3>
              <span className="text-sm text-muted-foreground">
                {completedExercises.length} / {exerciseRoutines.length} completed
              </span>
            </div>
            <div className="h-2 bg-muted rounded-full overflow-hidden">
              <div 
                className="h-full bg-primary transition-all duration-500"
                style={{ width: `${(completedExercises.length / exerciseRoutines.length) * 100}%` }}
              />
            </div>
          </div>

          {/* Weekly Schedule */}
          <div className="space-y-3">
            {exerciseRoutines.map((routine) => {
              const isCompleted = completedExercises.includes(routine.day);
              return (
                <div 
                  key={routine.day}
                  className={cn(
                    "bg-card rounded-xl p-4 border transition-all cursor-pointer",
                    isCompleted ? "border-success/50 bg-success/5" : "border-border hover:border-primary/30"
                  )}
                  onClick={() => toggleExercise(routine.day)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className={cn(
                        "w-10 h-10 rounded-lg flex items-center justify-center",
                        isCompleted ? "bg-success/20 text-success" : "bg-primary/10 text-primary"
                      )}>
                        {isCompleted ? <CheckCircle className="w-5 h-5" /> : <Calendar className="w-5 h-5" />}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-medium text-foreground">{routine.day}</h4>
                          {routine.dormFriendly && (
                            <span className="flex items-center gap-1 text-xs bg-accent/10 text-accent-foreground px-2 py-0.5 rounded-full">
                              <Home className="w-3 h-3" />
                              Dorm-friendly
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">{routine.exercise}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Clock className="w-4 h-4" />
                        {routine.duration}
                      </div>
                      <span className={cn(
                        "text-xs px-2 py-0.5 rounded-full",
                        routine.intensity === 'Low' && "bg-success/10 text-success",
                        routine.intensity === 'Medium' && "bg-warning/10 text-warning",
                        routine.intensity === 'High' && "bg-destructive/10 text-destructive"
                      )}>
                        {routine.intensity}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Exercise Tips */}
          <div className="bg-secondary/50 rounded-xl p-4">
            <h4 className="font-medium text-foreground mb-2">🏋️ Dorm Workout Tips</h4>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-muted-foreground">
              <li>• Use your bed for tricep dips</li>
              <li>• Fill a backpack with books for weights</li>
              <li>• Do planks during study breaks</li>
              <li>• Take the stairs instead of elevator</li>
            </ul>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
