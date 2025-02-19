"use client";

import { useState, useEffect, useMemo } from "react";
import { format, parseISO } from "date-fns";
import {
  CalendarIcon,
  Plus,
  Search,
  CheckCircle2,
  Clock,
  AlertCircle,
  Filter,
  Pencil,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger, DialogDescription, DialogFooter
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { Task, Priority, Project } from "../types/tasks";
import Navigation from "@/components/Navigation";


export default function Dashboard() {

  const [searchquery, setSearchquery] = useState('');
  const [filterPriority, setFilterPriority] = useState<Priority | "all">("all");
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProject, setSelectedProject] = useState<string | "all">("all");
  const [userId, setUserId] = useState<string | null>(null);
  const [addopen, setAddOpen] = useState(false);



  useEffect(() => {
    const storedUserId = localStorage.getItem("userId");
    if (storedUserId) {
      setUserId(storedUserId);
    }
  }, []);

  const { data } = useQuery({
    queryKey: ['taskData', userId],
    queryFn: async () => {
      if (!userId) return []; // Prevents fetching when userId is null
      const response = await fetch(`/api/tasks?userId=${encodeURIComponent(userId)}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      )
      return await response.json()
    },
    enabled: !!userId,

  })

  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState<Task>({
    title: "",
    description: "",
    priority: "high",
    dueDate: "",
    projectName: "",
    userId: "",
  } as Task);


  useEffect(() => {

    if (data) {
      setTasks(data.tasks);
    }
  }, [data]);

  useEffect(() => {
    if (!userId) {
      console.log("User ID is null")
      return;
    }
    setNewTask((prev) => ({ ...prev, userId }));
  }, [userId])


  const getPriorityColor = (priority: Priority) => {
    switch (priority) {
      case "high":
        return "text-red-500";
      case "medium":
        return "text-yellow-500";
      case "low":
        return "text-green-500";
      default:
        return "";
    }
  };

  const addTask = async (newTask: Task) => {
    const response = await fetch('/api/tasks', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newTask),
    })


    const data = await response.json()

    setTasks([...tasks, data[0]])

    setAddOpen(false);

  }

  const deleteTask = async (id: string) => {
    const response = await fetch('/api/tasks', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id }),
    })

    const data = await response.json()

    if (data.success) {
      console.log('Task deleted successfully')
      setTasks((prevTasks) => prevTasks.filter(task => task.id !== id))
    }
  }

  const updateTask = async (id: string, task: Task) => {
    const response = await fetch('/api/tasks', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id: id, title: task.title, description: task.description, dueDate: task.dueDate, priority: task.priority, projectName: task.projectName }),
    })

    const data = await response.json()

    if (data) {
      setTasks((prevTasks) => prevTasks.map(t => id === t.id ? { ...t, ...task } : t))
    }


  }

  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      const matchesSearch = task.title.toLowerCase().includes(searchquery.toLowerCase());
      const matchesPriority = filterPriority === "all" || filterPriority === task.priority;
      const matchesProject = selectedProject === "all" || selectedProject === task.projectName;
      return matchesSearch && matchesPriority && matchesProject;
    });
  }, [tasks, searchquery, filterPriority, selectedProject])

  const statistics = useMemo(() => {
    const total = tasks.length;
    const completed = tasks.filter((task) => task.completed).length;
    const upcoming = tasks.filter((t) => {
      return !t.completed && new Date(t.dueDate) >= new Date()
    }).length;
    const overdue = tasks.filter((t) => {
      return !t.completed && new Date(t.dueDate) < new Date()
    }).length;

    return { total, completed, upcoming, overdue };

  }, [tasks])

  const handleToggleComplete = async (id: string) => {

    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );

    const task = tasks.find((t) => t.id === id);
    if (!task) return;


    const newCompletedStatus = !task.completed;
    const apiEndpoint = newCompletedStatus ? "/api/completed" : "/api/notcompleted";

    await fetch(apiEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id }),
    })

  }

  useEffect(() => {
    if (!userId) {
      console.log("User ID is null")
      return;
    }
    fetch(`/api/projects?userId=${encodeURIComponent(userId)}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    }).then(response => response.json())
      .then(data => {
        if (data) {
          setProjects(data.projects);
        }
      })
  }, [userId, projects])


  return (
    <>
      <Navigation />
      <div className="container mx-auto py-10 px-4 md:px-40">
        <div className="grid gap-6">
          {/* Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Tasks</CardTitle>
                <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{statistics.total}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Completed</CardTitle>
                <CheckCircle2 className="h-4 w-4 text-green-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{statistics.completed}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Upcoming</CardTitle>
                <Clock className="h-4 w-4 text-blue-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{statistics.upcoming}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Overdue</CardTitle>
                <AlertCircle className="h-4 w-4 text-red-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{statistics.overdue}</div>
              </CardContent>
            </Card>
          </div>

          {/* Filters and Search */}
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search tasks..."
                className="pl-8"
                value={searchquery}
                onChange={(e) => setSearchquery(e.target.value)}
              />
            </div>
            <Select value={filterPriority} onValueChange={(value) => setFilterPriority(value as Priority | "all")}>
              <SelectTrigger className="w-[180px]">
                <Filter className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Priorities</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="low">Low</SelectItem>
              </SelectContent>
            </Select>
            <Select
              value={selectedProject} onValueChange={(value) => setSelectedProject(value as string)}
            >
              <SelectTrigger className="w-[180px]">
                <Filter className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Project" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Projects</SelectItem>
                {projects.map((project, index) => (
                  <SelectItem key={index} value={project.projectName}>{project.projectName}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Dialog open={addopen} onOpenChange={setAddOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Task
                </Button>
              </DialogTrigger>

              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New Task</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="title">Title</Label>
                    <Input
                      id="title"
                      value={newTask.title}
                      onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea value={newTask.description} onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="priority">Priority</Label>
                    <Select value={newTask.priority} onValueChange={(value) => setNewTask({ ...newTask, priority: value as Priority })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select priority" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="high">High</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="low">Low</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label>Due Date</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={`w-full justify-start text-left font-normal`}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {newTask.dueDate
                            ? format(new Date(newTask.dueDate), "PPP")
                            : "Pick a date"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={newTask.dueDate ? parseISO(newTask.dueDate) : undefined}
                          onSelect={(date) =>
                            setNewTask({
                              ...newTask,
                              dueDate: date ? format(date, "yyyy-MM-dd") : "",
                            })}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="project">Project Name</Label>
                    <Input value={newTask.projectName} onChange={(e) => setNewTask({ ...newTask, projectName: e.target.value })}></Input>
                  </div>
                </div>
                <div className="flex justify-end">
                  <Button onClick={() => addTask(newTask)}>Add Task</Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          {/* Tasks List */}
          <div className="grid gap-4">

            {filteredTasks.map((task, index) => (
              <Card key={index} className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleToggleComplete(task.id)}
                      className={task.completed ? "text-green-500" : "text-muted-foreground"}
                    >
                      <CheckCircle2 className="h-5 w-5" />
                    </Button>
                    <div>
                      <h3
                        className={`font-medium ${task.completed ? "line-through text-muted-foreground" : ""
                          }`}
                      >
                        {task.title}
                      </h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        {task.description}
                      </p>
                      <div className="flex gap-2 mt-2">
                        <Badge
                          variant="secondary"
                          className={getPriorityColor(task.priority)}
                        >
                          {task.priority}
                        </Badge>

                        <Badge
                          variant="outline"
                          className="text-muted-foreground"
                        >
                          {task.projectName}
                        </Badge>

                        <Badge variant="outline">
                          Due {format(new Date(task.dueDate), "MMM dd yyyy")}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 justify-end flex-wrap">
                    {/* Edit Button */}
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          variant="destructive"
                          size="icon"
                          className="p-2 rounded-md hover:bg-red-600 transition-all"
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Edit Task</DialogTitle>
                        </DialogHeader>

                        <div className="grid gap-4 py-4">
                          <div className="grid gap-2">
                            <Label htmlFor="edit-title">Title</Label>
                            <Input
                              id="edit-title"
                              value={task.title}
                              onChange={(e) => {
                                const updatedTask = { ...task, title: e.target.value };
                                setTasks((prevTasks) =>
                                  prevTasks.map((t) => (t.id === task.id ? updatedTask : t))
                                );
                              }}
                            />
                          </div>
                          <div className="grid gap-2">
                            <Label htmlFor="edit-description">Description</Label>
                            <Textarea
                              id="edit-description"
                              value={task.description}
                              onChange={(e) => {
                                const updatedTask = { ...task, description: e.target.value };
                                setTasks((prevTasks) =>
                                  prevTasks.map((t) => (t.id === task.id ? updatedTask : t))
                                );
                              }}
                            />
                          </div>
                          <div className="grid gap-2">
                            <Label htmlFor="edit-priority">Priority</Label>
                            <Select
                              value={task.priority}
                              onValueChange={(e) => {
                                const updatedTask = { ...task, priority: e as Priority };
                                setTasks((prevTasks) =>
                                  prevTasks.map((t) => (t.id === task.id ? updatedTask : t))
                                );
                              }}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select priority" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="high">High</SelectItem>
                                <SelectItem value="medium">Medium</SelectItem>
                                <SelectItem value="low">Low</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="grid gap-2">
                            <Label>Due Date</Label>
                            <Popover>
                              <PopoverTrigger asChild>
                                <Button
                                  variant="outline"
                                  className="w-full justify-start text-left font-normal"
                                >
                                  <CalendarIcon className="mr-2 h-4 w-4" />
                                  {task.dueDate
                                    ? format(new Date(task.dueDate), "PPP")
                                    : "Pick a date"}
                                </Button>
                              </PopoverTrigger>
                              <PopoverContent className="w-auto p-0">
                                <Calendar
                                  mode="single"
                                  selected={
                                    newTask.dueDate ? parseISO(newTask.dueDate) : undefined
                                  }
                                  onSelect={(date) => {
                                    const updatedTask = {
                                      ...task,
                                      dueDate: date ? format(date, "yyyy-MM-dd") : "",
                                    };
                                    setTasks((prevTasks) =>
                                      prevTasks.map((t) => (t.id === task.id ? updatedTask : t))
                                    );
                                  }}
                                  initialFocus
                                />
                              </PopoverContent>
                            </Popover>
                          </div>
                          <div className="grid gap-2">
                            <Label htmlFor="edit-project">Project Name</Label>
                            <Input
                              value={task.projectName}
                              onChange={(e) => {
                                const updatedTask = { ...task, projectName: e.target.value };
                                setTasks((prevTasks) =>
                                  prevTasks.map((t) => (t.id === task.id ? updatedTask : t))
                                );
                              }}
                            />
                          </div>
                        </div>

                        <div className="flex justify-end">
                          <Button onClick={() => updateTask(task.id, task)}>
                            Save Changes
                          </Button>
                        </div>
                      </DialogContent>
                    </Dialog>

  
                    {/* Delete Button with Confirmation Dialog */}
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          variant="destructive"
                          size="icon"
                          className="p-2 rounded-md hover:bg-red-600 transition-all"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="h-4 w-4"
                          >
                            <path d="M3 6h18" />
                            <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                            <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                          </svg>
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Confirm Delete</DialogTitle>
                          <DialogDescription>
                            Are you sure you want to delete this task? This action cannot be undone.
                          </DialogDescription>
                        </DialogHeader>
                        <DialogFooter className="flex justify-end gap-2">
                          <Button variant="outline">
                            Cancel
                          </Button>
                          <Button
                            variant="destructive"
                            onClick={() => {
                              deleteTask(task.id);
                            }}
                          >
                            Yes, Delete
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>

                  </div>
                </div>
              </Card>

            ))}
          </div>
        </div>
      </div>
    </>
  );
}