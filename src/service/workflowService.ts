import api from './api';

export interface StartWorkflowResponse {
  workflowId: string;
  runId: string;
}

export interface WorkflowStatusResponse {
  status: 'RUNNING' | 'COMPLETED' | 'FAILED';
  result?: any;
}

/**
 * Start Temporal workflow
 */
export const startWorkflow = async (): Promise<StartWorkflowResponse> => {
  const { data } = await api.get<StartWorkflowResponse>(
    '/temporal/start'
  );
  return data;
};

/**
 * Get workflow status
 */
export const getWorkflowStatus = async (
  workflowId: string
): Promise<WorkflowStatusResponse> => {
  const { data } = await api.get<WorkflowStatusResponse>(
    '/temporal/status',
    {
      params: { workflowId },
    }
  );
  return data;
};