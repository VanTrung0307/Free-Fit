import { useTranslation } from 'react-i18next';

export interface AgentType {
  id?: number;
  name: string;
}
export interface AgentTypeMap {
  [key: number]: AgentType;
}

export function GetAgentTypeMap() {
  const { t } = useTranslation();
  const agentTypeMap: AgentTypeMap = {
    0: { name: t('status.all') },
    1: { name: t('agent.captive') },
    2: { name: t('agent.freelancer') },
  };
  const agentTypeFilter: AgentType[] = [
    { id: 1, name: t('agent.captive') },
    { id: 2, name: t('agent.freelancer') },
  ];
  const agentRoleMap: AgentTypeMap = {
    0: { name: t('status.all') },
    1: { name: t('agent.leader') },
    2: { name: t('agent.member') },
  };
  const agentRoleFilter: AgentType[] = [
    { id: 1, name: t('agent.leader') },
    { id: 2, name: t('agent.member') },
  ];
  return { agentTypeMap, agentTypeFilter, agentRoleMap, agentRoleFilter };
}
