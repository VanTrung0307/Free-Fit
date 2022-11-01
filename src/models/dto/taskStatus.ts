import { useTranslation } from 'react-i18next';

export interface TaskStatus {
  id?: number;
  name: string;
  color?: string;
}
export interface TaskStatusMap {
  [key: number]: TaskStatus;
}

export function GetTaskTypeMap() {
  const { t } = useTranslation();
  const taskStatusMap: TaskStatusMap = {
    9: { name: t('status.all'), color: 'black' },
    0: { name: t('task.new'), color: 'green' },
    1: { name: t('task.failed'), color: 'red' },
    3: { name: t('task.closed'), color: 'green' },
    4: { name: t('task.notEnoughDriver'), color: 'goldenrod' },
  };
  const taskTypeFilter: TaskStatus[] = [
    { id: 0, name: t('task.new') },
    { id: 1, name: t('task.failed') },
    { id: 3, name: t('task.closed') },
    { id: 4, name: t('task.notEnoughDriver') },
  ];
  return { taskStatusMap, taskTypeFilter };
}
