import React, { useState } from 'react';
import {
  CheckSquare2,
  Square,
  Clock,
  Edit2,
  Share2,
  Plus,
} from 'lucide-react';

export interface TaskItem {
  id: string;
  title: string;
  date: string;
  duration: string;
  progress: number;
  completed: boolean;
  colorGrad: string;
}

interface TodayTasksCardProps {
  isDarkMode?: boolean;
  onAddTask?: () => void;
}

export const TodayTasksCard: React.FC<TodayTasksCardProps> = ({
  onAddTask,
}) => {
  const [tasks, setTasks] = useState<TaskItem[]>([
    {
      id: 'task-1',
      title: 'Back-calculate Hydrodynamic Drift Origin (ST-2046)',
      date: '27 Sep, 08:30 UTC',
      duration: '02 h 05 m',
      progress: 92,
      completed: false,
      colorGrad: 'from-cyan-500 to-blue-600',
    },
    {
      id: 'task-2',
      title: 'Analyze MT OCEAN TITAN AIS Transponder Gap (2h 48m)',
      date: '27 Sep, 09:15 UTC',
      duration: '00 h 45 m',
      progress: 75,
      completed: false,
      colorGrad: 'from-indigo-500 to-indigo-700',
    },
    {
      id: 'task-3',
      title: 'Dispatch containment advisory to ICGS Samudra Prahari',
      date: '27 Sep, 09:45 UTC',
      duration: '01 h 10 m',
      progress: 40,
      completed: false,
      colorGrad: 'from-emerald-500 to-teal-600',
    },
  ]);

  const toggleTask = (id: string) => {
    setTasks((prev) =>
      prev.map((t) =>
        t.id === id
          ? {
              ...t,
              completed: !t.completed,
              progress: !t.completed ? 100 : t.progress,
            }
          : t
      )
    );
  };

  return (
    <div className="flex flex-col p-5 rounded-3xl border border-[#1E2E48] bg-[#0B1528]/95 shadow-xl shadow-black/20 select-none">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2.5">
          <h2 className="text-sm font-bold tracking-tight text-white">
            Tactical Operations Log
          </h2>
          {/* Duty Officer status circles */}
          <div className="flex items-center -space-x-1">
            <span className="w-3.5 h-3.5 rounded-full bg-emerald-400 ring-2 ring-slate-900" />
            <span className="w-3.5 h-3.5 rounded-full bg-teal-400 ring-2 ring-slate-900" />
            <span className="w-3.5 h-3.5 rounded-full bg-blue-500 ring-2 ring-slate-900" />
          </div>
        </div>

        {/* Action icons */}
        <div className="flex items-center gap-1.5 text-slate-400">
          <button
            onClick={onAddTask}
            title="Add tactical task"
            className="p-1 hover:text-cyan-400 hover:bg-slate-800 rounded transition-all"
          >
            <Plus className="w-3.5 h-3.5" />
          </button>
          <button
            title="Edit tasks"
            className="p-1 hover:text-blue-400 hover:bg-slate-800 rounded transition-all"
          >
            <Edit2 className="w-3.5 h-3.5" />
          </button>
          <button
            title="Share with Coast Guard"
            className="p-1 hover:text-emerald-400 hover:bg-slate-800 rounded transition-all"
          >
            <Share2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Task Rows */}
      <div className="flex flex-col gap-3">
        {tasks.map((task) => (
          <div
            key={task.id}
            className="p-3.5 rounded-2xl border border-[#1E2E48] bg-[#0E1B33]/80 hover:border-cyan-400/50 hover:bg-[#112344] transition-all duration-200 group"
          >
            <div className="flex items-start justify-between gap-2 mb-2">
              <div className="flex items-start gap-2.5">
                <button
                  onClick={() => toggleTask(task.id)}
                  className="mt-0.5 text-slate-400 hover:text-cyan-400 transition-colors"
                >
                  {task.completed ? (
                    <CheckSquare2 className="w-4 h-4 text-emerald-400" />
                  ) : (
                    <Square className="w-4 h-4" />
                  )}
                </button>
                <div>
                  <h3
                    className={`text-xs font-semibold leading-snug ${
                      task.completed
                        ? 'line-through text-slate-500'
                        : 'text-slate-100'
                    }`}
                  >
                    {task.title}
                  </h3>
                  <p className="text-[10px] text-slate-400 mt-0.5 font-medium">
                    {task.date}
                  </p>
                </div>
              </div>

              {/* Duration pill */}
              <div className="flex items-center gap-1 text-[10px] font-mono text-cyan-400/90 shrink-0">
                <Clock className="w-3 h-3 text-cyan-400" />
                <span>{task.duration}</span>
              </div>
            </div>

            {/* Progress bar */}
            <div className="flex items-center gap-2.5 mt-2">
              <div className="flex-1 h-1.5 rounded-full bg-slate-800 overflow-hidden">
                <div
                  className={`h-full rounded-full bg-gradient-to-r ${task.colorGrad} transition-all duration-500`}
                  style={{ width: `${task.progress}%` }}
                />
              </div>
              <span className="text-[10px] font-mono font-semibold text-slate-400 shrink-0 w-7 text-right">
                {task.progress}%
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
