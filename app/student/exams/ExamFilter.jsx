"use client";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function ExamFilter({ filters, setFilters }) {
  const subjects = ["Mathematics", "Science", "History", "Literature", "Computer Science"];
  const durations = ["30", "45", "60", "90", "120"];
  const difficulties = ["Easy", "Medium", "Hard"];

  const clearFilters = () => {
    setFilters({
      subject: "",
      duration: "",
      difficulty: ""
    });
  };

  return (
    <div className="bg-white p-6 rounded-lg border shadow-sm">
      <h3 className="font-semibold mb-4">Filter Exams</h3>
      
      <div className="space-y-4">
        <div>
          <Label htmlFor="subject">Subject</Label>
          <Select
            value={filters.subject}
            onValueChange={(value) => setFilters({...filters, subject: value})}
          >
            <SelectTrigger className="w-full mt-1">
              <SelectValue placeholder="All Subjects" />
            </SelectTrigger>
            <SelectContent>
              {subjects.map(subject => (
                <SelectItem key={subject} value={subject}>
                  {subject}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <Label htmlFor="duration">Max Duration (mins)</Label>
          <Select
            value={filters.duration}
            onValueChange={(value) => setFilters({...filters, duration: value})}
          >
            <SelectTrigger className="w-full mt-1">
              <SelectValue placeholder="Any Duration" />
            </SelectTrigger>
            <SelectContent>
              {durations.map(duration => (
                <SelectItem key={duration} value={duration}>
                  {duration}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <Label htmlFor="difficulty">Difficulty</Label>
          <Select
            value={filters.difficulty}
            onValueChange={(value) => setFilters({...filters, difficulty: value})}
          >
            <SelectTrigger className="w-full mt-1">
              <SelectValue placeholder="All Levels" />
            </SelectTrigger>
            <SelectContent>
              {difficulties.map(difficulty => (
                <SelectItem key={difficulty} value={difficulty}>
                  {difficulty}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <Button 
          variant="outline" 
          className="w-full mt-4"
          onClick={clearFilters}
        >
          Clear Filters
        </Button>
      </div>
    </div>
  );
}