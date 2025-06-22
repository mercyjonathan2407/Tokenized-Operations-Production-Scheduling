import { describe, it, expect, beforeEach } from 'vitest'

describe('Scheduler Verification Contract', () => {
  let contractState
  
  beforeEach(() => {
    // Mock contract state
    contractState = {
      schedulers: new Map(),
      nextSchedulerId: 1,
      contractOwner: 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM'
    }
  })
  
  describe('register-scheduler', () => {
    it('should register a new scheduler successfully', () => {
      const schedulerName = 'Production Team A'
      const txSender = 'ST1SJ3DTE5DN7X54YDH5D64R3BCB6A2AG2ZQ8YPD5'
      
      const result = registerScheduler(contractState, schedulerName, txSender)
      
      expect(result.success).toBe(true)
      expect(result.value).toBe(1)
      expect(contractState.schedulers.has(1)).toBe(true)
      
      const scheduler = contractState.schedulers.get(1)
      expect(scheduler.name).toBe(schedulerName)
      expect(scheduler.owner).toBe(txSender)
      expect(scheduler.status).toBe(0) // STATUS_PENDING
      expect(scheduler.performanceScore).toBe(0)
    })
    
    it('should increment scheduler ID for multiple registrations', () => {
      const txSender = 'ST1SJ3DTE5DN7X54YDH5D64R3BCB6A2AG2ZQ8YPD5'
      
      registerScheduler(contractState, 'Team A', txSender)
      const result = registerScheduler(contractState, 'Team B', txSender)
      
      expect(result.value).toBe(2)
      expect(contractState.nextSchedulerId).toBe(3)
    })
    
    it('should handle empty scheduler name', () => {
      const txSender = 'ST1SJ3DTE5DN7X54YDH5D64R3BCB6A2AG2ZQ8YPD5'
      
      const result = registerScheduler(contractState, '', txSender)
      
      expect(result.success).toBe(true)
      expect(contractState.schedulers.get(1).name).toBe('')
    })
  })
  
  describe('verify-scheduler', () => {
    beforeEach(() => {
      const txSender = 'ST1SJ3DTE5DN7X54YDH5D64R3BCB6A2AG2ZQ8YPD5'
      registerScheduler(contractState, 'Test Scheduler', txSender)
    })
    
    it('should verify scheduler when called by contract owner', () => {
      const result = verifyScheduler(contractState, 1, contractState.contractOwner)
      
      expect(result.success).toBe(true)
      expect(result.value).toBe(true)
      
      const scheduler = contractState.schedulers.get(1)
      expect(scheduler.status).toBe(1) // STATUS_VERIFIED
    })
    
    it('should reject verification from non-owner', () => {
      const nonOwner = 'ST1SJ3DTE5DN7X54YDH5D64R3BCB6A2AG2ZQ8YPD5'
      const result = verifyScheduler(contractState, 1, nonOwner)
      
      expect(result.success).toBe(false)
      expect(result.error).toBe(100) // ERR_UNAUTHORIZED
    })
    
    it('should return error for non-existent scheduler', () => {
      const result = verifyScheduler(contractState, 999, contractState.contractOwner)
      
      expect(result.success).toBe(false)
      expect(result.error).toBe(102) // ERR_SCHEDULER_NOT_FOUND
    })
  })
  
  describe('update-performance-score', () => {
    beforeEach(() => {
      const txSender = 'ST1SJ3DTE5DN7X54YDH5D64R3BCB6A2AG2ZQ8YPD5'
      registerScheduler(contractState, 'Test Scheduler', txSender)
    })
    
    it('should update performance score when called by owner', () => {
      const newScore = 85
      const result = updatePerformanceScore(contractState, 1, newScore, contractState.contractOwner)
      
      expect(result.success).toBe(true)
      expect(result.value).toBe(true)
      
      const scheduler = contractState.schedulers.get(1)
      expect(scheduler.performanceScore).toBe(newScore)
    })
    
    it('should reject update from non-owner', () => {
      const nonOwner = 'ST1SJ3DTE5DN7X54YDH5D64R3BCB6A2AG2ZQ8YPD5'
      const result = updatePerformanceScore(contractState, 1, 85, nonOwner)
      
      expect(result.success).toBe(false)
      expect(result.error).toBe(100) // ERR_UNAUTHORIZED
    })
  })
  
  describe('get-scheduler', () => {
    it('should return scheduler details', () => {
      const txSender = 'ST1SJ3DTE5DN7X54YDH5D64R3BCB6A2AG2ZQ8YPD5'
      registerScheduler(contractState, 'Test Scheduler', txSender)
      
      const result = getScheduler(contractState, 1)
      
      expect(result).toBeDefined()
      expect(result.name).toBe('Test Scheduler')
      expect(result.owner).toBe(txSender)
    })
    
    it('should return undefined for non-existent scheduler', () => {
      const result = getScheduler(contractState, 999)
      expect(result).toBeUndefined()
    })
  })
  
  describe('is-scheduler-verified', () => {
    beforeEach(() => {
      const txSender = 'ST1SJ3DTE5DN7X54YDH5D64R3BCB6A2AG2ZQ8YPD5'
      registerScheduler(contractState, 'Test Scheduler', txSender)
    })
    
    it('should return false for unverified scheduler', () => {
      const result = isSchedulerVerified(contractState, 1)
      expect(result).toBe(false)
    })
    
    it('should return true for verified scheduler', () => {
      verifyScheduler(contractState, 1, contractState.contractOwner)
      const result = isSchedulerVerified(contractState, 1)
      expect(result).toBe(true)
    })
    
    it('should return false for non-existent scheduler', () => {
      const result = isSchedulerVerified(contractState, 999)
      expect(result).toBe(false)
    })
  })
})

// Mock contract functions
function registerScheduler(state, name, txSender) {
  const schedulerId = state.nextSchedulerId
  
  if (state.schedulers.has(schedulerId)) {
    return { success: false, error: 101 } // ERR_SCHEDULER_EXISTS
  }
  
  state.schedulers.set(schedulerId, {
    owner: txSender,
    name: name,
    status: 0, // STATUS_PENDING
    verificationDate: Date.now(),
    performanceScore: 0
  })
  
  state.nextSchedulerId += 1
  return { success: true, value: schedulerId }
}

function verifyScheduler(state, schedulerId, txSender) {
  if (txSender !== state.contractOwner) {
    return { success: false, error: 100 } // ERR_UNAUTHORIZED
  }
  
  const scheduler = state.schedulers.get(schedulerId)
  if (!scheduler) {
    return { success: false, error: 102 } // ERR_SCHEDULER_NOT_FOUND
  }
  
  scheduler.status = 1 // STATUS_VERIFIED
  scheduler.verificationDate = Date.now()
  
  return { success: true, value: true }
}

function updatePerformanceScore(state, schedulerId, score, txSender) {
  if (txSender !== state.contractOwner) {
    return { success: false, error: 100 } // ERR_UNAUTHORIZED
  }
  
  const scheduler = state.schedulers.get(schedulerId)
  if (!scheduler) {
    return { success: false, error: 102 } // ERR_SCHEDULER_NOT_FOUND
  }
  
  scheduler.performanceScore = score
  return { success: true, value: true }
}

function getScheduler(state, schedulerId) {
  return state.schedulers.get(schedulerId)
}

function isSchedulerVerified(state, schedulerId) {
  const scheduler = state.schedulers.get(schedulerId)
  return scheduler ? scheduler.status === 1 : false
}
