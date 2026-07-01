export interface WorkflowStep {
  name: string
  execute: () => Promise<void>
  compensate: () => Promise<void>
}

export async function runWorkflow(steps: WorkflowStep[]): Promise<void> {
  const executed: WorkflowStep[] = []

  for (const step of steps) {
    try {
      await step.execute()
      executed.push(step)
    } catch (error) {
      // Compensate in reverse order
      for (const done of executed.reverse()) {
        try {
          await done.compensate()
        } catch {
          console.error(`[workflow] Compensation failed for step "${done.name}"`)
        }
      }
      throw error
    }
  }
}
