;; Production Scheduler Verification Contract
;; Validates and manages production schedulers

(define-constant CONTRACT_OWNER tx-sender)
(define-constant ERR_UNAUTHORIZED (err u100))
(define-constant ERR_SCHEDULER_EXISTS (err u101))
(define-constant ERR_SCHEDULER_NOT_FOUND (err u102))
(define-constant ERR_INVALID_STATUS (err u103))

;; Scheduler status types
(define-constant STATUS_PENDING u0)
(define-constant STATUS_VERIFIED u1)
(define-constant STATUS_SUSPENDED u2)

;; Data structure for schedulers
(define-map schedulers
  { scheduler-id: uint }
  {
    owner: principal,
    name: (string-ascii 50),
    status: uint,
    verification-date: uint,
    performance-score: uint
  }
)

(define-data-var next-scheduler-id uint u1)

;; Register a new scheduler
(define-public (register-scheduler (name (string-ascii 50)))
  (let ((scheduler-id (var-get next-scheduler-id)))
    (asserts! (is-none (map-get? schedulers { scheduler-id: scheduler-id })) ERR_SCHEDULER_EXISTS)
    (map-set schedulers
      { scheduler-id: scheduler-id }
      {
        owner: tx-sender,
        name: name,
        status: STATUS_PENDING,
        verification-date: block-height,
        performance-score: u0
      }
    )
    (var-set next-scheduler-id (+ scheduler-id u1))
    (ok scheduler-id)
  )
)

;; Verify a scheduler (only contract owner)
(define-public (verify-scheduler (scheduler-id uint))
  (begin
    (asserts! (is-eq tx-sender CONTRACT_OWNER) ERR_UNAUTHORIZED)
    (match (map-get? schedulers { scheduler-id: scheduler-id })
      scheduler-data
      (begin
        (map-set schedulers
          { scheduler-id: scheduler-id }
          (merge scheduler-data { status: STATUS_VERIFIED, verification-date: block-height })
        )
        (ok true)
      )
      ERR_SCHEDULER_NOT_FOUND
    )
  )
)

;; Update scheduler performance score
(define-public (update-performance-score (scheduler-id uint) (score uint))
  (begin
    (asserts! (is-eq tx-sender CONTRACT_OWNER) ERR_UNAUTHORIZED)
    (match (map-get? schedulers { scheduler-id: scheduler-id })
      scheduler-data
      (begin
        (map-set schedulers
          { scheduler-id: scheduler-id }
          (merge scheduler-data { performance-score: score })
        )
        (ok true)
      )
      ERR_SCHEDULER_NOT_FOUND
    )
  )
)

;; Get scheduler details
(define-read-only (get-scheduler (scheduler-id uint))
  (map-get? schedulers { scheduler-id: scheduler-id })
)

;; Check if scheduler is verified
(define-read-only (is-scheduler-verified (scheduler-id uint))
  (match (map-get? schedulers { scheduler-id: scheduler-id })
    scheduler-data
    (is-eq (get status scheduler-data) STATUS_VERIFIED)
    false
  )
)
