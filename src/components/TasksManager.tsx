import React, { useState } from 'react';
import { useCrm } from '../context/CrmContext';
import { Task, Priority } from '../types/crm';
import { CheckSquare, Plus, Clock, User, AlertCircle, CheckCircle2 } from 'lucide-react';

export const TasksManager: React.FC = () => {
  const { tasks, addTask, toggleTaskStatus, t, lang, salesAgents, leads } = useCrm();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [taskTitle, setTaskTitle] = useState('');
  const [taskType, setTaskType] = useState<Task['taskType']>('Call Client');
  const [assignedEmployee, setAssignedEmployee] = useState(salesAgents[0]?.name || '');
  const [priority, setPriority] = useState<Priority>('High');
  const [deadline, setDeadline] = useState('2026-10-07 02:00 PM');
  const [notes, setNotes] = useState('');

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskTitle.trim()) return;
    addTask({
      taskTitle: taskTitle.trim(),
      taskType,
      assignedEmployee,
      priority,
      deadline,
      status: 'Pending',
      notes
    });
    setIsModalOpen(false);
    setTaskTitle('');
    setNotes('');
  };

  return (
    <div className="space-y-6 pb-12">
      <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-lg sm:text-xl font-black text-slate-900">{t.navTasks}</h1>
          <p className="text-xs text-slate-500 mt-1">
            {lang === 'ar'
              ? 'متابعة المهام التشغيلية، إرسال العروض، وتنسيق المعاينات وعقود البيع'
              : 'Actionable sales tasks, offers preparation, and legal contract deliveries'}
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-black text-xs rounded-xl shadow-xs flex items-center gap-1.5 transition-all cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>{lang === 'ar' ? 'إضافة مهمة جديدة' : 'Add New Task'}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {tasks.map((task) => {
          const isDone = task.status === 'Completed';
          return (
            <div
              key={task.id}
              className={`p-4 rounded-2xl border transition-all flex flex-col justify-between shadow-xs ${
                isDone ? 'bg-slate-50 border-slate-200 opacity-60' : 'bg-white border-slate-200 hover:border-amber-400'
              }`}
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <span
                    className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                      task.priority === 'Urgent'
                        ? 'bg-red-100 text-red-700'
                        : task.priority === 'High'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-slate-100 text-slate-700'
                    }`}
                  >
                    {task.priority}
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-600">
                    {task.taskType}
                  </span>
                </div>

                <h3 className={`text-xs font-bold leading-relaxed mb-2 ${isDone ? 'line-through text-slate-400' : 'text-slate-900'}`}>
                  {task.taskTitle}
                </h3>

                {task.notes && (
                  <p className="text-[11px] text-slate-500 bg-slate-50 p-2 rounded-xl mb-3">
                    {task.notes}
                  </p>
                )}
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                <div>
                  <div className="flex items-center gap-1 font-semibold text-slate-700">
                    <User className="w-3 h-3 text-slate-400" />
                    <span>{task.assignedEmployee}</span>
                  </div>
                  <div className="flex items-center gap-1 text-[10px] text-slate-400 mt-0.5">
                    <Clock className="w-3 h-3" />
                    <span>{task.deadline}</span>
                  </div>
                </div>

                <button
                  onClick={() => toggleTaskStatus(task.id)}
                  className={`p-1.5 rounded-lg border transition-colors cursor-pointer ${
                    isDone
                      ? 'bg-emerald-100 border-emerald-300 text-emerald-800'
                      : 'bg-white border-slate-200 text-slate-400 hover:text-emerald-600 hover:border-emerald-400'
                  }`}
                  title={isDone ? 'Mark Pending' : 'Mark Completed'}
                >
                  <CheckCircle2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Task Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-2xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full space-y-4 shadow-2xl border border-slate-200 text-xs">
            <h3 className="text-sm font-black text-slate-900">
              {lang === 'ar' ? 'إضافة مهمة جديدة' : 'Add New Task'}
            </h3>
            <form onSubmit={handleCreateTask} className="space-y-3">
              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  {lang === 'ar' ? 'عنوان المهمة' : 'Task Title'}
                </label>
                <input
                  type="text"
                  required
                  value={taskTitle}
                  onChange={(e) => setTaskTitle(e.target.value)}
                  placeholder="e.g. Send formal offer for Sawari Duplex"
                  className="w-full p-2 border border-slate-200 rounded-xl"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    {lang === 'ar' ? 'نوع المهمة' : 'Task Type'}
                  </label>
                  <select
                    value={taskType}
                    onChange={(e) => setTaskType(e.target.value as any)}
                    className="w-full p-2 border border-slate-200 rounded-xl bg-slate-50"
                  >
                    {['Call Client', 'Send Offer', 'Schedule Meeting', 'Arrange Site Visit', 'Send Contract', 'Follow-up Payment'].map((tt) => (
                      <option key={tt} value={tt}>{tt}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    {lang === 'ar' ? 'الأولوية' : 'Priority'}
                  </label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value as any)}
                    className="w-full p-2 border border-slate-200 rounded-xl bg-slate-50"
                  >
                    {['Low', 'Medium', 'High', 'Urgent'].map((p) => (
                      <option key={p} value={p}>{p}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    {lang === 'ar' ? 'المسؤول' : 'Assignee'}
                  </label>
                  <select
                    value={assignedEmployee}
                    onChange={(e) => setAssignedEmployee(e.target.value)}
                    className="w-full p-2 border border-slate-200 rounded-xl bg-slate-50"
                  >
                    {salesAgents.map((ag) => (
                      <option key={ag.id} value={ag.name}>{ag.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    {lang === 'ar' ? 'الموعد النهائي' : 'Deadline'}
                  </label>
                  <input
                    type="text"
                    value={deadline}
                    onChange={(e) => setDeadline(e.target.value)}
                    className="w-full p-2 border border-slate-200 rounded-xl"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  {t.cancel}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-amber-500 font-bold text-slate-950 rounded-xl hover:bg-amber-600"
                >
                  {t.confirm}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
