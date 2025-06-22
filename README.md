# Tokenized Operations Production Scheduling

A comprehensive blockchain-based production scheduling system built with Clarity smart contracts for the Stacks blockchain.

## Overview

This system provides a complete solution for managing production operations through tokenized smart contracts, including scheduler verification, capacity planning, schedule optimization, resource allocation, and performance monitoring.

## Features

### 🔐 Scheduler Verification
- Register and verify production schedulers
- Track scheduler performance scores
- Manage scheduler status (pending, verified, suspended)

### 📊 Capacity Planning
- Create and manage capacity plans
- Allocate and release production capacity
- Track resource utilization across planning periods

### ⚡ Schedule Optimization
- Create production schedules with priorities
- Optimize schedules based on duration and priority
- Lock schedules to prevent modifications

### 🎯 Resource Allocation
- Manage production resources (equipment, materials, labor)
- Allocate resources to specific schedules
- Track resource costs and availability

### 📈 Performance Monitoring
- Record performance metrics against targets
- Calculate efficiency rates and completion statistics
- Monitor variance between planned and actual performance

## Smart Contracts

### 1. Scheduler Verification (`scheduler-verification.clar`)
Manages the registration and verification of production schedulers.

**Key Functions:**
- `register-scheduler`: Register a new scheduler
- `verify-scheduler`: Verify a scheduler (owner only)
- `update-performance-score`: Update scheduler performance
- `get-scheduler`: Get scheduler details
- `is-scheduler-verified`: Check verification status

### 2. Capacity Planning (`capacity-planning.clar`)
Handles production capacity planning and allocation.

**Key Functions:**
- `create-capacity-plan`: Create a new capacity plan
- `allocate-capacity`: Allocate capacity to production
- `release-capacity`: Release allocated capacity
- `get-capacity-plan`: Get capacity plan details
- `get-available-capacity`: Check available capacity

### 3. Schedule Optimization (`schedule-optimization.clar`)
Optimizes production schedules based on priority and duration.

**Key Functions:**
- `create-schedule`: Create a production schedule
- `optimize-schedule`: Optimize schedule timing
- `lock-schedule`: Lock schedule to prevent changes
- `get-schedule`: Get schedule details
- `is-schedule-optimized`: Check optimization status

### 4. Resource Allocation (`resource-allocation.clar`)
Manages the allocation of production resources.

**Key Functions:**
- `add-resource`: Add a new resource
- `allocate-resource`: Allocate resource to schedule
- `release-allocation`: Release resource allocation
- `get-resource`: Get resource details
- `get-available-quantity`: Check available resource quantity

### 5. Performance Monitoring (`performance-monitoring.clar`)
Monitors and tracks production performance metrics.

**Key Functions:**
- `record-metric`: Record performance metric
- `update-performance-summary`: Update performance summary
- `calculate-efficiency`: Calculate efficiency rate
- `get-metric`: Get performance metric
- `get-performance-summary`: Get performance summary

## Getting Started

### Prerequisites
- Stacks blockchain node
- Clarity CLI tools
- Node.js and npm (for testing)

### Installation

1. Clone the repository:
   \`\`\`bash
   git clone <repository-url>
   cd tokenized-production-scheduling
   \`\`\`

2. Install dependencies:
   \`\`\`bash
   npm install
   \`\`\`

3. Run tests:
   \`\`\`bash
   npm test
   \`\`\`

### Deployment

Deploy contracts to Stacks blockchain:

\`\`\`bash
# Deploy scheduler verification contract
clarinet deploy scheduler-verification.clar

# Deploy capacity planning contract
clarinet deploy capacity-planning.clar

# Deploy schedule optimization contract
clarinet deploy schedule-optimization.clar

# Deploy resource allocation contract
clarinet deploy resource-allocation.clar

# Deploy performance monitoring contract
clarinet deploy performance-monitoring.clar
\`\`\`

## Usage Examples

### Register and Verify a Scheduler

\`\`\`clarity
;; Register a new scheduler
(contract-call? .scheduler-verification register-scheduler "Production Team A")

;; Verify the scheduler (as contract owner)
(contract-call? .scheduler-verification verify-scheduler u1)
\`\`\`

### Create and Optimize a Production Schedule

\`\`\`clarity
;; Create a production schedule
(contract-call? .schedule-optimization create-schedule u1 "Widget Production" u8 u240)

;; Optimize the schedule
(contract-call? .schedule-optimization optimize-schedule u1 u1000)
\`\`\`

### Allocate Resources

\`\`\`clarity
;; Add a resource
(contract-call? .resource-allocation add-resource "CNC Machine" "Equipment" u5 u100)

;; Allocate resource to schedule
(contract-call? .resource-allocation allocate-resource u1 u1 u2 u240)
\`\`\`

## Architecture

The system follows a modular architecture with separate contracts for each major function:

\`\`\`
┌─────────────────────┐    ┌─────────────────────┐
│ Scheduler           │    │ Capacity            │
│ Verification        │    │ Planning            │
└─────────────────────┘    └─────────────────────┘
│                           │
└───────────┬───────────────┘
│
┌─────────────────────┐
│ Schedule            │
│ Optimization        │
└─────────────────────┘
│
┌───────────┴───────────┐
│                       │
┌─────────────────────┐    ┌─────────────────────┐
│ Resource            │    │ Performance         │
│ Allocation          │    │ Monitoring          │
└─────────────────────┘    └─────────────────────┘
\`\`\`

## Testing

The project includes comprehensive tests using Vitest:

\`\`\`bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
\`\`\`

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support and questions, please open an issue in the GitHub repository.

